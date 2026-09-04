# Layered Technology Atlas Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a readable six-region `/landscape` atlas that lets users focus one technology and see only its direct relationships, while filling a small set of verified 2026 catalog gaps.

**Architecture:** Keep the existing 22 technology categories and 1-technology-per-JSON model unchanged. Add a display-only six-region mapping plus DOM-independent atlas filtering/focus helpers, render the full atlas as static Astro HTML, and use a small vanilla-JS controller to update focus state, relationship inspector, URL state, and focused SVG lines. Coverage additions are limited to seven technologies that pass the approved role-gap/current-relevance/relationship-evidence gate.

**Tech Stack:** Astro 7, TypeScript 5.9, Node.js 22 test runner, vanilla JavaScript, existing Simple Icons/Devicon/theSVG icon resolver, GitHub Pages base-path helpers.

**Spec:** `docs/superpowers/specs/2026-09-04-landscape-atlas-design.md`

## Global Constraints

- Preserve `AGENTS.md`: official primary information first, no guessed relations, no casual cross-layer `competes-with`, no unnecessary dependency, no server API or DB, one technology per JSON, plain Japanese, no popularity ranking language.
- Add no npm dependency.
- Preserve all existing URLs and the GitHub Pages `/tech-adventure/` base path.
- JavaScript-disabled users must still see every atlas region, category, technology name, and detail-page link.
- Relationship lines are enhancement-only; inspector text remains authoritative.
- New technology additions in this plan are exactly: `web-components`, `service-worker`, `web-app-manifest`, `trpc`, `tanstack-router`, `solidstart`, `tsdown` unless verification disproves one before its task is committed.
- `tsup` is audited but not added because its official repository says it is no longer actively maintained and recommends `tsdown`.
- Required final verification: `npm run check`, `npm test`, `npm run build`, `npx wrangler deploy --dry-run`.

---

### Task 1: Define atlas regions and pure state helpers

**Files:**
- Create: `src/data/landscape.ts`
- Create: `src/lib/landscape.mjs`
- Create: `tests/landscape.test.mjs`

**Interfaces:**
- Produces: `landscapeRegions`, `regionByCategory` from `src/data/landscape.ts`.
- Produces: `filterAtlasTechnologies(records, filters)`, `buildAdjacency(relations)`, `getFocusState(focusId, visibleIds, adjacency)` from `src/lib/landscape.mjs`.
- `filterAtlasTechnologies` consumes records with `id`, `name`, `shortDescription`, `role`, `ecosystem`, `importance`, `aliases`, and `tags`.
- `getFocusState` returns `{ focusId, relatedIds, dimmedIds }`, with unknown/hidden focus producing no active focus.

- [ ] **Step 1: Write failing mapping and helper tests**

Create `tests/landscape.test.mjs` with tests equivalent to:

