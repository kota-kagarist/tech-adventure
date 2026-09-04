import assert from 'node:assert/strict';
import test from 'node:test';
import { categoryIds } from '../src/data/schema.ts';
import { landscapeRegions, regionByCategory } from '../src/data/landscape.ts';
import { buildAdjacency, filterAtlasTechnologies, getFocusState } from '../src/lib/landscape.mjs';

test('all 22 categories map to exactly one of six atlas regions', () => {
  assert.equal(landscapeRegions.length, 6);
  assert.equal(new Set(landscapeRegions.map((region) => region.id)).size, 6);

  const mapped = landscapeRegions.flatMap((region) => region.categories);
  assert.deepEqual([...mapped].sort(), [...categoryIds].sort());
  assert.equal(new Set(mapped).size, categoryIds.length);

  for (const category of categoryIds) {
    assert.ok(regionByCategory[category], `${category} must map to an atlas region`);
  }
});

test('atlas filters normalized text, ecosystem, and importance', () => {
  const records = [
    {
      id: 'astro',
      name: 'Astro',
      shortDescription: 'content site',
      role: 'framework',
      ecosystem: ['javascript'],
      importance: 'core',
      aliases: [],
      tags: ['islands'],
    },
    {
      id: 'django',
      name: 'Django',
      shortDescription: 'python web',
      role: 'framework',
      ecosystem: ['python'],
      importance: 'major',
      aliases: [],
      tags: [],
    },
  ];

  assert.deepEqual(
    filterAtlasTechnologies(records, { query: 'ISLANDS', ecosystem: '', importance: '' }).map((item) => item.id),
    ['astro'],
  );
  assert.deepEqual(
    filterAtlasTechnologies(records, { query: '', ecosystem: 'python', importance: '' }).map((item) => item.id),
    ['django'],
  );
  assert.deepEqual(
    filterAtlasTechnologies(records, { query: '', ecosystem: '', importance: 'core' }).map((item) => item.id),
    ['astro'],
  );
});

test('focus state highlights direct incoming and outgoing relations only', () => {
  const adjacency = buildAdjacency([
    { source: 'nextjs', target: 'react', type: 'built-on', note: 'x' },
    { source: 'react', target: 'tanstack-query', type: 'works-with', note: 'y' },
    { source: 'django', target: 'python', type: 'built-on', note: 'z' },
  ]);

  const state = getFocusState(
    'react',
    new Set(['nextjs', 'react', 'tanstack-query', 'django']),
    adjacency,
  );

  assert.equal(state.focusId, 'react');
  assert.deepEqual([...state.relatedIds].sort(), ['nextjs', 'tanstack-query']);
  assert.deepEqual([...state.dimmedIds].sort(), ['django']);
});

test('unknown or filtered focus degrades to no active focus', () => {
  const adjacency = buildAdjacency([
    { source: 'nextjs', target: 'react', type: 'built-on', note: 'x' },
  ]);

  const state = getFocusState('missing', new Set(['react', 'nextjs']), adjacency);
  assert.equal(state.focusId, null);
  assert.equal(state.relatedIds.size, 0);
  assert.equal(state.dimmedIds.size, 0);
});
