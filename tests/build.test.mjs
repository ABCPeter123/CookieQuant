import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { test } from 'node:test';
import { Script, runInNewContext } from 'node:vm';

const read = (path) => readFile(new URL(path, import.meta.url), 'utf8');
const source = await read('../src/cookie-quant.js');
const consoleBuild = await read('../dist/cookie-quant.js');
const userscript = await read('../dist/cookie-quant.user.js');

test('console build matches the source', () => {
  assert.equal(consoleBuild, source);
});

test('all JavaScript files parse', () => {
  for (const [name, contents] of Object.entries({source, consoleBuild, userscript})) {
    assert.doesNotThrow(() => new Script(contents, { filename: name + '.js' }));
  }
});

test('userscript matches the intended official web game and update URL', () => {
  assert.match(userscript, /@match\s+https:\/\/orteil\.dashnet\.org\/cookieclicker\/\*/);
  assert.match(userscript, /@grant\s+none/);
  assert.match(userscript, /@license\s+MIT/);
  assert.match(userscript, /@updateURL\s+https:\/\/raw\.githubusercontent\.com\/ABCPeter123\/CookieQuant\/main\/dist\/cookie-quant\.user\.js/);
  assert.match(userscript, /window\.Game\?\.ready/);
  assert.ok(userscript.includes(source.replace(/^/gm, '      ')));
});

test('required automations remain present', () => {
  for (const name of [
    'function stockForecast(', 'function stockPortfolioPlan(',
    'function runGardenSeedCycle(', 'function runGodzamokAutomation(',
    'function runForceTheHandOfFate(', 'function runDragonAutomation(',
    'function runStockAutomation(', 'function runPantheonAutomation(',
    'function maintainGardenPreset(', 'toolkit.stop = () =>',
  ]) assert.ok(source.includes(name), 'Missing: ' + name);
});

test('persisted research and late-game controls exist', () => {
  assert.match(source, /researchUpgrades:\s*\n\s*typeof savedControls\.researchUpgrades/);
  assert.match(source, /"midgame",\s*\n\s*"lategame",/);
});

test('userscript waits for game readiness', () => {
  const win = {};
  win.top = win;
  win.self = win;
  const callbacks = [];
  const ctx = {
    window: win,
    document: { body: {} },
    setInterval(callback) { callbacks.push(callback); return 1; },
    clearInterval() {},
    console: { warn() {}, error() {} },
  };
  assert.doesNotThrow(() => runInNewContext(userscript, ctx));
  assert.equal(callbacks.length, 1);
  assert.doesNotThrow(() => callbacks[0]());
});

