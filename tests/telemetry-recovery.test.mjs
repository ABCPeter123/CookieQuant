import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { runInNewContext } from 'node:vm';

const source = await readFile(new URL('../src/cookie-quant.js', import.meta.url), 'utf8');
const first = source.indexOf('  /* Cloud telemetry: opt-in credentials, automatic startup');
const last = source.indexOf('  saveControls();\n  console.log', first);
assert.ok(first > 0 && last > first, 'Telemetry module must remain independently testable');
const moduleText = source.slice(first, last);

test('cloud publisher retries after failure, detects staleness and recovers after wake', async () => {
  const local = new Map();
  const events = new Map();
  const timers = new Map();
  let requests = 0;
  const toolkit = { active: true };
  const game = { ready: true, version: '2.058', resets: 0, cookies: 123,
    cookiesPs: 5, prestige: 1, Objects: { Bank: { level: 1 } } };
  const window = {
    Game: game, crypto: { randomUUID: () => '00000000-0000-4000-8000-000000000007' },
    addEventListener: (name, handler) => events.set(name, handler),
    removeEventListener: name => events.delete(name)
  };
  const document = {
    hidden: false,
    addEventListener: (name, handler) => events.set(name, handler),
    removeEventListener: name => events.delete(name)
  };
  const controls = { stockRiskPercent: 5, stockBudgetPercent: 10,
    stockHorizon: 15, stockAuto: true };
  runInNewContext(moduleText, {
    toolkit, Game: game, controls, window, document, navigator: { onLine: true },
    localStorage: {
      getItem: key => local.get(key) ?? null,
      setItem: (key, value) => local.set(key, value),
      removeItem: key => local.delete(key)
    },
    getStockMarket: () => null, stockBookFor: () => null,
    fetch: async () => {
      requests++;
      if (requests === 1) throw new Error('temporary outage');
      return { ok: true, status: 200 };
    },
    setInterval: (fn, ms) => { timers.set(ms, fn); return ms; },
    clearInterval: ms => timers.delete(ms),
    setTimeout: (fn, ms) => ms, clearTimeout: () => {},
    AbortController, Date, Math, TOOLKIT_VERSION: '2026.11.12.2', console: { warn() {}, error() {} }
  });
  const settle = () => new Promise(resolve => setImmediate(resolve));
  assert.ok(timers.has(15000), '15-second watchdog installed');
  assert.ok(events.has('online') && events.has('focus') && events.has('pageshow'));
  assert.ok(events.has('visibilitychange'));
  toolkit.telemetry.connect('x'.repeat(48));
  await settle();
  assert.equal(requests, 1);
  assert.equal(toolkit.telemetry.consecutiveFailures, 1);
  assert.match(toolkit.telemetry.status, /Disconnected/);
  assert.ok(toolkit.telemetry.nextAttemptAt > Date.now());
  timers.get(15000)();
  await settle();
  assert.equal(requests, 1, 'watchdog respects backoff');
  assert.equal(await toolkit.telemetry.push(true), true);
  assert.equal(requests, 2);
  assert.equal(toolkit.telemetry.consecutiveFailures, 0);
  assert.ok(toolkit.telemetry.lastSent > 0);
  toolkit.telemetry.lastSent = Date.now() - 160000;
  toolkit.telemetry.lastAttemptAt = 0;
  toolkit.telemetry.checkHealth();
  await settle();
  assert.equal(requests, 3, 'stale connection causes fresh upload');
  toolkit.telemetry.lastSent = Date.now() - 70000;
  toolkit.telemetry.lastAttemptAt = 0;
  events.get('online')();
  await settle();
  assert.equal(requests, 4, 'network recovery triggers immediate upload');
  toolkit.telemetry.disconnect();
  const count = requests;
  timers.get(15000)();
  await settle();
  assert.equal(requests, count, 'disabled publisher does not reconnect');
  toolkit.telemetry.cleanup();
  assert.equal(events.size, 0, 'listener cleanup prevents duplicate handlers');
});
