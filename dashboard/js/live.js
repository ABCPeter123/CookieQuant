/* Cloud telemetry UI. No writer credential or game-control API is bundled here. */
const CLOUD_ENDPOINT = '/api/live';
const CLOUD_HISTORY_ENDPOINT = '/api/history';
const HISTORY_RANGES = ['24h', '7d', '30d', '1y', 'all'];
const cloud = { key: sessionStorage.getItem('cookiequant:viewer') || '', latest: null, history: [], timer: null, active: false, selected: null, historyRange: '24h', historyLoaded: '', historyLastFetched: 0, historyTotal: 0, historyRequest: 0 };

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
.telemetry-help{padding:17px 23px;background:#10191a;border-top:1px solid #304038}.telemetry-help summary{font:11px 'IBM Plex Mono',monospace;color:#b7f4ba;cursor:pointer}.telemetry-help p{font:12px/1.65 'DM Sans',sans-serif;color:#8fa599}.telemetry-writer{display:flex;flex-wrap:wrap;gap:8px;margin-top:13px}.telemetry-live-note{font:10px/1.6 'IBM Plex Mono',monospace;color:#82988c;margin-top:12px}
@media(max-width:950px){.telemetry-cols{grid-template-columns:1fr}.telemetry-kpis{grid-template-columns:repeat(2,1fr)}.telemetry-modules{grid-template-columns:1fr 1fr}}@media(max-width:620px){.telemetry-top{align-items:flex-start;flex-direction:column}.telemetry-auth{padding:15px;align-items:stretch}.telemetry-auth label{width:100%}.telemetry-auth input{min-width:0;width:100%}.telemetry-live{padding:14px}.telemetry-kpis{gap:7px}.telemetry-kpi{padding:11px}.telemetry-kpi strong{font-size:19px}.telemetry-modules{grid-template-columns:1fr}.telemetry-surface{padding:12px}}
`;
function el(id) { return document.getElementById('cloud-' + id); }
function number(x, dp = 2) { return Number(x || 0).toLocaleString('en-US',{maximumFractionDigits:dp,minimumFractionDigits:dp}); }
function fmt(x) { let n = Number(x || 0); const a=Math.abs(n); if(a>=1e12)return number(n/1e12)+'T';if(a>=1e9)return number(n/1e9)+'B';if(a>=1e6)return number(n/1e6)+'M';if(a>=1e3)return number(n/1e3)+'K';return number(n); }
function safe(s) { return String(s ?? '').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])); }
function status(message, bad = false) { el('status').textContent=message;el('status').classList.toggle('error',bad); }
function isFresh() { return cloud.latest && Date.now()-new Date(cloud.latest.receivedAt).getTime()<150000; }

async function fetchLive(showErrors = true) {
  if (!cloud.key || !cloud.active) return;
  try {
    const controller = new AbortController();
    const t = setTimeout(() => controller.abort(), 12000);
    let response;
    try { response = await fetch(CLOUD_ENDPOINT,{headers:{Authorization:'Bearer '+cloud.key},cache:'no-store',signal:controller.signal}); }
    finally { clearTimeout(t); }
    if (response.status === 401) throw Error('Incorrect viewer key. Your game is not affected.');
    if (!response.ok) throw Error('Telemetry API returned HTTP '+response.status);
    const data = await response.json();
    cloud.latest=data.latest;
    if (cloud.historyLoaded !== cloud.historyRange) cloud.history=data.history||[];
    const fresh=isFresh();
    el('light').className='telemetry-light '+(fresh?'on':cloud.latest?'stale':'');
    if(!cloud.latest) status('Authenticated. No telemetry received yet. Enable the publisher in your Cookie Clicker console.');
    else status((fresh?'LIVE · ':'LAST SEEN · ')+new Date(cloud.latest.receivedAt).toLocaleString()+
      ' · '+(fresh?'Game telemetry current':'Game offline or no recent uploads')+
      ' · 30-second refresh');
    el('live').classList.add('visible');
    renderLive();
    if (cloud.historyLoaded !== cloud.historyRange || Date.now() - cloud.historyLastFetched > 120000) void fetchHistory(false);
  } catch(err) {
    if(showErrors) status(err.message || 'Connection failed.',true);
    el('light').className='telemetry-light';
  }
}
async function fetchHistory(showErrors = true) {
  if (!cloud.key || !cloud.active) return;
  const range = cloud.historyRange;
  const request = ++cloud.historyRequest;
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 15000);
    let response;
    try {
      response = await fetch(CLOUD_HISTORY_ENDPOINT+'?range='+encodeURIComponent(range), {
        headers: { Authorization: 'Bearer '+cloud.key }, cache: 'no-store', signal: controller.signal
      });
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
  if (!isLive) ++cloud.historyRequest;
  el('tab-live').classList.toggle('active',isLive);
  el('tab-demo').classList.toggle('active',!isLive);
  el('auth').hidden=!isLive;
  el('live').classList.toggle('visible',isLive && Boolean(cloud.latest));
  document.querySelectorAll('#market .metric-grid,#market .terminal-grid,#market .analysis-grid').forEach(node=>node.style.display=isLive?'none':'');
  if(cloud.timer){clearInterval(cloud.timer);cloud.timer=null;}
  if(isLive){if(cloud.key)void fetchLive();cloud.timer=setInterval(()=>void fetchLive(false),30000);}
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
  if(!goods.some(g=>g.id===cloud.selected))cloud.selected=goods[0]?.id??null;
  el('stocks').replaceChildren();
  for (const g of goods) {
    const b=document.createElement('button');
    b.textContent=g.symbol;b.className=g.id===cloud.selected?'selected':'';
    b.addEventListener('click',()=>{cloud.selected=g.id;renderLive();});
    el('stocks').appendChild(b);
  }
  const body=el('rows');body.replaceChildren();
  for (const g of goods) {
    const tr=document.createElement('tr');tr.dataset.stock=g.id;
    const edge=Number(g.mean||0)-Number(g.price||0);
    tr.innerHTML=`<td>${safe(g.symbol)}</td><td>$${number(g.price)}</td><td>$${number(g.mean)}</td><td class="${edge>=0?'positive':'negative'}">${edge>=0?'+':''}${number(edge)}</td><td>${number(g.stock,0)} / ${number(g.target,0)}</td>`;
    tr.addEventListener('click',()=>{cloud.selected=g.id;renderLive();});body.appendChild(tr);
  }
  const modules=data.modules||{}, modEl=el('modules');modEl.replaceChildren();
  for(const [name,value] of [['STOCKS',modules.stock],['GARDEN',modules.garden],['GODZAMOK',modules.godzamok],['ASCENSION',modules.ascension],['DRAGON',modules.dragon],['LATEST TRADE',stats.lastAction]]) {
    const item=document.createElement('div');item.className='telemetry-module';
    const head=document.createElement('strong');head.textContent=name;
    const body=document.createElement('span');body.textContent=value||'No status reported';
    item.append(head,body);modEl.appendChild(item);
  }
  const rangeLabel=cloud.historyRange==='all'?'all time':cloud.historyRange.toUpperCase();
  const shown=cloud.history.length;
  const historicalCount=cloud.historyLoaded===cloud.historyRange?cloud.historyTotal:shown;
  el('stock-caption').textContent=goods.length
    ?'Actual prices · '+shown+' chart points from '+number(historicalCount,0)+' recorded snapshots ('+rangeLabel+'). Forecast mean and 5th/95th percentile appear at the right edge. The underlying history is retained without expiration.'
    :'Bank minigame not available yet.';
  renderGraph();
}
function renderGraph() {
  const canvas=el('chart'),box=canvas.getBoundingClientRect();if(box.width<30)return;
  const dpr=Math.min(devicePixelRatio||1,2);canvas.width=Math.floor(box.width*dpr);canvas.height=Math.floor(box.height*dpr);
  const ctx=canvas.getContext('2d');ctx.scale(dpr,dpr);
  const w=box.width,h=box.height,left=44,right=w-25,top=17,bottom=h-27;
  const selected=cloud.latest?.market?.goods?.find(g=>g.id===cloud.selected);if(!selected)return;
  const samples=cloud.history.map(row=>({
    date:new Date(row.receivedAt).getTime(),value:row.market?.goods?.find(g=>g.id===selected.id)?.price
  })).filter(x=>Number.isFinite(x.value)).slice(-450);
  if(!samples.length)return;
  const values=[...samples.map(x=>x.value),selected.mean,selected.low,selected.high];
  let low=Math.min(...values),high=Math.max(...values);
  const buffer=Math.max(2,(high-low)*.16);low=Math.max(0,low-buffer);high+=buffer;
  const y=n=>top+(bottom-top)*(high-n)/(high-low);
  const x=i=>left+(right-left-50)*(samples.length===1?0.5:i/(samples.length-1));
  ctx.font='10px IBM Plex Mono, monospace';ctx.strokeStyle='#293b35';ctx.fillStyle='#81978b';
  for(let j=0;j<=4;j++){const val=low+(high-low)*j/4,py=y(val);ctx.beginPath();ctx.moveTo(left,py);ctx.lineTo(right,py);ctx.stroke();ctx.textAlign='right';ctx.fillText('$'+number(val,0),left-6,py+4);}
  ctx.fillStyle='#859d91';ctx.textAlign='left';ctx.fillText(samples.length>1?new Date(samples[0].date).toLocaleTimeString():'FIRST DATA POINT',left,bottom+19);ctx.textAlign='right';ctx.fillText('NOW',right-50,bottom+19);
  ctx.strokeStyle='#b7f4ba';ctx.lineWidth=2.4;ctx.beginPath();samples.forEach((p,i)=>i?ctx.lineTo(x(i),y(p.value)):ctx.moveTo(x(i),y(p.value)));ctx.stroke();
  const last=x(samples.length-1),fx=right-6;
  ctx.fillStyle='#b7f4ba';ctx.beginPath();ctx.arc(last,y(samples.at(-1).value),3,0,Math.PI*2);ctx.fill();
  ctx.strokeStyle='#f1c584';ctx.setLineDash([5,4]);ctx.lineWidth=1.4;
  ctx.beginPath();ctx.moveTo(last,y(samples.at(-1).value));ctx.lineTo(fx,y(selected.mean));ctx.stroke();
  ctx.strokeStyle='#86aebc8c';ctx.beginPath();ctx.moveTo(fx,y(selected.low));ctx.lineTo(fx,y(selected.high));ctx.stroke();ctx.setLineDash([]);
  ctx.fillStyle='#f1c584';ctx.beginPath();ctx.arc(fx,y(selected.mean),3,0,Math.PI*2);ctx.fill();
  canvas.setAttribute('aria-label',selected.name+': latest price $'+number(selected.price)+', forecast mean $'+number(selected.mean)+', '+samples.length+' historical observations');
}

export function initCloudTelemetry() {
  const style=document.createElement('style');style.textContent=cloudCss;document.head.appendChild(style);
  const market=document.getElementById('market'),metrics=market.querySelector('.metric-grid');
  const element=document.createElement('div');element.className='telemetry-box';
  element.innerHTML=`
    <div class="telemetry-top"><div class="telemetry-heading"><i id="cloud-light" class="telemetry-light"></i><strong>Cloud telemetry</strong><small>PRIVATE · READ-ONLY</small></div>
    <div class="telemetry-tabs"><button id="cloud-tab-demo" class="telemetry-tab active" type="button">DEMO</button><button id="cloud-tab-live" class="telemetry-tab" type="button">LIVE GAME</button></div></div>
    <div id="cloud-auth" class="telemetry-auth" hidden>
      <label for="cloud-reader">PRIVATE VIEWER KEY</label><input id="cloud-reader" type="password" autocomplete="off" spellcheck="false" placeholder="Paste your viewer key" />
      <button id="cloud-connect" type="button">CONNECT</button><button id="cloud-disconnect" type="button" class="secondary">DISCONNECT</button>
    </div>
    <div id="cloud-status" class="telemetry-status">Demo mode · Synthetic market conditions, no live connection</div>
    <div id="cloud-live" class="telemetry-live">
      <div class="subhead"><strong>Live game telemetry</strong><span id="cloud-date">WAITING FOR FIRST UPLOAD</span></div>
      <div id="cloud-kpis" class="telemetry-kpis"></div>
      <div class="telemetry-cols">
        <div class="telemetry-surface"><h4>Actual market history</h4><div id="cloud-ranges" class="telemetry-ranges"><button type="button" data-range="24h" class="active">24H</button><button type="button" data-range="7d">7D</button><button type="button" data-range="30d">30D</button><button type="button" data-range="1y">1Y</button><button type="button" data-range="all">ALL TIME</button></div><div id="cloud-stocks" class="telemetry-stock-picker"></div><canvas id="cloud-chart" class="telemetry-chart" role="img" aria-label="Historical stock price"></canvas><p id="cloud-stock-caption"></p></div>
        <div class="telemetry-surface"><h4>Current holdings &amp; forecast</h4><div style="overflow-x:auto"><table class="telemetry-stock-table"><thead><tr><th>ASSET</th><th>SPOT</th><th>MEAN</th><th>EDGE</th><th>OWN/TARGET</th></tr></thead><tbody id="cloud-rows"></tbody></table></div></div>
      </div>
      <div id="cloud-modules" class="telemetry-modules"></div>
      <p class="telemetry-live-note">Original engine forecasts are captured on real stock market ticks. No demo returns or fabricated transactions appear in live mode.</p>
    </div>
    <details class="telemetry-help"><summary>HOW TO LINK YOUR COOKIE CLICKER GAME</summary>
      <p>Install the latest CookieQuant userscript, open the game, then connect the private publisher key in the browser Console. Your game sends one snapshot per minute. Your visitor key only reads history and cannot issue trades.</p>
      <div class="telemetry-writer"><input type="password" id="cloud-writer" autocomplete="off" placeholder="Paste your private publisher key" aria-label="Private publisher key" /><button id="cloud-copy" type="button">COPY GAME CONSOLE COMMAND</button></div>
    </details>`;
  metrics.before(element);
  el('ranges').querySelectorAll('button[data-range]').forEach(button=>{
    button.addEventListener('click',()=>{
      const range=button.dataset.range;
      if(!HISTORY_RANGES.includes(range) || range===cloud.historyRange)return;
      cloud.historyRange=range;
      cloud.historyLoaded='';
      el('ranges').querySelectorAll('button').forEach(b=>b.classList.toggle('active',b===button));
      if(cloud.active&&cloud.key)void fetchHistory(true);
    });
  });
  el('reader').value=cloud.key;
  el('tab-demo').addEventListener('click',()=>showMode(false));
  el('tab-live').addEventListener('click',()=>showMode(true));
  el('connect').addEventListener('click',()=>{
    const key=el('reader').value.trim();
    if(!/^[A-Za-z0-9_-]{32,150}$/.test(key)){status('Enter a valid private viewer key.',true);return;}
    cloud.key=key;cloud.historyLoaded='';cloud.historyLastFetched=0;sessionStorage.setItem('cookiequant:viewer',key);
    showMode(true);
  });
  el('reader').addEventListener('keydown',e=>{if(e.key==='Enter')el('connect').click();});
  el('disconnect').addEventListener('click',()=>{
    cloud.key='';cloud.latest=null;cloud.history=[];cloud.historyLoaded='';cloud.historyTotal=0;++cloud.historyRequest;sessionStorage.removeItem('cookiequant:viewer');
    el('reader').value='';el('live').classList.remove('visible');el('light').className='telemetry-light';
    status('Viewer disconnected. Historical telemetry remains private in the cloud.');
  });
  el('copy').addEventListener('click',async()=>{
    const key=el('writer').value.trim();
    if(!/^[A-Za-z0-9_-]{32,150}$/.test(key)){status('Enter the publisher key first.',true);return;}
    const command='window.cookieClickToolkit.telemetry.connect('+JSON.stringify(key)+')';
    try{await navigator.clipboard.writeText(command);el('copy').textContent='COPIED ✓';setTimeout(()=>el('copy').textContent='COPY GAME CONSOLE COMMAND',2500);}
    catch{status('Clipboard unavailable. Open the game console and call cookieClickToolkit.telemetry.connect(...) manually.',true);}
    el('writer').value='';
  });
  const observer=new ResizeObserver(()=>{if(cloud.active&&cloud.latest)renderGraph();});observer.observe(el('chart'));
  if(cloud.key){showMode(true);}
}
