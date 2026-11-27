import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {runInNewContext} from 'node:vm';

const source=await readFile(new URL('../src/cookie-quant.js',import.meta.url),'utf8');
const start=source.indexOf('  function runElderPledgeAutomation() {');
const end=source.indexOf('  toolkit.elderPledgeTimer = setInterval',start);
assert.ok(start>0 && end>start,'Dedicated Elder Pledge renewal function exists');
const functionSource=source.slice(start,end);

function scenario({
  active=true,autoBuy=true,autoBuyUpgrades=true,unlocked=true,bought=false,
  inShop=true,pledgeT=0,hasPact=true,covenant=false,
  balanceOk=true,clickBuff=false,canBuy=true,price=100,
  recovery=false,oldPledges=0
}={}) {
  let buyCalls=0;
  const upgrade={
    name:'Elder Pledge',unlocked,bought,
    canBuy:()=>canBuy,getPrice:()=>price,
    buy(){buyCalls++;game.pledgeT=60*30;game.pledges++;}
  };
  const game={pledgeT,pledges:oldPledges,fps:30,buyMode:1,OnAscend:false,
    Upgrades:{'Elder Pledge':upgrade},UpgradesInStore:inShop?[upgrade]:[],
    Has:name=>name==='Elder Pact'?hasPact:name==='Elder Covenant'?covenant:false};
  const controls={autoElderPledge:active,autoBuy,autoBuyUpgrades};
  const toolkit={
    active:true,elderPledgeStatus:'Waiting',lastElderPledgeAt:-Infinity,
    godzamokRebuildQueue:recovery?[{name:'Farm'}]:[],
    ftHofTowerRebuildRemaining:0,targetSnapshotAt:0,lastPurchaseAt:0
  };
  const context={Game:game,controls,toolkit,performance:{now:()=>10000},
    isAscensionAutomationBusy:()=>false,isClickRelatedBuffActive:()=>clickBuff,
    canBuyWithoutBreakingReserve:()=>balanceOk,
    formatTime:s=>s+' seconds',compactNumber:n=>String(n)};
  const fn=runInNewContext(functionSource+'\nrunElderPledgeAutomation;',context);
  return {changed:fn(),game,toolkit,buyCalls};
}

test('auto pledge renews an unlocked expired pledge and records purchase',()=>{
  const state=scenario();
  assert.equal(state.changed,true);
  assert.equal(state.buyCalls,1);
  assert.equal(state.toolkit.lastPurchaseName,'Elder Pledge');
  assert.equal(state.toolkit.elderPledgeStatus,'Renewed Elder Pledge');
});

test('does not re-buy while active or when covenant is active',()=>{
  for(const config of [{pledgeT:300},{covenant:true},{hasPact:false}]){
    const state=scenario(config);
    assert.equal(state.changed,false);
    assert.equal(state.buyCalls,0);
  }
});

test('respects master controls, reserve, available shop and active combos',()=>{
  for(const config of [{active:false},{autoBuy:false},{autoBuyUpgrades:false},
    {unlocked:false},{bought:true},{inShop:false},{balanceOk:false},
    {canBuy:false},{clickBuff:true},{recovery:true}]){
    const state=scenario(config);
    assert.equal(state.changed,false,JSON.stringify(config));
    assert.equal(state.buyCalls,0,JSON.stringify(config));
  }
});

test('UI exposes toggle, runner is scheduled and cleanup cancels it',()=>{
  assert.match(source,/autoElderPledge:.*\n[\s\S]*?savedControls\.autoElderPledge/);
  assert.match(source,/id="cct-auto-elder-pledge"/);
  assert.match(source,/autoElderPledgeInput\.addEventListener\("change"/);
  assert.match(source,/toolkit\.elderPledgeTimer = setInterval\(runElderPledgeAutomation, ELDER_PLEDGE_CHECK_MS\)/);
  assert.match(source,/clearInterval\(toolkit\.elderPledgeTimer\)/);
  assert.match(source,/Elder Pledge: \$\{toolkit\.elderPledgeStatus\}/);
  assert.ok(source.includes('upgrade.name === "Elder Covenant"'));
  assert.ok(source.includes('upgrade.name === "Elder Pledge"'));
});
