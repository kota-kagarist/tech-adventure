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

export function canonicalPageUrl(site, baseUrl, pathname) {
  const root = projectRootUrl(site, baseUrl);
  const normalizedPath = String(pathname || '/').replace(/\/+$/, '') || '/';
  const normalizedRootPath = root.pathname.replace(/\/+$/, '') || '/';
  if (normalizedPath === normalizedRootPath) return root;
  return new URL(pathname, site instanceof URL ? site : new URL(site));
}
