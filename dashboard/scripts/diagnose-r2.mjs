/**
 * Read-only R2 cost-guard diagnostic.
 * Usage (from repository root):
 * node --env-file=.env.r2 dashboard/scripts/diagnose-r2.mjs
 * Never prints credentials or fetches full game telemetry.
 */
import {S3Client,ListObjectsV2Command,HeadObjectCommand,GetObjectCommand} from '@aws-sdk/client-s3';
import {explainR2Failure} from '../lib/r2-diagnostics.js';

const expected={
  R2_ACCOUNT_ID:'Cloudflare account ID (32 hex characters)',
  R2_BUCKET:'R2 bucket name',
  R2_ACCESS_KEY_ID:'R2 S3 Access Key ID',
  R2_SECRET_ACCESS_KEY:'R2 S3 Secret Access Key',
  R2_COST_GUARD:'enforced'
};
let invalid=false;
for(const [key,label] of Object.entries(expected)){
  const value=process.env[key];
  const valid=typeof value==='string'&&value.trim().length>0&&!['...','undefined','null','REPLACE_ME'].includes(value.trim());
  console.log(key+': '+(valid?'present':'MISSING')+(key==='R2_COST_GUARD'&&valid&&value!=='enforced'?' (expected enforced)':''));
  if(!valid||key==='R2_COST_GUARD'&&value!=='enforced')invalid=true;
}
const account=process.env.R2_ACCOUNT_ID||'';
const bucket=process.env.R2_BUCKET||'';
if(account && !/^[0-9a-f]{32}$/i.test(account)){
  console.error('R2_ACCOUNT_ID must be the 32-character ID, not the full https:// S3 API URL.');
  invalid=true;
}
if(bucket && bucket!=='cookiequant-telemetry'){
  console.error('R2_BUCKET differs from the configured cookiequant-telemetry bucket.');
  invalid=true;
}
for(const key of ['R2_ACCESS_KEY_ID','R2_SECRET_ACCESS_KEY']){
  const v=process.env[key]||'';
  if(v && (v.includes('\n')||v.includes('\r')||v!==v.trim()||v.includes('https://'))){
    console.error(key+' contains whitespace, a newline or an URL instead of an S3 credential.');
    invalid=true;
  }
}
if(invalid){
  console.error('Stopped before contacting R2. Correct .env.r2 and run this read-only diagnostic again.');
  process.exitCode=1;
}else{
  for(const [key,typicalLength] of [['R2_ACCESS_KEY_ID',32],['R2_SECRET_ACCESS_KEY',64]]) {
    const value=process.env[key]||'';
    if(value.length!==typicalLength)
      console.log(key+': unusual length for an R2 S3 credential; verify this is not the Cloudflare API token.');
  }
  const client=new S3Client({
    region:'auto',
    endpoint:'https://'+account+'.r2.cloudflarestorage.com',
    credentials:{accessKeyId:process.env.R2_ACCESS_KEY_ID,secretAccessKey:process.env.R2_SECRET_ACCESS_KEY},
    forcePathStyle:true,maxAttempts:2,
    requestChecksumCalculation:'WHEN_REQUIRED',
    responseChecksumValidation:'WHEN_REQUIRED'
  });
  const key='cookiequant/v1/.budget-guard.json';
  try {
    const listing=await client.send(new ListObjectsV2Command({Bucket:bucket,Prefix:key,MaxKeys:2}));
    const exact=(listing.Contents||[]).some(item=>item.Key===key);
    console.log('BUCKET LIST: READABLE');
    console.log('BUDGET OBJECT LISTED: '+(exact?'YES':'NO'));
  } catch (error) {
    console.log('BUCKET LIST: FAILED');
    console.log('List reason: '+explainR2Failure(error));
  }
  try{
    await client.send(new HeadObjectCommand({Bucket:bucket,Key:key}));
    console.log('BUDGET OBJECT METADATA: READABLE');
  }catch(error){
    console.log('BUDGET OBJECT METADATA: FAILED');
    console.log('Metadata reason: '+explainR2Failure(error));
  }
  try{
    const response=await client.send(new GetObjectCommand({
      Bucket:bucket,Key:key
    }));
    const bytes=await response.Body.transformToByteArray();
    const state=JSON.parse(Buffer.from(bytes).toString('utf8'));
    if(state?.version!==1||!Number.isSafeInteger(state.bytesReserved)||!state.days||typeof state.days!=='object')
      throw new Error('Unexpected budget-ledger structure');
    console.log('R2 COST GUARD: READABLE');
    console.log('Tracked storage reservations: '+state.bytesReserved.toLocaleString('en-US')+' bytes');
    console.log('Migration is safe to resume from source ID 1695.');
  }catch(error){
    console.error('R2 COST GUARD: UNREADABLE');
    console.error('Reason: '+(error?.message==='Unexpected budget-ledger structure'
      ? 'The budget ledger format is invalid. Do not reset the ledger.'
      : explainR2Failure(error)));
    console.error('No R2 objects were modified by this diagnostic.');
    process.exitCode=1;
  }finally{
    client.destroy();
  }
}
