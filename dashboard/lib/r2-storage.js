import { S3Client, GetObjectCommand, PutObjectCommand } from '@aws-sdk/client-s3';
import { gzipSync, gunzipSync } from 'node:zlib';
import { compactSnapshot, shouldArchiveScenarios, sameMinuteObservation } from './archive-policy.js';
import { applyReservation } from './r2-budget-core.js';
import { explainR2Failure } from './r2-diagnostics.js';

const PREFIX = 'cookiequant/v1';
const DAY_MS = 86_400_000;
let cachedClient;

// Existing Vercel production secret was saved under R2_SECRET_ACCESS_KEY_ID.
// Accept it as a compatibility alias without copying or exposing the secret.
export function r2SecretAccessKey() {
  return process.env.R2_SECRET_ACCESS_KEY || process.env.R2_SECRET_ACCESS_KEY_ID || '';
}
export function configured() {
  return ['R2_ACCOUNT_ID','R2_BUCKET','R2_ACCESS_KEY_ID']
    .every(key => typeof process.env[key] === 'string' && process.env[key].length > 0)
    && r2SecretAccessKey().length > 0;
}
function client() {
  if (!configured()) throw Error('R2 storage not configured');
  if (!cachedClient) cachedClient = new S3Client({
    region:'auto',
    endpoint:'https://' + process.env.R2_ACCOUNT_ID + '.r2.cloudflarestorage.com',
    credentials:{accessKeyId:process.env.R2_ACCESS_KEY_ID,secretAccessKey:r2SecretAccessKey()},
    forcePathStyle:true,
    // R2 supports a subset of S3 checksum features. Suppress optional SDK checksum headers.
    requestChecksumCalculation:'WHEN_REQUIRED',
    responseChecksumValidation:'WHEN_REQUIRED',
    maxAttempts:2
  });
  return cachedClient;
}
function objectKey(path) { return PREFIX+'/'+path; }
const BUDGET_PATH = objectKey('.budget-guard.json');
let budgetBlockedUntil = 0;
export class R2BudgetError extends Error {
  constructor(message){ super(message);this.name='R2BudgetError';this.status=507; }
}
function guardRequired() {
  if (process.env.R2_COST_GUARD !== 'enforced') {
    throw new R2BudgetError('R2 disabled: R2_COST_GUARD=enforced is required');
  }
}
const budgetPause = ms => new Promise(resolve=>setTimeout(resolve,ms));
let budgetGuardQueue=Promise.resolve();
let previousBudgetWriteAt=0;
// Serialize reservations per warm instance, avoiding same-key write bursts.
// Cloudflare also rate limits different instances. CAS failures still fail closed.
export function reserveR2Budget(reservation = {}) {
  const pending=budgetGuardQueue.then(()=>reserveBudgetInternal(reservation));
  budgetGuardQueue=pending.then(()=>{},()=>{});
  return pending;
}
async function reserveBudgetInternal(reservation = {}) {
  guardRequired();
  if (Date.now() < budgetBlockedUntil) throw new R2BudgetError('R2 circuit breaker active; retry later');
  if (!configured()) throw new R2BudgetError('R2 credentials not configured');
  for(let attempt=0;attempt<5;attempt++){
    let current;
    try{
      const response=await client().send(new GetObjectCommand({
        Bucket:process.env.R2_BUCKET,Key:BUDGET_PATH
      }));
      current={
        value:JSON.parse(Buffer.from(await response.Body.transformToByteArray()).toString('utf8')),
        etag:response.ETag
      };
    }catch(error){
      if(missing(error))throw new R2BudgetError('R2 disabled: initialize the cost guard on an empty bucket first');
      if(error?.name==='R2BudgetError')throw error;
      throw new R2BudgetError('R2 cost guard unreadable: '+explainR2Failure(error)+' Fail closed.');
    }
    const decision=applyReservation(current.value,reservation,new Date());
    if(!decision.ok){
      // Even failed protection checks consume R2 read operations. Avoid
      // repeatedly querying the bucket while the cap is exhausted.
      budgetBlockedUntil=Date.now()+60*60_000;
      throw new R2BudgetError(decision.reason);
    }
    try{
      const elapsed=Date.now()-previousBudgetWriteAt;
      if(elapsed<1100) await budgetPause(1100-elapsed);
      previousBudgetWriteAt=Date.now();
      await client().send(new PutObjectCommand({
        Bucket:process.env.R2_BUCKET,Key:BUDGET_PATH,
        IfMatch:current.etag,
        Body:Buffer.from(JSON.stringify(decision.next)),
        ContentType:'application/json',CacheControl:'private,no-store'
      }));
      return decision.next;
    }catch(error){
      if(!collision(error)||attempt===4)
        throw new R2BudgetError('R2 budget ledger could not be updated: fail closed');
      await budgetPause(350+attempt*350);
    }
  }
  throw new R2BudgetError('R2 budget unavailable');
}
function missing(error) {
  return error?.name === 'NoSuchKey' || error?.name === 'NotFound' ||
    error?.$metadata?.httpStatusCode === 404;
}
function collision(error) {
  return error?.$metadata?.httpStatusCode === 412 || error?.$metadata?.httpStatusCode === 409 || error?.$metadata?.httpStatusCode === 429 ||
    error?.name === 'PreconditionFailed' || error?.name === 'ConditionalRequestConflict';
}
export async function readJson(path) {
  try {
    const response = await client().send(new GetObjectCommand({Bucket:process.env.R2_BUCKET,Key:objectKey(path)}));
    const bytes=await response.Body.transformToByteArray();
    return { value:JSON.parse(gunzipSync(bytes).toString('utf8')),etag:response.ETag,size:bytes.length };
  }catch(error){
    if(missing(error))return null;
    throw error;
  }
}
export async function writeJson(path,value,etag,oldCompressedBytes=0) {
  const compressed=gzipSync(Buffer.from(JSON.stringify(value)),{level:6});
  // Positive deltas are deliberately never refunded. Overcounting fails closed
  // earlier, rather than risking overage when writes race or retries occur.
  const delta=Math.max(0,compressed.length-Math.max(0,oldCompressedBytes));
  await reserveR2Budget({bytes:delta});
  const input={
    Bucket:process.env.R2_BUCKET,Key:objectKey(path),Body:compressed,
    ContentType:'application/json',ContentEncoding:'gzip',CacheControl:'private, max-age=0',
    ...(etag === null ? {IfNoneMatch:'*'} : etag ? {IfMatch:etag} : {})
  };
  return client().send(new PutObjectCommand(input));
}
export async function editJson(path,merge) {
  for(let i=0;i<9;i++){
    const existing=await readJson(path);
    const next=merge(existing?.value||null);
    if (next === null)return null;
    try{ await writeJson(path,next,existing?.etag||null,existing?.size||0);return next; }
    catch(error){if(!collision(error)||i===8)throw error;await budgetPause(250+i*200);}
  }
  throw Error('R2 concurrent write retry limit exceeded');
}
export async function archiveSnapshot(payload,receivedAt=new Date().toISOString(),options={}) {
  // Reserve well above the ordinary number of PUTs, GETs and conditional
  // ledger updates before any user data touches R2.
  await reserveR2Budget({classA:12,classB:14});
  const timestamp=new Date(receivedAt);
  if(!Number.isFinite(timestamp.getTime()))throw Error('Invalid snapshot timestamp');
  const at=timestamp.toISOString();
  const day=at.slice(0,10);
  // Every market observation goes into the daily index. Full 256-path
  // simulations only go to the cold archive on approximately hourly samples.
  // Backfill preserves all historical simulation paths when requested.
  const preserveScenarios=shouldArchiveScenarios(at,payload.market.tick,options);
  if(preserveScenarios){
    const run=String(payload.run||'').replace(/[^a-zA-Z0-9_-]/g,'').slice(0,90);
    const archived='snapshots/'+day+'/'+run+'-'+String(payload.market.tick)+'.json.gz';
    await writeJson(archived,{receivedAt:at,payload});
  }
  const row=compactSnapshot(payload,at);
  const hour=at.slice(11,13);
  // Full-resolution history lives in minute-granular hourly objects, not a single
  // growing day file that would have to be rewritten in full every minute.
  const hourly=await editJson('hourly/'+day+'/'+hour+'.json.gz',current=>{
    const rows=current?.rows?.slice()||[];
    const match=rows.findIndex(v=>sameMinuteObservation(v,row));
    if(match>=0)rows[match]=row;else rows.push(row);
    rows.sort((a,b)=>Date.parse(a.receivedAt)-Date.parse(b.receivedAt));
    return {date:day,hour,rows};
  });
  // One representative observation per hour for efficient 30-day, yearly
  // and all-time charts. Full hourly observations remain available in R2.
  await editJson('daily/'+day+'.json.gz',current=>{
    const rows=current?.rows?.slice()||[];
    const summary={...row,samplesInHour:hourly.rows.length};
    const match=rows.findIndex(v=>v.receivedAt.slice(11,13)===hour);
    if(match>=0){
      if(Date.parse(row.receivedAt)>=Date.parse(rows[match].receivedAt))rows[match]=summary;
      else rows[match]={...rows[match],samplesInHour:hourly.rows.length};
    }else rows.push(summary);
    rows.sort((a,b)=>Date.parse(a.receivedAt)-Date.parse(b.receivedAt));
    return {date:day,rows};
  });
  await editJson('latest.json.gz',current=>{
    const history=current?.history?.slice()||[];
    const position=history.findIndex(v=>sameMinuteObservation(v,row));
    if(position>=0)history[position]=row;else history.push(row);
    history.sort((a,b)=>Date.parse(a.receivedAt)-Date.parse(b.receivedAt));
    const newest=history.slice(-120);
    const older=Date.parse(current?.receivedAt||'1970-01-01')>timestamp.getTime();
    return {
      firstAt:current?.firstAt && Date.parse(current.firstAt)<timestamp.getTime()?current.firstAt:at,
      receivedAt:older?current.receivedAt:at,
      payload:older?current.payload:payload,
      history:newest,
      // Count is an estimate used for UI only; each run+minute contributes once.
      total:Math.max(current?.total||0,0)+(position<0 && (!older || history.length<120)?1:0)
    };
  });
  return {receivedAt:at,recordedHourly:hourly.rows.length,archivedScenarios:preserveScenarios};
}
export async function latestSnapshot() {return (await readJson('latest.json.gz'))?.value||null;}
export async function readDay(date) {
  return (await readJson('daily/'+date+'.json.gz'))?.value?.rows||[];
}
export async function readHour(date,hour) {
  return (await readJson('hourly/'+date+'/'+hour+'.json.gz'))?.value?.rows||[];
}
function dayNumber(date){return Math.floor(Date.parse(date.slice(0,10)+'T00:00:00Z')/DAY_MS);}
function isoDay(num){return new Date(num*DAY_MS).toISOString().slice(0,10);}
export async function readDays(first,last,maxDays=500) {
  const from=dayNumber(first),to=dayNumber(last);
  if(!Number.isFinite(from)||!Number.isFinite(to)||to<from)return [];
  const count=to-from+1;
  // Exact minute-by-minute detail is used for short windows (up to 3 days).
  // Long ranges use one hourly summary per day-hour, which is sufficient
  // for a 450-point chart and avoids massive GET fanout.
  const detailed=count<=3;
  let days;
  if(count<=maxDays)days=Array.from({length:count},(_,i)=>from+i);
  else days=[...new Set(Array.from({length:maxDays},(_,i)=>
    from+Math.floor((to-from)*i/(maxDays-1))))];
  const calls=[];
  for(const day of days){
    const date=isoDay(day);
    if(detailed){
      for(let hour=0;hour<24;hour++){
        const hh=String(hour).padStart(2,'0');
        calls.push(()=>readHour(date,hh));
      }
    }else calls.push(()=>readDay(date));
  }
  const collected=[];
  for(let start=0;start<calls.length;start+=20){
    const batches=await Promise.all(calls.slice(start,start+20).map(call=>call()));
    for(const rows of batches)collected.push(...rows);
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
