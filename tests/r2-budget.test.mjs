import test from 'node:test';
import assert from 'node:assert/strict';
import {applyReservation, BUDGET_LIMITS} from '../dashboard/lib/r2-budget-core.js';

const date = value => new Date(value);
const boot = dateValue => applyReservation(null,{bootstrapAllowed:true},date(dateValue));

test('budget refuses uninitialized store, requires explicit empty-bucket bootstrap',()=>{
  assert.equal(applyReservation(null,{classA:1},date('2026-11-12T00:00:00Z')).ok,false);
  const init=boot('2026-11-12T00:00:00Z');
  assert.equal(init.ok,true);
  assert.equal(init.next.days['2026-11-12'].a,1);
  assert.equal(init.next.days['2026-11-12'].b,1);
});

test('conservatively reserves billed conditional writes and reads, and enforces storage limit',()=>{
  let state=boot('2026-11-12T00:00:00Z').next;
  const first=applyReservation(state,{classA:12,classB:14,bytes:100},date('2026-11-12T14:00:00Z'));
  assert.equal(first.ok,true);
  assert.equal(first.next.days['2026-11-12'].a,14);
  assert.equal(first.next.days['2026-11-12'].b,16);
  assert.equal(first.next.bytesReserved,100);
  state=first.next;
  const remaining=BUDGET_LIMITS.storageBytes-state.bytesReserved;
  const filled=applyReservation(state,{bytes:remaining},date('2026-11-12T14:00:00Z'));
  assert.equal(filled.ok,true);
  assert.equal(filled.next.bytesReserved,BUDGET_LIMITS.storageBytes);
  const blocked=applyReservation(filled.next,{bytes:1},date('2026-11-12T14:00:00Z'));
  assert.equal(blocked.ok,false);
  assert.match(blocked.reason,/Storage/);
});

test('rolling operation ceilings do not reset at month boundaries',()=>{
  const state=boot('2026-11-29T00:00:00Z').next;
  const almost={...state,days:{'2026-11-29':{a:BUDGET_LIMITS.classA31Days-2,b:3}}};
  const denied=applyReservation(almost,{classA:2},date('2026-12-01T01:00:00Z'));
  assert.equal(denied.ok,false);
  assert.match(denied.reason,/Class A/);
  const fullB={...state,days:{'2026-11-29':{a:1,b:BUDGET_LIMITS.classB31Days}}};
  const deniedB=applyReservation(fullB,{classB:1},date('2026-12-01T01:00:00Z'));
  assert.equal(deniedB.ok,false);
  assert.match(deniedB.reason,/Class B/);
  const after31=applyReservation(fullB,{classB:1},date('2027-01-02T01:00:00Z'));
  assert.equal(after31.ok,true);
  assert.equal(after31.next.bytesReserved,0);
});

test('malformed or missing budget state always fails closed',()=>{
  assert.equal(applyReservation({version:99,days:{},bytesReserved:0},{classA:1},new Date()).ok,false);
  assert.equal(applyReservation({version:1,days:{},bytesReserved:-1},{classA:1},new Date()).ok,false);
  assert.equal(applyReservation(boot('2026-11-12T00:00:00Z').next,{bytes:-100},new Date()).ok,false);
});
