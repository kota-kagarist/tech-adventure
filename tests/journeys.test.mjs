import assert from 'node:assert/strict';
import { readdir, readFile } from 'node:fs/promises';
import test from 'node:test';
import * as journeyModule from '../src/data/journeys.ts';

const { featuredJourneys, journeys } = journeyModule;

const expectedJourneyIds = [
  'api',
  'blog',
  'corporate-site',
  'documentation',
  'dotnet-business-app',
  'headless-content',
  'java-enterprise',
  'python-api',
  'realtime-app',
  'self-hosted-cms',
  'small-saas',
  'vue-saas'
];

async function technologyIds() {
  const directory = new URL('../src/data/technologies/', import.meta.url);
  const names = (await readdir(directory)).filter((name) => name.endsWith('.json'));
  const technologies = await Promise.all(names.map(async (name) => JSON.parse(await readFile(new URL(name, directory), 'utf8'))));
  return new Set(technologies.map(({ id }) => id));
}

test('journeys cover twelve representative modern web outcomes', () => {
  assert.deepEqual(journeys.map(({ id }) => id).sort(), expectedJourneyIds);
  assert.equal(new Set(journeys.map(({ id }) => id)).size, journeys.length);
});

test('each journey provides a valid route, reasons, trade-offs, and alternatives', async () => {
  const knownIds = await technologyIds();

  for (const journey of journeys) {
    assert.match(journey.id, /^[a-z0-9]+(?:-[a-z0-9]+)*$/);
    assert.ok(journey.title.trim().length >= 4, `${journey.id} title is too short`);
    assert.ok(journey.summary.trim().length >= 20, `${journey.id} summary is too short`);
    assert.ok(Array.isArray(journey.technologyIds), `${journey.id}.technologyIds must be an array`);
    assert.ok(Array.isArray(journey.reasoning), `${journey.id}.reasoning must be an array`);
    assert.ok(Array.isArray(journey.tradeoffs), `${journey.id}.tradeoffs must be an array`);
    assert.ok(Array.isArray(journey.alternatives), `${journey.id}.alternatives must be an array`);
    assert.ok(journey.technologyIds.length >= 3, `${journey.id} needs at least three technologies`);
    assert.equal(new Set(journey.technologyIds).size, journey.technologyIds.length, `${journey.id} repeats a technology`);
    assert.ok(journey.reasoning.length >= 3, `${journey.id} needs at least three reasons`);
    assert.ok(journey.tradeoffs.length >= 2, `${journey.id} needs at least two trade-offs`);
    assert.ok(journey.alternatives.length >= 2, `${journey.id} needs at least two alternatives`);

    for (const id of journey.technologyIds) {
      assert.ok(knownIds.has(id), `${journey.id} references unknown technology: ${id}`);
    }
    for (const field of ['reasoning', 'tradeoffs', 'alternatives']) {
      assert.ok(journey[field].every((item) => typeof item === 'string' && item.trim().length >= 12), `${journey.id}.${field} contains a weak explanation`);
    }
  }
});

test('named ecosystem journeys contain their defining technologies', () => {
  const expectedTechnologies = {
    'small-saas': ['react', 'nextjs', 'postgresql'],
    'vue-saas': ['vue', 'nuxt'],
    'python-api': ['python', 'fastapi'],
    'java-enterprise': ['java', 'spring-boot'],
    'dotnet-business-app': ['csharp', 'aspnet-core'],
    'self-hosted-cms': ['wordpress', 'mysql', 'nginx']
  };

  for (const [journeyId, technologyIds] of Object.entries(expectedTechnologies)) {
    const route = journeys.find(({ id }) => id === journeyId);
    assert.ok(route, `missing journey: ${journeyId}`);
    for (const technologyId of technologyIds) assert.ok(route.technologyIds.includes(technologyId), `${journeyId} must include ${technologyId}`);
  }
});

test('home page features four distinct journeys from the full catalog', () => {
  assert.ok(Array.isArray(featuredJourneys), 'featuredJourneys must be exported');
  assert.equal(featuredJourneys.length, 4);
  assert.equal(new Set(featuredJourneys.map(({ id }) => id)).size, 4);
  assert.ok(featuredJourneys.every((featured) => journeys.includes(featured)));
});

test('journey screens present outcomes as routes and stops', async () => {
  const [list, detail] = await Promise.all([
    readFile(new URL('../src/pages/journeys/index.astro', import.meta.url), 'utf8'),
    readFile(new URL('../src/pages/journeys/[id].astro', import.meta.url), 'utf8'),
  ]);
  assert.match(list, /journey-route-mark/);
  assert.match(list, /TechnologyIcon/);
  assert.match(list, /journey-row-icons/);
  assert.match(detail, /journey-rail/);
  assert.match(detail, /journey-step-index/);
  assert.match(detail, /TechnologyIcon/);
  assert.match(detail, /WHY THIS ROUTE\?/);
  assert.match(detail, /TRADE-OFFS/);
  assert.match(detail, /ALTERNATIVES/);
});
