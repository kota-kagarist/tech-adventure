import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const root = new URL('../', import.meta.url);
const source = (path) => readFile(new URL(path, root), 'utf8').catch(() => '');

test('responsive light atlas keeps every major surface inside the viewport', async () => {
  const [layout, mobileCss] = await Promise.all([
    source('src/layouts/BaseLayout.astro'),
    source('src/styles/mobile-layout.css'),
  ]);

  assert.match(layout, /mobile-layout\.css/);
  assert.match(mobileCss, /\.atlas-regions\s*\{[\s\S]*?grid-template-columns:\s*minmax\(0,\s*1fr\)/);
  assert.match(mobileCss, /@media\s*\(max-width:\s*1020px\)[\s\S]*?\.atlas-layout\s*\{[\s\S]*?grid-template-columns:\s*minmax\(0,\s*1fr\)/);
  assert.match(mobileCss, /@media\s*\(max-width:\s*760px\)[\s\S]*?\.header-inner\s*\{[\s\S]*?grid-template-columns:\s*1fr/);
  assert.match(mobileCss, /\.site-nav\s*\{[\s\S]*?overflow-x:\s*auto/);
  assert.match(mobileCss, /\.atlas-toolbar\s*\{[\s\S]*?grid-template-columns:\s*1fr/);
  assert.match(mobileCss, /\.atlas-layout\s*\{[\s\S]*?grid-template-columns:\s*minmax\(0,\s*1fr\)/);
  assert.match(mobileCss, /\.tech-grid\s*\{[\s\S]*?grid-template-columns:\s*1fr/);
  assert.match(mobileCss, /\.landscape-grid\s*\{[\s\S]*?min-width:\s*0;[\s\S]*?grid-template-columns:\s*repeat\(2,\s*minmax\(0,\s*1fr\)\)/);
  assert.match(mobileCss, /\.atlas-preview-grid\s*\{[\s\S]*?grid-template-columns:\s*repeat\(2,\s*minmax\(0,\s*1fr\)\)/);
  assert.match(mobileCss, /\.brand span:last-child\s*\{\s*display:\s*inline/);
});
