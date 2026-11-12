import { forecastMetrics, correlation, normalizedHistory } from './quant-math.js';

/*
 * Read-only quant analytics rendered from actual CookieQuant telemetry.
 * Historical samples are observed game quotes. All projections are terminal
 * distributions from the game's shared-shock Monte Carlo simulations.
 */
const COLORS = ['#A6ECBA','#FFC477','#83CEFA','#D99FFF','#F58DA2','#DFE58C',
  '#5AD9CD','#FEB4CF','#9BAEFF','#99D9AC','#F0A97D','#9AE5F4',
  '#F3D582','#BCB1FF','#FF9376','#8FCAEA','#7BDC9C','#D7B7EF'];
const q = (node,selector) => node.querySelector(selector);
const nfmt = (n,d=2) => Number(n||0).toLocaleString('en-US',{maximumFractionDigits:d,minimumFractionDigits:d});
const money = n => '$'+nfmt(n);
const signed = (n,d=1) => (n>0?'+':'')+nfmt(n,d)+'%';
const escapeHtml = value => String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const color = index => COLORS[index % COLORS.length];
const dateLabel = time => Number.isFinite(time) ? new Date(time).toLocaleString(undefined,{month:'short',day:'numeric',hour:'2-digit',minute:'2-digit'}) : '';
function canvas2D(canvas) {
  const bounds=canvas.getBoundingClientRect();
  const width=Math.max(10,bounds.width),height=Math.max(10,bounds.height);
  const pixelRatio=Math.min(window.devicePixelRatio||1,2);
  canvas.width=Math.floor(width*pixelRatio);
  canvas.height=Math.floor(height*pixelRatio);
  const ctx=canvas.getContext('2d');
  ctx.setTransform(pixelRatio,0,0,pixelRatio,0,0);
  ctx.clearRect(0,0,width,height);
  return {ctx,w:width,h:height};
}
function label(ctx,text,x,y,align='left',fill='#94a9ac',font='10px "IBM Plex Mono",monospace') {
  ctx.font=font;ctx.fillStyle=fill;ctx.textAlign=align;ctx.fillText(text,x,y);
}
function line(ctx,x1,y1,x2,y2,stroke='#33414c',width=1,dash=[]) {
  ctx.beginPath();ctx.moveTo(x1,y1);ctx.lineTo(x2,y2);
  ctx.strokeStyle=stroke;ctx.lineWidth=width;ctx.setLineDash(dash);ctx.stroke();ctx.setLineDash([]);
}
function dot(ctx,x,y,fill,r=3.5) {
  ctx.beginPath();ctx.arc(x,y,r,0,Math.PI*2);ctx.fillStyle=fill;ctx.fill();
}
function emptyGraph(ctx,w,h,message) {label(ctx,message,w/2,h/2,'center','#8399a6','12px "IBM Plex Mono",monospace');}
function tickFormat(n,raw) {return raw?'$'+nfmt(n,0):(n>0?'+':'')+nfmt(n,0)+'%';}
function probability(v) {return nfmt((v||0)*100,1)+'%';}
function rangeOf(values,pad) {
  if(!values.length)return [-1,1];
  let min=Math.min(...values),max=Math.max(...values);
  let spread=Math.max(pad,max-min);
  return [min-spread*.12,max+spread*.12];
}
function makeTemplate() {
  const ranges=['24h','7d','30d','1y','all'];
  return [
    '<div class="qt-top"><div><div class="qt-eyebrow">QUANTITATIVE RESEARCH / LIVE INSTRUMENTS</div>',
    '<h3 class="qt-title">Cross-asset intelligence</h3></div>',
    '<div class="qt-top-right"><span class="qt-flag"><strong id="qt-count">--</strong> INSTRUMENTS</span>',
    '<span class="qt-flag"><strong id="qt-scenarios">--</strong> JOINT SCENARIOS</span>',
    '<span class="qt-flag"><strong id="qt-horizon">--</strong> TICK HORIZON</span></div></div>',
    '<section class="qt-card"><div class="qt-card-header"><div>',
    '<h4><span class="qt-id">01 /</span> Multi-asset market tape</h4>',
    '<p>All stocks, one synchronized time axis. Select an instrument to emphasize it.</p></div>',
    '<div class="qt-actions" id="qt-units">',
    '<button type="button" class="qt-toggle is-active" data-units="relative">RETURN %</button>',
    '<button type="button" class="qt-toggle" data-units="price">PRICE $</button>',
    '<button type="button" class="qt-toggle" id="qt-focus" aria-pressed="false">ISOLATE: OFF</button>',
    '</div></div>',
    '<div class="qt-range-wrap"><div id="cloud-ranges" class="telemetry-ranges">',
    ranges.map(r=>'<button type="button" data-range="'+r+'"'+(r==='24h'?' class="active"':'')+'>'+
      (r==='all'?'ALL TIME':r.toUpperCase())+'</button>').join(''),
    '</div></div>',
    '<div class="qt-canvas-wrap" id="qt-tape-wrap">',
    '<canvas id="qt-tape" class="qt-canvas" role="img" aria-label="Historical price lines for all assets"></canvas>',
    '<div id="qt-hover" class="qt-crosshair" role="status" aria-live="off"></div></div>',
    '<div id="qt-tape-caption" class="qt-tape-caption"></div>',
    '<div id="qt-legend" class="qt-legend" aria-label="Select stock and view color legend"></div></section>',
    '<section class="qt-card"><div class="qt-card-header"><div>',
    '<h4><span class="qt-id">02 /</span> Cross-sectional forecast surface</h4>',
    '<p>Each row is the modeled return distribution at the forecast horizon. Horizontal bars show P05–P95; dots indicate median and expected returns.</p>',
    '</div><span class="qt-flag">MODEL · 90% SCENARIO INTERVAL</span></div>',
    '<div class="qt-surface-box"><canvas id="qt-surface" class="qt-surface" role="img" aria-label="All asset forecast intervals"></canvas></div>',
    '<div class="qt-chart-key">BAR = 5TH–95TH PERCENTILE &nbsp; | &nbsp; DIAMOND = MEAN &nbsp; | &nbsp; DOT = MEDIAN &nbsp; | &nbsp; RIGHT = P(PROFIT AFTER ENTRY FEE)</div></section>',
    '<div class="qt-detail"><section class="qt-card"><div class="qt-card-header"><div>',
    '<h4><span class="qt-id">03 /</span> Scenario distribution</h4>',
    '<p id="qt-distribution-sub">256 simulated terminal prices, as generated by the trading engine.</p>',
    '</div></div>',
    '<div id="qt-asset-title" class="qt-asset-title"></div>',
    '<div class="qt-canvas-wrap"><canvas id="qt-distribution" class="qt-distribution" role="img" aria-label="Monte Carlo terminal price histogram"></canvas></div>',
    '<div id="qt-statistics" class="qt-forecast-stats"></div>',
    '<div class="qt-detail-caption">Orange: observed spot · mint: expected terminal value · dashed: fee-inclusive entry · shaded range: modeled P05–P95. These are terminal scenarios, not predicted intraperiod paths.</div></section>',
    '<section class="qt-card"><div class="qt-card-header"><div>',
    '<h4><span class="qt-id">04 /</span> Forecast &amp; execution matrix</h4>',
    '<p>All products ranked by expected terminal return, relative to the current quote.</p>',
    '</div><span class="qt-flag">READ-ONLY / GAME ENGINE</span></div>',
    '<div class="qt-table-scroll"><table class="qt-forecasts">',
    '<thead><tr><th>ASSET</th><th>SPOT</th><th>E[PRICE]</th><th>EDGE</th><th>P05–P95</th><th>P(PROFIT)</th><th>OWN / TARGET</th><th>MODEL</th></tr></thead>',
    '<tbody id="qt-forecast-rows"></tbody></table></div>',
    '<div class="qt-tab-note">P(PROFIT) is the share of simulated outcomes above the fee-inclusive buy price. An expected positive return is not itself a buy signal.</div>',
    '</section></div>',
    '<details class="qt-advanced" id="qt-correlation-details"><summary><span>05 / Joint-scenario correlation diagnostic</span>',
    '<span class="qt-eyebrow">18 × 18 / COVARIANCE STRUCTURE</span></summary>',
    '<div class="qt-advanced-inner"><p>Pairwise correlations are estimated from the same aligned Monte Carlo terminal scenarios. This measures co-movement inside the model, not historical realized correlation.</p>',
    '<canvas id="qt-correlation" class="qt-correlation" role="img" aria-label="Joint scenario correlation heatmap"></canvas>',
    '<div id="qt-correlation-caption" class="qt-correlation-caption">Hover a cell for pairwise correlation.</div>',
    '</div></details>',
  ].join('');
}