```js
import assert from 'node:assert/strict';
import test from 'node:test';
import { categoryIds } from '../src/data/schema.ts';
import { landscapeRegions, regionByCategory } from '../src/data/landscape.ts';
import { buildAdjacency, filterAtlasTechnologies, getFocusState } from '../src/lib/landscape.mjs';

test('all 22 categories map to exactly one of six atlas regions', () => {
  assert.equal(landscapeRegions.length, 6);
  assert.equal(new Set(landscapeRegions.map((region) => region.id)).size, 6);
  const mapped = landscapeRegions.flatMap((region) => region.categories);
  assert.deepEqual([...mapped].sort(), [...categoryIds].sort());
  assert.equal(new Set(mapped).size, categoryIds.length);
  for (const category of categoryIds) assert.ok(regionByCategory[category]);
});

test('atlas filters normalized text, ecosystem, and importance', () => {
  const records = [
    { id: 'astro', name: 'Astro', shortDescription: 'content site', role: 'framework', ecosystem: ['javascript'], importance: 'core', aliases: [], tags: ['islands'] },
    { id: 'django', name: 'Django', shortDescription: 'python web', role: 'framework', ecosystem: ['python'], importance: 'major', aliases: [], tags: [] },
  ];
  assert.deepEqual(filterAtlasTechnologies(records, { query: 'ISLANDS', ecosystem: '', importance: '' }).map((item) => item.id), ['astro']);
  assert.deepEqual(filterAtlasTechnologies(records, { query: '', ecosystem: 'python', importance: '' }).map((item) => item.id), ['django']);
  assert.deepEqual(filterAtlasTechnologies(records, { query: '', ecosystem: '', importance: 'core' }).map((item) => item.id), ['astro']);
});

test('focus state highlights direct incoming and outgoing relations only', () => {
  const adjacency = buildAdjacency([
    { source: 'nextjs', target: 'react', type: 'built-on', note: 'x' },
    { source: 'react', target: 'tanstack-query', type: 'works-with', note: 'y' },
    { source: 'django', target: 'python', type: 'built-on', note: 'z' },
  ]);
  const state = getFocusState('react', new Set(['nextjs', 'react', 'tanstack-query', 'django']), adjacency);
  assert.deepEqual([...state.relatedIds].sort(), ['nextjs', 'tanstack-query']);
  assert.deepEqual([...state.dimmedIds].sort(), ['django']);
});
```

- [ ] **Step 2: Run the targeted tests and confirm failure**

Run: `node --experimental-strip-types --test tests/landscape.test.mjs`
Expected: FAIL because `src/data/landscape.ts` and `src/lib/landscape.mjs` do not exist.

- [ ] **Step 3: Implement the six-region map and pure helpers**

`src/data/landscape.ts` must define these six ids and category assignments exactly:

```ts
export const landscapeRegions = [
  { id: 'foundation', label: 'FOUNDATION', name: 'Webの土台', categories: ['language', 'runtime', 'protocol-api'] },
  { id: 'interface', label: 'INTERFACE', name: '画面をつくる', categories: ['ui-library', 'styling', 'ui-components', 'state-data'] },
  { id: 'application', label: 'APPLICATION', name: 'サイトとAPIを組む', categories: ['web-framework', 'server-framework', 'cms'] },
  { id: 'data-identity', label: 'DATA & IDENTITY', name: 'データと利用者', categories: ['orm', 'database', 'backend-platform', 'auth'] },
  { id: 'delivery', label: 'DELIVERY', name: '公開して動かす', categories: ['cloud-hosting', 'infrastructure', 'ci-cd'] },
  { id: 'engineering', label: 'ENGINEERING', name: '開発を支える', categories: ['package-monorepo', 'build-transform', 'quality-validation', 'testing', 'observability'] },
] as const;
```

Include a short description for each region and export `regionByCategory` using the existing `CategoryId` type.

`src/lib/landscape.mjs` must normalize query text the same way as `explorer.mjs`, treat relations as adjacent in both directions for visual focus, and never throw for an unknown focus id.

- [ ] **Step 4: Re-run targeted tests**

Run: `node --experimental-strip-types --test tests/landscape.test.mjs`
Expected: PASS.

- [ ] **Step 5: Commit the pure atlas model**

```bash
git add src/data/landscape.ts src/lib/landscape.mjs tests/landscape.test.mjs
git commit -m "feat: add layered atlas model"
```

---

### Task 2: Build the static atlas and focus inspector

**Files:**
- Create: `src/components/RelationshipInspector.astro`
- Create: `src/components/TechnologyAtlas.astro`
- Create: `src/pages/landscape.astro`
- Modify: `src/styles/global.css`
- Test: `tests/landscape-page.test.mjs`

**Interfaces:**
- `TechnologyAtlas.astro` consumes `technologies`, `relations`, and renders all six `landscapeRegions`.
- Every technology node has a focus `<button data-atlas-focus="id">` and a separate detail `<a data-atlas-detail href="...">`.
- `RelationshipInspector.astro` renders an empty/default inspector in static HTML and exposes `[data-atlas-inspector]` containers for the controller.
- `/landscape` embeds relation/technology metadata as JSON and imports only `src/lib/landscape.mjs`; it does not fetch at runtime.

