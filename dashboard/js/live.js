import { mountQuantTerminal } from './quant-terminal.js';
/* Cloud telemetry UI. No writer credential or game-control API is bundled here. */
const CLOUD_ENDPOINT = '/api/live';
const CLOUD_HISTORY_ENDPOINT = '/api/history';
const HISTORY_RANGES = ['24h', '7d', '30d', '1y', 'all'];
let quantTerminal;
const cloud = { latest: null, history: [], timer: null, active: false, historyRange: '24h', historyLoaded: '', historyLastFetched: 0, historyTotal: 0, historyRequest: 0, liveRequest: 0 };

const cloudCss = `
.telemetry-box{margin:0 0 18px;background:#121c1d;border:1px solid #345148;border-radius:5px;overflow:hidden}
.telemetry-top{padding:21px 23px;display:flex;gap:18px;align-items:center;justify-content:space-between;border-bottom:1px solid #304038}
.telemetry-heading{display:flex;align-items:center;gap:12px;flex-wrap:wrap}.telemetry-heading strong{font:650 19px 'Space Grotesk',sans-serif;letter-spacing:-.03em}.telemetry-heading small{font:10px 'IBM Plex Mono',monospace;color:#83a68d;letter-spacing:.06em}
.telemetry-light{height:8px;width:8px;border-radius:50%;background:#68767b}.telemetry-light.on{background:#b7f4ba;box-shadow:0 0 14px #b7f4ba}.telemetry-light.stale{background:#efc78b}
.telemetry-tabs{display:flex;gap:6px}.telemetry-tab{padding:10px 16px;background:transparent;border:1px solid #46504c;color:#a0aca4;font:650 10px 'IBM Plex Mono',monospace;letter-spacing:.04em}.telemetry-tab.active{background:#b7f4ba;color:#15221a;border-color:#b7f4ba}
.telemetry-auth{display:flex;flex-wrap:wrap;align-items:center;gap:12px;padding:18px 23px}.telemetry-auth label{font:600 10px 'IBM Plex Mono',monospace;color:#8ea89a}.telemetry-auth input,.telemetry-writer input{height:38px;min-width:190px;flex:1;background:#0b1115;border:1px solid #415149;color:#eff7ec;border-radius:3px;padding:0 12px;font:12px 'IBM Plex Mono',monospace}.telemetry-auth button,.telemetry-writer button{padding:11px 17px;border:1px solid #b7f4ba;background:#b7f4ba;color:#112117;font:650 10px 'IBM Plex Mono',monospace}.telemetry-auth button.secondary{background:transparent;color:#bad3c0;border-color:#40584c}
.telemetry-status{padding:0 23px 18px;color:#90a599;font:11px/1.55 'IBM Plex Mono',monospace}.telemetry-status.error{color:#ffa59c}
.telemetry-live{display:none;padding:21px 23px 25px}.telemetry-live.visible{display:block}.telemetry-live .subhead{display:flex;justify-content:space-between;align-items:center;gap:12px;flex-wrap:wrap}.telemetry-live .subhead strong{font:600 24px 'Space Grotesk',sans-serif}.telemetry-live .subhead span{font:10px 'IBM Plex Mono',monospace;color:#91a69b}
.telemetry-kpis{display:grid;grid-template-columns:repeat(4,1fr);gap:10px;margin-top:18px}.telemetry-kpi{border:1px solid #2a3934;background:#182423;padding:15px}.telemetry-kpi label{display:block;font:9px 'IBM Plex Mono',monospace;color:#8fa89d}.telemetry-kpi strong{display:block;font:650 23px 'Space Grotesk',sans-serif;margin:10px 0 6px;color:#e8f5e9}.telemetry-kpi small{font:10px 'IBM Plex Mono',monospace;color:#7e9589}
.telemetry-cols{display:grid;grid-template-columns:1.4fr 1fr;gap:13px;margin-top:13px}.telemetry-surface{background:#121b20;border:1px solid #2d3a3c;padding:19px;min-width:0}.telemetry-surface h4{font:600 17px 'Space Grotesk',sans-serif;margin:0 0 13px}.telemetry-surface p{font:11px/1.6 'IBM Plex Mono',monospace;color:#8fa8a3}.telemetry-ranges{display:flex;flex-wrap:wrap;gap:5px;margin:8px 0 14px}.telemetry-ranges button{padding:8px 11px;border:1px solid #30443a;background:#182522;color:#91a69b;font:600 10px 'IBM Plex Mono',monospace}.telemetry-ranges button.active{color:#152219;background:#b7f4ba;border-color:#b7f4ba}
.telemetry-stock-picker{display:flex;flex-wrap:wrap;gap:6px;margin-bottom:14px}.telemetry-stock-picker button{padding:8px 10px;border:1px solid #31443b;background:#1c2828;color:#92a59b;font:600 10px 'IBM Plex Mono',monospace}.telemetry-stock-picker button.selected{background:#b7f4ba;color:#152219}.telemetry-chart{width:100%;height:210px;display:block}
.telemetry-stock-table{width:100%;border-collapse:collapse;font:11px 'IBM Plex Mono',monospace}.telemetry-stock-table th{text-align:left;color:#89998e;font-size:9px;border-bottom:1px solid #35423b;padding:10px 5px}.telemetry-stock-table td{border-bottom:1px solid #25352e;padding:10px 5px}.telemetry-stock-table tr[data-stock]{cursor:pointer}.telemetry-stock-table tr[data-stock]:hover{background:#21322d}.telemetry-stock-table .positive{color:#b7f4ba}.telemetry-stock-table .negative{color:#f1a39b}
.telemetry-modules{display:grid;grid-template-columns:repeat(3,1fr);gap:9px;margin-top:13px}.telemetry-module{background:#131e1d;border:1px solid #304038;padding:14px;min-width:0}.telemetry-module strong{display:block;color:#b7f4ba;font:600 10px 'IBM Plex Mono',monospace;margin-bottom:9px}.telemetry-module span{font:11px/1.5 'DM Sans',sans-serif;color:#a4b7aa;overflow-wrap:anywhere}
.telemetry-help{padding:17px 23px;background:#10191a;border-top:1px solid #304038}.telemetry-empty{padding:21px 23px;color:#adbec1;font:12px/1.8 'IBM Plex Mono',monospace;background:#132222;border:1px solid #2a413b;margin-bottom:14px}.telemetry-help a{color:#b7f4ba;text-decoration:underline}.telemetry-help summary{font:11px 'IBM Plex Mono',monospace;color:#b7f4ba;cursor:pointer}.telemetry-help p{font:12px/1.65 'DM Sans',sans-serif;color:#8fa599}.telemetry-writer{display:flex;flex-wrap:wrap;gap:8px;margin-top:13px}.telemetry-live-note{font:10px/1.6 'IBM Plex Mono',monospace;color:#82988c;margin-top:12px}
@media(max-width:950px){.telemetry-cols{grid-template-columns:1fr}.telemetry-kpis{grid-template-columns:repeat(2,1fr)}.telemetry-modules{grid-template-columns:1fr 1fr}}@media(max-width:620px){.telemetry-top{align-items:flex-start;flex-direction:column}.telemetry-auth{padding:15px;align-items:stretch}.telemetry-auth label{width:100%}.telemetry-auth input{min-width:0;width:100%}.telemetry-live{padding:14px}.telemetry-kpis{gap:7px}.telemetry-kpi{padding:11px}.telemetry-kpi strong{font-size:19px}.telemetry-modules{grid-template-columns:1fr}.telemetry-surface{padding:12px}}
`;
function el(id) { return document.getElementById('cloud-' + id); }
function number(x, dp = 2) { return Number(x || 0).toLocaleString('en-US',{maximumFractionDigits:dp,minimumFractionDigits:dp}); }
function fmt(x) { let n = Number(x || 0); const a=Math.abs(n); if(a>=1e12)return number(n/1e12)+'T';if(a>=1e9)return number(n/1e9)+'B';if(a>=1e6)return number(n/1e6)+'M';if(a>=1e3)return number(n/1e3)+'K';return number(n); }
function safe(s) { return String(s ?? '').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])); }
function status(message, bad = false) { el('status').textContent=message;el('status').classList.toggle('error',bad); }
function isFresh() { return cloud.latest && Date.now()-new Date(cloud.latest.receivedAt).getTime()<150000; }

