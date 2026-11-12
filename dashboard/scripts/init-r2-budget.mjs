/**
 * Initializes the R2 application budget ledger exactly once.
 * Refuses to enable uploads unless the designated bucket is empty.
 * This script does not create buckets, enable billing, or set R2 flags in Vercel.
 */
import { S3Client, ListObjectsV2Command, PutObjectCommand } from '@aws-sdk/client-s3';
import { applyReservation } from '../lib/r2-budget-core.js';

const names=['R2_ACCOUNT_ID','R2_BUCKET','R2_ACCESS_KEY_ID','R2_SECRET_ACCESS_KEY'];
for(const name of names)if(!process.env[name])throw Error('Missing '+name);
if(process.env.R2_COST_GUARD!=='enforced')throw Error('Set R2_COST_GUARD=enforced explicitly');
const s3=new S3Client({
  region:'auto',
  endpoint:'https://'+process.env.R2_ACCOUNT_ID+'.r2.cloudflarestorage.com',
  credentials:{
    accessKeyId:process.env.R2_ACCESS_KEY_ID,
    secretAccessKey:process.env.R2_SECRET_ACCESS_KEY
  },
  maxAttempts:2,forcePathStyle:true
});
const bucket=process.env.R2_BUCKET;
const listing=await s3.send(new ListObjectsV2Command({Bucket:bucket,MaxKeys:1}));
if((listing.KeyCount||0)>0 || listing.Contents?.length) {
  throw Error('Refusing to initialize a non-empty bucket. Use a new dedicated private bucket.');
}
const reservation=applyReservation(null,{bootstrapAllowed:true},new Date());
if(!reservation.ok)throw Error('Cannot initialize R2 guard: '+reservation.reason);
try{
  await s3.send(new PutObjectCommand({
    Bucket:bucket,
    Key:'cookiequant/v1/.budget-guard.json',
    IfNoneMatch:'*',
    Body:Buffer.from(JSON.stringify(reservation.next)),
    ContentType:'application/json'
  }));
}catch(error){
  throw Error('R2 guard bootstrap failed. No application writes should proceed: '+error?.message);
}
console.log('R2 cost guard initialized for an empty private bucket. Limits apply to CookieQuant only.');
