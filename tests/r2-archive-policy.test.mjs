import test from 'node:test';
import assert from 'node:assert/strict';
import {compactSnapshot,shouldArchiveScenarios,sameMinuteObservation,FULL_SCENARIO_INTERVAL_TICKS} from '../dashboard/lib/archive-policy.js';

const buildSnapshot=()=>{
  const goods=Array.from({length:18},(_,id)=>({
    id,symbol:'S'+id,name:'Product '+id,price:id+10,stock:id+12,
    target:id+15,mean:id+10.4,low:id+9,high:id+12,win:.56,buy:id%2===0,
    paths:Array.from({length:256},(_,j)=>Number((id+10+j/33).toFixed(3)))
  }));
  return {
    version:1,run:'test-run-100',market:{
      tick:122,horizon:15,modeledRisk:0.05,modeledReturn:.08,
      goods
    },game:{cookies:5000},stats:{trades:10,realizedDollars:45},
    delivery:{clientVersion:'2026.11.12.2'},
    modules:{stock:'Trading'}
  };
};

test('every minute retains all trading metrics except raw stochastic paths',()=>{
  const original=buildSnapshot();
  const compact=compactSnapshot(original,'2026-11-12T14:35:00.000Z');
  assert.equal(compact.market.goods.length,18);
  assert.equal(compact.market.horizon,15);
  assert.deepEqual(compact.game,original.game);
  assert.deepEqual(compact.stats,original.stats);
  assert.deepEqual(compact.modules,original.modules);
  assert.deepEqual(compact.delivery,original.delivery);
  for(const [idx,good] of compact.market.goods.entries()){
    assert.deepEqual(good,((({paths,...rest})=>rest))(original.market.goods[idx]));
    assert.equal(Object.hasOwn(good,'paths'),false);
  }
  assert.equal(original.market.goods[0].paths.length,256,'original snapshot must not be mutated');
  const fullBytes=Buffer.byteLength(JSON.stringify(original));
  const compactBytes=Buffer.byteLength(JSON.stringify(compact));
  assert.ok(compactBytes<fullBytes*.30,
    'compact observation should use under 30% of uncompressed full sample');
});

test('periodic stochastic archives, forced legacy backfill and tick fallback',()=>{
  assert.equal(FULL_SCENARIO_INTERVAL_TICKS,60);
  assert.equal(shouldArchiveScenarios('2026-11-12T14:45:00.000Z',121),false);
  assert.equal(shouldArchiveScenarios('2026-11-12T15:00:02.000Z',121),true);
  assert.equal(shouldArchiveScenarios('2026-11-12T14:45:00.000Z',120),true);
  assert.equal(shouldArchiveScenarios('2026-11-12T14:45:00.000Z',121,{preserveFull:true}),true);
  assert.throws(()=>shouldArchiveScenarios('invalid',121),/Invalid/);
});

test('live snapshot identity retains unchanged market ticks across distinct received minutes',()=>{
  const snapshot=(tick,receivedAt,run='test-run-100')=>({run,tick,receivedAt});
  assert.equal(sameMinuteObservation(
    snapshot(873,'2026-11-13T00:12:05.000Z'),
    snapshot(873,'2026-11-13T00:13:05.000Z')),false);
  assert.equal(sameMinuteObservation(
    snapshot(873,'2026-11-13T00:13:05.000Z'),
    snapshot(873,'2026-11-13T00:13:59.000Z')),true);
  assert.equal(sameMinuteObservation(
    snapshot(873,'2026-11-13T00:13:05.000Z'),
    snapshot(874,'2026-11-13T00:13:55.000Z')),true);
  assert.equal(sameMinuteObservation(
    snapshot(873,'2026-11-13T00:13:05.000Z'),
    snapshot(873,'2026-11-13T00:13:09.000Z','another-run')),false);
});
