import { categoryById } from '../data/categories';
import { hasComparisonRelation } from './comparison-pairs.mjs';
import type { Technology, TechnologyRelation } from '../data/schema';

export interface ComparisonResult {
  comparable: boolean;
  kind: 'same-category' | 'direct-relation' | 'related-layers' | 'different-layers';
  summary: string;
  directRelations: TechnologyRelation[];
}

export function compareTechnologies(left: Technology, right: Technology, relations: TechnologyRelation[]): ComparisonResult {
  const directRelations = relations.filter((relation) => (relation.source === left.id && relation.target === right.id) || (relation.source === right.id && relation.target === left.id));
  if (left.category === right.category) return { comparable: true, kind: 'same-category', summary: `${left.name}と${right.name}はどちらも「${categoryById[left.category].name}」の技術なので、同じ土俵で比較しやすい組み合わせです。`, directRelations };
  if (hasComparisonRelation(left.id, right.id, directRelations)) return { comparable: true, kind: 'direct-relation', summary: `${left.name}と${right.name}は分類上の役割が異なりますが、適用範囲が重なる競合・代替候補です。置き換えられる範囲と、周辺機能まで含めた違いを確認してください。`, directRelations };
  if (directRelations.length > 0) return { comparable: false, kind: 'related-layers', summary: `${left.name}と${right.name}は担当する層が違います。ただし直接の関係があり、競合というより組み合わせや土台として理解する方が適切です。`, directRelations };
  return { comparable: false, kind: 'different-layers', summary: `${left.name}と${right.name}は担当する層が違うため、単純な二者択一ではありません。まず「何を作るための道具か」を分けて考えるのがおすすめです。`, directRelations };
}
