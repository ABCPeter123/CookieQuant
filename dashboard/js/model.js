// CookieQuant trading research model.
// Deterministic illustrative market states; stochastic transitions and the
// greedy risk-aware allocation follow the source toolkit's modeling approach.
export const GOODS = Object.freeze([
  { id: 0, symbol: 'CRL', name: 'Cereals',       val: 23.8, d: 0.36, mode: 3, dur: 14, rest: 43, max: 480 },
  { id: 1, symbol: 'CHC', name: 'Chocolate',     val: 31.6, d: 0.44, mode: 3, dur: 19, rest: 57, max: 380 },
  { id: 2, symbol: 'BTR', name: 'Butter',        val: 52.4, d: 0.12, mode: 1, dur: 45, rest: 69, max: 320 },
  { id: 3, symbol: 'SUG', name: 'Sugar',         val: 18.9, d: -0.18, mode: 2, dur: 28, rest: 36, max: 590 },
  { id: 4, symbol: 'NUT', name: 'Nuts',          val: 68.2, d: -0.32, mode: 4, dur: 16, rest: 63, max: 240 },
  { id: 5, symbol: 'SLT', name: 'Salt',          val: 41.4, d: 0.05, mode: 0, dur: 53, rest: 51, max: 450 },
  { id: 6, symbol: 'VNL', name: 'Vanilla',       val: 27.6, d: 0.22, mode: 3, dur: 12, rest: 42, max: 550 },
  { id: 7, symbol: 'EGG', name: 'Eggs',          val: 83.5, d: -0.40, mode: 4, dur: 20, rest: 83, max: 280 }
]);

export const REGIMES = ['Stable', 'Slow rise', 'Slow fall', 'Fast rise', 'Fast fall', 'Chaotic'];
export const DEFAULT_CONFIG = Object.freeze({ horizon: 15, riskPercent: 5, budgetPercent: 85, cash: 80000, reserve: 12000, brokers: 36, margin: 2, seed: 4317, level: 8, aura: 0, scenarios: 256 });