- [ ] **Step 1: Add a failing page-contract test**

Create `tests/landscape-page.test.mjs` that reads the source files and asserts:

```js
assert.match(page, /TechnologyAtlas/);
assert.match(page, /focus=/);
assert.match(atlas, /data-atlas-focus/);
assert.match(atlas, /data-atlas-detail/);
assert.match(atlas, /TechnologyIcon/);
assert.match(inspector, /data-atlas-inspector/);
assert.match(page, /withBase\('\/technologies'\)/);
assert.doesNotMatch(page, /fetch\(/);
```

Also assert the page uses `getTechnologies()` and `getRelations()` so all data is build-time local.

- [ ] **Step 2: Run the page-contract test and confirm failure**

Run: `node --experimental-strip-types --test tests/landscape-page.test.mjs`
Expected: FAIL because atlas components/page do not exist.

- [ ] **Step 3: Implement static `RelationshipInspector.astro`**

Render:
- heading: `関係を見る`
- default copy: `技術を選ぶと、直接つながる技術だけを表示します。`
- relation groups for all seven existing relation types, initially hidden/empty
- a detail link placeholder updated by controller
- an always-readable legend mapping relation types to Japanese labels

No client framework and no runtime fetch.

- [ ] **Step 4: Implement static `TechnologyAtlas.astro`**

For each region and category:
- output region title/description
- output category title/description
- output every technology in that category
- node contains `TechnologyIcon`, technology name, focus button, and separate detail link
- add `data-id`, normalized searchable metadata, ecosystem list, importance, category, region id
- add one SVG overlay `<svg data-atlas-lines aria-hidden="true">` at atlas-canvas level; no pre-rendered relation lines

- [ ] **Step 5: Implement `/landscape` controller**

Controls:
- search input
- ecosystem select from existing `ecosystems`
- importance select
- reset-focus button

Controller responsibilities:
1. Parse `query`, `ecosystem`, `importance`, `focus` from URL.
2. Use `filterAtlasTechnologies` to hide filtered-out nodes and empty category sections.
3. Use `buildAdjacency`/`getFocusState` to set selected/related/dimmed attributes.
4. Render inspector rows using the full relation records and preserve source/target direction in copy.
5. Draw SVG lines only between the focused node and currently visible direct neighbors.
6. Recalculate lines after focus, filter, resize, and atlas scroll; if element coordinates are unavailable, clear lines and keep inspector working.
7. Update URL with `history.replaceState` without losing the GitHub Pages path.
8. Unknown `focus` results in no active focus.

- [ ] **Step 6: Add atlas CSS without changing the existing design system**

Append focused atlas rules to `global.css`:
- six large region panels with existing black/purple vocabulary
- category sub-lanes and compact nodes
- selected/related/dimmed states use border + opacity + text, not color only
- desktop multi-column regions
- mobile horizontal category lanes and inspector-first relationship understanding
- `prefers-reduced-motion` disables atlas transitions
- SVG line styles distinguish relation families, while inspector text remains primary

- [ ] **Step 7: Run targeted tests**

Run: `node --experimental-strip-types --test tests/landscape.test.mjs tests/landscape-page.test.mjs`
Expected: PASS.

- [ ] **Step 8: Commit the atlas page**

```bash
git add src/components/RelationshipInspector.astro src/components/TechnologyAtlas.astro src/pages/landscape.astro src/styles/global.css tests/landscape-page.test.mjs
git commit -m "feat: add interactive technology atlas"
```

---

### Task 3: Make the atlas a first-class site navigation path

**Files:**
- Modify: `src/components/LandscapePreview.astro`
- Modify: `src/components/SiteHeader.astro`
- Modify: `src/pages/index.astro`
- Modify: `src/styles/global.css`
- Modify: `tests/design-v2.test.mjs`
- Modify: `tests/github-pages.test.mjs`

