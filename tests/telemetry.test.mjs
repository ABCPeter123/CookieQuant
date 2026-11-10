import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { Script } from 'node:vm';
const read = path => readFile(new URL(path,import.meta.url),'utf8');

test('opt-in game publisher exists in shipped runtime',async()=>{
 const src=await read('../src/cookie-quant.js');
 const user=await read('../dist/cookie-quant.user.js');
 assert.match(src,/cookieClickToolkit = toolkit/);
 assert.match(src,/telemetry\.connect/);
 assert.match(src,/CQ_TELEMETRY_URL = "https:\/\/cookiequant-dashboard\.vercel\.app\/api\/telemetry"/);
 assert.match(src,/const cloudConfig/);
 assert.match(src,/toolkit\.telemetryStock/);
 assert.match(src,/clearInterval\(toolkit\.telemetryTimer\)/);
 assert.ok(user.includes('const CQ_TELEMETRY_KEY'));
 assert.match(user,/cookieClickToolkit\.version === "2026\.11\.10\.3"/);
 assert.ok(user.includes('@version      2026.11.10.3'));
 new Script(src);
 new Script(user);
});
test('private read endpoint requires a credential', async()=>{
 const api=await read('../dashboard/api/live.js');
 assert.match(api,/TELEMETRY_READ_KEY/);
 assert.match(api,/timingSafeEqual/);
 assert.match(api,/if \(!authorized\(req\)\)/);
 assert.doesNotMatch(api,/Access-Control-Allow-Origin', '\*'/);
});
test('publisher API validates and strips fields',async()=>{
 const api=await read('../dashboard/api/telemetry.js');
 assert.match(api,/TELEMETRY_WRITE_KEY/);
 assert.match(api,/toRecord\(body\)/);
 assert.match(api,/MAX_BODY = 180000/);
 assert.match(api,/interval '30 days'/);
 assert.doesNotMatch(api,/value\.seed/);
});
test('dashboard exposes live and demo without storing keys in source',async()=>{
 const src=await read('../dashboard/js/live.js');
 const app=await read('../dashboard/js/app.js');
 assert.match(app,/initCloudTelemetry\(\)/);
 assert.match(src,/sessionStorage\.setItem\('cookiequant:viewer'/);
 assert.match(src,/synthetic|Demo mode/);
 assert.match(src,/Actual market prices/);
 assert.doesNotMatch(src,/dk7g2myHx/);
 assert.doesNotMatch(src,/dqC-lw0X/);
});
