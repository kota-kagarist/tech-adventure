const RELATION_LABELS = {
  'works-with': '併用',
  'competes-with': '比較候補',
  'alternative-to': '代替候補',
  'built-on': { outgoing: '土台にする', incoming: '土台になる' },
  'runs-on': { outgoing: '上で動く', incoming: '実行環境になる' },
  implements: { outgoing: '実装する', incoming: '実装される' },
  'part-of': { outgoing: '一部になる', incoming: '含む' },
};

function compareEdges(a, b) {
  return a.neighborId.localeCompare(b.neighborId)
    || a.relation.type.localeCompare(b.relation.type)
    || a.relation.source.localeCompare(b.relation.source)
    || a.relation.target.localeCompare(b.relation.target)
    || a.relation.note.localeCompare(b.relation.note);
}

function buildAdjacency(relations) {
  const adjacency = new Map();

  for (const relation of relations) {
    if (!adjacency.has(relation.source)) adjacency.set(relation.source, []);
    if (!adjacency.has(relation.target)) adjacency.set(relation.target, []);

    adjacency.get(relation.source).push({
      neighborId: relation.target,
      relation,
      direction: 'outgoing',
    });
    adjacency.get(relation.target).push({
      neighborId: relation.source,
      relation,
      direction: 'incoming',
    });
  }

  for (const edges of adjacency.values()) edges.sort(compareEdges);
  return adjacency;
}

function routeSignature(route) {
  return route.steps
    .map((step) => `${step.from}>${step.to}:${step.relation.type}:${step.relation.source}>${step.relation.target}`)
    .join('|');
}

export function findShortestPaths(startId, endId, relations, options = {}) {
  const limit = Math.max(1, Number(options.limit ?? 3));
  const maxHops = Math.max(0, Number(options.maxHops ?? Number.POSITIVE_INFINITY));
  if (!startId || !endId || !Array.isArray(relations)) return [];

  const adjacency = buildAdjacency(relations);
  if (!adjacency.has(startId) || !adjacency.has(endId)) return [];
  if (startId === endId) return [{ nodeIds: [startId], steps: [], hopCount: 0 }];

  const queue = [{ nodeIds: [startId], steps: [] }];
  const bestDepth = new Map([[startId, 0]]);
  const routes = [];
  const signatures = new Set();
  let shortestHops = null;
  let cursor = 0;

  while (cursor < queue.length) {
    const state = queue[cursor++];
    const currentId = state.nodeIds[state.nodeIds.length - 1];
    const currentHops = state.steps.length;

    if (shortestHops !== null && currentHops >= shortestHops) continue;
    if (currentHops >= maxHops) continue;

    for (const edge of adjacency.get(currentId) ?? []) {
      if (state.nodeIds.includes(edge.neighborId)) continue;

      const nextHops = currentHops + 1;
      if (nextHops > maxHops) continue;

      const step = {
        from: currentId,
        to: edge.neighborId,
        direction: edge.direction,
        relation: edge.relation,
      };
      const nextState = {
        nodeIds: [...state.nodeIds, edge.neighborId],
        steps: [...state.steps, step],
      };

      if (edge.neighborId === endId) {
        if (shortestHops === null) shortestHops = nextHops;
        if (nextHops !== shortestHops) continue;

        const route = { ...nextState, hopCount: nextHops };
        const signature = routeSignature(route);
        if (!signatures.has(signature)) {
          signatures.add(signature);
          routes.push(route);
        }
        if (routes.length >= limit) return routes;
        continue;
      }

      if (shortestHops !== null && nextHops >= shortestHops) continue;
      const previousDepth = bestDepth.get(edge.neighborId);
      if (previousDepth !== undefined && nextHops > previousDepth) continue;
      if (previousDepth === undefined || nextHops < previousDepth) bestDepth.set(edge.neighborId, nextHops);
      queue.push(nextState);
    }
  }

  return routes;
}

export function describePathStep(step) {
  const label = RELATION_LABELS[step?.relation?.type];
  if (!label) return step?.relation?.type ?? 'relation';
  if (typeof label === 'string') return label;
  return label[step.direction] ?? step.relation.type;
}
