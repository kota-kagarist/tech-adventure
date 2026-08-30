import assert from 'node:assert/strict';
import { readdir, readFile } from 'node:fs/promises';
import test from 'node:test';

async function loadIconModule() {
  try {
    return await import('../src/lib/technology-icons.mjs');
  } catch {
    return {};
  }
}

async function technologies() {
  const directory = new URL('../src/data/technologies/', import.meta.url);
  const filenames = (await readdir(directory)).filter((name) => name.endsWith('.json'));
  return Promise.all(filenames.map(async (filename) => JSON.parse(await readFile(new URL(filename, directory), 'utf8'))));
}

const iconModule = await loadIconModule();

test('representative technologies resolve to their official brand icons', () => {
  assert.equal(typeof iconModule.resolveTechnologyIcon, 'function', 'technology icon resolver must exist');

  const expectedSlugs = {
    astro: 'astro',
    react: 'react',
    nextjs: 'nextdotjs',
    typescript: 'typescript',
    'cloudflare-workers': 'cloudflareworkers',
    docker: 'docker',
  };

  for (const [id, expectedSlug] of Object.entries(expectedSlugs)) {
    const icon = iconModule.resolveTechnologyIcon({ id, name: id, category: 'runtime' });
    assert.equal(icon.kind, 'brand', `${id} must use a brand icon`);
    assert.equal(icon.slug, expectedSlug);
    assert.match(icon.path, /^[Mm][0-9A-Za-z.,\s-]+$/);
    assert.match(icon.hex, /^[0-9A-F]{6}$/);
  }
});

test('concepts without a brand icon receive a deterministic category fallback', () => {
  assert.equal(typeof iconModule.resolveTechnologyIcon, 'function', 'technology icon resolver must exist');

  const icon = iconModule.resolveTechnologyIcon({ id: 'http', name: 'HTTP', category: 'protocol-api' });
  assert.deepEqual(icon, {
    kind: 'fallback',
    label: 'HT',
    hex: '8B5CF6',
  });
});

test('major brands missing from Simple Icons use official Devicon artwork', () => {
  const expectedIcons = {
    aws: 'amazonwebservices',
    azure: 'azure',
    csharp: 'csharp',
    html: 'html5',
    java: 'java',
    playwright: 'playwright',
    vue: 'vuejs',
  };

  for (const [id, expectedSlug] of Object.entries(expectedIcons)) {
    const icon = iconModule.resolveTechnologyIcon({ id, name: id === 'csharp' ? 'C#' : id, category: 'language' });
    assert.equal(icon.kind, 'brand', `${id} must use a brand icon`);
    assert.equal(icon.source, 'devicon');
    assert.equal(icon.slug, expectedSlug);
    assert.match(icon.svg, /^<svg[\s\S]+<\/svg>$/);
  }
});

test('branded products missing from the primary catalogs use curated brand artwork', () => {
  for (const id of ['authjs', 'elysia', 'parcel', 'rspack', 'turbopack', 'valibot']) {
    const icon = iconModule.resolveTechnologyIcon({ id, name: id, category: 'build-transform' });
    assert.equal(icon.kind, 'brand', `${id} must not use an acronym fallback`);
    assert.equal(icon.source, 'thesvg');
  }

  for (const id of ['emotion', 'kysely', 'nitro']) {
    const icon = iconModule.resolveTechnologyIcon({ id, name: id, category: 'server-framework' });
    assert.equal(icon.kind, 'brand', `${id} must use its project artwork`);
    assert.equal(icon.source, 'official');
  }
});

test('every catalog technology resolves to a visible icon or fallback', async () => {
  assert.equal(typeof iconModule.resolveTechnologyIcon, 'function', 'technology icon resolver must exist');

  for (const technology of await technologies()) {
    const icon = iconModule.resolveTechnologyIcon(technology);
    assert.ok(icon.kind === 'brand' || icon.kind === 'fallback', `${technology.id} has no icon`);
    assert.match(icon.hex, /^[0-9A-F]{6}$/, `${technology.id} has an invalid icon color`);
    if (icon.kind === 'brand') assert.ok(icon.path?.length > 8 || icon.svg?.length > 32, `${technology.id} has empty brand artwork`);
    if (icon.kind === 'fallback') assert.match(icon.label, /^[A-Z0-9.#/+]{1,2}$/, `${technology.id} has an invalid fallback label`);
  }
});
