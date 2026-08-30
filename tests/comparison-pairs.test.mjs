import assert from 'node:assert/strict';
import { readFile, readdir } from 'node:fs/promises';
import test from 'node:test';

async function loadSubject() {
  try {
    return await import('../src/lib/comparison-pairs.mjs');
  } catch (error) {
    assert.fail(`comparison pair builder is unavailable: ${error.message}`);
  }
}

test('comparison pairs include alternatives and competitors once in canonical order', async () => {
  const { buildComparisonPairIds } = await loadSubject();
  const technologies = [
    { id: 'astro' },
    { id: 'hono' },
    { id: 'nextjs' },
    { id: 'react' }
  ];
  const relations = [
    { source: 'nextjs', target: 'astro', type: 'competes-with' },
    { source: 'astro', target: 'nextjs', type: 'alternative-to' },
    { source: 'hono', target: 'react', type: 'works-with' },
    { source: 'missing', target: 'astro', type: 'competes-with' }
  ];
  const featuredPairs = [
    ['hono', 'astro'],
    ['react', 'nextjs'],
    ['missing', 'astro'],
    ['astro', 'astro']
  ];

  assert.deepEqual(buildComparisonPairIds(technologies, relations, featuredPairs), [
    ['astro', 'hono'],
    ['astro', 'nextjs'],
    ['nextjs', 'react']
  ]);
});

test('comparison paths are stable regardless of the selected side', async () => {
  const { comparisonPath } = await loadSubject();

  assert.equal(comparisonPath('nextjs', 'astro'), '/compare/astro/nextjs');
  assert.equal(comparisonPath('astro', 'nextjs'), '/compare/astro/nextjs');
});

test('explicit competitors and alternatives remain comparable across categories', async () => {
  const { hasComparisonRelation } = await loadSubject();
  assert.equal(typeof hasComparisonRelation, 'function');
  const relations = [
    { source: 'redis', target: 'cloudflare-kv', type: 'alternative-to' },
    { source: 'astro', target: 'hono', type: 'works-with' }
  ];

  assert.equal(hasComparisonRelation('cloudflare-kv', 'redis', relations), true);
  assert.equal(hasComparisonRelation('astro', 'hono', relations), false);
});

test('catalog comparison pairs cover every explicit competitor and alternative', async () => {
  const { buildComparisonPairIds, featuredComparisonPairs } = await loadSubject();
  const technologyDirectory = new URL('../src/data/technologies/', import.meta.url);
  const filenames = (await readdir(technologyDirectory)).filter((filename) => filename.endsWith('.json'));
  const technologies = await Promise.all(filenames.map(async (filename) => JSON.parse(await readFile(new URL(filename, technologyDirectory), 'utf8'))));
  const relations = JSON.parse(await readFile(new URL('../src/data/relations.json', import.meta.url), 'utf8'));
  const pairs = buildComparisonPairIds(technologies, relations);
  const pairKeys = new Set(pairs.map(([left, right]) => `${left}/${right}`));

  assert.equal(pairKeys.size, pairs.length, 'comparison routes must not be duplicated');
  assert.ok(pairs.every(([left, right]) => left < right), 'comparison routes must use canonical id order');

  for (const relation of relations.filter(({ type }) => type === 'competes-with' || type === 'alternative-to')) {
    const key = [relation.source, relation.target].sort().join('/');
    assert.ok(pairKeys.has(key), `missing comparison route for ${key}`);
  }

  for (const pair of featuredComparisonPairs) {
    assert.ok(pairKeys.has([...pair].sort().join('/')), `missing featured comparison route for ${pair.join('/')}`);
  }
});
