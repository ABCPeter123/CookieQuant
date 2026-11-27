import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {runInNewContext} from 'node:vm';

const source=await readFile(new URL('../src/cookie-quant.js',import.meta.url),'utf8');
const start=source.indexOf('  function scoreGodzamokCandidate(');
const end=source.indexOf('  function selectGodzamokPlan(',start);
assert.ok(start>0 && end>start,'Godzamok candidate evaluation is available');

function score(objective,cost,sold,valuePerBuilding,budget) {
  const controls={godzamokObjective:objective,godzamokConfidence:1,godzamokMaxRecoverySeconds:300};
  const ctx={controls,Game:{cookiesReset:0,cookiesEarned:0},
    GODZAMOK_PROFIT_MARGIN:1.25,getGodzamokRecoveryRate:()=>100};
  const fn=runInNewContext(source.slice(start,end)+'\nscoreGodzamokCandidate;',ctx);
  return fn(cost,sold,{
    rate:1,perClick:1,valuePerBuilding,seconds:8,horizon:8,interruptionCost:10
  },budget);
}

test('full-sale rejects losses, marginal projections and unaffordable buybacks',()=>{
  assert.equal(score('all',100,100,1,1000),null);
  assert.equal(score('all',100,100,2,90),null);
  assert.ok(score('all',100,100,2,200));
});

test('profit mode protects reserve and requires a positive estimated margin',()=>{
  assert.equal(score('profit',100,100,1,1000),null);
  assert.equal(score('profit',100,100,2,90),null);
  assert.ok(score('profit',100,100,2,200));
});

test('legacy sell-all becomes profit mode and pending recovery blocks autobuy',()=>{
  assert.match(source,/godzamokSafetyV2: true/);
  assert.ok(source.includes('savedControls.godzamokObjective === "all" && !savedControls.godzamokSafetyV2'));
  assert.ok(source.includes('getGodzamokSellAllPlan(forecast, Number(Game.cookies) - Number(getReserve()))'));
  assert.ok(source.includes('scoreGodzamokCandidate(totalCost, plan.sold, plan, bankBefore - reserve)'));
  assert.ok(source.includes('if (runGodzamokRebuild(now)) return;\n    if (runFtHoFTowerRebuild(now)) return;'));
  assert.doesNotMatch(source,/scoreGodzamokCandidate\(cost,sold,forecast,Infinity\)/);
  const before=source.indexOf('function runGodzamokRebuild(now)');
  const after=source.indexOf('function runFtHoFTowerRebuild(now)',before);
  const rebuild=source.slice(before,after);
  assert.match(rebuild,/if \(toolkit\.godzamokRebuildQueue\.length > 0\)[\s\S]*?return true;/);
});
