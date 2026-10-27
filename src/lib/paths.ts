import { projectPath } from './site-urls.mjs';

export function withBase(path = '/') {
  return projectPath(import.meta.env.BASE_URL || '/', path);
}
