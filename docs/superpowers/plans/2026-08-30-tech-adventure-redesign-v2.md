# Tech Adventure Redesign v2 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the current rustic field-guide visual system with a dense, modern dark technology atlas inspired by Linear, roadmap.sh, and Raycast while preserving all existing product behavior and GitHub Pages compatibility.

**Architecture:** Keep the Astro static-site architecture and all existing data models. Introduce one new presentational component (`LandscapePreview.astro`), refactor existing page markup into consistent structural classes, and replace the global CSS design system. No UI library, external font, image dependency, API, or database is added.

**Tech Stack:** Astro 7, TypeScript, CSS, Node test runner, GitHub Actions, GitHub Pages

**Spec:** `docs/superpowers/specs/2026-08-30-tech-adventure-redesign-v2-design.md`

## Global Constraints

- Keep Astro 7 + TypeScript.
- Add no UI framework or design dependency.
- Add no external font or required image asset.
- Preserve GitHub Pages `/tech-adventure/` base-path behavior.
- Preserve all 22 technologies, relation data, journeys, search, and filtering.
- Use one purple accent family; do not reintroduce multicolor decorative styling.
- Run `npm ci`, `npm run check`, `npm test`, and `npm run build` before merge.

---

### Task 1: Lock the new design contract with failing tests

**Files:**
- Create: `tests/design-v2.test.mjs`

**Interfaces:**
- Consumes: current `src/styles/global.css`, `src/pages/index.astro`, page templates.
- Produces: regression contract for tokens and new structure.

- [ ] **Step 1: Write the failing test**

Create `tests/design-v2.test.mjs` that asserts:

```js
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const source = (path) => readFile(new URL(`../${path}`, import.meta.url), 'utf8');

test('v2 dark design tokens replace the rustic theme', async () => {
  const css = await source('src/styles/global.css');
  assert.match(css, /--bg:\s*#08090b/);
  assert.match(css, /--accent:\s*#8b5cf6/);
  assert.match(css, /--surface:\s*#0e1014/);
  assert.doesNotMatch(css, /--paper:/);
  assert.doesNotMatch(css, /--moss:/);
  assert.doesNotMatch(css, /--signal:/);
});

test('home renders the technology landscape instead of decorative adventure cards', async () => {
  const [home, preview] = await Promise.all([
    source('src/pages/index.astro'),
    source('src/components/LandscapePreview.astro')
  ]);
  assert.match(home, /TECHNOLOGY LANDSCAPE/);
  assert.match(home, /Navigate the technology landscape\./);
  assert.match(home, /<LandscapePreview/);
  assert.match(preview, /landscape-grid/);
  assert.match(preview, /landscape-node/);
});

test('core screens use the v2 structural shells', async () => {
  const [list, detail, compare, journeys] = await Promise.all([
    source('src/pages/technologies/index.astro'),
    source('src/pages/technologies/[id].astro'),
    source('src/pages/compare/[left]/[right].astro'),
    source('src/pages/journeys/[id].astro')
  ]);
  assert.match(list, /explorer-toolbar/);
  assert.match(detail, /technology-detail-grid/);
  assert.match(compare, /comparison-shell/);
  assert.match(journeys, /journey-rail/);
});
```

- [ ] **Step 2: Verify the test fails**

Run: `npm test`

Expected: FAIL because `LandscapePreview.astro`, new tokens, and structural classes do not yet exist.

- [ ] **Step 3: Commit only the failing contract**

Commit message: `test: define redesign v2 contract`

---

### Task 2: Replace the global design system and site chrome

**Files:**
- Modify: `src/styles/global.css`
- Modify: `src/components/SiteHeader.astro`
- Modify: `src/components/SiteFooter.astro`
- Modify: `src/layouts/BaseLayout.astro`

**Interfaces:**
- Consumes: `withBase()` helper and existing semantic layout.
- Produces: v2 design tokens and reusable classes used by all pages.

- [ ] **Step 1: Replace old theme tokens**

Use exactly these core tokens:

```css
:root {
  --bg: #08090b;
  --surface: #0e1014;
  --surface-2: #14171d;
  --surface-hover: #181b22;
  --border: #242832;
  --border-strong: #343946;
  --text: #f4f6f8;
  --text-muted: #949ba8;
  --text-dim: #69707d;
  --accent: #8b5cf6;
  --accent-soft: rgba(139, 92, 246, .14);
  --accent-line: rgba(139, 92, 246, .38);
  --radius: 8px;
  --radius-lg: 12px;
}
```

Remove the old paper/moss/signal palette and card shadows.

- [ ] **Step 2: Implement the dark global shell**

Add reusable classes for:
- `.site-shell`
- `.section-shell`
- `.display-title`
- `.section-title`
- `.meta-label`
- `.button-primary`
- `.button-secondary`
- `.panel`
- `.subtle-grid`

Keep `:focus-visible`, skip-link, responsive behavior, and reduced-motion support.

- [ ] **Step 3: Simplify header and footer**

Header contains brand, Technologies, Journeys, Compare, GitHub. Use thin borders and no pill navigation containers.

Footer is one compact row with product description and repository link.

- [ ] **Step 4: Run checks**