async function fetchLive(showErrors = true) {
  if (!cloud.active) return;
  const request = ++cloud.liveRequest;
  try {
    const controller = new AbortController();
    const t = setTimeout(() => controller.abort(), 12000);
    let response;
    try { response = await fetch(CLOUD_ENDPOINT,{cache:'no-store',signal:controller.signal}); }
    finally { clearTimeout(t); }
    if (!response.ok) throw Error('Telemetry API returned HTTP '+response.status);
    const data = await response.json();
    if (!cloud.active || request !== cloud.liveRequest) return;
    cloud.latest=data.latest;
    if (cloud.historyLoaded !== cloud.historyRange) cloud.history=data.history||[];
    const fresh=isFresh();
    el('light').className='telemetry-light '+(fresh?'on':cloud.latest?'stale':'');
    if(!cloud.latest) status('NO DATA YET · Waiting for the first game upload. No dashboard key required.');
    else status((fresh?'LIVE · ':'LAST SEEN · ')+new Date(cloud.latest.receivedAt).toLocaleString()+
      ' · '+(fresh?'Game telemetry current':'Game offline or no recent uploads')+
      ' · 30-second refresh');
    el('live').classList.add('visible');
    el('empty').hidden=Boolean(cloud.latest);
    el('data').hidden=!cloud.latest;
    renderLive();
    if (cloud.historyLoaded !== cloud.historyRange || Date.now() - cloud.historyLastFetched > 120000) void fetchHistory(false);
  } catch(err) {
    if(showErrors && cloud.active && request === cloud.liveRequest) status('Unable to load public telemetry: '+(err?.message||'Connection failed.'),true);
    el('light').className='telemetry-light';
  }
}
async function fetchHistory(showErrors = true) {
  if (!cloud.active) return;
  const range = cloud.historyRange;
  const request = ++cloud.historyRequest;
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 15000);
    let response;
    try {
      response = await fetch(CLOUD_HISTORY_ENDPOINT+'?range='+encodeURIComponent(range), { cache: 'no-store', signal: controller.signal });
    } finally { clearTimeout(timeout); }
    if (!response.ok) throw Error('History request failed (HTTP '+response.status+')');
    const result = await response.json();
    if (request !== cloud.historyRequest || !cloud.active || range !== cloud.historyRange) return;
    cloud.history=result.history||[];
    cloud.historyTotal=Number(result.total)||0;
    cloud.historyLoaded=range;
    cloud.historyLastFetched=Date.now();
    if (cloud.latest) renderLive();
  } catch(error) {
    if (showErrors && request === cloud.historyRequest) {
      status('History unavailable: '+(error?.message||String(error)),true);
    }
  }
}
function showMode(isLive) {
  cloud.active=isLive;
  if (!isLive) { ++cloud.historyRequest; ++cloud.liveRequest; }
  el('tab-live').classList.toggle('active',isLive);
  el('tab-demo').classList.toggle('active',!isLive);
  const demoNotice=document.querySelector('.notice[role="note"]');
  if(demoNotice)demoNotice.style.display=isLive?'none':'';
  const marketDescription=document.querySelector('#market .section-heading-row p');
  if(marketDescription)marketDescription.textContent=isLive?
    'Live stock prices, shared-shock Monte Carlo forecasts, and risk-aware trading signals.':
    'Simulate the next 10–20 market ticks, then let the optimizer pick a portfolio.';
  el('live').classList.toggle('visible',isLive);
  document.querySelectorAll('#market .metric-grid,#market .terminal-grid,#market .analysis-grid').forEach(node=>node.style.display=isLive?'none':'');
  if(cloud.timer){clearInterval(cloud.timer);cloud.timer=null;}
  if(isLive){void fetchLive();cloud.timer=setInterval(()=>void fetchLive(false),30000);}
  else status('Demo mode · Synthetic market conditions, no live connection');
}
function renderLive() {
  const data=cloud.latest;
  if (!data) return;
  const m=data.market||{}, stats=data.stats||{}, goods=m.goods||[];
  const held=goods.reduce((s,g)=>s+Number(g.stock||0)*Number(g.price||0),0);
  const total=goods.reduce((s,g)=>s+Number(g.stock||0),0);
  el('date').textContent='TICK '+number(m.tick,0)+' · '+(m.autoTrading?'AUTO TRADING ON':'AUTO TRADING OFF');
  el('kpis').innerHTML=`
    <div class="telemetry-kpi"><label>FORECAST RETURN</label><strong>${number((m.modeledReturn||0)*100)}%</strong><small>ENGINE ESTIMATE</small></div>
    <div class="telemetry-kpi"><label>WORST-5% LOSS</label><strong>${number((m.modeledRisk||0)*100)}%</strong><small>RISK LIMIT ${number((m.riskLimit||0)*100,0)}%</small></div>
    <div class="telemetry-kpi"><label>MARKED HOLDINGS</label><strong>$${fmt(held)}</strong><small>${number(total,0)} SHARES · MARKET DOLLARS</small></div>
    <div class="telemetry-kpi"><label>REALIZED P&L</label><strong>$${fmt(stats.realizedDollars)}</strong><small>${number(stats.trades,0)} TRADES</small></div>`;
  const modules=data.modules||{}, modEl=el('modules');modEl.replaceChildren();
  for(const [name,value] of [['STOCKS',modules.stock],['GARDEN',modules.garden],['GODZAMOK',modules.godzamok],['ASCENSION',modules.ascension],['DRAGON',modules.dragon],['LATEST TRADE',stats.lastAction]]) {
    const item=document.createElement('div');item.className='telemetry-module';
    const head=document.createElement('strong');head.textContent=name;
    const body=document.createElement('span');body.textContent=value||'No status reported';
    item.append(head,body);modEl.appendChild(item);
  }
  quantTerminal?.render(data,cloud.history,{
    historyRange:cloud.historyRange,
    historyLoaded:cloud.historyLoaded,
    historyTotal:cloud.historyTotal
  });
}

