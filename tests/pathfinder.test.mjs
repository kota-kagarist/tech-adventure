import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const root = new URL('../', import.meta.url);
const source = (path) => readFile(new URL(path, root), 'utf8').catch(() => '');

const syntheticRelations = [
  { source: 'alpha', target: 'beta', type: 'works-with', note: 'Alpha works with Beta.' },
  { source: 'beta', target: 'delta', type: 'built-on', note: 'Beta is built on Delta.' },
  { source: 'alpha', target: 'charlie', type: 'works-with', note: 'Alpha works with Charlie.' },
  { source: 'charlie', target: 'delta', type: 'runs-on', note: 'Charlie runs on Delta.' },
  { source: 'beta', target: 'echo', type: 'works-with', note: 'Beta works with Echo.' },
  { source: 'echo', target: 'delta', type: 'works-with', note: 'Echo works with Delta.' },
];

test('pathfinder returns deterministic equal-hop shortest routes only', async () => {
  const { findShortestPaths } = await import('../src/lib/pathfinder.mjs');
  const routes = findShortestPaths('alpha', 'delta', syntheticRelations, { limit: 3 });

  assert.equal(routes.length, 2);
  assert.deepEqual(routes.map((route) => route.nodeIds), [
    ['alpha', 'beta', 'delta'],
    ['alpha', 'charlie', 'delta'],
  ]);
  assert.deepEqual(routes.map((route) => route.hopCount), [2, 2]);
});

test('pathfinder handles same-node, unknown-node, and disconnected inputs safely', async () => {
  const { findShortestPaths } = await import('../src/lib/pathfinder.mjs');

  assert.deepEqual(findShortestPaths('alpha', 'alpha', syntheticRelations), [
    { nodeIds: ['alpha'], steps: [], hopCount: 0 },
  ]);
  assert.deepEqual(findShortestPaths('missing', 'delta', syntheticRelations), []);
  assert.deepEqual(findShortestPaths('alpha', 'missing', syntheticRelations), []);
  assert.deepEqual(findShortestPaths('alpha', 'isolated', [
    ...syntheticRelations,
    { source: 'isolated', target: 'zulu', type: 'works-with', note: 'Separate component.' },
  ]), []);
});

test('pathfinder preserves actual relation direction in every step', async () => {
  const { findShortestPaths, describePathStep } = await import('../src/lib/pathfinder.mjs');
  const [route] = findShortestPaths('delta', 'alpha', syntheticRelations, { limit: 1 });

  assert.deepEqual(route.nodeIds, ['delta', 'beta', 'alpha']);
  assert.equal(route.steps[0].direction, 'incoming');
  assert.equal(route.steps[1].direction, 'incoming');
  assert.equal(describePathStep(route.steps[0]), '土台になる');
  assert.equal(describePathStep(route.steps[1]), '併用');
});

test('pathfinder page exposes shareable from/to controls and relation route results', async () => {
  const page = await source('src/pages/pathfinder.astro');
  const css = await source('src/styles/pathfinder.css');
  const home = await source('src/pages/index.astro');
  const atlas = await source('src/pages/landscape.astro');
  const detail = await source('src/pages/technologies/[id].astro');

  assert.match(page, /TECHNOLOGY PATHFINDER/);
  assert.match(page, /data-pathfinder-from/);
  assert.match(page, /data-pathfinder-to/);
  assert.match(page, /data-pathfinder-results/);
  assert.match(page, /findShortestPaths/);
  assert.match(page, /URLSearchParams/);
  assert.match(css, /\.pathfinder-route/);
  assert.match(css, /@media\s*\(max-width:\s*760px\)/);
  assert.match(home, /\/pathfinder/);
  assert.match(atlas, /\/pathfinder/);
  assert.match(detail, /\/pathfinder\?from=/);
});
