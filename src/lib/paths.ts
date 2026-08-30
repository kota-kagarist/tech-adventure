export function withBase(path = '/') {
  const configuredBase = import.meta.env.BASE_URL || '/';
  const base = configuredBase.endsWith('/') ? configuredBase : `${configuredBase}/`;
  if (!path || path === '/') return base;
  return `${base}${path.replace(/^\/+/, '')}`;
}
