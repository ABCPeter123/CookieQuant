/**
 * One-time backfill from Neon to Cloudflare R2.
 * Needs DATABASE_URL, R2_ACCOUNT_ID, R2_BUCKET, R2_ACCESS_KEY_ID and R2_SECRET_ACCESS_KEY.
 * Leave TELEMETRY_BACKEND=neon in production until copied data is verified.
 */
import { neon } from '@neondatabase/serverless';
import { archiveSnapshot, latestSnapshot, configured } from '../lib/r2-storage.js';

if(!configured())throw Error('R2 environment variables are missing');
if(!process.env.DATABASE_URL)throw Error('DATABASE_URL is required for migration');
const db=neon(process.env.DATABASE_URL);
let lastId=Number(process.env.MIGRATE_AFTER_ID||0);
if(!Number.isSafeInteger(lastId)||lastId<0)throw Error('Invalid MIGRATE_AFTER_ID');
let migrated=0,errors=0,first=null,last=null;
const limit=50;
const delayMs=Number(process.env.R2_MIGRATION_DELAY_MS??1100);
if(!Number.isFinite(delayMs)||delayMs<0||delayMs>30000)
  throw Error('Invalid R2_MIGRATION_DELAY_MS');
const sleep=ms=>new Promise(resolve=>setTimeout(resolve,ms));
while(true){
  const rows=await db`SELECT id,received_at,payload FROM cq_telemetry_snapshots
    WHERE id>${lastId} ORDER BY id ASC LIMIT ${limit}`;
  if(!rows.length)break;
  for(const row of rows){
    const at=new Date(row.received_at).toISOString();
    try{
      await archiveSnapshot(row.payload,at,{preserveFull:true});
      migrated++;
      first=first||at;last=at;
      lastId=Number(row.id);
      if(migrated%50===0)console.log('Copied',migrated,'snapshots; last ID',lastId);
      if(delayMs>0)await sleep(delayMs);
    }catch(error){
      errors++;
      console.error('Migration halted at ID',row.id,'after',migrated,'records:',error?.message);
      console.error('Resume by setting MIGRATE_AFTER_ID='+lastId);
      process.exitCode=1;
      break;
    }
  }
  if(errors)break;
}
const archived=await latestSnapshot();
console.log(JSON.stringify({
  migrated,errors,lastId,sourceFirstAt:first,sourceLastAt:last,
  r2FirstAt:archived?.firstAt||null,r2LatestAt:archived?.receivedAt||null,
  instructions:errors?'Resume from last successful ID':'Re-run from the start to catch up with any new Neon snapshots before cutover'
},null,2));
