import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const source = (path) => readFile(new URL(`../${path}`, import.meta.url), 'utf8');

test('atlas semantic tokens resolve to the active v2 design system', async () => {
  const [globalCss, bridgeCss, layout] = await Promise.all([
    source('src/styles/global.css'),
    source('src/styles/landscape-tokens.css'),
    source('src/layouts/BaseLayout.astro'),
  ]);

  for (const token of ['--border:', '--surface:', '--text-muted:', '--accent:']) {
    assert.match(globalCss, new RegExp(token.replace('--', '--')));
  }

  assert.match(bridgeCss, /--line:\s*var\(--border\)/);
  assert.match(bridgeCss, /--panel:\s*var\(--surface\)/);
  assert.match(bridgeCss, /--muted:\s*var\(--text-muted\)/);
  assert.match(bridgeCss, /--text-soft:\s*var\(--text-muted\)/);
  assert.match(bridgeCss, /--accent-light:\s*#b9a3ff/);
  assert.match(layout, /landscape-tokens\.css/);
});
