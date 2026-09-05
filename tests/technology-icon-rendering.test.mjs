import assert from 'node:assert/strict';
import { execFile } from 'node:child_process';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
import { promisify } from 'node:util';
import { requiredTechnologyIds } from './fixtures/required-technologies.mjs';

const execFileAsync = promisify(execFile);

async function buildSite() {
  await execFileAsync('npm', ['run', 'build'], {
    cwd: new URL('..', import.meta.url),
    env: { ...process.env, ASTRO_TELEMETRY_DISABLED: '1' },
  });
}

function iconCount(html) {
  return (html.match(/data-icon-source="/g) ?? []).length;
}

test('built pages render local technology icons across every discovery surface', async () => {
  await buildSite();

  const [home, explorer, detail, journey, comparison, reactIcon, csharpIcon] = await Promise.all([
    readFile(new URL('../dist/index.html', import.meta.url), 'utf8'),
    readFile(new URL('../dist/technologies/index.html', import.meta.url), 'utf8'),
    readFile(new URL('../dist/technologies/react/index.html', import.meta.url), 'utf8'),
    readFile(new URL('../dist/journeys/python-api/index.html', import.meta.url), 'utf8'),
    readFile(new URL('../dist/compare/react/vue/index.html', import.meta.url), 'utf8'),
    readFile(new URL('../dist/icons/react.svg', import.meta.url), 'utf8'),
    readFile(new URL('../dist/icons/csharp.svg', import.meta.url), 'utf8'),
  ]);

  assert.ok(iconCount(home) >= 20, 'home must show icons in the landscape and featured cards');
  assert.equal(iconCount(explorer), requiredTechnologyIds.length, 'every explorer card must show an icon');
  assert.ok(iconCount(detail) >= 2, 'detail must show an icon in the hero and relationship list');
  assert.equal(iconCount(journey), 6, 'every technology in a journey must show an icon');
  assert.ok(iconCount(comparison) >= 2, 'comparison columns must show both technology icons');
  assert.match(explorer, /data-icon-source="simple-icons"/);
  assert.match(explorer, /data-icon-source="devicon"/);
  assert.match(explorer, /data-icon-source="thesvg"/);
  assert.match(explorer, /data-icon-source="official"/);
  assert.match(explorer, /data-icon-source="fallback"/);
  assert.doesNotMatch(explorer, /technology-icon--invert/, 'light theme must not invert dark brand logos to white');
  assert.doesNotMatch(explorer, /class="technology-icon[^>]+src="https?:\/\//);
  assert.doesNotMatch(explorer, /<svg[^>]+id="/, 'brand SVG internals must not be duplicated into page HTML');
  assert.ok(Buffer.byteLength(explorer) < 500_000, 'explorer HTML must stay below 500 KB');
  assert.match(reactIcon, /^<svg/);
  assert.match(csharpIcon, /^<svg/);
  assert.match(csharpIcon, /#68217A/i, 'C# must use the C# logo rather than the C-language logo');
});