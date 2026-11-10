import { GOODS, REGIMES, DEFAULT_CONFIG, runResearch, godzamokEstimate, gardenWindow } from './model.js';

const $ = (selector) => document.querySelector(selector);
const money = (n, decimals = 2) => '$' + Number(n).toLocaleString('en-US', { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
const compact = (number) => {
  const value = Math.abs(number), sign = number < 0 ? '−' : '';
  if (value >= 1e12) return sign + (value / 1e12).toFixed(2) + 'T';
  if (value >= 1e9) return sign + (value / 1e9).toFixed(2) + 'B';
  if (value >= 1e6) return sign + (value / 1e6).toFixed(2) + 'M';
  if (value >= 1e3) return sign + (value / 1e3).toFixed(1) + 'K';
  return sign + value.toFixed(0);
};
const pct = (n, digits = 2) => (n >= 0 ? '+' : '') + (n * 100).toFixed(digits) + '%';
const colors = ['#b7f4ba','#f3bc79','#82bfec','#d1aeeb','#f38f85','#84dccc','#d8d8a2','#b8a6d7'];
const stages = [
  { name: 'First ascension', cost: 365, rewards: ['Heavenly cookies', 'How to bake your dragon', 'Permanent upgrade slot I'] },
  { name: 'Second ascension', cost: 2185, rewards: ['Starter kit', 'Golden switch', 'Season switcher'] },
  { name: 'Third ascension', cost: 12409, rewards: ['Twin Gates of Transcendence', 'Persistent memory', 'Kitten angels'] },
  { name: 'Fourth ascension', cost: 62217, rewards: ['Halo gloves', 'Lasting fortune', 'Lucky digit'] },
  { name: 'Fifth ascension', cost: 127776, rewards: ['Permanent upgrade slot II', 'Residual luck', 'Decisive fate'] },
  { name: 'Sixth ascension', cost: 825019, rewards: ['Synergies Vol. I', 'Divine discount', 'Divine sales'] },
  { name: 'Seventh ascension', cost: 2568911, rewards: ['Cherubim', 'Seraphim', 'Synergies Vol. II'] },
  { name: 'Eighth ascension', cost: 32900000, rewards: ['Inspired checklist', 'Genius accounting', 'Unshackled cursors'] },
];
let config = { ...DEFAULT_CONFIG };
let research = runResearch(config);
let selected = 'CHC';
let gardenPhase = 0;
let stageSelected = 3;
let hoverTick = null;
let resizeId = 0;

function asset() {
  return research.signals.find(item => item.symbol === selected) || research.signals[0];
}

function renderStats() {
  const p = research.portfolio;
  $('#stat-return').textContent = pct(p.expected);
  $('#stat-risk').textContent = (p.risk * 100).toFixed(2) + '%';
  $('#stat-signals').textContent = String(research.signals.filter(s => s.buy).length).padStart(2, '0') + ' / ' + String(research.signals.length).padStart(2, '0');
  $('#stat-capital').textContent = '$' + compact(p.used);
  $('#stat-return-sub').textContent = 'EXPECTED / NEXT ' + research.config.horizon + ' TICKS';
  $('#seed-label').textContent = String(config.seed);
  $('#horizon-out').textContent = config.horizon + ' TICKS';
  $('#risk-out').textContent = config.riskPercent + '%';
  $('#budget-out').textContent = config.budgetPercent + '%';
  $('#risk').value = String(config.riskPercent);
  $('#budget').value = String(config.budgetPercent);
  document.querySelectorAll('[data-horizon]').forEach(b => {
    const active = Number(b.dataset.horizon) === config.horizon;
    b.classList.toggle('selected', active);
    b.setAttribute('aria-pressed', String(active));
  });
}
function renderAssets() {
  const row = $('#asset-pills');
  row.replaceChildren();
  for (const s of research.signals) {
    const button = document.createElement('button');
    button.className = 'asset-pill' + (s.symbol === selected ? ' selected' : '');
    button.type = 'button';
    button.textContent = s.symbol;
    button.setAttribute('aria-pressed', String(s.symbol === selected));
    button.title = s.name + ': ' + money(s.price);
    button.addEventListener('click', () => selectAsset(s.symbol));
    row.appendChild(button);
  }
}
function selectAsset(symbol, fromTable = false) {
  selected = symbol;
  hoverTick = null;
  renderAssets();
  renderChart();
  renderSignals();
  if (fromTable) $('#forecast-chart').scrollIntoView({ behavior: 'smooth', block: 'center' });
}
function polygonPath(ctx, top, bottom, X, Y) {
  ctx.beginPath();
  for (let i = 0; i < top.length; i++) {
    if (i === 0) ctx.moveTo(X(i), Y(top[i]));
    else ctx.lineTo(X(i), Y(top[i]));
  }
  for (let i = bottom.length - 1; i >= 0; i--) ctx.lineTo(X(i), Y(bottom[i]));
  ctx.closePath();
}
function renderChart() {
  const s = asset();
  $('#selected-name').textContent = s.name;
  $('#selected-regime').textContent = REGIMES[s.mode].toUpperCase() + ' REGIME';
  $('#plot-current').textContent = money(s.price);
  $('#plot-expected').textContent = money(s.mean);
  $('#plot-low').textContent = money(s.low);
  $('#plot-mean').textContent = money(s.mean);
  $('#plot-high').textContent = money(s.high);
  const canvas = $('#forecast-chart');
  const rect = canvas.getBoundingClientRect();
  if (rect.width < 10 || rect.height < 10) return;
  const DPR = Math.min(window.devicePixelRatio || 1, 3);
  canvas.width = Math.round(rect.width * DPR);
  canvas.height = Math.round(rect.height * DPR);
  const ctx = canvas.getContext('2d');
  ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
  const width = rect.width, height = rect.height;
  const left = 48, right = width - 17, top = 18, bottom = height - 36;
  const horizon = research.config.horizon;
  const minimum = Math.min(...s.bands.map(b => b.p05), s.price);
  const maximum = Math.max(...s.bands.map(b => b.p95), s.price);
  const buffer = Math.max(3, (maximum - minimum) * 0.16);
  const low = Math.max(0, minimum - buffer), high = maximum + buffer;
  const X = t => left + (right - left) * t / horizon;
  const Y = value => top + (bottom - top) * (high - value) / (high - low);
  ctx.clearRect(0, 0, width, height);
  ctx.font = "10px 'IBM Plex Mono', monospace";
  ctx.textAlign = 'right';
  ctx.fillStyle = '#71808a';
  ctx.strokeStyle = '#263039';
  ctx.lineWidth = 1;
  for (let k = 0; k <= 4; k++) {
    const val = low + (high - low) * k / 4, y = Y(val);
    ctx.beginPath(); ctx.moveTo(left, y); ctx.lineTo(right, y); ctx.stroke();
    ctx.fillText('$' + val.toFixed(0), left - 10, y + 3);
  }
  ctx.textAlign = 'center';
  for (let k = 0; k <= 4; k++) {
    const t = Math.round(horizon * k / 4);
    ctx.fillText(t === 0 ? 'NOW' : 'T+' + t, X(t), bottom + 21);
  }
  const band = s.bands;
  let gradient = ctx.createLinearGradient(0, top, 0, bottom);
  gradient.addColorStop(0, '#b7f4ba3e');
  gradient.addColorStop(1, '#b7f4ba0c');
  polygonPath(ctx, band.map(b => b.p95), band.map(b => b.p05), X, Y);
  ctx.fillStyle = gradient; ctx.fill();
  polygonPath(ctx, band.map(b => b.p75), band.map(b => b.p25), X, Y);
  ctx.fillStyle = '#a7efb51a'; ctx.fill();
  ctx.lineWidth = 1;
  ctx.strokeStyle = '#96c9b227';
  for (const trace of s.traces) {
    ctx.beginPath();
    trace.forEach((value, i) => i ? ctx.lineTo(X(i), Y(value)) : ctx.moveTo(X(i), Y(value)));
    ctx.stroke();
  }
  ctx.strokeStyle = '#f6be765e';
  ctx.setLineDash([5, 4]);
  ctx.beginPath(); ctx.moveTo(left, Y(s.price)); ctx.lineTo(right, Y(s.price)); ctx.stroke();
  ctx.setLineDash([]);
  ctx.beginPath();
  band.forEach((b, i) => i ? ctx.lineTo(X(i), Y(b.mean)) : ctx.moveTo(X(i), Y(b.mean)));
  ctx.strokeStyle = '#b7f4ba';
  ctx.lineWidth = 3;
  ctx.shadowColor = '#b7f4ba8c'; ctx.shadowBlur = 8; ctx.stroke(); ctx.shadowBlur = 0;
  const last = band[horizon];
  ctx.beginPath(); ctx.arc(X(horizon), Y(last.mean), 4, 0, Math.PI * 2); ctx.fillStyle = '#b7f4ba'; ctx.fill();
  if (hoverTick !== null) {
    const t = Math.max(0, Math.min(horizon, hoverTick));
    const b = band[t];
    const pos = X(t);
    ctx.strokeStyle = '#effff28a';ctx.lineWidth=1;ctx.setLineDash([3,3]);
    ctx.beginPath();ctx.moveTo(pos,top);ctx.lineTo(pos,bottom);ctx.stroke();ctx.setLineDash([]);
    const label = 'T+' + t + '  MEAN ' + money(b.mean) + '  5–95% ' + money(b.p05) + '–' + money(b.p95);
    ctx.font = "10px 'IBM Plex Mono', monospace";
    const labelWidth = Math.min(width - 70, ctx.measureText(label).width + 18);
    const bx = Math.max(left, Math.min(right - labelWidth, pos - labelWidth / 2));
    ctx.fillStyle = '#20332a';ctx.fillRect(bx,top + 6,labelWidth,25);
    ctx.fillStyle = '#d3f9db';ctx.textAlign='left';
    ctx.fillText(label,bx + 8,top + 22);
  }
  canvas.setAttribute('aria-label', s.name + ' current price ' + money(s.price) + ', projected mean ' + money(s.mean) + ' after ' + horizon + ' ticks with 256 simulated market futures.');
}
function renderAllocation() {
  const { portfolio } = research;
  const capital = portfolio.capital;
  const held = research.signals.map((s, i) => ({
    name: s.name, symbol: s.symbol, value: (portfolio.targets[s.id] || 0) * s.entry, qty: portfolio.targets[s.id] || 0, color: colors[i],
  })).filter(x => x.qty > 0).sort((a, b) => b.value - a.value);
  const cash = Math.max(0, capital - portfolio.used);
  const bar = $('#allocation-bar');
  bar.replaceChildren();
  for (const item of held) {
    const part = document.createElement('div');
    part.className = 'alloc-segment'; part.style.background = item.color;
    part.style.width = (capital ? item.value / capital * 100 : 0) + '%';
    part.title = item.symbol + ': ' + money(item.value, 0);
    bar.appendChild(part);
  }
  const remaining = document.createElement('div');
  remaining.className = 'alloc-segment'; remaining.style.flex = '1'; remaining.style.background = '#334049';
  remaining.title = 'Unallocated capital: ' + money(cash, 0);
  bar.appendChild(remaining);
  const list = $('#allocation-list');
  list.replaceChildren();
  const listItems = [...held.slice(0, 4), { symbol: 'CASH', name: 'Unallocated capital', value: cash, qty: null, color: '#4c5d65' }];
  listItems.forEach(item => {
    const row = document.createElement('div');
    row.className = 'alloc-row';
    const detail = item.qty === null ? 'RETAINED LIQUIDITY' : item.qty + ' SHARES';
    row.innerHTML = '<div><div class="alloc-name"><i class="alloc-dot" style="background:' + item.color + '"></i>' + item.symbol + ' <span style="font-weight:400;color:#76848d">' + item.name + '</span></div><div class="alloc-detail">' + detail + '</div></div><span class="alloc-share">' + (capital > 0 ? (item.value / capital * 100).toFixed(1) : '0') + '%</span>';
    list.appendChild(row);
  });
  $('#capital-buffer').textContent = money(cash, 0);
  $('#iteration-count').textContent = portfolio.iterations + ' LOTS';
}
function renderSignals() {
  const body = $('#signals-body');
  body.replaceChildren();
  for (const s of research.signals) {
    const qty = research.portfolio.targets[s.id] || 0;
    const tr = document.createElement('tr');
    tr.className = s.symbol === selected ? 'active' : '';
    const action = qty ? 'BUY ' + qty : s.buy ? 'WATCH' : 'PASS';
    tr.innerHTML = '<td>' + s.symbol + '</td><td>' + money(s.price) + '</td><td>' + money(s.mean) + '</td><td>' + (s.win * 100).toFixed(0) + '%</td><td><span class="trade-tag ' + (qty ? 'buy' : '') + '">' + action + '</span></td>';
    tr.tabIndex = 0;
    tr.title = 'Inspect ' + s.name + ' forecast';
    tr.addEventListener('click', () => selectAsset(s.symbol, true));
    tr.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); selectAsset(s.symbol, true); } });
    body.appendChild(tr);
  }
}
function refresh() {
  research = runResearch(config);
  renderStats();
  renderAssets();
  renderAllocation();
  renderSignals();
  renderChart();
}
function garden() {
  const grid = $('#garden-grid');
  const cells = [];
  for (let y = 0; y < 6; y++) for (let x = 0; x < 6; x++) {
    const parent = Math.abs(x - 2) <= 1 && Math.abs(y - 2) <= 1 && (x !== 2 || y !== 2);
    const target = x === 2 && y === 2;
    const className = target && gardenPhase === 2 ? 'target' : parent ? 'parent ' + (gardenPhase === 0 ? 'seedling' : 'mature') : '';
    cells.push('<div class="garden-cell ' + className + '" title="' + (target ? 'Mutation target cell' : parent ? 'Queenbeet parent' : 'Empty Garden cell') + '"></div>');
  }
  grid.innerHTML = cells.join('');
  const state = ['PHASE 01 / PLANTED', 'PHASE 02 / MATURE', 'PHASE 03 / MUTATION'][gardenPhase];
  const messages = [
    'The planner plants parents in a valid eight-plant ring and aligns their maturity windows.',
    'Parents reach maturity together. Wood chips increase the opportunity for a target mutation.',
    'An illustrative mutation appears. The real agent waits for native game RNG and harvests after maturity.',
  ];
  $('#garden-status').textContent = state;
  $('#garden-message').textContent = messages[gardenPhase];
  $('#garden-step').textContent = gardenPhase === 2 ? 'RESTART CYCLE ↺' : 'NEXT PHASE →';
}
function godzamok() {
  const count = Number($('#combo-range').value);
  const saleCost = count * 240000 + count ** 2 * 300;
  const value = godzamokEstimate({ count, perClick: 420000, clicksPerSecond: 18, buffSeconds: 9, saleCost });
  $('#combo-count').textContent = String(count);
  $('#combo-multiplier').textContent = value.multiplier.toFixed(2) + '×';
  $('#combo-gross').textContent = compact(value.gross);
  $('#combo-cost').textContent = compact(value.saleCost);
  $('#combo-net').textContent = (value.net < 0 ? '−' : '+') + compact(Math.abs(value.net));
  $('#combo-net').classList.toggle('negative', value.net < 0);
  const max = Math.max(value.gross, value.saleCost, 1);
  $('#combo-gross-bar').style.width = value.gross / max * 100 + '%';
  $('#combo-cost-bar').style.width = value.saleCost / max * 100 + '%';
}
function ascension() {
  const root = $('#ascension-stages');
  root.replaceChildren();
  stages.forEach((stage, index) => {
    const button = document.createElement('button');
    button.className = 'ascension-stage' + (index === stageSelected ? ' selected' : '');
    button.type = 'button';
    button.textContent = String(index + 1).padStart(2, '0');
    button.title = stage.name;
    button.setAttribute('aria-pressed', String(index === stageSelected));
    button.addEventListener('click', () => { stageSelected = index; ascension(); });
    root.appendChild(button);
  });
  const s = stages[stageSelected];
  $('#ascension-title').textContent = s.name;
  $('#ascension-cost').textContent = s.cost.toLocaleString('en-US');
  $('#ascension-rewards').textContent = 'PRIORITY: ' + s.rewards.join(' · ').toUpperCase();
}
function init() {
  refresh();
  garden();
  godzamok();
  ascension();
  const w = gardenWindow();
  document.querySelectorAll('[data-horizon]').forEach(button => button.addEventListener('click', () => { config.horizon = Number(button.dataset.horizon); refresh(); }));
  $('#risk').addEventListener('input', event => { config.riskPercent = Number(event.target.value); refresh(); });
  $('#budget').addEventListener('input', event => { config.budgetPercent = Number(event.target.value); refresh(); });
  $('#rerun').addEventListener('click', () => { config.seed += 7919; refresh(); });
  $('#garden-step').addEventListener('click', () => { gardenPhase = (gardenPhase + 1) % 3; garden(); });
  $('#combo-range').addEventListener('input', godzamok);
  const canvas = $('#forecast-chart');
  canvas.addEventListener('pointermove', event => {
    const rect = canvas.getBoundingClientRect();
    const fraction = Math.max(0, Math.min(1, (event.clientX - rect.left - 48) / Math.max(1, rect.width - 65)));
    hoverTick = Math.round(fraction * research.config.horizon);
    renderChart();
  });
  canvas.addEventListener('pointerleave', () => { hoverTick = null; renderChart(); });
  const observer = new ResizeObserver(() => { cancelAnimationFrame(resizeId); resizeId = requestAnimationFrame(renderChart); });
  observer.observe(canvas.parentElement);
  const sectionObserver = new IntersectionObserver(entries => {
    for (const entry of entries) if (entry.isIntersecting) {
      document.querySelectorAll('.rail-link').forEach(link => link.classList.toggle('active', link.getAttribute('href') === '#' + entry.target.id));
    }
  }, { rootMargin: '-10% 0px -65% 0px' });
  ['top','market','method','systems'].forEach(id => { const node = document.getElementById(id); if (node) sectionObserver.observe(node); });
}
init();
