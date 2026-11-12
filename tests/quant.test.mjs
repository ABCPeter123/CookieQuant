import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { forecastMetrics, percentile, correlation, normalizedHistory } from '../dashboard/js/quant-math.js';

test('interpolated quantiles match known ordered outcomes',()=>{
  assert.equal(percentile([1,2,3,4,5],0),1);
  assert.equal(percentile([1,2,3,4,5],.5),3);
  assert.equal(percentile([1,2,3,4,5],.95),4.8);
  assert.equal(percentile([],0.5),null);
});

test('terminal forecast uses actual joint scenarios and fee-aware profit threshold',()=>{
  const paths=[9,10,10,11,12,13,14,15];
  const result=forecastMetrics({id:1,symbol:'CHC',name:'Chocolate',price:10,stock:3,target:5,buy:true,paths,mean:11.75},.1);
  assert.equal(result.count,8);
  assert.equal(result.mean,94/8);
  assert.equal(result.edgePct,17.5);
  assert.equal(result.pProfit,4/8);
  assert.ok(result.q05 < result.median);
  assert.ok(result.median < result.q95);
  assert.ok(result.tailReturnPct<0);
  assert.equal(result.stock,3);
  assert.equal(result.target,5);
  assert.equal(forecastMetrics({price:0,paths}),null);
  assert.equal(forecastMetrics({price:10,paths:[]}),null);
});

test('common-shock correlation gives symmetric +1/-1 and undefined for zero variance',()=>{
  const a=[1,2,3,4,5,6,7,8,9];
  const b=[9,8,7,6,5,4,3,2,1];
  assert.ok(Math.abs(correlation(a,a)-1)<1e-12);
  assert.ok(Math.abs(correlation(a,b)+1)<1e-12);
  assert.equal(correlation(a,Array(9).fill(3)),null);
  assert.equal(correlation(a,[1]),null);
});

test('synchronized price history preserves real time gaps, missing quotes and baselines',()=>{
  const input=[
    {receivedAt:'2026-11-11T11:01:00Z',market:{goods:[{id:0,price:105},{id:1,price:20}]}},
    {receivedAt:'2026-11-11T11:00:00Z',market:{goods:[{id:0,price:100}]}},
    {receivedAt:'2026-11-11T11:04:00Z',market:{goods:[{id:0,price:110},{id:1,price:21}]}}
  ];
  const out=normalizedHistory(input,[]);
  assert.equal(out.first.get(0),100);
  assert.equal(out.first.get(1),20);
  assert.equal(out.observations[0].prices.has(1),false);
  assert.equal((out.observations[2].time-out.observations[1].time)/60000,3);
});

test('quant terminal includes all-stocks view, 256-scenario forecast matrix and correlations',async()=>{
  const terminal=await readFile(new URL('../dashboard/js/quant-terminal.js',import.meta.url),'utf8');
  const browser=await readFile(new URL('../dashboard/js/live.js',import.meta.url),'utf8');
  const html=await readFile(new URL('../dashboard/index.html',import.meta.url),'utf8');
  assert.match(terminal,/Multi-asset market tape/);
  assert.match(terminal,/Cross-sectional forecast surface/);
  assert.match(terminal,/Scenario distribution/);
  assert.match(terminal,/Forecast &amp; execution matrix/);
  assert.match(terminal,/Joint-scenario correlation diagnostic/);
  assert.match(terminal,/state\.goods/);
  assert.match(terminal,/P05–P95/);
  assert.match(terminal,/forecastMetrics/);
  assert.match(browser,/mountQuantTerminal/);
  assert.match(html,/quant\.css/);
  assert.doesNotMatch(terminal,/TELEMETRY_READ_KEY|DATABASE_URL/);
});
