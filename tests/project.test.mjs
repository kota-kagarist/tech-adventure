import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
const source = (path) => readFile(new URL(`../${path}`, import.meta.url), 'utf8');

test('brand and accessibility contracts exist', async () => {
  const [layout, header, css] = await Promise.all([source('src/layouts/BaseLayout.astro'), source('src/components/SiteHeader.astro'), source('src/styles/global.css')]);
  assert.match(layout, /<main id="main">/);
  assert.match(layout, /skip-link/);
  assert.match(header, /TECH ADVENTURE/);
  assert.match(css, /--space-/);
  assert.match(css, /prefers-reduced-motion/);
  assert.match(css, /:focus-visible/);
});

test('core pages explain role, comparison, and journeys', async () => {
  const [detail, compare, journeys] = await Promise.all([source('src/pages/technologies/[id].astro'), source('src/pages/compare/[left]/[right].astro'), source('src/pages/journeys/index.astro')]);
  assert.match(detail, /何者？/);
  assert.match(detail, /いつ使う？/);
  assert.match(detail, /いつ使わない？/);
  assert.match(compare, /単純な二者択一/);
  assert.match(journeys, /唯一の正解/);
});

test('Workers static assets configuration points at dist', async () => {
  const wrangler = await source('wrangler.jsonc');
  assert.match(wrangler, /"directory": "\.\/dist"/);
  assert.doesNotMatch(wrangler, /"main"/);
});
