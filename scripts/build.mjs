import { readFile, mkdir, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const source = await readFile(resolve(root, 'src/cookie-quant.js'), 'utf8');
const version = source.match(/const TOOLKIT_VERSION\s*=\s*"([^"]+)"/)?.[1];
if (!version) throw new Error('Missing TOOLKIT_VERSION in source');
const header = ["// ==UserScript==","// @name         CookieQuant | Cookie Clicker Automation","// @namespace    https://github.com/ABCPeter123/CookieQuant","// @version      __VERSION__","// @description  Monte Carlo trading, risk-aware automation, Garden, Godzamok, dragon, and ascension helpers.","// @author       ABCPeter123","// @license      MIT","// @homepageURL  https://github.com/ABCPeter123/CookieQuant","// @supportURL   https://github.com/ABCPeter123/CookieQuant/issues","// @downloadURL  https://raw.githubusercontent.com/ABCPeter123/CookieQuant/main/dist/cookie-quant.user.js","// @updateURL    https://raw.githubusercontent.com/ABCPeter123/CookieQuant/main/dist/cookie-quant.user.js","// @match        https://orteil.dashnet.org/cookieclicker/*","// @match        http://orteil.dashnet.org/cookieclicker/*","// @run-at       document-idle","// @grant        none","// ==/UserScript==","","/* Auto-start once the official web game is ready. */","(() => {","  'use strict';","  if (window.top !== window.self) return;","  let checks = 0;","  const boot = () => {","    if (window.cookieClickToolkit?.active && window.cookieClickToolkit.version === \"__VERSION__\" && typeof window.cookieClickToolkit?.telemetry?.connect === \"function\") return true;","    if (!window.Game?.ready || !document.body) return false;","    try {"].join('\n').replaceAll('__VERSION__', version) + '\n';
const footer = '\n' + ["    } catch (error) {","      console.error('[CookieQuant] Startup failed:', error);","    }","    return true;","  };","  if (boot()) return;","  const timer = setInterval(() => {","    if (boot() || ++checks >= 240) {","      clearInterval(timer);","      if (checks >= 240) console.warn('[CookieQuant] Game did not become ready.');","    }","  }, 500);","})();",""].join('\n');
const userscript = header + source.replace(/^/gm, '      ') + footer;
const artifacts = [['dist/cookie-quant.js', source], ['dist/cookie-quant.user.js', userscript]];
const check = process.argv.includes('--check');
for (const [path, expected] of artifacts) {
  const file = resolve(root, path);
  if (check) {
    const actual = await readFile(file, 'utf8').catch(() => { throw new Error(path + ' missing; run npm run build'); });
    if (actual !== expected) throw new Error(path + ' is stale; run npm run build');
    console.log('OK ' + path);
  } else {
    await mkdir(dirname(file), { recursive: true });
    await writeFile(file, expected, 'utf8');
    console.log('Built ' + path);
  }
}
