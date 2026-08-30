const comparisonRelationTypes = new Set(['competes-with', 'alternative-to']);

export const featuredComparisonPairs = [
  ['astro', 'nextjs'],
  ['astro', 'hono'],
  ['react', 'nextjs'],
  ['hono', 'express'],
  ['nodejs', 'bun'],
  ['postgresql', 'sqlite']
];

function canonicalPair(left, right) {
  return left < right ? [left, right] : [right, left];
}

export function comparisonPath(left, right) {
  const [canonicalLeft, canonicalRight] = canonicalPair(left, right);
  return `/compare/${canonicalLeft}/${canonicalRight}`;
}

export function hasComparisonRelation(left, right, relations) {
  return relations.some((relation) =>
    comparisonRelationTypes.has(relation.type)
    && ((relation.source === left && relation.target === right) || (relation.source === right && relation.target === left))
  );
}

export function buildComparisonPairIds(technologies, relations, featuredPairs = featuredComparisonPairs) {
  const knownIds = new Set(technologies.map(({ id }) => id));
  const pairsByKey = new Map();

  const addPair = (left, right) => {
    if (left === right || !knownIds.has(left) || !knownIds.has(right)) return;
    const pair = canonicalPair(left, right);
    pairsByKey.set(pair.join('/'), pair);
  };

  for (const relation of relations) {
    if (comparisonRelationTypes.has(relation.type)) addPair(relation.source, relation.target);
  }
  for (const [left, right] of featuredPairs) addPair(left, right);

  return [...pairsByKey.entries()]
    .sort(([leftKey], [rightKey]) => leftKey.localeCompare(rightKey, 'en'))
    .map(([, pair]) => pair);
}
