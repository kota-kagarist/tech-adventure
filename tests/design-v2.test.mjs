import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const source = (path) => readFile(new URL(`../${path}`, import.meta.url), 'utf8');

test('light Digital Atlas tokens replace the dark canvas', async () => {
  const [css, layout, header] = await Promise.all([
    source('src/styles/global.css'),
    source('src/layouts/BaseLayout.astro'),
    source('src/components/SiteHeader.astro')
  ]);
  assert.match(css, /--canvas:\s*#F6F7F4/i);
  assert.match(css, /--ink:\s*#14233B/i);
  assert.match(css, /--brand:\s*#1D5FD1/i);
  assert.match(css, /--region-foundation-bg:/);
  assert.doesNotMatch(css, /color-scheme:\s*dark/);
  assert.match(layout, /theme-color[^\n]*#F6F7F4/i);
  assert.match(header, />Atlas</);
  assert.doesNotMatch(header, />Landscape</);
});

test('home is a light atlas entry point', async () => {
  const [home, preview, terrain, header] = await Promise.all([
    source('src/pages/index.astro'),
    source('src/components/LandscapePreview.astro'),
    source('src/components/AtlasTerrain.astro').catch(() => ''),
    source('src/components/SiteHeader.astro')
  ]);
  assert.match(home, /WEB TECHNOLOGY ATLAS/);
  assert.match(home, /Web技術の地図を、一緒に旅しよう。/);
  assert.match(home, />地図を開く</);
  assert.match(home, />技術を探す</);
  assert.match(home, /categories\.length/);
  assert.match(home, /<AtlasTerrain/);
  assert.match(home, /<LandscapePreview/);
  assert.match(home, /start-path-grid/);
  assert.match(preview, /landscapeRegions/);
  assert.match(preview, /landscape-region-card/);
  assert.match(preview, /withBase\('\/landscape'\)/);
  assert.match(terrain, /<svg/);
  assert.match(header, /withBase\('\/landscape'\)/);
});

test('explorer cards expose role context in a responsive index grid', async () => {
  const [card, css] = await Promise.all([
    source('src/components/TechnologyCard.astro'),
    source('src/styles/global.css'),
  ]);
  assert.match(card, /tech-card-role/);
  assert.match(card, /technology\.role/);
  assert.match(css, /\.tech-grid\s*\{[\s\S]*?repeat\(4,\s*minmax\(0,\s*1fr\)\)/);
  assert.match(css, /@media\s*\(max-width:\s*1020px\)[\s\S]*?\.tech-grid\s*\{\s*grid-template-columns:\s*repeat\(2,\s*minmax\(0,1fr\)\)/);
  assert.match(css, /@media\s*\(max-width:\s*760px\)[\s\S]*?\.tech-grid\s*\{\s*grid-template-columns:\s*1fr/);
});

test('core screens use the v2 structural shells', async () => {
  const [list, detail, compare, journeys, landscape] = await Promise.all([
    source('src/pages/technologies/index.astro'),
    source('src/pages/technologies/[id].astro'),
    source('src/pages/compare/[left]/[right].astro'),
    source('src/pages/journeys/[id].astro'),
    source('src/pages/landscape.astro')
  ]);
  assert.match(list, /explorer-toolbar/);
  assert.match(detail, /technology-detail-grid/);
  assert.match(compare, /comparison-shell/);
  assert.match(journeys, /journey-rail/);
  assert.match(landscape, /atlas-layout/);
});
