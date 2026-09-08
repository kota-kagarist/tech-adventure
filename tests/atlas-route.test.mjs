import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
import { resolveAtlasRoute, serializeAtlasRoute } from '../src/lib/atlas-route.mjs';

const root = new URL('../', import.meta.url);
const source = (path) => readFile(new URL(path, root), 'utf8').catch(() => '');

const technologies = new Set(['alpha', 'beta', 'delta']);
const relations = [
  { source: 'alpha', target: 'beta', type: 'works-with', note: 'Alpha works with Beta.' },
  { source: 'delta', target: 'beta', type: 'built-on', note: 'Delta is a foundation for Beta.' },
  { source: 'alpha', target: 'delta', type: 'alternative-to', note: 'Alternative path.' },
];

test('Atlas route state preserves Pathfinder node order, exact relations, and direction', () => {
  const route = resolveAtlasRoute(
    'alpha,beta,delta',
    'alpha:works-with:beta,delta:built-on:beta',
    technologies,
    relations,
  );

  assert.ok(route);
  assert.deepEqual(route.nodeIds, ['alpha', 'beta', 'delta']);
  assert.equal(route.hopCount, 2);
  assert.deepEqual(route.steps.map((step) => step.direction), ['outgoing', 'incoming']);
  assert.deepEqual(route.steps.map((step) => step.relation.type), ['works-with', 'built-on']);
});

test('Atlas route state rejects unknown, duplicate, incomplete, and non-continuous routes safely', () => {
  assert.equal(resolveAtlasRoute('alpha,missing', 'alpha:works-with:beta', technologies, relations), null);
  assert.equal(resolveAtlasRoute('alpha,beta,alpha', 'alpha:works-with:beta,alpha:works-with:beta', technologies, relations), null);
  assert.equal(resolveAtlasRoute('alpha,beta,delta', 'alpha:works-with:beta', technologies, relations), null);
  assert.equal(resolveAtlasRoute('alpha,beta,delta', 'alpha:alternative-to:delta,delta:built-on:beta', technologies, relations), null);
});

test('Pathfinder routes serialize into stable Atlas query values', () => {
  const serialized = serializeAtlasRoute({
    nodeIds: ['alpha', 'beta', 'delta'],
    steps: [
      { relation: relations[0] },
      { relation: relations[1] },
    ],
  });

  assert.deepEqual(serialized, {
    route: 'alpha,beta,delta',
    edges: 'alpha:works-with:beta,delta:built-on:beta',
  });
});

test('Pathfinder and Atlas expose route projection controls and mobile text fallback hooks', async () => {
  const [pathfinder, pathfinderCss, landscape, routeCss] = await Promise.all([
    source('src/pages/pathfinder.astro'),
    source('src/styles/pathfinder.css'),
    source('src/pages/landscape.astro'),
    source('src/styles/atlas-route.css'),
  ]);

  assert.match(pathfinder, /serializeAtlasRoute/);
  assert.match(pathfinder, /Atlasで見る/);
  assert.match(pathfinder, /edges/);
  assert.match(pathfinderCss, /\.pathfinder-atlas-link/);
  assert.match(landscape, /resolveAtlasRoute/);
  assert.match(landscape, /data-atlas-route-summary/);
  assert.match(landscape, /data-atlas-route-clear/);
  assert.match(landscape, /dataAtlasRoute/);
  assert.match(routeCss, /data-atlas-route="true"/);
  assert.match(routeCss, /data-atlas-route-line="true"/);
  assert.match(routeCss, /@media\s*\(max-width:\s*760px\)[\s\S]*?atlas-route-summary/);
});
