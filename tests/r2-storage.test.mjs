import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
const read = path => readFile(new URL(path,import.meta.url),'utf8');

test('R2 adapter compresses immutable game snapshots and maintains atomic indices',async()=>{
  const r2=await read('../dashboard/lib/r2-storage.js');
  assert.match(r2,/S3Client/);
  assert.match(r2,/R2_SECRET_ACCESS_KEY_ID/);
  assert.match(r2,/r2SecretAccessKey\(\)/);
  assert.match(r2,/gzipSync/);
  assert.match(r2,/gunzipSync/);
  assert.match(r2,/IfMatch:etag/);
  assert.match(r2,/reserveR2Budget/);
  assert.match(r2,/R2_COST_GUARD/);
  assert.match(r2,/budgetGuardQueue/);
  assert.match(r2,/previousBudgetWriteAt/);
  assert.match(r2,/elapsed<1100/);
  assert.match(r2,/IfNoneMatch:'\*'/);
  assert.match(r2,/snapshots\/'/);
  assert.match(r2,/daily\/'/);
  assert.match(r2,/hourly\/'/);
  assert.match(r2,/shouldArchiveScenarios/);
  assert.match(r2,/compactSnapshot/);
  assert.match(r2,/latest\.json\.gz/);
  assert.match(r2,/function downsample|export function downsample/);
  assert.match(r2,/function rangeStart|export function rangeStart/);
  assert.doesNotMatch(r2,/hardcoded-secret-token|ACCESS_KEY_ID = "[a-zA-Z0-9]{20,}"/);
});

test('all APIs support R2 without database credentials and preserve Neon until cutover',async()=>{
  for(const path of ['telemetry','live','history','health']){
    const api=await read('../dashboard/api/'+path+'.js');
    assert.match(api,/TELEMETRY_BACKEND/);
    assert.match(api,/=== 'r2'|==='r2'/);
    assert.match(api,/DATABASE_URL/);
  }
  const ingestion=await read('../dashboard/api/telemetry.js');
  assert.match(ingestion,/TELEMETRY_WRITE_KEY/);
  assert.match(ingestion,/archiveSnapshot/);
  const history=await read('../dashboard/api/history.js');
  assert.match(history,/readDays/);
  assert.match(history,/downsample/);
});

test('migration is explicit, resumable and never deletes source rows',async()=>{
  const script=await read('../dashboard/scripts/migrate-neon-r2.mjs');
  assert.match(script,/MIGRATE_AFTER_ID/);
  assert.match(script,/migrateLegacyBatch/);
  const helper=await read('../dashboard/lib/r2-migration.js');
  assert.match(helper,/legacy-full/);
  assert.match(helper,/compactSnapshot/);
  assert.match(helper,/reserveR2Budget/);
  const verify=await read('../dashboard/scripts/verify-r2-history.mjs');
  assert.match(verify,/missing===0/);
  assert.match(script,/ORDER BY id ASC/);
  assert.doesNotMatch(script,/\bDELETE FROM\b|\bDROP TABLE\b/);
  const docs=await read('../docs/CLOUD_TELEMETRY.md');
  assert.match(docs,/TELEMETRY_BACKEND=r2/);
  assert.match(docs,/Do not delete the Neon database/);
});
