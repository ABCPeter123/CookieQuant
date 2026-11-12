import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {explainR2Failure} from '../dashboard/lib/r2-diagnostics.js';

const failure=(name,status)=>({name,$metadata:{httpStatusCode:status}});
test('R2 diagnostic explains authentication errors without exposing raw messages',()=>{
  const badKey={...failure('InvalidAccessKeyId',401),message:'DO-NOT-LEAK'};
  const explanation=explainR2Failure(badKey);
  assert.match(explanation,/Access Key ID/);
  assert.doesNotMatch(explanation,/DO-NOT-LEAK/);
  assert.match(explainR2Failure(failure('AccessDenied',403)),/Object Read & Write/);
  assert.match(explainR2Failure(failure('SignatureDoesNotMatch',403)),/Secret/);
  assert.match(explainR2Failure(failure('NoSuchKey',404)),/missing/);
  assert.match(explainR2Failure(failure('SlowDown',429)),/rate-limited/);
  assert.match(explainR2Failure(new SyntaxError('internal parse error')),/not valid JSON/);
});

test('read-only cost-guard diagnostics never write objects or print secret values',async()=>{
  const src=await readFile(new URL('../dashboard/scripts/diagnose-r2.mjs',import.meta.url),'utf8');
  assert.match(src,/GetObjectCommand/);
  assert.match(src,/cookiequant\/v1\/\.budget-guard\.json/);
  assert.match(src,/No R2 objects were modified/);
  assert.doesNotMatch(src,/PutObjectCommand|DeleteObjectCommand|console\.log\(.*R2_SECRET_ACCESS_KEY/);
  const core=await readFile(new URL('../dashboard/lib/r2-storage.js',import.meta.url),'utf8');
  assert.match(core,/explainR2Failure\(error\)/);
  assert.match(core,/R2 cost guard unreadable/);
});
