export const categoryIds = [
  'language', 'ui-library', 'web-framework', 'server-framework', 'runtime',
  'database', 'storage', 'deployment', 'build-tool', 'orm'
] as const;

export type CategoryId = (typeof categoryIds)[number];

export interface Technology {
  id: string;
  name: string;
  shortDescription: string;
  category: CategoryId;
  officialUrl: string;
  whatItDoes: string;
  whenToUse: string[];
  whenNotToUse: string[];
  maturity: 'emerging' | 'established' | 'mature';
  tags: string[];
}

export type RelationType =
  | 'competes-with'
  | 'works-with'
  | 'runs-on'
  | 'built-on'
  | 'alternative-to';

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
  alternatives: string[];
}
