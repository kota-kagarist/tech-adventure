import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const root = new URL('../', import.meta.url);
const source = (path) => readFile(new URL(path, root), 'utf8').catch(() => '');

test('responsive light atlas keeps every major surface inside the viewport', async () => {
  const [layout, mobileCss, polishCss] = await Promise.all([
    source('src/layouts/BaseLayout.astro'),
    source('src/styles/mobile-layout.css'),
    source('src/styles/layout-polish.css'),
  ]);

  assert.match(layout, /mobile-layout\.css/);
  assert.match(layout, /layout-polish\.css/);
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

  assert.match(polishCss, /\.relation-note\s*\{[\s\S]*?display:\s*block;[\s\S]*?min-width:\s*0;[\s\S]*?max-width:\s*100%;[\s\S]*?white-space:\s*normal;[\s\S]*?overflow-wrap:\s*anywhere/);
  assert.match(polishCss, /@media\s*\(max-width:\s*1020px\)[\s\S]*?\.explorer-toolbar\s*\{[\s\S]*?grid-template-columns:\s*repeat\(2,\s*minmax\(0,\s*1fr\)\)/);
  assert.match(polishCss, /@media\s*\(max-width:\s*760px\)[\s\S]*?\.explorer-toolbar\s*\{[\s\S]*?grid-template-columns:\s*1fr/);
  assert.match(polishCss, /\.home-hero \.display-title\s*\{[\s\S]*?font-size:\s*clamp\(2\.1rem,\s*9\.5vw,\s*2\.75rem\);[\s\S]*?word-break:\s*keep-all;[\s\S]*?text-wrap:\s*balance/);
});
