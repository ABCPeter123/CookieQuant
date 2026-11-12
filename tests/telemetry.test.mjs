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
test('public live endpoint requires no viewer key and remains read-only', async()=>{
 const api=await read('../dashboard/api/live.js');
 assert.match(api,/Access-Control-Allow-Origin', '\*'/);
 assert.match(api,/req.method !== 'GET'/);
 assert.doesNotMatch(api,/TELEMETRY_READ_KEY|authorized\(req\)|Invalid viewer key/);
 assert.match(api,/SELECT received_at, tick, payload/);
});
test('publisher API validates and strips fields',async()=>{
 const api=await read('../dashboard/api/telemetry.js');
 assert.match(api,/TELEMETRY_WRITE_KEY/);
 assert.match(api,/toRecord\(body\)/);
 assert.match(api,/MAX_BODY = 180000/);
 assert.doesNotMatch(api,/DELETE FROM cq_telemetry_snapshots/i);
 assert.doesNotMatch(api,/interval '30 days'/);
 assert.doesNotMatch(api,/value\.seed/);
});
test('public all-time history needs no viewer key and is bounded only in display sampling',async()=>{
 const api=await read('../dashboard/api/history.js');
 assert.match(api,/Access-Control-Allow-Origin', '\*'/);
 assert.doesNotMatch(api,/TELEMETRY_READ_KEY|authorized\(req\)|Invalid viewer key/);
 assert.match(api,/req.method !== 'GET'/);
 assert.match(api,/all: 0/);
 assert.match(api,/SAMPLES = 450/);
 assert.match(api,/row_number\(\) OVER/);
 assert.doesNotMatch(api,/DELETE FROM/);
 const client=await read('../dashboard/js/live.js');
 const terminal=await read('../dashboard/js/quant-terminal.js');
 assert.match(terminal,/ALL TIME/);
 assert.match(client,/fetchHistory/);
 assert.match(client,/CLOUD_HISTORY_ENDPOINT/);
});
test('dashboard defaults to live, keeps demo separate and never prompts for a viewer key',async()=>{
 const src=await read('../dashboard/js/live.js');
 const app=await read('../dashboard/js/app.js');
 assert.match(app,/initCloudTelemetry\(\)/);
 assert.match(src,/showMode\(true\);/);
 assert.match(src,/fetch\(CLOUD_ENDPOINT,\{cache:'no-store'/);
 assert.match(src,/synthetic|Demo mode/);
 assert.match(src,/mountQuantTerminal/);
 assert.match(src,/PUBLIC · READ-ONLY/);
 assert.doesNotMatch(src,/sessionStorage|cloud-reader|PRIVATE VIEWER KEY|Invalid viewer key|Bearer /);
});
