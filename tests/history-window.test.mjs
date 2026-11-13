import test from 'node:test';
import assert from 'node:assert/strict';
import {HISTORY_RANGE_MINUTES,rangeStart,hourlyKeysBetween} from '../dashboard/lib/history-window.js';
import {readFile} from 'node:fs/promises';

test('intraday and long history ranges are measured in minutes',()=>{
  assert.deepEqual(['1h','6h','12h','24h','7d','30d','1y','all'].map(key=>HISTORY_RANGE_MINUTES[key]),
    [60,360,720,1440,10080,43200,525600,0]);
  const end='2026-11-13T14:45:00.000Z',first='2026-10-10T14:00:00.000Z';
  assert.equal(rangeStart(end,'1h',first),'2026-11-13T13:45:00.000Z');
  assert.equal(rangeStart(end,'6h',first),'2026-11-13T08:45:00.000Z');
  assert.equal(rangeStart(end,'12h',first),'2026-11-13T02:45:00.000Z');
  assert.equal(rangeStart(end,'24h',first),'2026-11-12T14:45:00.000Z');
  assert.equal(rangeStart(end,'all',first),first);
  assert.equal(rangeStart(end,'1h','2026-11-13T14:10:00Z'),'2026-11-13T14:10:00.000Z');
  assert.throws(()=>rangeStart(end,'5m',first),/Invalid history range/);
});

test('hourly R2 reads cross UTC midnight without scanning unrelated hours',()=>{
  assert.deepEqual(hourlyKeysBetween('2026-11-12T23:45:00Z','2026-11-13T00:45:00Z'),
    ['2026-11-12T23','2026-11-13T00']);
  assert.deepEqual(hourlyKeysBetween('2026-11-13T03:01:00Z','2026-11-13T03:59:00Z'),
    ['2026-11-13T03']);
  assert.deepEqual(hourlyKeysBetween('invalid','2026-11-13T03:59:00Z'),[]);
  assert.deepEqual(hourlyKeysBetween('2026-11-14T03:59:00Z','2026-11-13T03:59:00Z'),[]);
});

test('UI and Neon support intraday options and R2 fetches only selected hours',async()=>{
  const read=path=>readFile(new URL(path,import.meta.url),'utf8');
  const client=await read('../dashboard/js/live.js');
  const terminal=await read('../dashboard/js/quant-terminal.js');
  const api=await read('../dashboard/api/history.js');
  const storage=await read('../dashboard/lib/r2-storage.js');
  for(const range of ['1h','6h','12h']){
    assert.ok(client.includes("'"+range+"'"),'Client supports '+range);
    assert.ok(terminal.includes("'"+range+"'"),'Range button exists: '+range);
  }
  assert.ok(api.includes('HISTORY_RANGE_MINUTES'));
  assert.ok(api.includes("INTERVAL '1 minute'"));
  assert.ok(storage.includes('hourlyKeysBetween(first,last)'));
  assert.ok(!storage.includes('for(let hour=0;hour<24;hour++)'));
});

test('price/return toggle only redraws the tape instead of recalculating forecasts',async()=>{
  const source=await readFile(new URL('../dashboard/js/quant-terminal.js',import.meta.url),'utf8');
  assert.ok(source.includes('function setTapeUnits(units)'));
  assert.ok(source.includes('if(state.latest)drawTape();'));
  assert.ok(!source.includes('if(state.latest)render(state.latest,state.history,state.options);'));
});
