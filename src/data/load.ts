import { categories, categoryById } from './categories';
import relationsJson from './relations.json';
import type { Technology, TechnologyRelation } from './schema';
import { technologies } from './technologies';

const relations = relationsJson as TechnologyRelation[];

export function getTechnologies(): Technology[] {
  return [...technologies].sort((a, b) => {
    const categoryDelta = categoryById[a.category].order - categoryById[b.category].order;
    return categoryDelta || a.name.localeCompare(b.name, 'en');
  });
}

export function getTechnologyById(id: string): Technology | undefined {
  return technologies.find((technology) => technology.id === id);
}

export function getRelations(): TechnologyRelation[] {
  return [...relations];
}

export function getRelationsFor(id: string): TechnologyRelation[] {
  return relations.filter((relation) => relation.source === id || relation.target === id);
}

export { categories, categoryById };
