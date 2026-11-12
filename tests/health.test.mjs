import { test } from 'node:test';
import assert from 'node:assert/strict';
import { classifyFeed, buildHealthView, HEALTH_WINDOW_MINUTES } from '../dashboard/lib/health-core.js';

test('feed status uses server-observed last successful upload only',()=>{
  assert.equal(classifyFeed(null),'waiting');
  assert.equal(classifyFeed(0),'live');
  assert.equal(classifyFeed(149),'live');
  assert.equal(classifyFeed(150),'live');
  assert.equal(classifyFeed(151),'delayed');
  assert.equal(classifyFeed(600),'delayed');
  assert.equal(classifyFeed(601),'offline');
});

test('minute activity distinguishes observed snapshots from connection uptime',()=>{
  const data=buildHealthView({
    now:'2026-11-12T14:00:30.000Z',
    latestAt:'2026-11-12T13:59:55Z',
    minuteRows:[
      {minute:'2026-11-12T13:59:00Z',samples:2},
      {minute:'2026-11-12T13:59:00Z',samples:1},
      {minute:'2026-11-12T13:58:00Z',samples:1},
      {minute:'2026-11-12T13:00:00Z',samples:2} // outside 60 displayed buckets
    ],
    snapshots24h:127
  });
  assert.equal(data.status,'live');
  assert.equal(data.ageSeconds,35);
  assert.equal(data.minutes.length,HEALTH_WINDOW_MINUTES);
  assert.equal(data.recordedMinutesLastHour,2);
  assert.equal(data.cadence.recentWindowMinutes,10);
  assert.equal(data.cadence.recentRecordedMinutes,2);
  assert.equal(data.cadence.status,'gaps');
  assert.equal(data.snapshotsLastHour,4);
  assert.equal(data.snapshotsLast24Hours,127);
  assert.equal(data.publisher,null);
  assert.equal(data.minutes.at(-1).snapshots,0);
  assert.equal(data.minutes.at(-2).snapshots,3);
});

test('delivery statistics are reported only when available, never synthesized',()=>{
  const publisher={clientVersion:'2026.11.12.2',attempts:19,failedAttempts:2,
    recoveries:1,retriesBeforeSuccess:2,lastFailureKind:'timeout',
    lastFailureAt:'2026-11-12T13:58:00Z',lastRecoveryAt:'2026-11-12T13:59:00Z'};
  const health=buildHealthView({now:'2026-11-12T14:00:00Z',
    latestAt:'2026-11-12T13:59:00Z',delivery:publisher});
  assert.equal(health.publisher.failedAttempts,2);
  assert.equal(health.publisher.recoveries,1);
  assert.equal(health.publisher.lastFailureKind,'timeout');
  assert.equal(health.publisher.retriesBeforeSuccess,2);
  const missing=buildHealthView({now:'2026-11-12T14:00:00Z'});
  assert.equal(missing.status,'waiting');
  assert.equal(missing.lastReceivedAt,null);
  assert.equal(missing.ageSeconds,null);
  assert.equal(missing.publisher,null);
});

test('ten completed minutes report accurate cadence without assuming browser uptime',()=>{
  const start=Date.parse('2026-11-12T13:50:00Z');
  const minuteRows=Array.from({length:10},(_,i)=>({
    minute:new Date(start+i*60_000).toISOString(),samples:1
  }));
  const healthy=buildHealthView({
    now:'2026-11-12T14:00:35Z',
    latestAt:'2026-11-12T13:59:55Z',minuteRows
  });
  assert.equal(healthy.cadence.status,'on-target');
  assert.equal(healthy.cadence.recentRecordedMinutes,10);
  assert.equal(healthy.cadence.recentMissedMinutes,0);
  assert.equal(healthy.cadence.targetIntervalSeconds,60);
  const sparse=buildHealthView({
    now:'2026-11-12T14:00:35Z',
    latestAt:'2026-11-12T13:59:55Z',
    minuteRows:[minuteRows[0],minuteRows[9]]
  });
  assert.equal(sparse.status,'live');
  assert.equal(sparse.cadence.status,'gaps');
  assert.equal(sparse.cadence.recentRecordedMinutes,2);
  assert.equal(sparse.cadence.recentMissedMinutes,8);
});
