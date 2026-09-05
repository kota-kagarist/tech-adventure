import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const source = (path) => readFile(new URL(`../${path}`, import.meta.url), 'utf8');

test('atlas semantic tokens resolve to the light Digital Atlas system without global layout coupling', async () => {
  const [globalCss, bridgeCss, atlasCss, page, layout] = await Promise.all([
    source('src/styles/global.css'),
    source('src/styles/landscape-tokens.css'),
    source('src/styles/landscape.css'),
    source('src/pages/landscape.astro'),
    source('src/layouts/BaseLayout.astro'),
  ]);

  for (const token of ['--canvas:', '--surface:', '--ink-muted:', '--line:', '--brand:', '--region-foundation-bg:']) {
    assert.match(globalCss, new RegExp(token.replace('--', '--')));
  }

  assert.doesNotMatch(bridgeCss, /--line:\s*var\(--line\)/);
  assert.match(bridgeCss, /--panel:\s*var\(--surface\)/);
  assert.match(bridgeCss, /--muted:\s*var\(--ink-muted\)/);
  assert.match(bridgeCss, /--text-soft:\s*var\(--ink-muted\)/);
  assert.match(bridgeCss, /--accent-light:\s*#7EA6E8/i);
  assert.match(atlasCss, /\.atlas-layout\s*\{[\s\S]*?grid-template-columns:\s*minmax\(0,\s*1fr\)\s+minmax\(280px,\s*340px\)/);
  assert.match(atlasCss, /\[data-atlas-region="foundation"\][\s\S]*?var\(--region-foundation-bg\)/);
  assert.match(atlasCss, /\[data-atlas-region="interface"\][\s\S]*?var\(--region-interface-bg\)/);
  assert.match(atlasCss, /line\[data-relation="built-on"\]/);
  assert.match(atlasCss, /line\[data-relation="competes-with"\]/);
  assert.match(atlasCss, /@media\s*\(max-width:\s*760px\)[\s\S]*?\.atlas-page-head\s*\{[\s\S]*?grid-template-columns:\s*minmax\(0,\s*1fr\)/);
  assert.match(page, /landscape-tokens\.css/);
  assert.doesNotMatch(layout, /landscape-tokens\.css/);
});
