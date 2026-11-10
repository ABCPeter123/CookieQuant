import { cp, mkdir, rm } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const output = resolve(root, 'public');
await rm(output, { recursive: true, force: true });
await mkdir(output, { recursive: true });
for (const path of ['index.html', 'style.css']) {
  await cp(resolve(root, path), resolve(output, path));
}
await cp(resolve(root, 'js'), resolve(output, 'js'), { recursive: true });
console.log('CookieQuant dashboard ready: dashboard/public/');
