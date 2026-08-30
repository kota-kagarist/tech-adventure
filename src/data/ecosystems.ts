import { ecosystemIds, type EcosystemId } from './schema';

export interface Ecosystem {
  id: EcosystemId;
  name: string;
  order: number;
}

const names: Record<EcosystemId, string> = {
  'web-platform': 'Web標準',
  javascript: 'JavaScript',
  typescript: 'TypeScript',
  react: 'React',
  vue: 'Vue',
  svelte: 'Svelte',
  python: 'Python',
  go: 'Go',
  rust: 'Rust',
  php: 'PHP',
  java: 'Java',
  dotnet: '.NET',
  ruby: 'Ruby',
  elixir: 'Elixir',
  node: 'Node.js',
  bun: 'Bun',
  deno: 'Deno',
  cloudflare: 'Cloudflare',
  aws: 'AWS',
  azure: 'Azure',
  gcp: 'Google Cloud',
  data: 'Data',
  devops: 'DevOps',
  content: 'Content'
};

export const ecosystems: Ecosystem[] = ecosystemIds.map((id, index) => ({
  id,
  name: names[id],
  order: (index + 1) * 10
}));

export const ecosystemById = Object.fromEntries(
  ecosystems.map((ecosystem) => [ecosystem.id, ecosystem])
) as Record<EcosystemId, Ecosystem>;