**Interfaces:**
- Home preview consumes all technologies but renders only six region summaries and representative Core nodes.
- Header adds a `Landscape` link using `withBase('/landscape')`.
- Home primary CTA points to `/landscape`; Explorer remains available as a secondary path.

- [ ] **Step 1: Update tests first**

Add assertions that:
- `SiteHeader.astro` contains `withBase('/landscape')`.
- `LandscapePreview.astro` imports `landscapeRegions` and links to `/landscape`.
- `index.astro` uses `/landscape` as the main explore CTA and keeps `/technologies` present somewhere on the page.
- GitHub Pages test recognizes `/landscape` as an internal route and still rejects root-relative internal hrefs.

- [ ] **Step 2: Run the modified tests and confirm failure**

Run: `node --experimental-strip-types --test tests/design-v2.test.mjs tests/github-pages.test.mjs`
Expected: FAIL on missing `/landscape` navigation.

- [ ] **Step 3: Replace the 18-node home preview**

Change `LandscapePreview.astro` from hard-coded `LANGUAGE/UI/FRAMEWORK/SERVER/RUNTIME/DATA` groups to six `landscapeRegions`.
For each region:
- show total technology count
- choose up to three `importance === 'core'` technologies from that region, falling back to first major technologies only when a region has fewer than three core entries
- render icons and detail links
- footer CTA: `Open full atlas →`

Do not render all technologies on the home page.

- [ ] **Step 4: Update header and home copy/CTA**

Header order: `Landscape`, `Technologies`, `Journeys`, `Compare`, GitHub.
Home hero primary: `Open technology atlas` -> `/landscape`.
Home role-grid section remains intact and continues to link into Explorer filters.

- [ ] **Step 5: Run navigation/design tests**

Run: `node --experimental-strip-types --test tests/design-v2.test.mjs tests/github-pages.test.mjs tests/landscape-page.test.mjs`
Expected: PASS.

- [ ] **Step 6: Commit site integration**

```bash
git add src/components/LandscapePreview.astro src/components/SiteHeader.astro src/pages/index.astro src/styles/global.css tests/design-v2.test.mjs tests/github-pages.test.mjs
git commit -m "feat: make atlas a primary discovery path"
```

---

### Task 4: Add seven verified catalog gaps and record the audit

**Files:**
- Create: `src/data/technologies/web-components.json`
- Create: `src/data/technologies/service-worker.json`
- Create: `src/data/technologies/web-app-manifest.json`
- Create: `src/data/technologies/trpc.json`
- Create: `src/data/technologies/tanstack-router.json`
- Create: `src/data/technologies/solidstart.json`
- Create: `src/data/technologies/tsdown.json`
- Modify: `src/data/relations.json`
- Modify: `tests/fixtures/required-technologies.mjs`
- Modify: `tests/data.test.mjs`
- Modify: `src/lib/technology-icons.mjs` only if a brand slug needs an explicit override after resolution test
- Create: `docs/research/2026-09-04-coverage-audit.md`

**Interfaces:**
- Catalog count becomes exactly 186 technologies.
- All new technologies use existing schema fields and existing categories/ecosystems only.
- No new relation type or category is introduced.

- [ ] **Step 1: Write failing catalog expectations**

Update `tests/fixtures/required-technologies.mjs` to include:
- `web-components` and `web-app-manifest` in `language`
- `service-worker` in `runtime`
- `trpc` in `protocol-api`
- `tanstack-router`, `solidstart` in `web-framework`
- `tsdown` in `build-transform`

Update the first `tests/data.test.mjs` assertion to exactly 186 technologies while preserving exactly 22 categories.
Add semantic relation assertions:

