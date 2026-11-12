import { S3Client, GetObjectCommand, PutObjectCommand } from '@aws-sdk/client-s3';
import { gzipSync, gunzipSync } from 'node:zlib';

const PREFIX = 'cookiequant/v1';
const DAY_MS = 86_400_000;
let cachedClient;

export function configured() {
  return ['R2_ACCOUNT_ID','R2_BUCKET','R2_ACCESS_KEY_ID','R2_SECRET_ACCESS_KEY']
    .every(key => typeof process.env[key] === 'string' && process.env[key].length > 0);
}
function client() {
  if (!configured()) throw Error('R2 storage not configured');
  if (!cachedClient) cachedClient = new S3Client({
    region:'auto',
    endpoint:'https://' + process.env.R2_ACCOUNT_ID + '.r2.cloudflarestorage.com',
    credentials:{accessKeyId:process.env.R2_ACCESS_KEY_ID,secretAccessKey:process.env.R2_SECRET_ACCESS_KEY},
    forcePathStyle:true,
    maxAttempts:3
  });
  return cachedClient;
}
function objectKey(path) { return PREFIX+'/'+path; }
function missing(error) {
  return error?.name === 'NoSuchKey' || error?.name === 'NotFound' ||
    error?.$metadata?.httpStatusCode === 404;
}
function collision(error) {
  return error?.$metadata?.httpStatusCode === 412 || error?.$metadata?.httpStatusCode === 409 ||
    error?.name === 'PreconditionFailed' || error?.name === 'ConditionalRequestConflict';
}
export async function readJson(path) {
  try {
    const response = await client().send(new GetObjectCommand({Bucket:process.env.R2_BUCKET,Key:objectKey(path)}));
    const bytes=await response.Body.transformToByteArray();
    return { value:JSON.parse(gunzipSync(bytes).toString('utf8')),etag:response.ETag };
  }catch(error){
    if(missing(error))return null;
    throw error;
  }
}
export async function writeJson(path,value,etag) {
  const compressed=gzipSync(Buffer.from(JSON.stringify(value)),{level:6});
  const input={
    Bucket:process.env.R2_BUCKET,Key:objectKey(path),Body:compressed,
    ContentType:'application/json',ContentEncoding:'gzip',CacheControl:'private, max-age=0',
    ...(etag === null ? {IfNoneMatch:'*'} : etag ? {IfMatch:etag} : {})
  };
  return client().send(new PutObjectCommand(input));
}
async function editJson(path,merge) {
  for(let i=0;i<9;i++){
    const existing=await readJson(path);
    const next=merge(existing?.value||null);
    if (next === null)return null;
    try{ await writeJson(path,next,existing?.etag||null);return next; }
    catch(error){if(!collision(error)||i===8)throw error;}
  }
  throw Error('R2 concurrent write retry limit exceeded');
}
function compactRow(payload,receivedAt) {
  return {
    receivedAt, run:payload.run,tick:payload.market.tick,
    game:payload.game,stats:payload.stats,
    market:{
      tick:payload.market.tick,modeledReturn:payload.market.modeledReturn,
      modeledRisk:payload.market.modeledRisk,
      goods:payload.market.goods.map(({id,symbol,price,stock,target,mean})=>({id,symbol,price,stock,target,mean}))
    }
  };
}
export async function archiveSnapshot(payload,receivedAt=new Date().toISOString()) {
  const timestamp=new Date(receivedAt);
  if(!Number.isFinite(timestamp.getTime()))throw Error('Invalid snapshot timestamp');
  const at=timestamp.toISOString();
  const day=at.slice(0,10);
  // Stable key makes retries and migration resumable without duplicate objects.
  const run=String(payload.run||'').replace(/[^a-zA-Z0-9_-]/g,'').slice(0,90);
  const immutable='snapshots/'+day+'/'+run+'-'+String(payload.market.tick)+'.json.gz';
  await writeJson(immutable,{receivedAt:at,payload});
  const row=compactRow(payload,at);
  const daily=await editJson('daily/'+day+'.json.gz',current=>{
    const rows=current?.rows?.slice()||[];
    const match=rows.findIndex(v=>v.run===row.run&&v.tick===row.tick);
    if(match>=0)rows[match]=row;else rows.push(row);
    rows.sort((a,b)=>Date.parse(a.receivedAt)-Date.parse(b.receivedAt));
    return {date:day,rows};
  });
  await editJson('latest.json.gz',current=>{
    const history=current?.history?.slice()||[];
    const position=history.findIndex(v=>v.run===row.run&&v.tick===row.tick);
    if(position>=0)history[position]=row;else history.push(row);
    history.sort((a,b)=>Date.parse(a.receivedAt)-Date.parse(b.receivedAt));
    const newest=history.slice(-120);
    const older=Date.parse(current?.receivedAt||'1970-01-01')>timestamp.getTime();
    return {
      firstAt:current?.firstAt && Date.parse(current.firstAt)<timestamp.getTime()?current.firstAt:at,
      receivedAt:older?current.receivedAt:at,
      payload:older?current.payload:payload,
      history:newest,
      // Count is an estimate used for UI only; original snapshots are immutable.
      total:Math.max(current?.total||0,0)+(position<0 && (!older || history.length<120)?1:0)
    };
  });
  return {receivedAt:at,recordedDaily:daily.rows.length};
}
export async function latestSnapshot() {return (await readJson('latest.json.gz'))?.value||null;}
export async function readDay(date) {return (await readJson('daily/'+date+'.json.gz'))?.value?.rows||[];}
function dayNumber(date){return Math.floor(Date.parse(date.slice(0,10)+'T00:00:00Z')/DAY_MS);}
function isoDay(num){return new Date(num*DAY_MS).toISOString().slice(0,10);}
export async function readDays(first,last,maxDays=500) {
  const from=dayNumber(first),to=dayNumber(last);
  if(!Number.isFinite(from)||!Number.isFinite(to)||to<from)return [];
  const count=to-from+1;
  let days;
  if(count<=maxDays)days=Array.from({length:count},(_,i)=>from+i);
  else {
    days=[...new Set(Array.from({length:maxDays},(_,i)=>from+Math.floor((to-from)*i/(maxDays-1))))];
  }
  const collected=[];
  for(let start=0;start<days.length;start+=20){
    const batches=await Promise.all(days.slice(start,start+20).map(async day=>readDay(isoDay(day))));
    batches.forEach(rows=>collected.push(...rows));
  }
  return collected.sort((a,b)=>Date.parse(a.receivedAt)-Date.parse(b.receivedAt));
}
export function downsample(rows,max=450) {
  if(rows.length<=max)return rows;
  return Array.from({length:max},(_,i)=>rows[Math.round((rows.length-1)*i/(max-1))]);
}
export function rangeStart(end,range,firstAt) {
  const last=Date.parse(end),start=Date.parse(firstAt);
  if(range==='all')return firstAt;
  const days=({'24h':1,'7d':7,'30d':30,'1y':365})[range];
  if(!days)throw Error('Invalid history range');
  return new Date(Math.max(start,last-days*DAY_MS)).toISOString();
}
