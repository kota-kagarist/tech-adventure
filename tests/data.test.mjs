import assert from 'node:assert/strict';
import { readdir, readFile } from 'node:fs/promises';
import test from 'node:test';
import { ecosystemIds, requiredTechnologyIds, requiredTechnologyIdsByCategory } from './fixtures/required-technologies.mjs';

const techDir = new URL('../src/data/technologies/', import.meta.url);
const categoryIds = new Set(Object.keys(requiredTechnologyIdsByCategory));
const validEcosystemIds = new Set(ecosystemIds);
const relationTypes = new Set(['competes-with', 'works-with', 'runs-on', 'built-on', 'alternative-to', 'implements', 'part-of']);
const symmetricRelationTypes = new Set(['competes-with', 'works-with', 'alternative-to']);
const maturityValues = new Set(['emerging', 'established', 'mature']);
const importanceValues = new Set(['core', 'major']);

async function loadTechnologyEntries() {
  const names = (await readdir(techDir)).filter((name) => name.endsWith('.json')).sort();
  return Promise.all(names.map(async (fileName) => ({
    fileName,
    technology: JSON.parse(await readFile(new URL(fileName, techDir), 'utf8'))
  })));
}

async function loadRelations() {
  const [base, atlas] = await Promise.all([
    readFile(new URL('../src/data/relations.json', import.meta.url), 'utf8'),
    readFile(new URL('../src/data/relations-atlas.json', import.meta.url), 'utf8')
  ]);
  return [...JSON.parse(base), ...JSON.parse(atlas)];
}

test('catalog contains exactly the 186 required technology ids across 22 categories', async () => {
  const entries = await loadTechnologyEntries();
  const ids = entries.map(({ technology }) => technology.id).sort();
  assert.equal(entries.length, 186);
  assert.deepEqual(ids, [...requiredTechnologyIds].sort());
  assert.equal(categoryIds.size, 22);
});

test('technology records have unique ids, matching filenames, and complete decision fields', async () => {
  const entries = await loadTechnologyEntries();
  const ids = new Set();

  for (const { fileName, technology } of entries) {
    assert.match(technology.id, /^[a-z0-9]+(?:-[a-z0-9]+)*$/);
    assert.equal(fileName, `${technology.id}.json`, `${fileName} must match technology id`);
    assert.equal(ids.has(technology.id), false, `duplicate id: ${technology.id}`);
    ids.add(technology.id);

    for (const field of ['name', 'shortDescription', 'whatItDoes', 'role']) {
      assert.equal(typeof technology[field], 'string', `${technology.id}.${field} must be a string`);
      const minimumLength = field === 'name' ? 2 : 4;
      assert.ok(technology[field].trim().length >= minimumLength, `${technology.id}.${field} is too short`);
    }

    assert.ok(categoryIds.has(technology.category), `unknown category: ${technology.category}`);
    assert.ok(maturityValues.has(technology.maturity), `invalid maturity: ${technology.id}`);
    assert.ok(importanceValues.has(technology.importance), `invalid importance: ${technology.id}`);

    for (const field of ['whenToUse', 'whenNotToUse', 'ecosystem', 'tags']) {
      assert.ok(Array.isArray(technology[field]), `${technology.id}.${field} must be an array`);
      assert.ok(technology[field].length > 0, `${technology.id}.${field} must not be empty`);
      assert.equal(technology[field].every((item) => typeof item === 'string' && item.trim().length > 0), true);
    }
    assert.ok(Array.isArray(technology.aliases), `${technology.id}.aliases must be an array`);
    assert.equal(technology.aliases.every((alias) => typeof alias === 'string' && alias.trim().length > 0), true);
    assert.equal(new Set(technology.ecosystem).size, technology.ecosystem.length, `${technology.id} has duplicate ecosystems`);
    for (const ecosystem of technology.ecosystem) {
      assert.ok(validEcosystemIds.has(ecosystem), `${technology.id} has unknown ecosystem: ${ecosystem}`);
    }
  }
});

test('official URLs and verification dates are valid and auditable', async () => {
  const entries = await loadTechnologyEntries();
  const today = new Date();
  today.setUTCHours(23, 59, 59, 999);

  for (const { technology } of entries) {
    const url = new URL(technology.officialUrl);
    assert.equal(url.protocol, 'https:', `${technology.id} officialUrl must use HTTPS`);
    assert.ok(url.hostname.includes('.'), `${technology.id} officialUrl must have a public hostname`);

    assert.match(technology.lastVerified, /^\d{4}-\d{2}-\d{2}$/);
    const verified = new Date(`${technology.lastVerified}T00:00:00.000Z`);
    assert.equal(Number.isNaN(verified.getTime()), false, `${technology.id} has an invalid verification date`);
    assert.equal(verified.toISOString().slice(0, 10), technology.lastVerified, `${technology.id} has a non-existent date`);
    assert.ok(verified <= today, `${technology.id} lastVerified is in the future`);
  }
});

