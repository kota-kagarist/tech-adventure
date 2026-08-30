import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://kota-kagarist.github.io',
  base: '/tech-adventure',
  output: 'static',
  trailingSlash: 'never',
  build: { format: 'directory' }
});
