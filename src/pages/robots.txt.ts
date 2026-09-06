import type { APIRoute } from 'astro';
import { projectAssetUrl } from '../lib/site-urls.mjs';

export const prerender = true;

export const GET: APIRoute = ({ site }) => {
  const resolvedSite = site ?? new URL('https://kota-kagarist.github.io');
  const sitemap = projectAssetUrl(resolvedSite, import.meta.env.BASE_URL, 'sitemap.xml').href;
  const body = `User-agent: *\nAllow: /\nSitemap: ${sitemap}\n`;

  return new Response(body, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
};
