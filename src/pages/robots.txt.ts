import type { APIRoute } from 'astro';

export const prerender = true;

export const GET: APIRoute = ({ site }) => {
  const projectRoot = new URL(import.meta.env.BASE_URL, site ?? new URL('https://kota-kagarist.github.io'));
  const sitemap = new URL('sitemap.xml', projectRoot).href;
  const body = `User-agent: *\nAllow: /\nSitemap: ${sitemap}\n`;

  return new Response(body, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
};
