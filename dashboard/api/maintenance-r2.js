// TEMPORARY internal migration route. Remove immediately after cutover.
// Requires private one-time token; no credentials or game data returned to callers.
import { createHash,timingSafeEqual } from 'node:crypto';
import { neon } from '@neondatabase/serverless';
import { S3Client,ListObjectsV2Command,PutObjectCommand } from '@aws-sdk/client-s3';
import { applyReservation } from '../lib/r2-budget-core.js';
import { compactSnapshot } from '../lib/archive-policy.js';
import { configured,latestSnapshot,writeJson,editJson,readDay,readHour,reserveR2Budget } from '../lib/r2-storage.js';

export const config={maxDuration:60};
function authorize(token){
 const secret=process.env.CQ_ONE_TIME_MIGRATION_TOKEN;
 if(!secret || typeof token!=='string'||token.length!==secret.length)return false;
 return timingSafeEqual(createHash('sha256').update(token).digest(),createHash('sha256').update(secret).digest());
}
function r2(){
 return new S3Client({region:'auto',endpoint:'https://'+process.env.R2_ACCOUNT_ID+'.r2.cloudflarestorage.com',
 credentials:{accessKeyId:process.env.R2_ACCESS_KEY_ID,secretAccessKey:process.env.R2_SECRET_ACCESS_KEY},
 forcePathStyle:true,maxAttempts:2});
}
function sameHour(row){return row.receivedAt.slice(0,13);}
function dedupRows(rows){
 const map=new Map();for(const row of rows)map.set(row.run+'|'+row.tick,row);
 return [...map.values()].sort((a,b)=>Date.parse(a.receivedAt)-Date.parse(b.receivedAt));
}
export default async function handler(req,res){
 res.setHeader('Cache-Control','no-store');res.setHeader('X-Content-Type-Options','nosniff');
 if(req.method!=='GET')return res.status(405).json({error:'Not allowed'});
 if(!authorize(req.query?.token))return res.status(404).json({error:'Not found'});
 if(!configured()||process.env.R2_COST_GUARD!=='enforced')return res.status(503).json({error:'R2 config incomplete'});
 const action=req.query?.action;
 try {
  if(action==='inspect'){
   const result=await r2().send(new ListObjectsV2Command({Bucket:process.env.R2_BUCKET,MaxKeys:3}));
   return res.status(200).json({ok:true,bucket:process.env.R2_BUCKET,keys:result.KeyCount||0,
     hasBudgetLedger:(result.Contents||[]).some(e=>e.Key==='cookiequant/v1/.budget-guard.json'),
     firstKeys:(result.Contents||[]).map(e=>e.Key)});
  }
  if(action==='init'){
   const client=r2();
   const result=await client.send(new ListObjectsV2Command({Bucket:process.env.R2_BUCKET,MaxKeys:1}));
   if(result.KeyCount>0||(result.Contents||[]).length) return res.status(409).json({error:'Bucket is not empty. Initialization refused.'});
   const initial=applyReservation(null,{bootstrapAllowed:true},new Date());
   if(!initial.ok)throw Error(initial.reason);
   await client.send(new PutObjectCommand({Bucket:process.env.R2_BUCKET,
     Key:'cookiequant/v1/.budget-guard.json',IfNoneMatch:'*',
     Body:Buffer.from(JSON.stringify(initial.next)),ContentType:'application/json'}));
   return res.status(200).json({ok:true,initialized:true,limits:'7GB, 650k Class A, 3M Class B/31d'});
  }
  if(action==='migrate'){
   if(!process.env.DATABASE_URL)throw Error('Neon source unavailable');
   const cursor=Number(req.query.cursor||0),limit=Math.min(80,Math.max(1,Number(req.query.limit||60)));
   if(!Number.isSafeInteger(cursor)||cursor<0||!Number.isSafeInteger(limit))return res.status(400).json({error:'Invalid cursor'});
   // Cost guard check before migrating anything. All writes also individually reserve space.
   await reserveR2Budget({classA:16,classB:30});
   const sql=neon(process.env.DATABASE_URL);
   const source=await sql`SELECT id,received_at,payload FROM cq_telemetry_snapshots
     WHERE id>${cursor} ORDER BY id ASC LIMIT ${limit}`;
   if(!source.length)return res.status(200).json({ok:true,migrated:0,cursor,complete:true});
   const rows=source.map(x=>({id:Number(x.id),receivedAt:new Date(x.received_at).toISOString(),payload:x.payload}));
   const groups=new Map();
   for(const row of rows){const key=sameHour(row);if(!groups.has(key))groups.set(key,[]);groups.get(key).push(row);}
   let groupsWritten=0;
   for(const [hourKey,originals] of groups){
     const date=hourKey.slice(0,10),hour=hourKey.slice(11,13);
     const startId=originals[0].id,endId=originals.at(-1).id;
     const legacy='legacy-full/'+date+'/'+hour+'/'+startId+'-'+endId+'.json.gz';
     // All original scenario paths retained, grouped to avoid thousands of objects.
     await writeJson(legacy,{version:1,rows:originals});
     const minRows=originals.map(({receivedAt,payload})=>compactSnapshot(payload,receivedAt));
     const hourly=await editJson('hourly/'+date+'/'+hour+'.json.gz',current=>({
       date,hour,rows:dedupRows([...(current?.rows||[]),...minRows])
     }));
     await editJson('daily/'+date+'.json.gz',current=>{
       const data=(current?.rows||[]).filter(row=>row.receivedAt.slice(11,13)!==hour);
       const last=hourly.rows.at(-1);
       data.push({...last,samplesInHour:hourly.rows.length});
       data.sort((a,b)=>Date.parse(a.receivedAt)-Date.parse(b.receivedAt));
       return {date,rows:data};
     });
     groupsWritten++;
   }
   const compact=rows.map(({receivedAt,payload})=>compactSnapshot(payload,receivedAt));
   const newest=rows.at(-1),oldest=rows[0];
   await editJson('latest.json.gz',current=>{
     const history=dedupRows([...(current?.history||[]),...compact]).slice(-120);
     const currentTime=Date.parse(current?.receivedAt||'1970-01-01');
     const lastTime=Date.parse(newest.receivedAt);
     const useNew=lastTime>=currentTime;
     const priorFirst=Date.parse(current?.firstAt||'2999-01-01');
     return {
       firstAt:Date.parse(oldest.receivedAt)<priorFirst?oldest.receivedAt:current.firstAt,
       receivedAt:useNew?newest.receivedAt:current.receivedAt,
       payload:useNew?newest.payload:current.payload,
       history,total:Math.max(current?.total||0,cursor+rows.length)
     };
   });
   return res.status(200).json({ok:true,migrated:rows.length,groups:groupsWritten,
     cursor:rows.at(-1).id,complete:rows.length<limit,latest:rows.at(-1).receivedAt});
  }
  if(action==='verify'){
   const sql=neon(process.env.DATABASE_URL);
   const rows=await sql`SELECT count(*)::int AS count,max(id) AS max_id,min(received_at) AS oldest,max(received_at) AS newest FROM cq_telemetry_snapshots`;
   const state=await latestSnapshot();
   return res.status(200).json({ok:true,source:rows[0],r2:{
     present:!!state,firstAt:state?.firstAt||null,lastAt:state?.receivedAt||null,
     displayedRecent:state?.history?.length||0,recordCountEstimate:state?.total||0
   }});
  }
  return res.status(400).json({error:'Unknown action'});
 }catch(error){
   console.error('Temporary R2 migration action failed',action,error?.name,error?.message);
   return res.status(503).json({ok:false,action,error:error?.message||'Migration failed'});
 }
}
