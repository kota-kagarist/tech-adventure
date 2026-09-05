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
  assert.match(page, /technologies\.length/);
  assert.match(page, /is:inline/);
  assert.match(page, /landscape-tokens\.css/);
  assert.doesNotMatch(page, /<main\b/);
  assert.doesNotMatch(page, /179個/);
  assert.doesNotMatch(page, /fetch\(/);
});

test('atlas nodes keep interaction hooks and expose region identity', async () => {
  const atlas = await source('src/components/TechnologyAtlas.astro');

  assert.match(atlas, /data-atlas-focus/);
  assert.match(atlas, /data-atlas-detail/);
  assert.match(atlas, /TechnologyIcon/);
  assert.match(atlas, /data-atlas-lines/);
  assert.match(atlas, /data-atlas-region=\{region\.id\}/);
  assert.match(atlas, /id="atlas-map"/);
});

test('relationship inspector stays text-first and can return to the map on small screens', async () => {
  const inspector = await source('src/components/RelationshipInspector.astro');

  assert.match(inspector, /data-atlas-inspector/);
  assert.match(inspector, /関係を見る/);
  assert.match(inspector, /data-atlas-no-relations/);
  assert.match(inspector, /直接関係は未登録/);
  assert.match(inspector, /competes-with/);
  assert.match(inspector, /works-with/);
  assert.match(inspector, /built-on/);
  assert.match(inspector, /runs-on/);
  assert.match(inspector, /atlas-back-to-map/);
  assert.match(inspector, /href="#atlas-map"/);
});
