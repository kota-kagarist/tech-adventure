function relationKey(relation) {
  return `${relation.source}:${relation.type}:${relation.target}`;
}

function parseList(value) {
  return String(value ?? '')
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);
}

export function serializeAtlasRoute(route) {
  return {
    route: route.nodeIds.join(','),
    edges: route.steps.map((step) => relationKey(step.relation)).join(','),
  };
}

export function resolveAtlasRoute(routeValue, edgesValue, technologyIds, relations) {
  const nodeIds = parseList(routeValue);
  const edgeKeys = parseList(edgesValue);

  if (nodeIds.length < 2) return null;
  if (new Set(nodeIds).size !== nodeIds.length) return null;
  if (nodeIds.some((id) => !technologyIds.has(id))) return null;
  if (edgeKeys.length !== nodeIds.length - 1) return null;

  const relationByKey = new Map(relations.map((relation) => [relationKey(relation), relation]));
  const steps = [];

  for (let index = 0; index < edgeKeys.length; index += 1) {
    const from = nodeIds[index];
    const to = nodeIds[index + 1];
    const relation = relationByKey.get(edgeKeys[index]);
    if (!from || !to || !relation) return null;

    let direction;
    if (relation.source === from && relation.target === to) direction = 'outgoing';
    else if (relation.source === to && relation.target === from) direction = 'incoming';
    else return null;

    steps.push({ from, to, direction, relation });
  }

  return { nodeIds, steps, hopCount: steps.length };
}
