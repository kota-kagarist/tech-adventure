import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const root = new URL('../', import.meta.url);

async function source(path) {
  return readFile(new URL(path, root), 'utf8');
}

test('landscape page is build-time local and composes atlas components', async () => {
  const page = await source('src/pages/landscape.astro');

  assert.match(page, /TechnologyAtlas/);
  assert.match(page, /RelationshipInspector/);
  assert.match(page, /getTechnologies\(\)/);
  assert.match(page, /getRelations\(\)/);
  assert.match(page, /withBase\('\/technologies'\)/);
  assert.match(page, /focus/);
  assert.doesNotMatch(page, /fetch\(/);
});

test('atlas nodes separate focus controls from detail navigation', async () => {
  const atlas = await source('src/components/TechnologyAtlas.astro');

  assert.match(atlas, /data-atlas-focus/);
  assert.match(atlas, /data-atlas-detail/);
  assert.match(atlas, /TechnologyIcon/);
  assert.match(atlas, /data-atlas-lines/);
});

test('relationship inspector exposes readable text-first relationship UI', async () => {
  const inspector = await source('src/components/RelationshipInspector.astro');

  assert.match(inspector, /data-atlas-inspector/);
  assert.match(inspector, /関係を見る/);
  assert.match(inspector, /competes-with/);
  assert.match(inspector, /works-with/);
  assert.match(inspector, /built-on/);
  assert.match(inspector, /runs-on/);
});