export function initCloudTelemetry() {
  const style=document.createElement('style');style.textContent=cloudCss;document.head.appendChild(style);
  const market=document.getElementById('market'),metrics=market.querySelector('.metric-grid');
  const element=document.createElement('div');element.className='telemetry-box';
  element.innerHTML=`
    <div class="telemetry-top">
      <div class="telemetry-heading"><i id="cloud-light" class="telemetry-light"></i><strong>Cloud telemetry</strong><small>PUBLIC · READ-ONLY</small></div>
      <div class="telemetry-tabs"><button id="cloud-tab-live" class="telemetry-tab active" type="button">LIVE GAME</button><button id="cloud-tab-demo" class="telemetry-tab" type="button">DEMO</button></div>
    </div>
    <div id="cloud-status" class="telemetry-status">Connecting to public game telemetry…</div>
    <div id="cloud-live" class="telemetry-live visible">
      <div id="cloud-empty" class="telemetry-empty">Waiting for game telemetry. This dashboard needs no access key. Once the game publisher uploads a snapshot, live analysis appears here.</div>
      <div id="cloud-data" hidden>
        <div class="subhead"><strong>Live game telemetry</strong><span id="cloud-date">WAITING FOR FIRST UPLOAD</span></div>
        <div id="cloud-kpis" class="telemetry-kpis"></div>
        <div id="cloud-quant"></div>
        <div id="cloud-modules" class="telemetry-modules"></div>
        <p class="telemetry-live-note">Actual game data with the engine's forecasts. The dashboard cannot execute trades or change the game.</p>
      </div>
    </div>
    <details class="telemetry-help"><summary>ABOUT THIS LIVE FEED</summary>
      <p>This is a public, read-only view of one CookieQuant game. The installed userscript uploads market snapshots about once per minute while running. Its private publishing credential prevents visitors from submitting data. Viewers need no key.</p>
      <p>For a new game installation, see <a href="https://github.com/ABCPeter123/CookieQuant/blob/main/docs/CLOUD_TELEMETRY.md" target="_blank" rel="noopener noreferrer">the game publishing setup guide</a>.</p>
    </details>`;
  metrics.before(element);
  quantTerminal=mountQuantTerminal(el('quant'));
  el('ranges').querySelectorAll('button[data-range]').forEach(button=>{
    button.addEventListener('click',()=>{
      const range=button.dataset.range;
      if(!HISTORY_RANGES.includes(range) || range===cloud.historyRange)return;
      cloud.historyRange=range;
      cloud.historyLoaded='';
      el('ranges').querySelectorAll('button').forEach(b=>b.classList.toggle('active',b===button));
      if(cloud.active)void fetchHistory(true);
    });
  });
  el('tab-demo').addEventListener('click',()=>showMode(false));
  el('tab-live').addEventListener('click',()=>showMode(true));
  showMode(true);
}