export function mountQuantTerminal(root) {
  root.classList.add('qt-root');
  root.innerHTML=makeTemplate();
  const $=id=>q(root,'#qt-'+id);
  const node={
    tape:$('tape'), tapeWrap:$('tape-wrap'), hover:$('hover'),
    legend:$('legend'), caption:$('tape-caption'), surface:$('surface'),
    distribution:$('distribution'), detail:$('asset-title'), stats:$('statistics'),
    table:$('forecast-rows'), corr:$('correlation'), corrCaption:$('correlation-caption'),
    corrDetails:$('correlation-details')
  };
  const state={
    latest:null,history:[],options:{},goods:[],metrics:[],
    selected:null,units:'relative',isolated:false,hoverIndex:null,
    observations:[],first:new Map(),tapeBounds:null,surfaceRows:[],corrCells:null
  };
  const getSelected=()=>state.goods.find(g=>g.id===state.selected)||state.goods[0];
  const getMetric=good=>state.metrics.find(g=>g.id===good?.id);
  const stockColor=good=>color(state.goods.findIndex(g=>g.id===good.id));
  function choose(id) {
    if(!state.goods.some(g=>g.id===id))return;
    state.selected=id;
    drawEverything();
  }
  function updateLegend(){
    node.legend.replaceChildren();
    for(const good of state.goods){
      const base=state.first.get(good.id);
      const last=state.observations.slice().reverse().find(o=>o.prices.has(good.id));
      const change=base&&last?((last.prices.get(good.id)/base)-1)*100:null;
      const b=document.createElement('button');b.type='button';
      b.className='qt-symbol'+(good.id===state.selected?' is-selected':'')+
        (state.isolated&&good.id!==state.selected?' is-dim':'');
      b.setAttribute('aria-pressed',String(good.id===state.selected));
      const dot=document.createElement('span');dot.className='qt-dot';dot.style.background=stockColor(good);
      const symbol=document.createElement('b');symbol.textContent=good.symbol||('ASSET '+good.id);
      const delta=document.createElement('small');delta.textContent=change===null?'--':signed(change,1);
      b.title=(good.name||good.symbol)+': select for detailed forecast';
      b.append(dot,symbol,delta);b.addEventListener('click',()=>choose(good.id));
      node.legend.append(b);
    }
  }
  function updateTable(){
    node.table.replaceChildren();
    const ordered=state.metrics.slice().sort((a,b)=>b.edgePct-a.edgePct);
    if(!ordered.length){
      const row=document.createElement('tr');row.innerHTML='<td colspan="8" class="qt-unavailable">Forecast scenarios are unavailable for this game tick.</td>';
      node.table.append(row);return;
    }
    for(const forecast of ordered){
      const tr=document.createElement('tr');tr.dataset.qtAsset=forecast.id;
      if(forecast.id===state.selected)tr.className='is-selected';
      const action=forecast.target<forecast.stock?'TRIM':
        forecast.target>forecast.stock?'ADD':forecast.buy?'BUY SETUP':'HOLD';
      const actionClass=action==='TRIM'?'qt-trim':action==='ADD'||action==='BUY SETUP'?'qt-buy':'';
      const edgeClass=forecast.edgePct>=0?'qt-positive':'qt-negative';
      tr.innerHTML='<td><span class="qt-dot" style="display:inline-block;vertical-align:middle;margin-right:8px;background:'+
        stockColor(forecast)+'"></span><b>'+escapeHtml(forecast.symbol)+'</b></td>'+
        '<td>'+money(forecast.price)+'</td>'+
        '<td>'+money(forecast.expected)+'</td>'+
        '<td class="'+edgeClass+'">'+signed(forecast.edgePct)+'</td>'+
        '<td>'+nfmt(forecast.q05,1)+' – '+nfmt(forecast.q95,1)+'</td>'+
        '<td>'+probability(forecast.pProfit)+'</td>'+
        '<td>'+nfmt(forecast.stock,0)+' / '+nfmt(forecast.target,0)+'</td>'+
        '<td class="qt-signal '+actionClass+'">'+action+'</td>';
      tr.title='Select '+forecast.name+' for full scenario distribution';
      tr.addEventListener('click',()=>choose(forecast.id));
      node.table.append(tr);
    }
  }
  function tapeMap(){
    const valid=state.observations;
    if(!valid.length)return null;
    const raw=state.units==='price';
    const focus=state.isolated?state.goods.filter(g=>g.id===state.selected):state.goods;
    const series=[];
    for(const good of focus){
      const base=state.first.get(good.id);
      if(!base)continue;
      const items=valid.map(row=>{
        const p=row.prices.get(good.id);
        return {t:row.time,value:p===undefined?null:raw?p:(p/base-1)*100};
      }).filter(item=>item.value!==null);
      if(items.length)series.push({good,items});
    }
    if(!series.length)return null;
    const timestamps=valid.map(v=>v.time);
    const xMin=Math.min(...timestamps),xMax=Math.max(...timestamps);
    const nums=series.flatMap(s=>s.items.map(o=>o.value));
    const [lo,hi]=rangeOf(nums,raw?5:2);
    return {series,raw,xMin,xMax:xMax===xMin?xMin+1:xMax,yMin:lo,yMax:hi};
  }
  function drawTape(){
    const {ctx,w,h}=canvas2D(node.tape);
    const map=tapeMap();
    if(!map){emptyGraph(ctx,w,h,'WAITING FOR HISTORICAL QUOTES');state.tapeBounds=null;return;}
    const plot={left:w<500?56:66,right:w-22,top:28,bottom:h-40};
    const fx=t=>plot.left+(t-map.xMin)/(map.xMax-map.xMin)*(plot.right-plot.left);
    const fy=n=>plot.bottom-(n-map.yMin)/(map.yMax-map.yMin)*(plot.bottom-plot.top);
    state.tapeBounds={map,plot,fx,fy};
    for(let i=0;i<=5;i++){
      const v=map.yMin+(map.yMax-map.yMin)*i/5,y=fy(v);
      line(ctx,plot.left,y,plot.right,y,'#30404b',1);
      label(ctx,tickFormat(v,map.raw),plot.left-8,y+3,'right','#78919a');
    }
    if(map.yMin<=0&&map.yMax>=0)line(ctx,plot.left,fy(0),plot.right,fy(0),'#57756b',1,[3,4]);
    for(let i=0;i<=3;i++){
      const t=map.xMin+(map.xMax-map.xMin)*i/3;
      const x=fx(t);line(ctx,x,plot.top,x,plot.bottom,'#273741',1,[2,5]);
      label(ctx,dateLabel(t),x,plot.bottom+21,i===0?'left':i===3?'right':'center');
    }
    const isFocused=state.selected!==null;
    for(const entry of map.series){
      const highlighted=entry.good.id===state.selected;
      ctx.globalAlpha=state.isolated?1:!isFocused?0.85:highlighted?1:0.5;
      ctx.beginPath();
      entry.items.forEach((p,i)=>i?ctx.lineTo(fx(p.t),fy(p.value)):ctx.moveTo(fx(p.t),fy(p.value)));
      ctx.strokeStyle=stockColor(entry.good);ctx.lineWidth=highlighted?2.45:1.35;ctx.stroke();
      const last=entry.items.at(-1);
      dot(ctx,fx(last.t),fy(last.value),stockColor(entry.good),highlighted?3.8:2);
      ctx.globalAlpha=1;
    }
    if(state.hoverIndex!==null&&state.observations[state.hoverIndex]){
      const row=state.observations[state.hoverIndex],x=fx(row.time);
      line(ctx,x,plot.top,x,plot.bottom,'#e1efe5',1,[3,4]);
    }
    node.tape.setAttribute('aria-label','Observed price history for '+map.series.length+' products. Mode: '+(map.raw?'dollars':'percent change from first observation')+'.');
  }
  function drawSurface(){
    const {ctx,w,h}=canvas2D(node.surface);
    state.surfaceRows=[];
    if(!state.metrics.length){emptyGraph(ctx,w,h,'WAITING FOR LIVE MONTE CARLO OUTPUT');return;}
    const ordered=state.metrics.slice().sort((a,b)=>b.edgePct-a.edgePct);
    const plot={left:w<500?50:58,right:w<500?w-55:w-74,top:37,bottom:h-33};
    const values=ordered.flatMap(m=>[m.q05Pct,m.q95Pct,m.edgePct]);
    const [vMin,vMax]=rangeOf([...values,0],12);
    const x=v=>plot.left+(v-vMin)/(vMax-vMin)*(plot.right-plot.left);
    const rowsHeight=(plot.bottom-plot.top)/ordered.length;
    for(let i=0;i<=4;i++){
      const v=vMin+(vMax-vMin)*i/4,cx=x(v);
      line(ctx,cx,plot.top-8,cx,plot.bottom,'#33414a',1,[2,5]);
      label(ctx,signed(v,0),cx,plot.top-18,'center');
    }
    if(vMin<0&&vMax>0)line(ctx,x(0),plot.top-9,x(0),plot.bottom,'#849a90',1,[5,4]);
    ordered.forEach((m,index)=>{
      const y=plot.top+rowsHeight*(index+.5);
      state.surfaceRows.push({top:plot.top+index*rowsHeight,bottom:plot.top+(index+1)*rowsHeight,id:m.id});
      if(index%2===1){ctx.fillStyle='#17242c';ctx.fillRect(0,y-rowsHeight/2,w,rowsHeight);}
      const highlighted=m.id===state.selected;
      if(highlighted){ctx.fillStyle='#29493c77';ctx.fillRect(0,y-rowsHeight/2,w,rowsHeight);}
      const fill=stockColor(m);
      label(ctx,m.symbol,plot.left-7,y+3,'right',highlighted?'#ecfff2':'#a1b9b8','10px "IBM Plex Mono",monospace');
      line(ctx,x(m.q05Pct),y,x(m.q95Pct),fill,highlighted?3.5:2.2);
      line(ctx,x(m.q05Pct),y-4,x(m.q05Pct),y+4,fill,1.4);
      line(ctx,x(m.q95Pct),y-4,x(m.q95Pct),y+4,fill,1.4);
      dot(ctx,x(m.medianPct),y,'#f5e9d2',2.4);
      const meanX=x(m.edgePct);ctx.save();ctx.translate(meanX,y);ctx.rotate(Math.PI/4);ctx.fillStyle='#f6fff3';ctx.fillRect(-3.1,-3.1,6.2,6.2);ctx.restore();
      label(ctx,nfmt(m.pProfit*100,0)+'%',plot.right+8,y+3,'left',m.pProfit>=.55?'#b7f4ba':'#c7afb0');
    });
    label(ctx,'P(PROFIT)',plot.right+8,plot.top-18,'left','#87a7a2','9px "IBM Plex Mono",monospace');
    node.surface.setAttribute('aria-label',ordered.length+' assets forecast return intervals P05 through P95 and fee-adjusted profit probabilities, sorted by expected return.');
  }
  function drawDistribution(){
    const {ctx,w,h}=canvas2D(node.distribution);
    const good=getSelected(),m=getMetric(good);
    if(!m){emptyGraph(ctx,w,h,'WAITING FOR JOINT SCENARIOS');node.detail.textContent='NO MODEL DATA';node.stats.replaceChildren();return;}
    const fee=Math.max(0,Number(state.latest?.market?.fee)||0);
    node.detail.innerHTML='<span class="qt-dot" style="background:'+stockColor(good)+'"></span>'+
      '<span class="qt-asset-name">'+escapeHtml(good.symbol)+'</span>'+
      '<span class="qt-asset-tag">'+escapeHtml(good.name||'')+'</span>'+
      '<span class="qt-asset-tag">'+m.count+' JOINT DRAWS</span>';
    const stats=[
      ['EXPECTED EDGE',signed(m.edgePct),'gross modeled return'],
      ['P(PROFIT)',probability(m.pProfit),'after '+nfmt(fee*100,1)+'% buy fee'],
      ['TERMINAL σ',signed(m.sigmaPct,1),'std. dev. / spot'],
      ['P05',money(m.q05),'lower scenario quantile'],
      ['MEDIAN',money(m.median),'50th percentile'],
      ['P95',money(m.q95),'upper scenario quantile'],
      ['WORST 5% MEAN',signed(m.tailReturnPct),'conditional tail return'],
      ['TARGET',nfmt(m.target,0),'held '+nfmt(m.stock,0)+' shares'],
      ['HORIZON',nfmt(state.latest.market.horizon,0)+' T','forecast from last tick']
    ];
    node.stats.innerHTML=stats.map(item=>'<div class="qt-stat"><label>'+
      escapeHtml(item[0])+'</label><strong>'+escapeHtml(item[1])+'</strong><small>'+
      escapeHtml(item[2])+'</small></div>').join('');
    const plot={left:45,right:w-23,top:22,bottom:h-47};
    const pmin=Math.min(...m.values),pmax=Math.max(...m.values);
    const d=rangeOf([pmin,pmax,m.price,m.expected,m.price*(1+fee)],5);
    const x=v=>plot.left+(v-d[0])/(d[1]-d[0])*(plot.right-plot.left);
    const bins=26,counts=Array(bins).fill(0);
    for(const value of m.values){
      const index=Math.max(0,Math.min(bins-1,Math.floor((value-d[0])/(d[1]-d[0])*bins)));
      counts[index]++;
    }
    const maxCount=Math.max(...counts,1);
    for(let i=0;i<=4;i++){
      const v=d[0]+(d[1]-d[0])*i/4,cx=x(v);
      line(ctx,cx,plot.top,cx,plot.bottom,'#2b4246',1,[3,4]);
      label(ctx,money(v),cx,plot.bottom+18,'center');
    }
    const bw=(plot.right-plot.left)/bins;
    counts.forEach((count,i)=>{
      const ht=(count/maxCount)*(plot.bottom-plot.top-14);
      ctx.fillStyle='#4c9a868d';ctx.fillRect(plot.left+i*bw+1,plot.bottom-ht,Math.max(1,bw-2),ht);
    });
    ctx.fillStyle='#a7d5a81b';ctx.fillRect(x(m.q05),plot.top,x(m.q95)-x(m.q05),plot.bottom-plot.top);
    line(ctx,x(m.price),plot.top,x(m.price),plot.bottom,'#f8b97a',2.2);
    line(ctx,x(m.price*(1+fee)),plot.top,x(m.price*(1+fee)),plot.bottom,'#a8b7ba',1.1,[4,3]);
    line(ctx,x(m.mean),plot.top,x(m.mean),plot.bottom,'#b7f4ba',2.1);
    label(ctx,'CURRENT',x(m.price),plot.top-7,'center','#f8b97a','9px "IBM Plex Mono",monospace');
    label(ctx,'EXPECTED',x(m.mean),plot.bottom+34,'center','#b7f4ba','9px "IBM Plex Mono",monospace');
    node.distribution.setAttribute('aria-label',m.symbol+' distribution from '+m.count+' Monte Carlo outcomes, expected '+money(m.mean)+', 5th percentile '+money(m.q05)+', 95th percentile '+money(m.q95)+'.');
  }
  function drawCorrelation(){
    if(!node.corrDetails.open)return;
    const {ctx,w,h}=canvas2D(node.corr);
    const items=state.metrics, size=items.length;
    if(size<2){emptyGraph(ctx,w,h,'WAITING FOR SHARED SCENARIO DATA');return;}
    const side=Math.min((w-70)/size,(h-59)/size,27);
    const left=55,top=32;
    const coefficients=items.map(a=>items.map(b=>correlation(a.values,b.values)));
    state.corrCells={items,side,left,top,coefficients};
    for(let i=0;i<size;i++){
      label(ctx,items[i].symbol,left+i*side+side/2,top-9,'center','#b3c6c7','9px "IBM Plex Mono",monospace');
      label(ctx,items[i].symbol,left-8,top+i*side+side*.65,'right','#b3c6c7','9px "IBM Plex Mono",monospace');
      for(let j=0;j<size;j++){
        const rho=coefficients[i][j],alpha=rho===null?.18:.16+.72*Math.abs(rho);
        ctx.fillStyle=rho===null?'#46505d':rho>=0?'rgba(109,225,178,'+alpha+')':'rgba(247,147,124,'+alpha+')';
        ctx.fillRect(left+j*side+1,top+i*side+1,Math.max(2,side-2),Math.max(2,side-2));
      }
    }
    label(ctx,'−1 NEGATIVE',left,top+size*side+20,'left','#e9aa9b');
    label(ctx,'+1 POSITIVE',left+size*side,top+size*side+20,'right','#b7f4ba');
  }
  function drawEverything(){
    updateLegend();updateTable();drawTape();drawSurface();drawDistribution();drawCorrelation();
  }
  function render(snapshot,history,options={}){
    if(!snapshot?.market)return;
    state.latest=snapshot;state.history=history||[];state.options=options;
    state.goods=(snapshot.market.goods||[]).slice().sort((a,b)=>a.id-b.id);
    state.metrics=state.goods.map(g=>forecastMetrics(g,Number(snapshot.market.fee)||0)).filter(Boolean);
    const normalized=normalizedHistory(state.history,state.goods);
    state.observations=normalized.observations;state.first=normalized.first;
    if(!state.goods.some(g=>g.id===state.selected))state.selected=state.goods[0]?.id??null;
    $('count').textContent=nfmt(state.goods.length,0);
    $('scenarios').textContent=state.metrics[0]?.count??'--';
    $('horizon').textContent=Number(snapshot.market.horizon)||'--';
    const points=state.observations.length,underlying=options.historyLoaded===options.historyRange?options.historyTotal:points;
    const labelRange=options.historyRange==='all'?'ALL-TIME':(options.historyRange||'24h').toUpperCase();
    node.caption.innerHTML='<span>'+nfmt(points,0)+' displayed observations / '+nfmt(underlying,0)+' stored snapshots · '+labelRange+'</span>'+
      '<span>ACTUAL GAME QUOTES · '+(state.units==='relative'?'REBASED PERCENT CHANGE':'MARKET DOLLARS')+'</span>';
    drawEverything();
  }
  root.querySelectorAll('[data-units]').forEach(button=>button.addEventListener('click',()=>{
    state.units=button.dataset.units;
    root.querySelectorAll('[data-units]').forEach(b=>b.classList.toggle('is-active',b===button));
    if(state.latest)render(state.latest,state.history,state.options);
  }));
  $('focus').addEventListener('click',()=>{
    state.isolated=!state.isolated;
    $('focus').textContent=state.isolated?'ISOLATE: ON':'ISOLATE: OFF';
    $('focus').setAttribute('aria-pressed',String(state.isolated));
    if(state.latest)drawEverything();
  });
  node.tape.addEventListener('pointermove',event=>{
    if(!state.tapeBounds)return;
    const rect=node.tape.getBoundingClientRect();
    const local=event.clientX-rect.left;
    const {map,plot,fx}=state.tapeBounds;
    if(local<plot.left||local>plot.right){state.hoverIndex=null;node.hover.style.display='none';drawTape();return;}
    const time=map.xMin+(local-plot.left)/(plot.right-plot.left)*(map.xMax-map.xMin);
    let best=0,diff=Infinity;
    state.observations.forEach((obs,i)=>{const d=Math.abs(obs.time-time);if(d<diff){best=i;diff=d;}});
    state.hoverIndex=best;drawTape();
    const row=state.observations[best],selected=getSelected(),good=selected||state.goods[0];
    const quote=row.prices.get(good.id),base=state.first.get(good.id);
    let top=Array.from(row.prices.entries()).map(([id,price])=>{
      const asset=state.goods.find(g=>g.id===id),baseline=state.first.get(id);
      return {symbol:asset?.symbol||'',change:baseline?((price/baseline)-1)*100:0};
    }).sort((a,b)=>b.change-a.change).slice(0,3);
    node.hover.innerHTML='<strong>'+escapeHtml(dateLabel(row.time))+'</strong>'+
      '<span>'+escapeHtml(good.symbol)+' '+(quote?money(quote):'NO OBSERVATION')+
      (quote&&base?' ('+signed((quote/base-1)*100)+')':'')+'</span>'+
      '<small>TOP MOVERS: '+escapeHtml(top.map(x=>x.symbol+' '+signed(x.change)).join(' · '))+'</small>';
    node.hover.style.display='block';
    node.hover.style.left=Math.max(5,Math.min(rect.width-220,local+13))+'px';
    node.hover.style.top='8px';
  });
  node.tape.addEventListener('pointerleave',()=>{
    if(state.hoverIndex!==null){state.hoverIndex=null;node.hover.style.display='none';if(state.latest)drawTape();}
  });
  node.surface.addEventListener('click',event=>{
    const rect=node.surface.getBoundingClientRect(),y=event.clientY-rect.top;
    const row=state.surfaceRows.find(r=>y>=r.top&&y<r.bottom);
    if(row)choose(row.id);
  });
  node.surface.style.cursor='pointer';
  node.corrDetails.addEventListener('toggle',()=>{if(state.latest)requestAnimationFrame(drawCorrelation);});
  node.corr.addEventListener('pointermove',event=>{
    if(!state.corrCells)return;
    const r=node.corr.getBoundingClientRect(),cx=event.clientX-r.left,cy=event.clientY-r.top;
    const {side,left,top,items,coefficients}=state.corrCells;
    const x=Math.floor((cx-left)/side),y=Math.floor((cy-top)/side);
    if(x>=0&&y>=0&&x<items.length&&y<items.length){
      const rho=coefficients[y][x];
      node.corrCaption.textContent=items[y].symbol+' × '+items[x].symbol+' · ρ = '+(rho===null?'UNDEFINED':nfmt(rho,3));
    }else node.corrCaption.textContent='Hover a cell for pairwise correlation.';
  });
  const resize=new ResizeObserver(()=>{if(state.latest)requestAnimationFrame(()=>{
    drawTape();drawSurface();drawDistribution();drawCorrelation();
  });});
  resize.observe(root);
  return {render,resize:()=>{if(state.latest)drawEverything();}};
}
