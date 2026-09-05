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

test('home preview summarizes the six-region technology atlas', async () => {
  const [home, preview, header] = await Promise.all([
    source('src/pages/index.astro'),
    source('src/components/LandscapePreview.astro'),
    source('src/components/SiteHeader.astro')
  ]);
  assert.match(home, /TECHNOLOGY LANDSCAPE/);
  assert.match(home, /Navigate the technology landscape\./);
  assert.match(home, /<LandscapePreview/);
  assert.match(home, /withBase\('\/landscape'\)/);
  assert.match(home, /withBase\('\/technologies'\)/);
  assert.match(preview, /landscapeRegions/);
  assert.match(preview, /Open full atlas/);
  assert.match(preview, /withBase\('\/landscape'\)/);
  assert.match(header, /withBase\('\/landscape'\)/);
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
