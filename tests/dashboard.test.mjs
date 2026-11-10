import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { GOODS, runResearch, optimizePortfolio, godzamokEstimate, gardenWindow } from '../dashboard/js/model.js';

test('research produces 256 finite joint simulated futures', () => {
  const { signals, count, config } = runResearch();
  assert.equal(count, 256);
  assert.equal(config.horizon, 15);
  assert.equal(signals.length, GOODS.length);
  for (const signal of signals) {
    assert.equal(signal.paths.length, count);
    assert.equal(signal.traces.length, 22);
    assert.equal(signal.bands.length, 16);
    assert.ok(signal.paths.every(v => Number.isFinite(v) && v >= 1));
    assert.ok(signal.bands.every(v => v.p05 <= v.p50 && v.p50 <= v.p95));
  }
});
test('simulation is reproducible for a fixed seed', () => {
  const a = runResearch({ seed: 100, horizon: 10 });
  const b = runResearch({ seed: 100, horizon: 10 });
  const c = runResearch({ seed: 101, horizon: 10 });
  assert.deepEqual(a.signals.map(s => s.paths), b.signals.map(s => s.paths));
  assert.notDeepEqual(a.signals[0].paths, c.signals[0].paths);
});
test('portfolio respects budget, capacity and tail-risk constraints', () => {
  for (const riskPercent of [1, 5, 25]) {
    for (const budgetPercent of [10, 60, 100]) {
      const { signals, portfolio } = runResearch({ riskPercent, budgetPercent });
      assert.ok(portfolio.used <= portfolio.budget + 1e-6);
      assert.ok(portfolio.risk <= riskPercent / 100 + 1e-9);
      assert.ok(Number.isFinite(portfolio.expected));
      for (const s of signals) {
        assert.ok(portfolio.targets[s.id] >= 0 && portfolio.targets[s.id] <= s.max);
        if (!s.buy) assert.equal(portfolio.targets[s.id], 0);
      }
    }
  }
});
test('zero budget cannot produce purchases', () => {
  const research = runResearch();
  const p = optimizePortfolio(research.signals, { cash: 0, reserve: 0, budgetPercent: 100 });
  assert.equal(p.used, 0);
});
test('Garden and Godzamok educational models remain finite', () => {
  const g = gardenWindow();
  assert.ok(Number.isFinite(g.overlap) && g.overlap >= 0);
  const combo = godzamokEstimate({ count: 200, saleCost: 10 });
  assert.equal(combo.multiplier, 3);
  assert.equal(combo.net, combo.gross - combo.saleCost);
});
test('static dashboard has required data and navigation targets', async () => {
  const html = await readFile(new URL('../dashboard/index.html', import.meta.url), 'utf8');
  const app = await readFile(new URL('../dashboard/js/app.js', import.meta.url), 'utf8');
  for (const id of ['market', 'method', 'systems', 'forecast-chart', 'risk', 'budget', 'garden-grid', 'combo-range', 'ascension-stages'])
    assert.match(html, new RegExp('id="' + id + '"'));
  assert.match(html, /synthetic market states locally/);
  assert.match(app, /runResearch\(config\)/);
});
