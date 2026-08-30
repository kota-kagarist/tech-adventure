import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
test('project exposes the required quality scripts on Astro 7', async () => { const pkg = JSON.parse(await readFile(new URL('../package.json', import.meta.url), 'utf8')); assert.match(pkg.dependencies.astro, /^\^7\./); assert.equal(pkg.scripts.check, 'astro check'); assert.equal(pkg.scripts.test, 'node --test'); assert.equal(pkg.scripts.build, 'astro build'); assert.equal(pkg.devDependencies.typescript, '5.9.3'); });
