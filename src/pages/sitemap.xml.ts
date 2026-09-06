import type { APIRoute } from 'astro';
import { getRelations, getTechnologies } from '../data/load';
import { journeys } from '../data/journeys';
import { buildComparisonPairIds } from '../lib/comparison-pairs.mjs';

export const prerender = true;

function escapeXml(value: string) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&apos;');
}

export const GET: APIRoute = ({ site }) => {
  const technologies = getTechnologies();
  const relations = getRelations();
  const projectRoot = new URL(import.meta.env.BASE_URL, site ?? new URL('https://kota-kagarist.github.io'));
  const absolute = (path = '') => new URL(path.replace(/^\/+/, ''), projectRoot).href;

  const entries = [
    { path: '' },
    { path: 'landscape' },
    { path: 'technologies' },
    { path: 'journeys' },
    { path: 'pathfinder' },
    ...technologies.map((technology) => ({
      path: `technologies/${technology.id}`,
      lastmod: technology.lastVerified,
    })),
    ...journeys.map((journey) => ({ path: `journeys/${journey.id}` })),
    ...buildComparisonPairIds(technologies, relations).map(([left, right]) => ({
      path: `compare/${left}/${right}`,
    })),
  ];

  const body = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...entries.map(({ path, lastmod }) => [
      '  <url>',
      `    <loc>${escapeXml(absolute(path))}</loc>`,
      ...(lastmod ? [`    <lastmod>${escapeXml(lastmod)}</lastmod>`] : []),
      '  </url>',
    ].join('\n')),
    '</urlset>',
    '',
  ].join('\n');

  return new Response(body, {
    headers: { 'Content-Type': 'application/xml; charset=utf-8' },
  });
};
