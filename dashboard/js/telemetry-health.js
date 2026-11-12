/* Public read-only health monitor; no browser-publisher control or key. */
const LIVE_THRESHOLD_S=150;
const DELAYED_THRESHOLD_S=600;
function formatAge(seconds) {
  if (seconds===null || !Number.isFinite(seconds)) return 'Never';
  if (seconds<60) return Math.max(0,Math.floor(seconds))+'s ago';
  if (seconds<3600) return Math.floor(seconds/60)+'m '+Math.floor(seconds%60)+'s ago';
  if (seconds<86400) return Math.floor(seconds/3600)+'h '+Math.floor(seconds%3600/60)+'m ago';
  return Math.floor(seconds/86400)+'d ago';
}
function readableDate(value) {
  const time=Date.parse(value);
  return Number.isFinite(time)?new Date(time).toLocaleString():'No report';
}
function numeric(value) { return Number(value||0).toLocaleString('en-US',{maximumFractionDigits:0}); }
function classifyAge(age) {
  if(age===null)return ['NO DATA','waiting','No uploads received yet'];
  if(age<=LIVE_THRESHOLD_S)return ['FEED ACTIVE','active','Recent uploads received from the game'];
  if(age<=DELAYED_THRESHOLD_S)return ['DELAYED','delayed','No upload within the expected 150-second window'];
  return ['NO RECENT DATA','offline','The game may be closed, asleep, offline, or retrying'];
}
export function mountTelemetryHealth(root) {
  root.className='health-terminal';
  root.innerHTML=[
    '<div class="health-head"><div><div class="health-kicker">DATA PIPELINE / INGEST MONITOR</div>',
    '<h4>Telemetry health</h4><p>Server-observed publisher activity. Updated every 30 seconds.</p></div>',
    '<div id="health-status" class="health-status waiting"><span id="health-dot" aria-hidden="true"></span><strong id="health-state">CHECKING</strong></div></div>',
    '<div class="health-metrics">',
      '<div><span>LAST RECEIVED</span><strong id="health-age">...</strong><small id="health-time">Waiting for server response</small></div>',
      '<div><span>RECORDED MINUTES / 60M</span><strong id="health-coverage">-- / 60</strong><small>Observed snapshot coverage, not uptime</small></div>',
      '<div><span>SNAPSHOTS / 24H</span><strong id="health-count">--</strong><small>Persisted game ticks</small></div>',
      '<div><span>RECOVERED INTERRUPTIONS</span><strong id="health-recoveries">--</strong><small>Reported by last successful publisher update</small></div>',
    '</div>',
    '<div class="health-activity"><div class="health-activity-head">',
      '<span>INGEST ACTIVITY · LAST 60 MIN</span><span id="health-activity-label">NO DATA</span>',
    '</div><div id="health-bars" class="health-bars" role="img" aria-label="Recorded snapshot minutes across the last 60 minutes"></div>',
    '<div class="health-axis"><span>−60 MIN</span><span>−30 MIN</span><span>NOW</span></div></div>',
    '<div class="health-foot"><span id="health-reason">Connecting to the health service…</span>',
      '<span id="health-publisher">PUBLISHER DIAGNOSTICS: AWAITING REPORT</span></div>',
    '<details class="health-details"><summary>Recovery details</summary><div id="health-detail-body">Awaiting the publisher’s next successful upload.</div>',
    '<p>Current retry attempts are only visible inside the game. When publishing fails, this website cannot receive new diagnostics until the connection recovers. The script retries automatically.</p></details>'
  ].join('');
  const field=id=>root.querySelector('#health-'+id);
  const state={data:null,clockOffset:0,error:null};
  function updateStatus(){
    if(state.error){
      field('status').className='health-status offline';
      field('state').textContent='MONITOR UNAVAILABLE';
      field('reason').textContent=state.error;
      return;
    }
    const data=state.data;
    if(!data)return;
    const age=data.lastReceivedAt?Math.max(0,Math.floor((Date.now()-state.clockOffset-Date.parse(data.lastReceivedAt))/1000)):null;
    const [label,css,description]=classifyAge(age);
    field('status').className='health-status '+css;
    field('state').textContent=label;
    field('age').textContent=formatAge(age);
    field('reason').textContent=description;
  }
  function render(data){
    if(!data || !Array.isArray(data.minutes))throw Error('Invalid telemetry health response');
    state.data=data;state.error=null;
    const timestamp=Date.parse(data.serverTime);
    state.clockOffset=Number.isFinite(timestamp)?Date.now()-timestamp:0;
    field('time').textContent=data.lastReceivedAt?readableDate(data.lastReceivedAt):'No recorded upload';
    field('coverage').textContent=numeric(data.recordedMinutesLastHour)+' / 60';
    field('count').textContent=numeric(data.snapshotsLast24Hours);
    field('activity-label').textContent=numeric(data.snapshotsLastHour)+' snapshots / '+numeric(data.recordedMinutesLastHour)+' active minutes';
    const bars=field('bars'); bars.replaceChildren();
    for(const [index,minute] of data.minutes.entries()){
      const bar=document.createElement('span');
      bar.className='health-bar'+(minute.snapshots>0?' seen':'')+(index===data.minutes.length-1?' latest':'');
      bar.title=readableDate(minute.at)+' · '+numeric(minute.snapshots)+' saved snapshots';
      bars.appendChild(bar);
    }
    const report=data.publisher;
    if(report){
      field('recoveries').textContent=numeric(report.recoveries);
      field('publisher').textContent='PUBLISHER '+(report.clientVersion||'UNKNOWN VERSION')+' · REPORT AS OF LAST UPLOAD';
      const details=[
        ['Client version',report.clientVersion||'Unknown'],
        ['Script started',readableDate(report.startedAt)],
        ['Attempts since script load',numeric(report.attempts)],
        ['Failed attempts since script load',numeric(report.failedAttempts)],
        ['Recovered interruptions since script load',numeric(report.recoveries)],
        ['Retries before latest successful upload',numeric(report.retriesBeforeSuccess)],
        ['Last reported failure',report.lastFailureAt?readableDate(report.lastFailureAt)+' ('+(report.lastFailureKind||'unknown')+')':'None reported'],
        ['Last reported recovery',report.lastRecoveryAt?readableDate(report.lastRecoveryAt):'None reported']
      ];
      const body=field('detail-body');body.replaceChildren();
      for(const [name,value] of details){
        const row=document.createElement('div');row.className='health-detail-row';
        const label=document.createElement('span');label.textContent=name;
        const dataPoint=document.createElement('strong');dataPoint.textContent=value;
        row.append(label,dataPoint);body.append(row);
      }
    }else{
      field('recoveries').textContent='--';
      field('publisher').textContent='PUBLISHER DIAGNOSTICS: LEGACY TELEMETRY';
      field('detail-body').textContent='The last received snapshot predates publisher health reporting. Install the updated CookieQuant userscript to include recovery diagnostics.';
    }
    updateStatus();
  }
  function error(message){
    state.error=message||'Health API unreachable. Existing market data may still be available.';
    updateStatus();
  }
  function dispose(){clearInterval(agingTimer);}
  const agingTimer=setInterval(updateStatus,5000);
  return {render,error,dispose};
}