```js
assert.ok(relations.some((r) => r.source === 'web-components' && r.target === 'html' && r.type === 'built-on'));
assert.ok(relations.some((r) => r.source === 'service-worker' && r.target === 'browser' && r.type === 'runs-on'));
assert.ok(relations.some((r) => r.source === 'web-app-manifest' && r.target === 'service-worker' && r.type === 'works-with'));
assert.ok(relations.some((r) => r.source === 'trpc' && r.target === 'typescript' && r.type === 'built-on'));
assert.ok(relations.some((r) => r.source === 'tanstack-router' && r.target === 'react' && r.type === 'works-with'));
assert.ok(relations.some((r) => r.source === 'solidstart' && r.target === 'solid' && r.type === 'built-on'));
assert.ok(relations.some((r) => r.source === 'tsdown' && r.target === 'rolldown' && r.type === 'built-on'));
```

- [ ] **Step 2: Run data tests and confirm failure**

Run: `node --experimental-strip-types --test tests/data.test.mjs`
Expected: FAIL because the seven JSON records/relations do not exist.

- [ ] **Step 3: Add technology records from primary sources**

Use `lastVerified: "2026-09-04"` only for these seven newly verified records.
Required official URLs and intended roles:

| id | category | officialUrl | role summary |
| --- | --- | --- | --- |
| `web-components` | `language` | `https://developer.mozilla.org/en-US/docs/Web/API/Web_components` | Custom Elements, Shadow DOM, templates/slots as browser-native reusable component primitives |
| `service-worker` | `runtime` | `https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API` | background worker/proxy between web app, browser, and network for offline/cache/push-related capabilities |
| `web-app-manifest` | `language` | `https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps/Manifest` | metadata format describing installable web-app name, icons, start URL, display and OS integration |
| `trpc` | `protocol-api` | `https://trpc.io/` | TypeScript-inferred end-to-end typesafe API layer without schema/code generation |
| `tanstack-router` | `web-framework` | `https://tanstack.com/router/latest/docs/overview` | type-safe React/Solid router with loaders, search-param schemas and route generation |
| `solidstart` | `web-framework` | `https://docs.solidjs.com/solid-start/v2` | full-stack Solid application framework built on Solid and Vite |
| `tsdown` | `build-transform` | `https://tsdown.dev/` | TypeScript library bundler built on Rolldown; current migration target from unmaintained tsup |

Set `importance: 'major'` for all seven so the map does not assert unsupported foundational priority.

- [ ] **Step 4: Add only evidence-backed relations**

At minimum add these unique relations with notes of 12+ characters:

```json
{ "source": "web-components", "target": "html", "type": "built-on", "note": "Custom Elementsやtemplate/slotをHTML要素として利用するWeb標準群。" }
{ "source": "web-components", "target": "javascript", "type": "works-with", "note": "Custom Elementsの定義や振る舞いはJavaScript APIで実装できる。" }
{ "source": "service-worker", "target": "browser", "type": "runs-on", "note": "Service WorkerはブラウザのWorkerコンテキストでページとは別に動作する。" }
{ "source": "service-worker", "target": "http", "type": "works-with", "note": "ネットワークリクエストを横取りし、キャッシュやオフライン応答を制御する。" }
{ "source": "web-app-manifest", "target": "service-worker", "type": "works-with", "note": "PWAではmanifestとService Workerを組み合わせ、インストール性とオフライン機能を構成する。" }
{ "source": "trpc", "target": "typescript", "type": "built-on", "note": "TypeScriptの型推論を共有してクライアントとサーバーの型安全性をつなぐ。" }
{ "source": "trpc", "target": "zod", "type": "works-with", "note": "tRPCのprocedure入力検証ではZodなどのvalidatorを組み合わせられる。" }
{ "source": "tanstack-router", "target": "react", "type": "works-with", "note": "TanStack RouterはReactアプリ向けの公式router実装を提供する。" }
{ "source": "tanstack-router", "target": "solid", "type": "works-with", "note": "TanStack RouterはSolid向けrouterも提供し同じ型安全な経路モデルを使える。" }
{ "source": "tanstack-router", "target": "react-router", "type": "competes-with", "note": "Reactアプリのルーティングを担う同じ層の選択肢として比較できる。" }
{ "source": "solidstart", "target": "solid", "type": "built-on", "note": "SolidStart v2はSolid上にフルスタックWebアプリを構成する。" }
{ "source": "solidstart", "target": "vite", "type": "built-on", "note": "SolidStart v2はViteの環境APIを用いてクライアントとサーバーを構成する。" }
{ "source": "tsdown", "target": "rolldown", "type": "built-on", "note": "tsdownはRolldownを利用してTypeScriptライブラリをバンドルする。" }
{ "source": "tsdown", "target": "typescript", "type": "works-with", "note": "TypeScriptライブラリの配布用ビルドを簡潔な設定で生成する。" }
```

