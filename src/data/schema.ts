export const categoryIds = [
  'language', 'ui-library', 'web-framework', 'server-framework', 'runtime',
  'styling', 'ui-components', 'state-data', 'protocol-api', 'package-monorepo',
  'build-transform', 'quality-validation', 'testing', 'orm', 'database',
  'backend-platform', 'auth', 'cloud-hosting', 'infrastructure', 'ci-cd',
  'cms', 'observability'
] as const;

export type CategoryId = (typeof categoryIds)[number];

export const ecosystemIds = [
  'web-platform', 'javascript', 'typescript', 'react', 'vue', 'svelte',
  'python', 'go', 'rust', 'php', 'java', 'dotnet', 'ruby', 'elixir',
  'node', 'bun', 'deno', 'cloudflare', 'aws', 'azure', 'gcp', 'data',
  'devops', 'content'
] as const;

export type EcosystemId = (typeof ecosystemIds)[number];

export interface Technology {
  id: string;
  name: string;
  shortDescription: string;
  category: CategoryId;
  officialUrl: string;
  whatItDoes: string;
  role: string;
  whenToUse: string[];
  whenNotToUse: string[];
  maturity: 'emerging' | 'established' | 'mature';
  importance: 'core' | 'major';
  ecosystem: EcosystemId[];
  aliases: string[];
  tags: string[];
  lastVerified: string;
}

export type RelationType =
  | 'competes-with'
  | 'works-with'
  | 'runs-on'
  | 'built-on'
  | 'alternative-to'
  | 'implements'
  | 'part-of';

export interface TechnologyRelation {
  source: string;
  target: string;
  type: RelationType;
  note: string;
}

export interface Journey {
  id: string;
  title: string;
  summary: string;
  technologyIds: string[];
  reasoning: string[];
  tradeoffs: string[];
  alternatives: string[];
}