Run:

```bash
npm run check
npm test
```

Expected: design contract still partially fails only on screens/components not yet migrated; existing Astro/type checks pass.

---

### Task 3: Redesign the homepage around the technology landscape

**Files:**
- Create: `src/components/LandscapePreview.astro`
- Modify: `src/pages/index.astro`
- Modify: `src/styles/global.css`

**Interfaces:**
- Consumes: `Technology[]`, category metadata, `withBase()`.
- Produces: semantic static technology landscape and new homepage hierarchy.

- [ ] **Step 1: Build `LandscapePreview.astro`**

Render six representative groups:

```ts
const groups = [
  { label: 'LANGUAGE', ids: ['javascript', 'typescript'] },
  { label: 'UI', ids: ['react', 'vue', 'svelte'] },
  { label: 'FRAMEWORK', ids: ['astro', 'nextjs', 'nuxt'] },
  { label: 'SERVER', ids: ['hono', 'fastify', 'express'] },
  { label: 'RUNTIME', ids: ['nodejs', 'bun', 'deno'] },
  { label: 'DATA', ids: ['postgresql', 'sqlite', 'cloudflare-d1'] }
];
```

Each technology is a normal anchor with class `.landscape-node`. The layout must work without JavaScript.

- [ ] **Step 2: Replace homepage hero**

Hero must include:

```text
TECHNOLOGY LANDSCAPE
Navigate the technology landscape.
技術名を覚える前に、「何者か」「何と競合するか」「何と組むか」を理解する。
```

Render count metrics from real data: technologies, relations, journeys.

- [ ] **Step 3: Rebuild homepage sections**

Use these sections in order:
1. Hero + LandscapePreview
2. Explore by role
3. Start here
4. Compare
5. Journeys
6. Open source

Use dense border-led rows/cards rather than large shadow cards.

- [ ] **Step 4: Run tests**

Run: `npm test`

Expected: homepage portion of `design-v2.test.mjs` passes.

---

### Task 4: Redesign technology explorer and detail screens

**Files:**
- Modify: `src/components/TechnologyCard.astro`
- Modify: `src/components/TechnologyRelations.astro`
- Modify: `src/pages/technologies/index.astro`
- Modify: `src/pages/technologies/[id].astro`
- Modify: `src/styles/global.css`

**Interfaces:**
- Consumes: existing search/filter JS and relationship data.
- Produces: dense explorer and two-column detail experience.

- [ ] **Step 1: Make technology cards compact**

Card structure:
- category meta label
- technology name
- one short description
- up to three muted tags

No shadows. Hover changes border/background only.

- [ ] **Step 2: Build `.explorer-toolbar`**

Search, category select, and count appear in one responsive toolbar. Do not change existing filtering behavior.

- [ ] **Step 3: Build `.technology-detail-grid`**

Left: definition, role, use/skip sections.
Right: relationship panel.

- [ ] **Step 4: Convert relations to link rows**

`TechnologyRelations.astro` uses grouped link rows with category label, technology name, and relation note instead of large cards.

- [ ] **Step 5: Verify**

Run:

```bash
npm run check
npm test
```

Expected: list/detail design contract passes.

---

### Task 5: Redesign compare and journey screens

**Files:**
- Modify: `src/pages/compare/[left]/[right].astro`
- Modify: `src/pages/journeys/index.astro`
- Modify: `src/pages/journeys/[id].astro`
- Modify: `src/styles/global.css`

**Interfaces:**
- Consumes: existing `compareTechnologies()` output and journey records.
- Produces: comparison verdict shell and vertical journey rail.

- [ ] **Step 1: Build `.comparison-shell`**

Top verdict panel shows:
- relation kind
- direct comparison or different layers
- summary

Below it, render two equal technology columns separated by a 1px border. Remove the oversized `VS` element.

- [ ] **Step 2: Redesign journey list**

Each journey is a compact row with title, summary, and technology count.

- [ ] **Step 3: Build `.journey-rail`**

Each route step shows number, technology name, category, and short description on a vertical rail.

- [ ] **Step 4: Verify**

Run: `npm test`

Expected: all `design-v2.test.mjs` tests pass.

---

### Task 6: Final quality gate and GitHub Pages deployment

**Files:**
- Modify: `README.md` only if live-site description needs updating.
- No new runtime dependencies.

**Interfaces:**
- Consumes: complete redesign.
- Produces: verified `main` deployment.

- [ ] **Step 1: Run complete verification**

Run:

```bash
npm ci
npm run check
npm test
npm run build
```

Expected:
- zero Astro/type errors
- all existing data, Pages, and redesign tests pass
- 36+ static pages build successfully

- [ ] **Step 2: Verify GitHub Pages base paths**

Confirm existing `tests/github-pages.test.mjs` remains green.

- [ ] **Step 3: Open PR and let GitHub Actions verify**

PR title: `feat: redesign Tech Adventure`

- [ ] **Step 4: Merge only after green CI**

Use squash merge into `main`.

- [ ] **Step 5: Verify Pages deployment**

Confirm `Deploy to GitHub Pages` succeeds and the environment URL remains:

```text
https://kota-kagarist.github.io/tech-adventure/
```