test('relations are meaningful, unique, and connect all technology records', async () => {
  const entries = await loadTechnologyEntries();
  const technologies = entries.map(({ technology }) => technology);
  const byId = new Map(technologies.map((technology) => [technology.id, technology]));
  const relations = await loadRelations();
  const seen = new Set();
  const degree = new Map(technologies.map((technology) => [technology.id, 0]));

  assert.ok(relations.length >= 320, `expected at least 320 relations, got ${relations.length}`);

  for (const relation of relations) {
    assert.ok(relationTypes.has(relation.type), `unknown relation type: ${relation.type}`);
    assert.ok(byId.has(relation.source), `unknown source: ${relation.source}`);
    assert.ok(byId.has(relation.target), `unknown target: ${relation.target}`);
    assert.notEqual(relation.source, relation.target);
    assert.ok(relation.note.trim().length >= 12, `relation note is too short: ${relation.source}/${relation.target}`);

    const endpoints = symmetricRelationTypes.has(relation.type)
      ? [relation.source, relation.target].sort().join('::')
      : `${relation.source}->${relation.target}`;
    const key = `${relation.type}:${endpoints}`;
    assert.equal(seen.has(key), false, `duplicate relation: ${key}`);
    seen.add(key);

    if (relation.type === 'competes-with') {
      assert.equal(byId.get(relation.source).category, byId.get(relation.target).category, `cross-category competition: ${key}`);
    }

    degree.set(relation.source, degree.get(relation.source) + 1);
    degree.set(relation.target, degree.get(relation.target) + 1);
  }

  for (const technology of technologies) {
    assert.ok(degree.get(technology.id) >= 1, `isolated technology: ${technology.id}`);
    if (technology.importance === 'core') {
      assert.ok(degree.get(technology.id) >= 3, `core technology has fewer than 3 relations: ${technology.id}`);
    }
  }
});

test('Astro and Hono are not incorrectly modeled as competitors', async () => {
  const relations = await loadRelations();
  assert.equal(relations.some((relation) => relation.type === 'competes-with' && [relation.source, relation.target].includes('astro') && [relation.source, relation.target].includes('hono')), false);
});

test('complementary infrastructure, observability, and testing tools are not alternatives', async () => {
  const relations = await loadRelations();
  const complementaryPairs = [
    ['docker', 'kubernetes'],
    ['opentelemetry', 'prometheus'],
    ['prometheus', 'grafana'],
    ['testing-library', 'storybook'],
    ['storybook', 'msw']
  ];

  for (const pair of complementaryPairs) {
    assert.equal(relations.some((relation) => relation.type === 'alternative-to'
      && pair.includes(relation.source) && pair.includes(relation.target)), false, `${pair.join('/')} must be modeled as complementary`);
  }
});

test('part-of and protocol foundation relations point in the semantic direction', async () => {
  const relations = await loadRelations();
  assert.ok(relations.some((relation) => relation.source === 'firestore' && relation.target === 'firebase' && relation.type === 'part-of'));
  assert.ok(relations.some((relation) => relation.source === 'rest' && relation.target === 'http' && relation.type === 'built-on'));
  assert.ok(relations.some((relation) => relation.source === 'server-sent-events' && relation.target === 'http' && relation.type === 'built-on'));
  assert.ok(relations.some((relation) => relation.source === 'msw' && relation.target === 'http' && relation.type === 'works-with'));
});

test('atlas additions connect to existing web platform and library layers with evidenced directions', async () => {
  const relations = await loadRelations();
  assert.ok(relations.some((relation) => relation.source === 'web-components' && relation.target === 'html' && relation.type === 'built-on'));
  assert.ok(relations.some((relation) => relation.source === 'service-worker' && relation.target === 'browser' && relation.type === 'runs-on'));
  assert.ok(relations.some((relation) => relation.source === 'web-app-manifest' && relation.target === 'service-worker' && relation.type === 'works-with'));
  assert.ok(relations.some((relation) => relation.source === 'trpc' && relation.target === 'typescript' && relation.type === 'built-on'));
  assert.ok(relations.some((relation) => relation.source === 'tanstack-router' && relation.target === 'react' && relation.type === 'works-with'));
  assert.ok(relations.some((relation) => relation.source === 'solidstart' && relation.target === 'solid' && relation.type === 'built-on'));
  assert.ok(relations.some((relation) => relation.source === 'tsdown' && relation.target === 'rolldown' && relation.type === 'built-on'));
});