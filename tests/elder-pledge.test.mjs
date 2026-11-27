import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {runInNewContext} from 'node:vm';

const source=await readFile(new URL('../src/cookie-quant.js',import.meta.url),'utf8');
const start=source.indexOf('  function getPendingElderPledge() {');
const end=source.indexOf('  toolkit.elderPledgeTimer = setInterval',start);
assert.ok(start>0 && end>start,'Elder Pledge scheduling exists');
const code=source.slice(start,end);

function scenario({
  active=true,autoBuy=true,autoBuyUpgrades=true,unlocked=true,bought=false,
  inShop=true,pledgeT=0,hasPact=true,covenant=false,clickBuff=false,
  canBuy=true,price=100,cookies=100,recovery=false,oldPledges=0,
  ascending=false,now=10000,cap=3,throwOnBuy=false,succeed=true
}={}) {
  let buyCalls=0;
  const upgrade={name:'Elder Pledge',unlocked,bought,canBuy:()=>canBuy,
    getPrice:()=>price,buy(){
      buyCalls++;
      if(throwOnBuy)throw Error('blocked');
      if(succeed){game.pledgeT=1800;game.pledges++;}
    }};
  const game={pledgeT,pledges:oldPledges,fps:30,buyMode:-1,cookies,OnAscend:ascending,
    Upgrades:{'Elder Pledge':upgrade},UpgradesInStore:inShop?[upgrade]:[],
    Has:name=>name==='Elder Pact'?hasPact:name==='Elder Covenant'?covenant:false};
  const controls={autoElderPledge:active,autoBuy,autoBuyUpgrades,
    grandmapocalypseStageCap:cap};
  const toolkit={active:true,elderPledgeStatus:'Waiting',lastElderPledgeAt:-Infinity,
    godzamokRebuildQueue:recovery?[{name:'Farm'}]:[],
    ftHofTowerRebuildRemaining:0,targetSnapshotAt:0,lastPurchaseAt:0};
  const ctx={Game:game,controls,toolkit,performance:{now:()=>now},
    isAscensionAutomationBusy:()=>false,isClickRelatedBuffActive:()=>clickBuff,
    formatTime:s=>s+' sec',compactNumber:n=>String(n)};
  const getPendingElderPledge=runInNewContext(code+'\ngetPendingElderPledge;',ctx);
  const runElderPledgeAutomation=runInNewContext(code+'\nrunElderPledgeAutomation;',ctx);
  return {run:runElderPledgeAutomation,pending:getPendingElderPledge,
    game,toolkit,get buyCalls(){return buyCalls;}};
}

test('pledge renewal works when normal auto-buy and upgrades are disabled',()=>{
  const state=scenario({autoBuy:false,autoBuyUpgrades:false});
  assert.equal(state.run(),true);
  assert.equal(state.buyCalls,1);
  assert.equal(state.toolkit.lastPurchaseName,'Elder Pledge');
  assert.equal(state.toolkit.elderPledgeStatus,'Renewed Elder Pledge');
});

test('available repeatable pledge does not depend on old unlocked/bought flags',()=>{
  const state=scenario({unlocked:false,bought:true});
  assert.equal(state.run(),true);
  assert.equal(state.buyCalls,1);
});

test('does not purchase while active, hidden, disabled, or recovery is pending',()=>{
  for(const config of [{pledgeT:300},{covenant:true},{active:false},
      {inShop:false},{canBuy:false},{clickBuff:true},{recovery:true},
      {ascending:true},{cookies:99},{price:Infinity}]){
    const state=scenario(config);
    assert.equal(state.run(),false,JSON.stringify(config));
    assert.equal(state.buyCalls,0,JSON.stringify(config));
  }
});

test('reserves ordinary autobuy spending until an expired pledge is affordable',()=>{
  const state=scenario({cookies:20});
  assert.ok(state.pending());
  assert.equal(state.run(),false);
  assert.match(state.toolkit.elderPledgeStatus,/Saving for Elder Pledge/);
  state.game.cookies=100;
  assert.equal(state.run(),true);
  assert.equal(state.pending(),null);
});

test('failed purchases report failures rather than fake successes',()=>{
  const blocked=scenario({succeed:false});
  assert.equal(blocked.run(),false);
  assert.match(blocked.toolkit.elderPledgeStatus,/did not activate/);
  const thrown=scenario({throwOnBuy:true});
  assert.equal(thrown.run(),false);
  assert.match(thrown.toolkit.elderPledgeStatus,/purchase failed/);
});

test('toggle, status, timer, savings priority and cleanup remain wired',()=>{
  assert.match(source,/savedControls\.autoElderPledge/);
  assert.match(source,/id="cct-auto-elder-pledge"/);
  assert.match(source,/id="cct-elder-pledge-status"/);
  assert.match(source,/autoElderPledgeInput\.addEventListener\("change"/);
  assert.match(source,/toolkit\.elderPledgeTimer = setInterval\(runElderPledgeAutomation, ELDER_PLEDGE_CHECK_MS\)/);
  assert.match(source,/clearInterval\(toolkit\.elderPledgeTimer\)/);
  assert.match(source,/if \(getPendingElderPledge\(\)\) return;/);
  const autobuy = source.slice(source.indexOf('  toolkit.autoBuyTimer = setInterval('));
  assert.ok(autobuy.indexOf('runGodzamokRebuild(now)') <
    autobuy.indexOf('getPendingElderPledge()'), 'never delay Godzamok recovery for Elder Pledge');
  assert.ok(autobuy.indexOf('runFtHoFTowerRebuild(now)') <
    autobuy.indexOf('getPendingElderPledge()'), 'never delay tower recovery for Elder Pledge');
  assert.doesNotMatch(code,/!controls\.autoBuy \|\| !controls\.autoBuyUpgrades/);
  assert.doesNotMatch(code,/canBuyWithoutBreakingReserve/);
  assert.match(source,/Elder Pledge: \$\{toolkit\.elderPledgeStatus\}/);
  assert.ok(source.includes('upgrade.name === "Elder Covenant"'));
});
