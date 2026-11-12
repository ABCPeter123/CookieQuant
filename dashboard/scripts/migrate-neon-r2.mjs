/**
 * Resume the protected, lossless Neon -> R2 migration using Vercel production
 * env variables loaded locally with Node.js --env-file. Does not delete source.
 * Usage: node --env-file=.env.r2 dashboard/scripts/migrate-neon-r2.mjs [last-copied-id]
 */
import { neon } from '@neondatabase/serverless';
import { latestSnapshot, configured } from '../lib/r2-storage.js';
import { migrateLegacyBatch } from '../lib/r2-migration.js';

if(!configured())throw Error('Missing R2 credentials');
if(process.env.R2_COST_GUARD!=='enforced')throw Error('R2 cost guard must be enforced');
if(!process.env.DATABASE_URL)throw Error('Missing Neon source URL');
const sql=neon(process.env.DATABASE_URL);
const start=process.argv[2] ?? process.env.MIGRATE_AFTER_ID ?? '0';
let cursor=Number(start);
if(!Number.isSafeInteger(cursor)||cursor<0)throw Error('Invalid last-copied ID');
const firstCursor=cursor;
let copied=0, batches=0;
try{
  while(true){
    const source=await sql`SELECT id,received_at,payload FROM cq_telemetry_snapshots
      WHERE id>${cursor} ORDER BY id ASC LIMIT 60`;
    if(!source.length)break;
    const result=await migrateLegacyBatch(source);
    cursor=result.cursor;
    copied+=result.migrated;
    batches++;
    console.log('Copied batch',batches,'rows',result.migrated,'latest source id',cursor);
    // Let other R2 requests and Cloudflare same-key rate limits settle.
    await new Promise(resolve=>setTimeout(resolve,1200));
  }
  const state=await latestSnapshot();
  const sourceSummary=await sql`SELECT count(*)::int AS count,max(id) AS latest_id,
    min(received_at) AS first_at,max(received_at) AS last_at FROM cq_telemetry_snapshots`;
  console.log(JSON.stringify({
    copiedThisRun:copied,batches,resumedFrom:firstCursor,lastCopiedId:cursor,
    sourceRows:sourceSummary[0].count,sourceLastId:sourceSummary[0].latest_id,
    r2FirstAt:state?.firstAt||null,r2LastAt:state?.receivedAt||null,
    note:'Verify R2 source timestamps and counts before setting TELEMETRY_BACKEND=r2'
  },null,2));
  if(Number(sourceSummary[0].latest_id||0)>cursor){
    console.error('New records arrived during migration. Run the same command again, starting at ID '+cursor);
    process.exitCode=2;
  }
}catch(error){
  console.error('Migration stopped at source id',cursor,':',error?.message);
  console.error('Retry with: node --env-file=.env.r2 dashboard/scripts/migrate-neon-r2.mjs '+cursor);
  process.exitCode=1;
}