function prng(seed) {
  let s = seed >>> 0;
  return () => {
    s = (s + 0x6D2B79F5) >>> 0;
    let t = s;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function quantile(array, q) {
  const sorted = [...array].sort((a, b) => a - b);
  const index = Math.min(sorted.length - 1, Math.max(0, Math.floor(q * (sorted.length - 1))));
  return sorted[index];
}

// Port of stockSimulateTick from the browser toolkit. All state is copied
// and generated randomness never interacts with Cookie Clicker's Game RNG.
export function simulateTick(states, resting, level, aura, random) {
  const dragonBoost = aura;
  let globD = 0;
  const globP = random();
  if (random() < 0.1 + 0.1 * dragonBoost) globD = (random() - 0.5) * 2;
  for (const me of states) {
    me.last = 0;
    me.d *= 0.97 + 0.01 * dragonBoost;
    if (me.mode === 0) { me.d *= 0.95; me.d += 0.05 * (random() - 0.5); }
    else if (me.mode === 1) { me.d *= 0.99; me.d += 0.05 * (random() - 0.1); }
    else if (me.mode === 2) { me.d *= 0.99; me.d -= 0.05 * (random() - 0.1); }
    else if (me.mode === 3) { me.d += 0.15 * (random() - 0.1); me.val += random() * 5; }
    else if (me.mode === 4) { me.d -= 0.15 * (random() - 0.1); me.val -= random() * 5; }
    else if (me.mode === 5) me.d += 0.3 * (random() - 0.5);

    me.val += (resting[me.id] - me.val) * 0.01;
    if (globD !== 0 && random() < globP) {
      me.val -= (1 + me.d * random() ** 3 * 7) * globD;
      me.val -= globD * (1 + random() ** 3 * 7);
      me.d += globD * (1 + random() * 4);
      me.dur = 0;
    }
    me.val += ((random() - 0.5) * 2) ** 11 * 3;
    me.d += 0.1 * (random() - 0.5);
    if (random() < 0.15) me.val += (random() - 0.5) * 3;
    if (random() < 0.03) me.val += (random() - 0.5) * (10 + 10 * dragonBoost);
    if (random() < 0.1) me.d += (random() - 0.5) * (0.3 + 0.2 * dragonBoost);
    if (me.mode === 5) {
      if (random() < 0.5) me.val += (random() - 0.5) * 10;
      if (random() < 0.2) me.d = (random() - 0.5) * (2 + 6 * dragonBoost);
    }
    if (me.mode === 3 && random() < 0.3) { me.d += (random() - 0.5) * 0.1; me.val += (random() - 0.7) * 10; }
    if (me.mode === 3 && random() < 0.03) me.mode = 4;
    if (me.mode === 4 && random() < 0.3) { me.d += (random() - 0.5) * 0.1; me.val += (random() - 0.3) * 10; }
    if (me.val > 100 + (level - 1) * 3 && me.d > 0) me.d *= 0.9;
    me.val += me.d;
    if (me.val < 5) me.val += (5 - me.val) * 0.5;
    if (me.val < 5 && me.d < 0) me.d *= 0.95;
    me.val = Math.max(me.val, 1);
    me.dur--;
    if (me.dur <= 0) {
      me.dur = Math.floor(10 + random() * (690 - 200 * dragonBoost));
      if (random() < dragonBoost && random() < 0.5) me.mode = 5;
      else if (random() < 0.7 && (me.mode === 3 || me.mode === 4)) me.mode = 5;
      else me.mode = [0, 1, 1, 2, 2, 3, 4, 5][Math.floor(random() * 8)];
    }
  }
}

function metrics(values) {
  const sorted = [...values].sort((a, b) => a - b);
  const tail = Math.ceil(sorted.length * 0.05);
  const loss = Math.max(0, -sorted.slice(0, tail).reduce((a, b) => a + b, 0) / tail);
  const score = values.reduce((sum, value) => sum + Math.log1p(Math.max(-0.999999999, value)), 0) / values.length - 0.5 * loss;
  return { score, loss };
}

// Mirrored decision steps: fee-aware signal filter and scenario-wise greedy
// allocation with a hard 5% expected-shortfall cap and log-growth objective.
export function optimizePortfolio(signals, config = DEFAULT_CONFIG) {
  const { cash, reserve, riskPercent, budgetPercent } = { ...DEFAULT_CONFIG, ...config };
  const capital = Math.max(0, cash - reserve);
  const budget = capital * budgetPercent / 100;
  const sampleCount = signals[0]?.paths?.length || 256;
  const targets = Object.fromEntries(signals.map(s => [s.id, 0]));
  const pnl = Array(sampleCount).fill(0);
  const riskCap = riskPercent / 100;
  let used = 0, current = { score: 0, loss: 0 }, nextPnl = pnl, iterations = 0;
  if (!(capital > 0) || !(budget > 0)) return { targets, risk: 0, expected: 0, used: 0, budget, capital, iterations: 0, score: 0 };
  for (let step = 0; step < 100; step++) {
    let best = null;
    for (const s of signals) {
      if (!s.buy) continue;
      const qty = Math.min(s.max - targets[s.id],
        Math.floor((budget - used) / s.entry),
        Math.max(1, Math.floor(budget / 40 / s.entry)));
      if (!(qty > 0)) continue;
      const delta = s.paths.map(v => qty * (v - s.entry) / capital);
      const next = nextPnl.map((v, i) => v + delta[i]);
      const metric = metrics(next);
      if (metric.loss > riskCap || metric.score <= current.score) continue;
      const benefit = (metric.score - current.score) / (qty * s.entry / capital);
      if (!best || benefit > best.benefit) best = { s, qty, next, metric, benefit, cost: qty * s.entry };
    }
    if (!best) break;
    targets[best.s.id] += best.qty;
    used += best.cost;
    nextPnl = best.next;
    current = best.metric;
    iterations++;
  }
  return {
    targets,
    risk: current.loss,
    expected: nextPnl.reduce((a, b) => a + b, 0) / sampleCount,
    used, budget, capital, iterations, score: current.score,
    outcomes: nextPnl,
  };
}

export function runResearch(userConfig = {}) {
  const config = { ...DEFAULT_CONFIG, ...userConfig };
  const horizon = Math.min(20, Math.max(10, Math.floor(config.horizon)));
  const count = 256;
  const rand = prng(config.seed);
  const snapshots = GOODS.map(() => Array.from({ length: horizon + 1 }, () => []));
  const traces = GOODS.map(() => []);
  const paths = GOODS.map(() => []);
  const rest = Object.fromEntries(GOODS.map(g => [g.id, g.rest]));
  for (let path = 0; path < count; path++) {
    const state = GOODS.map(g => ({ id: g.id, val: g.val, d: g.d, mode: g.mode, dur: g.dur }));
    for (let i = 0; i < GOODS.length; i++) {
      snapshots[i][0].push(state[i].val);
      if (path < 22) traces[i].push([state[i].val]);
    }
    for (let tick = 1; tick <= horizon; tick++) {
      simulateTick(state, rest, config.level, config.aura, rand);
      for (let i = 0; i < GOODS.length; i++) {
        snapshots[i][tick].push(state[i].val);
        if (path < 22) traces[i][path].push(state[i].val);
        if (tick === horizon) paths[i].push(state[i].val);
      }
    }
  }
  const fee = 0.2 * 0.95 ** config.brokers;
  const signals = GOODS.map((good, i) => {
    const samples = paths[i];
    const mean = samples.reduce((a, b) => a + b, 0) / count;
    const variance = samples.reduce((a, b) => a + (b - mean) ** 2, 0) / count;
    const entry = good.val * (1 + fee);
    const win = samples.filter(v => v > entry).length / count;
    const buy = mean - 1.96 * Math.sqrt(variance / count) > entry * (1 + config.margin / 100) && win >= 0.55;
    return { ...good, price: good.val, entry, fee, mean, variance, win, buy, horizon, low: quantile(samples, 0.05), high: quantile(samples, 0.95), paths: samples, traces: traces[i], bands: snapshots[i].map(values => ({
      p05: quantile(values, 0.05),
      p25: quantile(values, 0.25),
      p50: quantile(values, 0.5),
      p75: quantile(values, 0.75),
      p95: quantile(values, 0.95),
      mean: values.reduce((a, b) => a + b, 0) / values.length,
    })) };
  });
  const portfolio = optimizePortfolio(signals, config);
  return { config: { ...config, horizon }, signals, portfolio, fee, count, seed: config.seed };
}

// Pure utility functions also power the educational modules below.
export function godzamokEstimate({ count = 230, perClick = 300000, clicksPerSecond = 18, buffSeconds = 9, saleCost = 72000000, gainPerBuilding = 0.01 } = {}) {
  const gross = count * gainPerBuilding * perClick * clicksPerSecond * buffSeconds;
  return { gross, net: gross - saleCost, multiplier: 1 + count * gainPerBuilding, saleCost };
}

export function gardenWindow({ maturity = 9, lifespan = 19, slowDelay = 0, fastDelay = 4 } = {}) {
  const slow = [slowDelay + maturity, slowDelay + lifespan];
  const fast = [fastDelay + maturity * 0.65, fastDelay + lifespan * 0.65];
  return { slow, fast, overlap: Math.max(0, Math.min(slow[1], fast[1]) - Math.max(slow[0], fast[0])) };
}
