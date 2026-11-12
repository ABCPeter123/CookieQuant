// Resumable, lossless Neon -> R2 bulk migration shared by local CLI.
import { compactSnapshot } from './archive-policy.js';
import { writeJson,editJson,reserveR2Budget } from './r2-storage.js';

function sameHour(row){return row.receivedAt.slice(0,13);}
function dedupRows(rows){
 const map=new Map();for(const row of rows)map.set(row.run+'|'+row.tick,row);
 return [...map.values()].sort((a,b)=>Date.parse(a.receivedAt)-Date.parse(b.receivedAt));
}

export async function migrateLegacyBatch(source) {
  if(!Array.isArray(source)||!source.length) return {migrated:0,groups:0,cursor:null};
  if(source.length>80) throw Error('Legacy migration batch capped at 80 snapshots');
  await reserveR2Budget({classA:16,classB:30});
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
       // The source cursor belongs to the CLI, not this helper. Keep the
       // persisted estimate monotonic; the verifier checks exact source parity.
       history,total:Math.max(current?.total||0,history.length)
     };
   });

  return {migrated:rows.length,groups:groupsWritten,cursor:rows.at(-1).id,latest:rows.at(-1).receivedAt};
}
