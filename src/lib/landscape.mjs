function normalize(value) {
  return String(value ?? '').toLocaleLowerCase().normalize('NFKC').replace(/[^\p{L}\p{N}]+/gu, '');
}

export function filterAtlasTechnologies(technologies, filters = {}) {
  const query = normalize(filters.query);

  return technologies.filter((technology) => {
    const searchable = normalize([
      technology.id,
      technology.name,
      technology.shortDescription,
      technology.role,
      ...(technology.aliases ?? []),
      ...(technology.tags ?? []),
    ].join(' '));

    return (!query || searchable.includes(query))
      && (!filters.ecosystem || technology.ecosystem?.includes(filters.ecosystem))
      && (!filters.importance || technology.importance === filters.importance);
  });
}

export function buildAdjacency(relations) {
  const adjacency = new Map();

  for (const relation of relations) {
    if (!adjacency.has(relation.source)) adjacency.set(relation.source, []);
    if (!adjacency.has(relation.target)) adjacency.set(relation.target, []);

    adjacency.get(relation.source).push({ ...relation, direction: 'outgoing', neighborId: relation.target });
    adjacency.get(relation.target).push({ ...relation, direction: 'incoming', neighborId: relation.source });
  }

  return adjacency;
}

export function getFocusState(focusId, visibleIds, adjacency) {
  if (!focusId || !visibleIds.has(focusId)) {
    return {
      focusId: null,
      relatedIds: new Set(),
      dimmedIds: new Set(),
    };
  }

  const relatedIds = new Set(
    (adjacency.get(focusId) ?? [])
      .map((entry) => entry.neighborId)
      .filter((id) => visibleIds.has(id)),
  );

  const dimmedIds = new Set(
    [...visibleIds].filter((id) => id !== focusId && !relatedIds.has(id)),
  );

  return { focusId, relatedIds, dimmedIds };
}
