import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {runInNewContext} from 'node:vm';

const script=await readFile(new URL('../src/cookie-quant.js',import.meta.url),'utf8');
const from=script.indexOf('  function selectGodzamokQuickPlan(');
const to=script.indexOf('  function quoteGodzamokRoundTrip(',from);
assert.ok(from>0 && to>from,'quick Godzamok fallback available');

function runQuick({budget=1000,boost=5,quantity=200,sellMultiplier=0.25,objective='profit'}={}) {
  const building={
    name:'Farm',amount:quantity,locked:false,
    sell(){},buy(){},
    getPrice(){return 100+this.amount;},
    getSellMultiplier(){return sellMultiplier;}
  };
  const stats={
    rate:10,perClick:50,seconds:8,horizon:8,
    valuePerBuilding:boost*100,interruptionCost:10
  };
  const controls={godzamokObjective:objective,godzamokConfidence:1,godzamokMaxRecoverySeconds:300};
  const scoringStart=script.indexOf('  function scoreGodzamokCandidate(');
  const scoringEnd=script.indexOf('  function selectGodzamokPlan(',scoringStart);
  const fn=runInNewContext(script.slice(scoringStart,scoringEnd)+
    script.slice(from,to)+'\nselectGodzamokQuickPlan;',{
      Game:{Objects:{Farm:building},cookiesReset:0,cookiesEarned:0},
      controls,GODZAMOK_BUILDINGS:['Farm'],
      getGodzamokSaleLimits:b=>({amount:b.amount,maxSell:b.amount}),
      getGodzamokRecoveryRate:()=>100,
      GODZAMOK_PROFIT_MARGIN:1.25
    });
  return fn(stats,budget);
}
test('quick plan finds a profitable affordable sacrifice without the full frontier',()=>{
  const plan=runQuick();
  assert.ok(plan);
  assert.ok(plan.sold>0);
  assert.ok(plan.cost<=1000);
  assert.equal(plan.quantities.get('Farm'),plan.sold);
});
test('quick plan skips losing or unaffordable sacrifices',()=>{
  assert.equal(runQuick({boost:0.01}),null);
  assert.equal(runQuick({budget:0}),null);
});
test('quick fallback remains protected by live profit/recovery guards',()=>{
  assert.match(script,/const quick = selectGodzamokQuickPlan\(quickForecast,/);
  assert.match(script,/if \(quick\) \{[\s\S]*?sellForGodzamok\(quick\)/);
  assert.match(script,/scoreGodzamokCandidate\(Math\.max\(cost,0\),quantity,forecast,budget\)/);
});
test('non-clicking buffs cannot artificially shorten a click combo',()=>{
  assert.match(script,/const relevant = active\.filter\(buff =>/);
  assert.match(script,/const horizon = Math\.min\(10, \.\.\.relevant\.map\(getBuffSecondsLeft\)\)/);
});
