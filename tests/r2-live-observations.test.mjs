import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {runInNewContext} from 'node:vm';
import {compactSnapshot, shouldArchiveScenarios, sameMinuteObservation} from '../dashboard/lib/archive-policy.js';

// Execute the actual R2 archive function against a deterministic in-memory
// object adapter. No cloud credentials, calls or billing are involved.
test('R2 live ingestion preserves sixty minutes when market tick remains unchanged', async()=>{
  const src=await readFile(new URL('../dashboard/lib/r2-storage.js',import.meta.url),'utf8');
  const first=src.indexOf('export async function archiveSnapshot(');
  const last=src.indexOf('export async function latestSnapshot()',first);
  assert.ok(first>=0&&last>first,'archiveSnapshot source can be isolated');
  const objects=new Map();
  let protectedWrites=0;
  const context={
    compactSnapshot,shouldArchiveScenarios,sameMinuteObservation,
    reserveR2Budget:async()=>{protectedWrites++;},
    writeJson:async(key,data)=>{objects.set(key,data);},
    editJson:async(key,merge)=>{
      const next=merge(objects.get(key)||null);
      objects.set(key,next);
      return next;
    }
  };
  runInNewContext(src.slice(first,last).replace('export async function','async function')+
    '\nthis.archiveSnapshot=archiveSnapshot;',context);
  const payload={
    run:'same-tick-run-0001',version:1,market:{
      tick:873,goods:[{id:0,price:42,paths:[1,2,3]}]
    },delivery:{clientVersion:'2026.11.12.3'},
    game:{cookies:100},stats:{trades:5},modules:{stock:'on'}
  };
  const hour='hourly/2026-11-12/19.json.gz';
  for(let i=0;i<60;i++){
    const minute=String(i).padStart(2,'0');
    await context.archiveSnapshot(payload,'2026-11-12T19:'+minute+':05.000Z');
  }
  const recorded=objects.get(hour).rows;
  assert.equal(recorded.length,60,'sixty successful minutes must persist independently');
  assert.equal(new Set(recorded.map(row=>row.receivedAt.slice(0,16))).size,60);
  assert.ok(recorded.every(row=>row.tick===873),'original market tick remains unchanged');
  assert.equal(objects.get('daily/2026-11-12.json.gz').rows[0].samplesInHour,60);
  assert.equal(objects.get('latest.json.gz').history.length,60);
  assert.equal(objects.get('latest.json.gz').total,60);
  assert.equal(protectedWrites,60);

  // A repeated request in the *same* UTC minute must not add a false sample.
  await context.archiveSnapshot(payload,'2026-11-12T19:59:40.000Z');
  assert.equal(objects.get(hour).rows.length,60,'same-minute retry is idempotent');
  assert.equal(objects.get('latest.json.gz').total,60);
  assert.equal(objects.get('latest.json.gz').history.length,60);
  assert.equal(objects.get(hour).rows.at(-1).receivedAt,'2026-11-12T19:59:40.000Z');

  // A new hour with the same market tick creates a new observation.
  await context.archiveSnapshot(payload,'2026-11-12T20:00:05.000Z');
  assert.equal(objects.get('hourly/2026-11-12/20.json.gz').rows.length,1);
  assert.equal(objects.get('latest.json.gz').total,61);
  assert.equal(objects.get('daily/2026-11-12.json.gz').rows.length,2);
  assert.equal(protectedWrites,62,'budget reservations remain mandatory');
});
