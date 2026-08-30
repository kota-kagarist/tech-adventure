import type { Technology } from '../schema';

const modules = import.meta.glob<Technology>('./*.json', {
  eager: true,
  import: 'default'
});

export const technologies = Object.values(modules);
