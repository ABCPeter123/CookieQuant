import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import {readFile} from 'node:fs/promises';

test('R2 legacy migration resumes with no caller cursor in helper scope and retries safely',async()=>{
  const file=await readFile(new URL('../dashboard/lib/r2-migration.js',import.meta.url),'utf8');
  const source=file.replace(/^import .*;\s*$/gm,'')
    .replace('export async function migrateLegacyBatch(source)','async function migrateLegacyBatch(source)')
    +'\nthis.migrateLegacyBatch=migrateLegacyBatch;';
  const objects=new Map();
  const context={
    compactSnapshot:(payload,receivedAt)=>({
      receivedAt,run:payload.run,tick:payload.market.tick,
      market:payload.market,stats:payload.stats
    }),
    reserveR2Budget:async()=>{},
    writeJson:async(path,value)=>{objects.set(path,value);},
    editJson:async(path,transform)=>{
      const value=transform(objects.get(path)||null);
      objects.set(path,value);
      return value;
    }
  };
  vm.runInNewContext(source,context,{timeout:1000});
  const snapshots=[
    {id:1696,received_at:'2026-11-12T12:00:02.000Z',
      payload:{run:'game-012345',market:{tick:400,goods:[{id:0,price:42,paths:[1,2,3]}]},stats:{trades:1}}},
    {id:1697,received_at:'2026-11-12T12:01:02.000Z',
      payload:{run:'game-012345',market:{tick:401,goods:[{id:0,price:43,paths:[2,3,4]}]},stats:{trades:2}}}
  ];
  const first=await context.migrateLegacyBatch(snapshots);
  assert.equal(first.cursor,1697);
  assert.equal(first.migrated,2);
  assert.equal(first.groups,1);
  const latest=objects.get('latest.json.gz');
  assert.equal(latest.receivedAt,'2026-11-12T12:01:02.000Z');
  assert.equal(latest.history.length,2);
  assert.equal(latest.total,2);
  assert.equal(objects.get('hourly/2026-11-12/12.json.gz').rows.length,2);
  assert.deepEqual(Array.from(objects.keys()).filter(k=>k.startsWith('legacy-full/')),
    ['legacy-full/2026-11-12/12/1696-1697.json.gz']);
  const second=await context.migrateLegacyBatch(snapshots);
  assert.equal(second.cursor,1697);
  assert.equal(objects.get('latest.json.gz').history.length,2);
  assert.equal(objects.get('latest.json.gz').total,2);
});
