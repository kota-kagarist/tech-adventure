export const requiredTechnologyIdsByCategory = Object.freeze({
  language: ['html', 'css', 'javascript', 'typescript', 'python', 'go', 'rust', 'php', 'java', 'csharp', 'ruby'],
  'ui-library': ['react', 'vue', 'angular', 'svelte', 'solid', 'preact', 'htmx', 'alpinejs', 'lit', 'qwik'],
  'web-framework': ['nextjs', 'nuxt', 'astro', 'sveltekit', 'tanstack-start', 'remix', 'react-router', 'gatsby', 'fresh', 'docusaurus'],
  'server-framework': ['hono', 'express', 'fastify', 'nestjs', 'elysia', 'nitro', 'fastapi', 'django', 'flask', 'laravel', 'rails', 'spring-boot', 'aspnet-core', 'phoenix'],
  runtime: ['nodejs', 'bun', 'deno', 'browser', 'cloudflare-workers', 'aws-lambda'],
  styling: ['tailwind-css', 'bootstrap', 'sass', 'css-modules', 'styled-components', 'emotion', 'unocss'],
  'ui-components': ['shadcn-ui', 'mui', 'ant-design', 'chakra-ui'],
  'state-data': ['redux-toolkit', 'zustand', 'tanstack-query', 'swr', 'apollo-client', 'pinia'],
  'protocol-api': ['http', 'rest', 'graphql', 'websocket', 'server-sent-events', 'grpc'],
  'package-monorepo': ['npm', 'pnpm', 'yarn', 'turborepo', 'nx'],
  'build-transform': ['vite', 'webpack', 'rollup', 'esbuild', 'swc', 'turbopack', 'rspack', 'rolldown', 'parcel', 'babel'],
  'quality-validation': ['eslint', 'prettier', 'biome', 'oxlint', 'zod', 'valibot'],
  testing: ['vitest', 'jest', 'playwright', 'cypress', 'testing-library', 'storybook', 'msw', 'puppeteer', 'selenium'],
  orm: ['prisma', 'drizzle-orm', 'typeorm', 'sequelize', 'mongoose', 'kysely', 'sqlalchemy', 'hibernate', 'ef-core'],
  database: ['postgresql', 'mysql', 'sqlite', 'mongodb', 'redis', 'mariadb', 'sql-server', 'dynamodb', 'firestore', 'elasticsearch', 'opensearch', 'clickhouse', 'cloudflare-d1'],
  'backend-platform': ['supabase', 'firebase', 'neon', 'planetscale', 'turso', 'convex', 'appwrite', 'pocketbase', 'cloudflare-r2', 'cloudflare-kv'],
  auth: ['oauth2', 'openid-connect', 'authjs', 'clerk', 'better-auth', 'keycloak', 'firebase-auth', 'supabase-auth'],
  'cloud-hosting': ['aws', 'azure', 'gcp', 'cloudflare', 'vercel', 'netlify', 'render', 'railway', 'flyio', 'digitalocean', 'heroku'],
  infrastructure: ['docker', 'kubernetes', 'terraform', 'pulumi', 'sst', 'nginx', 'apache-http-server', 'caddy'],
  'ci-cd': ['github-actions', 'gitlab-ci', 'circleci', 'jenkins'],
  cms: ['wordpress', 'strapi', 'payload-cms', 'directus', 'sanity', 'contentful', 'ghost'],
  observability: ['sentry', 'opentelemetry', 'datadog', 'prometheus', 'grafana']
});

export const requiredTechnologyIds = Object.freeze(Object.values(requiredTechnologyIdsByCategory).flat());

if (requiredTechnologyIds.length !== 179) {
  throw new Error(`Required technology fixture must contain 179 ids, got ${requiredTechnologyIds.length}`);
}

export const ecosystemIds = Object.freeze([
  'web-platform', 'javascript', 'typescript', 'react', 'vue', 'svelte',
  'python', 'go', 'rust', 'php', 'java', 'dotnet', 'ruby', 'elixir',
  'node', 'bun', 'deno', 'cloudflare', 'aws', 'azure', 'gcp', 'data',
  'devops', 'content'
]);
