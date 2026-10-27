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

function withDirectorySlash(url) {
  const lastSegment = url.pathname.split('/').at(-1);
  if (lastSegment && !lastSegment.includes('.')) url.pathname += '/';
  return url;
}

export function canonicalPageUrl(site, baseUrl, pathname) {
  const root = projectRootUrl(site, baseUrl);
  const url = new URL(pathname || '', root);
  url.search = '';
  url.hash = '';
  return withDirectorySlash(url);
}

export function projectPath(baseUrl, path = '/') {
  const url = withDirectorySlash(projectAssetUrl('https://example.invalid', baseUrl, path));
  return `${url.pathname}${url.search}${url.hash}`;
}