Do not add `competes-with` unless the two records share the same existing category.

- [ ] **Step 5: Record the coverage audit**

Create `docs/research/2026-09-04-coverage-audit.md` with three sections:
1. Added: the seven records, role-gap reason, official primary source.
2. Audited but not added now: `tsup` (not actively maintained; official repo recommends tsdown), `WebdriverIO` (testing role already represented by Playwright/Cypress/Selenium/Puppeteer), `Koa` (server-framework role already represented), `Node Test Runner` and `bun test` (features of existing Node/Bun entries, better represented as detail enrichment later rather than separate top-level technologies).
3. Survey signals: State of JavaScript 2025 library page and State of HTML 2025 Web Components page as secondary relevance signals, clearly separated from primary technical sources.

- [ ] **Step 6: Run data and icon tests**

Run: `node --experimental-strip-types --test tests/data.test.mjs tests/technology-icons.test.mjs tests/technology-icon-rendering.test.mjs`
Expected: PASS. If `trpc`, `tanstack-router`, `solidstart`, or `tsdown` resolves to fallback despite a known brand slug in installed icon catalogs, add only the minimal slug override needed and re-run.

- [ ] **Step 7: Commit verified coverage additions**

```bash
git add src/data/technologies src/data/relations.json tests/fixtures/required-technologies.mjs tests/data.test.mjs src/lib/technology-icons.mjs docs/research/2026-09-04-coverage-audit.md
git commit -m "feat: fill verified web technology gaps"
```

---

### Task 5: Full regression verification and PR

**Files:**
- Modify only files required to fix failures found by the commands below.

**Interfaces:**
- Final catalog: 186 technologies, 22 categories, 6 display regions.
- Existing Explorer, comparisons, journeys, technology details, icon generation, and GitHub Pages build continue working.

- [ ] **Step 1: Run type/static checks**

Run: `npm run check`
Expected: 0 errors, 0 warnings that block the current CI policy.

- [ ] **Step 2: Run all tests**

Run: `npm test`
Expected: all tests pass, including new atlas and updated exact-count data tests.

- [ ] **Step 3: Run production build**

Run: `npm run build`
Expected: build succeeds and emits `/landscape/index.html` in addition to all existing static routes.

- [ ] **Step 4: Run Workers static-assets dry run**

Run: `npx wrangler deploy --dry-run`
Expected: success with generated `dist` recognized as static assets and no unexpected bindings.

- [ ] **Step 5: Inspect generated GitHub Pages links**

Verify the existing GitHub Pages regression test passes and no internal `href="/..."` bypasses `withBase()`.

- [ ] **Step 6: Review branch diff**

Run: `git diff main...HEAD --stat` and inspect the complete diff for accidental unrelated changes, data relation direction errors, and duplicated CSS selectors.

- [ ] **Step 7: Create pull request**

PR title: `feat: add layered technology atlas`

PR body must summarize:
- six-region `/landscape` atlas and focus-only relation rendering
- home/header integration
- catalog 179 -> 186 with seven evidence-backed gaps
- audit decisions including why tsup was not added
- exact verification results from check/test/build/wrangler

- [ ] **Step 8: Confirm CI and merge only after green**

Wait for repository CI/Pages checks for the PR head. If a check fails, inspect logs, fix the branch, and re-run. Merge only after required checks are green and the diff matches this spec.
