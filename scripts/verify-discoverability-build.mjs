import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import config from '../astro.config.mjs';
import { projectRootUrl } from '../src/lib/site-urls.mjs';

const output = new URL('../dist/', import.meta.url);
const siteRoot = projectRootUrl(config.site, config.base);
const sitemap = await readFile(new URL('sitemap.xml', output), 'utf8');
const locations = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]);

assert.ok(locations.length > 0, 'sitemap must contain pages');
assert.equal(new Set(locations).size, locations.length, 'sitemap must not contain duplicate URLs');
for (const relative of ['', 'technologies/react/', 'compare/astro/hono/', 'journeys/', 'pathfinder/']) {
  assert.ok(locations.includes(new URL(relative, siteRoot).href), `missing representative page: ${relative}`);
}

for (const location of locations) {
  const url = new URL(location);
  assert.equal(url.origin, siteRoot.origin, `unexpected origin: ${location}`);
  assert.ok(url.pathname.startsWith(siteRoot.pathname), `URL is outside the project: ${location}`);
  assert.ok(url.pathname.endsWith('/'), `page URL must match the hosted directory: ${location}`);
  assert.equal(url.search + url.hash, '', `page URL must not contain a query or fragment: ${location}`);

  const relativePath = url.pathname.slice(siteRoot.pathname.length);
  const html = await readFile(new URL(join(relativePath, 'index.html'), output), 'utf8');
  const canonicalTag = html.match(/<link\b[^>]*\brel="canonical"[^>]*>/)?.[0];
  const ogUrlTag = html.match(/<meta\b[^>]*\bproperty="og:url"[^>]*>/)?.[0];
  assert.equal(canonicalTag?.match(/\bhref="([^"]+)"/)?.[1], location, `canonical does not match sitemap: ${location}`);
  assert.equal(ogUrlTag?.match(/\bcontent="([^"]+)"/)?.[1], location, `og:url does not match sitemap: ${location}`);

  for (const match of html.matchAll(/<a\b[^>]*\bhref="([^"]+)"/g)) {
    const href = match[1];
    if (!href.startsWith(siteRoot.pathname)) continue;
    const internal = new URL(href, siteRoot);
    const lastSegment = internal.pathname.split('/').at(-1);
    if (lastSegment && !lastSegment.includes('.')) {
      assert.fail(`internal page link does not match hosted directory: ${href} in ${location}`);
    }
  }
}

console.log(`Verified canonical, Open Graph URL and internal links for ${locations.length} sitemap pages.`);
