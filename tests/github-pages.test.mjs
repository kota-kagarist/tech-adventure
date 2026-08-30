import assert from 'node:assert/strict';
import { readdir, readFile } from 'node:fs/promises';
import { extname, join } from 'node:path';
import test from 'node:test';

const source = (path) => readFile(new URL(`../${path}`, import.meta.url), 'utf8');

async function astroFiles(dir) {
  const entries = await readdir(new URL(`../${dir}/`, import.meta.url), { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) files.push(...await astroFiles(path));
    else if (extname(entry.name) === '.astro') files.push(path);
  }
  return files;
}

test('Astro is configured for the GitHub Pages project URL', async () => {
  const config = await source('astro.config.mjs');
  assert.match(config, /site:\s*['"]https:\/\/kota-kagarist\.github\.io['"]/);
  assert.match(config, /base:\s*['"]\/tech-adventure['"]/);
});

test('internal links are base-path aware', async () => {
  const files = await astroFiles('src');
  for (const file of files) {
    const text = await source(file);
    assert.doesNotMatch(text, /href=(?:"|\{`|\{'|\{")\//, `${file} contains a root-relative link`);
  }
});

test('GitHub Pages workflow builds and deploys dist', async () => {
  const workflow = await source('.github/workflows/pages.yml');
  assert.match(workflow, /actions\/configure-pages@v5/);
  assert.match(workflow, /actions\/upload-pages-artifact@v4/);
  assert.match(workflow, /actions\/deploy-pages@v5/);
  assert.match(workflow, /path:\s*\.\/dist/);
  assert.match(workflow, /pages:\s*write/);
  assert.match(workflow, /id-token:\s*write/);
});
