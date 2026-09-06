export function projectRootUrl(site, baseUrl) {
  const root = site instanceof URL ? site : new URL(site);
  const base = String(baseUrl || '/');
  const normalizedBase = base.endsWith('/') ? base : `${base}/`;
  return new URL(normalizedBase, root);
}

export function projectAssetUrl(site, baseUrl, path = '') {
  const root = projectRootUrl(site, baseUrl);
  return new URL(String(path).replace(/^\/+/, ''), root);
}
