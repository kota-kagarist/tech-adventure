import * as simpleIcons from 'simple-icons';
import { titleToSlug } from 'simple-icons/sdk';
import authjsIcon from 'thesvg/authdotjs';
import elysiaIcon from 'thesvg/elysiajs';
import parcelIcon from 'thesvg/parcel';
import rspackIcon from 'thesvg/rspack';
import turbopackIcon from 'thesvg/turbopack';
import valibotIcon from 'thesvg/valibot';
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import path from 'node:path';
import { officialIconAssets } from './official-icon-assets.mjs';

/** @typedef {import('../data/schema').Technology} Technology */
/** @typedef {{ kind: 'brand', source: 'simple-icons', slug: string, title: string, path: string, hex: string }} SimpleTechnologyIcon */
/** @typedef {{ kind: 'brand', source: 'devicon' | 'thesvg' | 'official', slug: string, title: string, svg: string, hex: string }} SvgTechnologyIcon */
/** @typedef {{ kind: 'fallback', label: string, hex: string }} FallbackTechnologyIcon */
/** @typedef {SimpleTechnologyIcon | SvgTechnologyIcon | FallbackTechnologyIcon} TechnologyIcon */

const require = createRequire(import.meta.url);
const deviconRoot = path.dirname(require.resolve('devicon/package.json'));
const deviconData = require('devicon/devicon.json');
const deviconsByName = new Map(deviconData.map((icon) => [icon.name, icon]));

const iconsBySlug = new Map(
  Object.values(simpleIcons)
    .filter((icon) => icon && typeof icon === 'object' && typeof icon.slug === 'string')
    .map((icon) => [icon.slug, icon]),
);

const slugOverrides = {
  'apollo-client': 'apollographql',
  'apache-http-server': 'apache',
  'aspnet-core': 'dotnet',
  'cloudflare-d1': 'cloudflare',
  'cloudflare-kv': 'cloudflare',
  'cloudflare-r2': 'cloudflare',
  'drizzle-orm': 'drizzle',
  'ef-core': 'dotnet',
  nextjs: 'nextdotjs',
  'openid-connect': 'openid',
  oxlint: 'oxc',
  'payload-cms': 'payloadcms',
  'rollup': 'rollupdotjs',
  'msw': 'mockserviceworker',
  'tanstack-query': 'tanstack',
  'tanstack-start': 'tanstack',
};

const deviconOverrides = {
  aws: 'amazonwebservices',
  'aws-lambda': 'amazonwebservices',
  azure: 'azure',
  csharp: 'csharp',
  dynamodb: 'dynamodb',
  'firebase-auth': 'firebase',
  firestore: 'firebase',
  'gitlab-ci': 'gitlab',
  grpc: 'grpc',
  heroku: 'heroku',
  html: 'html5',
  java: 'java',
  oauth2: 'oauth',
  parcel: 'parcel',
  phoenix: 'phoenix',
  playwright: 'playwright',
  'redux-toolkit': 'redux',
  'sql-server': 'microsoftsqlserver',
  'supabase-auth': 'supabase',
  sveltekit: 'svelte',
  'tanstack-query': 'tanstack',
  'tanstack-start': 'tanstack',
  vue: 'vuejs',
  zustand: 'zustand',
};

const thesvgOverrides = {
  authjs: authjsIcon,
  elysia: elysiaIcon,
  parcel: parcelIcon,
  rspack: rspackIcon,
  turbopack: turbopackIcon,
  valibot: valibotIcon,
};

const categoryColors = {
  language: 'EAB308',
  'ui-library': '38BDF8',
  'web-framework': 'A78BFA',
  'server-framework': 'F97316',
  runtime: '10B981',
  styling: '38BDF8',
  'ui-components': '818CF8',
  'state-data': 'EC4899',
  'protocol-api': '8B5CF6',
  'package-monorepo': 'CB3837',
  'build-transform': 'F59E0B',
  'quality-validation': '84CC16',
  testing: '22C55E',
  orm: '14B8A6',
  database: '3B82F6',
  'backend-platform': '06B6D4',
  auth: 'F43F5E',
  'cloud-hosting': '0EA5E9',
  infrastructure: '64748B',
  'ci-cd': '22C55E',
  cms: 'D946EF',
  observability: 'F97316',
};

function fallbackLabel(name) {
  if (name === 'C#') return 'C#';
  const words = name.toUpperCase().match(/[A-Z0-9]+/g) ?? [];
  if (words.length > 1 && words[0].length > 1) return words.slice(0, 2).map((word) => word[0]).join('');
  return words.join('').slice(0, 2) || '?';
}

/**
 * @param {Technology} technology
 * @returns {SvgTechnologyIcon | undefined}
 */
function resolveDevicon(technology) {
  const slug = deviconOverrides[technology.id];
  const icon = slug ? deviconsByName.get(slug) : undefined;
  if (!icon) return undefined;

  const versions = icon.versions.svg;
  const version = ['plain', 'original', 'plain-wordmark', 'original-wordmark'].find((candidate) => versions.includes(candidate));
  if (!version) return undefined;

  return {
    kind: 'brand',
    source: 'devicon',
    slug,
    title: icon.altnames?.[0] ?? technology.name,
    svg: readFileSync(path.join(deviconRoot, 'icons', slug, `${slug}-${version}.svg`), 'utf8').trim(),
    hex: categoryColors[technology.category] ?? '8B5CF6',
  };
}

/**
 * @param {Technology} technology
 * @returns {SvgTechnologyIcon | undefined}
 */
function resolveCuratedIcon(technology) {
  const official = officialIconAssets[technology.id];
  if (official) {
    return {
      kind: 'brand',
      source: 'official',
      slug: technology.id,
      ...official,
    };
  }

  const icon = thesvgOverrides[technology.id];
  if (!icon) return undefined;
  return {
    kind: 'brand',
    source: 'thesvg',
    slug: icon.slug,
    title: icon.title,
    svg: icon.svg,
    hex: (icon.hex || categoryColors[technology.category] || '8B5CF6').toUpperCase(),
  };
}

/**
 * @param {Technology} technology
 * @returns {TechnologyIcon}
 */
export function resolveTechnologyIcon(technology) {
  const devicon = resolveDevicon(technology);
  if (devicon) return devicon;

  const candidates = [
    slugOverrides[technology.id],
    titleToSlug(technology.name),
    technology.id.replaceAll('-', ''),
  ].filter(Boolean);
  const icon = candidates.map((slug) => iconsBySlug.get(slug)).find(Boolean);

  if (icon) {
    return {
      kind: 'brand',
      source: 'simple-icons',
      slug: icon.slug,
      title: icon.title,
      path: icon.path,
      hex: icon.hex.toUpperCase(),
    };
  }

  const curated = resolveCuratedIcon(technology);
  if (curated) return curated;

  return {
    kind: 'fallback',
    label: fallbackLabel(technology.name),
    hex: categoryColors[technology.category] ?? '8B5CF6',
  };
}

/**
 * @param {TechnologyIcon} icon
 * @returns {string}
 */
export function renderTechnologyIconSvg(icon) {
  if (icon.kind !== 'brand') throw new TypeError('Fallback icons do not have SVG artwork');
  if (icon.source === 'simple-icons') {
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#${icon.hex}"><path d="${icon.path}"/></svg>`;
  }
  return icon.svg.replace(/<!--([\s\S]*?)-->/g, '').replace(/>\s+</g, '><').trim();
}
