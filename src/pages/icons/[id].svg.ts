import type { APIRoute, GetStaticPaths } from 'astro';
import { getTechnologies } from '../../data/load';
import { renderTechnologyIconSvg, resolveTechnologyIcon } from '../../lib/technology-icons.mjs';

export const getStaticPaths: GetStaticPaths = async () => getTechnologies()
  .map((technology) => ({ technology, icon: resolveTechnologyIcon(technology) }))
  .filter(({ icon }) => icon.kind === 'brand')
  .map(({ technology, icon }) => ({
    params: { id: technology.id },
    props: { svg: renderTechnologyIconSvg(icon) },
  }));

export const GET: APIRoute = ({ props }) => new Response(props.svg, {
  headers: {
    'Cache-Control': 'public, max-age=31536000, immutable',
    'Content-Type': 'image/svg+xml; charset=utf-8',
  },
});
