import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const root = new URL('../', import.meta.url);
const source = (path) => readFile(new URL(path, root), 'utf8').catch(() => '');

test('mobile layout constrains the atlas and home landscape preview to the viewport', async () => {
  const [layout, mobileCss] = await Promise.all([
    source('src/layouts/BaseLayout.astro'),
    source('src/styles/mobile-layout.css'),
  ]);

  assert.match(layout, /mobile-layout\.css/);
  assert.match(mobileCss, /\.atlas-regions\s*\{[\s\S]*?grid-template-columns:\s*minmax\(0,\s*1fr\)/);
  assert.match(mobileCss, /@media\s*\(max-width:\s*760px\)[\s\S]*?\.landscape-grid\s*\{[\s\S]*?min-width:\s*0;[\s\S]*?grid-template-columns:\s*repeat\(2,\s*minmax\(0,\s*1fr\)\)/);
  assert.match(mobileCss, /\.landscape-group:nth-child\(odd\)\s*\{\s*border-left:\s*0;/);
});
