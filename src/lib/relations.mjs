export function groupRelationsForTechnology(technologyId, relations) {
  return {
    implements: relations.filter((relation) => relation.type === 'implements' && relation.source === technologyId),
    implementedBy: relations.filter((relation) => relation.type === 'implements' && relation.target === technologyId),
    partOf: relations.filter((relation) => relation.type === 'part-of' && relation.source === technologyId),
    includes: relations.filter((relation) => relation.type === 'part-of' && relation.target === technologyId)
  };
}
