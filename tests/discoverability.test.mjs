import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const root = new URL('../', import.meta.url);
const source = (path) => readFile(new URL(path, root), 'utf8').catch(() => '');

test('base layout exposes canonical, social, author, and structured metadata', async () => {
  const layout = await source('src/layouts/BaseLayout.astro');

  assert.match(layout, /rel="canonical"/);
  assert.match(layout, /property="og:title"/);
  assert.match(layout, /property="og:description"/);
  assert.match(layout, /property="og:url"/);
  assert.match(layout, /property="og:image"/);
  assert.match(layout, /name="twitter:card"/);
  assert.match(layout, /summary_large_image/);
  assert.match(layout, /name="author"/);
  assert.match(layout, /Kota Tsuda/);
  assert.match(layout, /kagarist/);
  assert.match(layout, /application\/ld\+json/);
  assert.match(layout, /WebSite/);
  assert.match(layout, /Person/);
});

test('project URLs preserve the GitHub Pages base path and canonical root', async () => {
  const { canonicalPageUrl, projectRootUrl, projectAssetUrl } = await import('../src/lib/site-urls.mjs');
  const site = new URL('https://kota-kagarist.github.io');

  assert.equal(
    projectRootUrl(site, '/tech-adventure').href,
    'https://kota-kagarist.github.io/tech-adventure/',
  );
  assert.equal(
    projectAssetUrl(site, '/tech-adventure', 'social-preview.png').href,
    'https://kota-kagarist.github.io/tech-adventure/social-preview.png',
  );
  assert.equal(
    projectAssetUrl(site, '/tech-adventure/', 'sitemap.xml').href,
    'https://kota-kagarist.github.io/tech-adventure/sitemap.xml',
  );
  assert.equal(
    canonicalPageUrl(site, '/tech-adventure', '/tech-adventure').href,
    'https://kota-kagarist.github.io/tech-adventure/',
  );
  assert.equal(
    canonicalPageUrl(site, '/tech-adventure', '/tech-adventure/technologies/react').href,
    'https://kota-kagarist.github.io/tech-adventure/technologies/react',
  );
});

test('search crawlers receive sitemap and robots endpoints without a new dependency', async () => {
  const [sitemap, robots, packageJson] = await Promise.all([
    source('src/pages/sitemap.xml.ts'),
    source('src/pages/robots.txt.ts'),
    source('package.json'),
  ]);

  assert.match(sitemap, /getTechnologies/);
  assert.match(sitemap, /buildComparisonPairIds/);
  assert.match(sitemap, /journeys/);
  assert.match(sitemap, /application\/xml/);
  assert.match(robots, /User-agent:/);
  assert.match(robots, /Sitemap:/);
  assert.doesNotMatch(packageJson, /@astrojs\/sitemap/);
});

test('public identity is visible but restrained in the footer and README', async () => {
  const [footer, readme] = await Promise.all([
    source('src/components/SiteFooter.astro'),
    source('README.md'),
  ]);

  assert.match(footer, /kagarist/);
  assert.match(footer, /Kota Tsuda/);
  assert.match(readme, /kagarist/);
  assert.match(readme, /Kota Tsuda/);
  assert.match(readme, /kota-kagarist\.github\.io\/tech-adventure/);
});
