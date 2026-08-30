import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const source = (path) => readFile(new URL(`../${path}`, import.meta.url), 'utf8');

test('v2 dark design tokens replace the rustic theme', async () => {
  const css = await source('src/styles/global.css');
  assert.match(css, /--bg:\s*#08090b/);
  assert.match(css, /--accent:\s*#8b5cf6/);
  assert.match(css, /--surface:\s*#0e1014/);
  assert.doesNotMatch(css, /--paper:/);
  assert.doesNotMatch(css, /--moss:/);
  assert.doesNotMatch(css, /--signal:/);
});

test('home renders the technology landscape instead of decorative adventure cards', async () => {
  const [home, preview] = await Promise.all([
    source('src/pages/index.astro'),
    source('src/components/LandscapePreview.astro')
  ]);
  assert.match(home, /TECHNOLOGY LANDSCAPE/);
  assert.match(home, /Navigate the technology landscape\./);
  assert.match(home, /<LandscapePreview/);
  assert.match(preview, /landscape-grid/);
  assert.match(preview, /landscape-node/);
});

test('core screens use the v2 structural shells', async () => {
  const [list, detail, compare, journeys] = await Promise.all([
    source('src/pages/technologies/index.astro'),
    source('src/pages/technologies/[id].astro'),
    source('src/pages/compare/[left]/[right].astro'),
    source('src/pages/journeys/[id].astro')
  ]);
  assert.match(list, /explorer-toolbar/);
  assert.match(detail, /technology-detail-grid/);
  assert.match(compare, /comparison-shell/);
  assert.match(journeys, /journey-rail/);
});
