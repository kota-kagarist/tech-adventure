# Light Digital Atlas Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Tech Adventure の全画面を、既存機能とデータ構造を維持したまま、読みやすい明るい Digital Atlas デザインへ刷新する。

**Architecture:** Astro の既存ページ・データ・クライアントロジックは維持し、共通 light-atlas design tokens と既存クラスの再設計を中心に進める。Atlas 固有の region / relation 表現は `landscape.css` に閉じ、モバイルの overflow 契約は `mobile-layout.css` と回帰テストで固定する。UI フレームワーク・外部フォント・新規 runtime dependency は追加しない。

**Tech Stack:** Astro 7, TypeScript 5.9, Node.js 22+, static HTML, vanilla browser JavaScript, CSS, inline SVG, GitHub Pages, Wrangler Static Assets dry-run

**Spec:** `docs/superpowers/specs/2026-09-05-light-digital-atlas-redesign.md`

## Global Constraints

- 正本の 186 technologies / 22 categories / 6 regions / 485 relations を変更しない。
- Astro 7 + TypeScript 5.9 + Node.js 22+ を維持する。
- UI framework / external font / backend API / DB を追加しない。
- JavaScript 無効でも主要情報とリンクが読める状態を維持する。
- relation line は desktop の focus-only 表現で、全 relation を同時表示しない。
- mobile は relation line に依存せず Inspector の text UI を正本にする。
- 320 / 360 / 390 / 430 / 768 / 1024 / 1440px を確認する。
- page-level horizontal overflow を作らない。Atlas category lane の意図した横スクロールだけを例外とする。
- 必須検証は `npm run check`, `npm test`, `npm run build`, `npx wrangler deploy --dry-run`。

---

### Task 1: Light Atlas design system and global navigation

**Files:**
- Modify: `tests/design-v2.test.mjs`
- Modify: `src/styles/global.css`
- Modify: `src/layouts/BaseLayout.astro`
- Modify: `src/components/SiteHeader.astro`
- Modify: `src/components/SiteFooter.astro`

**Interfaces:**
- Consumes: existing semantic classes such as `.shell`, `.button-primary`, `.meta-label`, `.site-header`, `.technology-icon`.
- Produces: global light tokens (`--canvas`, `--surface`, `--ink`, `--brand`, region colors) while keeping compatibility aliases (`--bg`, `--text`, `--border`, `--accent`) for Atlas CSS during migration.

- [ ] **Step 1: Rewrite the design-token regression test first**

Replace the dark-token assertion in `tests/design-v2.test.mjs` with assertions equivalent to:

```js
test('light Digital Atlas tokens replace the dark canvas', async () => {
  const [css, layout, header] = await Promise.all([
    source('src/styles/global.css'),
    source('src/layouts/BaseLayout.astro'),
    source('src/components/SiteHeader.astro'),
  ]);
  assert.match(css, /--canvas:\s*#F6F7F4/i);
  assert.match(css, /--ink:\s*#14233B/i);
  assert.match(css, /--brand:\s*#1D5FD1/i);
  assert.match(css, /--region-foundation-bg:/);
  assert.doesNotMatch(css, /color-scheme:\s*dark/);
  assert.match(layout, /theme-color[^\n]*#F6F7F4/i);
  assert.match(header, />Atlas</);
  assert.doesNotMatch(header, />Landscape</);
});
```

- [ ] **Step 2: Verify RED**

Run CI/test for the branch. Expected: `design-v2.test.mjs` fails because the dark tokens and `Landscape` nav still exist.

- [ ] **Step 3: Implement global tokens and base surfaces**

At the top of `global.css`, define:

```css
:root {
  --canvas: #F6F7F4;
  --surface: #FFFFFF;
  --surface-subtle: #F1F4F6;
  --surface-raised: #FFFFFF;
  --ink: #14233B;
  --ink-muted: #4E5D72;
  --ink-dim: #748195;
  --line: #D9E0E7;
  --line-strong: #BCC7D2;
  --brand: #1D5FD1;
  --brand-hover: #174FB0;
  --brand-soft: #E8F0FD;
  --focus-ring: #1D5FD1;
  --region-foundation-bg: #EAF3FF;
  --region-foundation-ink: #245A93;
  --region-interface-bg: #FFF0F5;
  --region-interface-ink: #9B4664;
  --region-application-bg: #FFF3E7;
  --region-application-ink: #9A5A22;
  --region-data-identity-bg: #EAF7F0;
  --region-data-identity-ink: #2D7054;
  --region-delivery-bg: #EDF4FF;
  --region-delivery-ink: #3D669E;
  --region-engineering-bg: #F2EEFF;
  --region-engineering-ink: #6853A4;
  --bg: var(--canvas);
  --text: var(--ink);
  --text-muted: var(--ink-muted);
  --text-dim: var(--ink-dim);
  --border: var(--line);
  --border-strong: var(--line-strong);
  --accent: var(--brand);
  --accent-soft: var(--brand-soft);
  --accent-line: color-mix(in srgb, var(--brand) 34%, transparent);
  --radius: 10px;
  --radius-lg: 16px;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "Noto Sans JP", "Hiragino Sans", sans-serif;
  color: var(--ink);
  background: var(--canvas);
}
```

Update body/link/button/header/footer/icon surfaces to light colors. Remove the full-page dark radial background and `color-scheme: dark`. Use `:focus-visible { outline: 3px solid var(--focus-ring); outline-offset: 3px; }`.

- [ ] **Step 4: Make the header an Atlas navigation, without new JS**

Change the brand label to `Tech Adventure`; keep the mark compact. Change the first nav item to `Atlas`. Keep Technologies / Journeys / Compare / GitHub. Mobile layout is handled in Task 8; do not add a hamburger script.

- [ ] **Step 5: Set the browser chrome to the light canvas**

In `BaseLayout.astro`, change:

```astro
<meta name="theme-color" content="#F6F7F4" />
```

- [ ] **Step 6: Verify GREEN and commit**

Run `npm run check && npm test`. Expected: new light-token test passes and no existing contract fails. Commit message: `feat: establish light atlas design system`.

---

### Task 2: Home as the entry map

**Files:**
- Modify: `tests/design-v2.test.mjs`
- Modify: `src/pages/index.astro`
- Modify: `src/components/LandscapePreview.astro`
- Create: `src/components/AtlasTerrain.astro`
- Modify: `src/styles/global.css`

**Interfaces:**
- Consumes: `landscapeRegions`, `TechnologyIcon`, data-derived `technologies.length`, `relations.length`, `journeys.length`, `categories.length`.
- Produces: `AtlasTerrain` decorative SVG component and a 3x2 / 2x3 region preview.

- [ ] **Step 1: Add failing Home assertions**

Extend `tests/design-v2.test.mjs`:

```js
test('home is a light atlas entry point', async () => {
  const [home, preview, terrain] = await Promise.all([
    source('src/pages/index.astro'),
    source('src/components/LandscapePreview.astro'),
    source('src/components/AtlasTerrain.astro').catch(() => ''),
  ]);
  assert.match(home, /WEB TECHNOLOGY ATLAS/);
  assert.match(home, /Web技術の地図を、一緒に旅しよう。/);
  assert.match(home, />地図を開く</);
  assert.match(home, />技術を探す</);
  assert.match(home, /categories\.length/);
  assert.match(home, /<AtlasTerrain/);
  assert.match(preview, /landscapeRegions/);
  assert.match(preview, /landscape-region-card/);
  assert.match(terrain, /<svg/);
});
```

- [ ] **Step 2: Verify RED**

Expected failures: old English hero, no category metric, no terrain component, old preview markup.

- [ ] **Step 3: Create `AtlasTerrain.astro`**

Build a decorative inline SVG with `viewBox="0 0 720 480"`, `aria-hidden="true"`, six softly colored terrain masses, contour paths, and a dotted route. No image text and no technology logos. Use only the six region palette values and a low-opacity blue route.

- [ ] **Step 4: Rewrite Home hero**

Use:

```astro
<div class="meta-label accent-label">WEB TECHNOLOGY ATLAS</div>
<h1 class="display-title">Web技術の地図を、<br />一緒に旅しよう。</h1>
<p class="hero-description">技術を知り、比べ、つなげて、あなたの次の一歩を見つける。名前の暗記ではなく、役割と関係からWeb技術の世界を眺める地図です。</p>
<div class="hero-actions">
  <a class="button-primary" href={withBase('/landscape')}>地図を開く</a>
  <a class="button-secondary" href={withBase('/technologies')}>技術を探す</a>
</div>
```

Render `AtlasTerrain` on the right. Render four data-derived metrics: technologies / categories / relations / journeys.

- [ ] **Step 5: Redesign `LandscapePreview` as six region cards**

Use `landscape-region-card` with `data-region={group.id}`, region label, Japanese name, count, and 3 representative icons. Keep a single CTA to `/landscape`. Do not put watercolor images inside each card.

- [ ] **Step 6: Reorganize the rest of Home**

Keep existing content, but make the information flow explicit: Atlas preview -> three start paths (`技術を探す`, `違いを比べる`, `作りたいものから辿る`) -> representative technologies -> comparisons -> journeys -> open source. Preserve all destination URLs.

- [ ] **Step 7: Verify and commit**

Run `npm run check && npm test && npm run build`. Commit: `feat: redesign home as digital atlas`.

---

### Task 3: Full Technology Atlas visual hierarchy

**Files:**
- Modify: `tests/landscape-page.test.mjs`
- Modify: `tests/landscape-styles.test.mjs`
- Modify: `src/pages/landscape.astro`
- Modify: `src/components/TechnologyAtlas.astro`
- Modify: `src/components/RelationshipInspector.astro`
- Modify: `src/styles/landscape-tokens.css`
- Modify: `src/styles/landscape.css`

**Interfaces:**
- Consumes: existing `data-atlas-*` attributes and existing client-side filtering/focus code; these selectors must not be renamed unless the script is changed in the same task.
- Produces: six pale vertical regions, category lanes, white technology nodes, sticky desktop inspector, relation-colored direct lines.

- [ ] **Step 1: Add failing Atlas style/structure assertions**

Assert that `TechnologyAtlas.astro` exposes `data-region={region.id}` on the region section, `landscape.css` contains per-region selectors such as `[data-atlas-region="foundation"]`, `atlas-layout` uses a two-column desktop grid, and the Inspector contains a `戻る` / map return affordance for inline mobile use.

- [ ] **Step 2: Verify RED**

Expected: old monochrome Atlas CSS and no mobile return affordance.

- [ ] **Step 3: Keep the data contract, improve region markup**

Keep all `data-atlas-*` hooks. Add `data-region={region.id}` where useful, make region headings show `01–06`, label, Japanese name, description, and count in a compact header.

- [ ] **Step 4: Replace Atlas colors and layout**

In `landscape-tokens.css`, map legacy aliases to global light tokens. In `landscape.css`:

```css
.atlas-layout {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(280px, 340px);
  gap: 1.25rem;
  align-items: start;
}
.atlas-inspector { position: sticky; top: 92px; }
.atlas-region { border: 1px solid var(--line); border-radius: 18px; overflow: clip; }
.atlas-region[data-atlas-region="foundation"] { background: var(--region-foundation-bg); }
```

Repeat region background rules for all six region ids. Category panels should use translucent white rather than dark surfaces.

- [ ] **Step 5: Redesign nodes and focus states**

Nodes use white surface, thin line, 10px radius. Selected gets blue border + `brand-soft`; direct neighbors stay full contrast; unrelated nodes use `opacity: .4`. Keep focus button and detail link separate.

- [ ] **Step 6: Relation-line colors**

Set line styles using `line[data-relation="built-on"]`, `runs-on`, `works-with`, `implements`, `part-of`, `competes-with`, `alternative-to` with the relation palette from the spec. Width 1.5–2px and no heavy glow.

- [ ] **Step 7: Inspector hierarchy**

Keep text-first relation direction + note. Make the selected technology summary visually dominant, group each relation type by label/swatch, and include a compact return-to-map anchor/button that is hidden on wide screens and shown when inline on tablet/mobile.

- [ ] **Step 8: Verify and commit**

Run `npm run check && npm test && npm run build`. Commit: `feat: redesign technology atlas regions`.

---

### Task 4: Explorer as a readable index

**Files:**
- Modify: `tests/design-v2.test.mjs`
- Modify: `src/pages/technologies/index.astro`
- Modify: `src/components/TechnologyCard.astro`
- Modify: `src/styles/global.css`

**Interfaces:**
- Consumes: all existing `data-tech-*` attributes and `filterTechnologies`; filter behavior and URL state stay unchanged.
- Produces: compact light search panel, clear category sections, 4/2/1 card grid.

- [ ] **Step 1: Add failing Explorer assertions**

Assert `TechnologyCard` renders a `tech-card-role` element and no more than small metadata, and CSS defines 4-column desktop, 2-column <=1020px, 1-column <=760px.

- [ ] **Step 2: Verify RED**

Expected: current card lacks explicit role line and old dark layout remains.

- [ ] **Step 3: Refine card content**

Keep icon/category/name/description. Add `<p class="tech-card-role">{technology.role}</p>` and reduce tag prominence. Preserve every filtering dataset attribute unchanged.

- [ ] **Step 4: Restyle toolbar and sections**

Toolbar uses white surface, 1px line, compact controls, sticky desktop. Category headers get label/name/description with no large dark block. Cards use border + white, almost no shadow.

- [ ] **Step 5: Verify and commit**

Run `npm run check && npm test && npm run build`. Commit: `feat: redesign technology explorer index`.

---

### Task 5: Technology detail as an atlas entry

**Files:**
- Modify: `tests/design-v2.test.mjs`
- Modify: `src/pages/technologies/[id].astro`
- Modify: `src/components/TechnologyRelations.astro`
- Modify: `src/styles/global.css`

**Interfaces:**
- Consumes: `categoryById`, `regionByCategory`, existing metadata helper and relation grouping.
- Produces: region-aware detail header and light right-rail relation index.

- [ ] **Step 1: Add failing detail assertions**

Assert detail imports `regionByCategory` / `landscapeRegions`, renders a `technology-region-label`, and retains `technology-detail-grid` plus `RELATIONSHIP MAP`.

- [ ] **Step 2: Verify RED**

Expected: current detail only displays category.

- [ ] **Step 3: Add region context**

Resolve the technology region from `regionByCategory[technology.category]`, lookup the region object, and render region label + category above the title. Keep official site, metadata, what/role/when sections intact.

- [ ] **Step 4: Restyle the detail page**

Use large official icon, readable title, compact metadata chips/grid, 7–8 / 4–5 column split on desktop. Relation rows use light surfaces and text-first direction. Mobile remains content first, relationships second.

- [ ] **Step 5: Verify and commit**

Run `npm run check && npm test && npm run build`. Commit: `feat: redesign technology atlas entries`.

---

### Task 6: Compare as a decision page

**Files:**
- Modify: `tests/design-v2.test.mjs`
- Modify: `src/pages/compare/[left]/[right].astro`
- Modify: `src/styles/global.css`

**Interfaces:**
- Consumes: existing `compareTechnologies` result (`comparable`, `kind`, `summary`, `directRelations`).
- Produces: verdict-first comparison with two equal cards and a direct-relation note.

- [ ] **Step 1: Add failing Compare assertions**

Assert the page contains `comparison-verdict`, `comparison-facts`, both technology sections, and explicit `いつ使う？` / `避けたい場面` labels.

- [ ] **Step 2: Verify RED**

Expected: current columns only show `Use it when` and no when-not-to-use block.

- [ ] **Step 3: Expand both comparison cards**

For each technology render category, icon, name, `whatItDoes`, `role`, `whenToUse`, and `whenNotToUse`. Keep the verdict above the two columns and direct relation notes below.

- [ ] **Step 4: Restyle**

Use pale verdict panel with visible status label, two white bordered columns on desktop, stacked A then B on mobile. No large VS visual.

- [ ] **Step 5: Verify and commit**

Run `npm run check && npm test && npm run build`. Commit: `feat: redesign technology comparisons`.

---

### Task 7: Journeys as routes

**Files:**
- Modify: `tests/journeys.test.mjs`
- Modify: `tests/design-v2.test.mjs`
- Modify: `src/pages/journeys/index.astro`
- Modify: `src/pages/journeys/[id].astro`
- Modify: `src/styles/global.css`

**Interfaces:**
- Consumes: current journey data and `TechnologyIcon`.
- Produces: route-oriented list cards and dotted/solid vertical rail detail pages.

- [ ] **Step 1: Add failing visual-contract assertions**

Assert journey list rows contain a `journey-route-mark` element and detail retains `journey-rail`, numbered `journey-step-index`, icons, reasons, trade-offs, alternatives.

- [ ] **Step 2: Verify RED**

Expected: list lacks route motif.

- [ ] **Step 3: Enrich list rows without new data**

Add a small dotted route glyph (`aria-hidden`) and retain title, summary, technology count. Keep each row as one simple anchor.

- [ ] **Step 4: Restyle detail route**

Use a 24–36px rail column, numbered circular stop marker, icon/name/category, description, and thin route line. Reasons/trade-offs/alternatives become three light panels on desktop and one column on mobile.

- [ ] **Step 5: Verify and commit**

Run `npm run check && npm test && npm run build`. Commit: `feat: redesign journeys as atlas routes`.

---

### Task 8: Responsive contract, accessibility, cleanup, and full verification

**Files:**
- Modify: `tests/mobile-layout.test.mjs`
- Modify: `tests/design-v2.test.mjs`
- Modify: `src/styles/mobile-layout.css`
- Modify: `src/styles/global.css`
- Modify: `src/styles/landscape.css`
- Modify if required: `README.md`

**Interfaces:**
- Consumes: all previous tasks.
- Produces: final responsive design and regression guards.

- [ ] **Step 1: Write responsive regression assertions**

Extend `mobile-layout.test.mjs` to require:

```js
assert.match(mobileCss, /@media\s*\(max-width:\s*760px\)/);
assert.match(mobileCss, /\.header-inner[\s\S]*?grid-template-columns:\s*1fr/);
assert.match(mobileCss, /\.site-nav[\s\S]*?overflow-x:\s*auto/);
assert.match(mobileCss, /\.atlas-toolbar[\s\S]*?grid-template-columns:\s*1fr/);
assert.match(mobileCss, /\.atlas-layout[\s\S]*?grid-template-columns:\s*minmax\(0,\s*1fr\)/);
assert.match(mobileCss, /\.tech-grid[\s\S]*?grid-template-columns:\s*1fr/);
```

Keep the existing `.atlas-regions { grid-template-columns: minmax(0, 1fr) }` regression.

- [ ] **Step 2: Verify RED**

Expected: new two-row/header and Atlas responsive contracts are not all present yet.

- [ ] **Step 3: Implement breakpoints**

At <=1020px: Atlas Inspector becomes non-sticky/inline, Explorer cards 2 columns, detail/compare 1 or reduced columns as specified. At <=760px: header becomes two rows, nav horizontally scrolls without page overflow, Atlas filters 1 column, Home region preview 2x3, cards 1 column, relation SVG hidden, journey rail compact. At <=480px: reduce shell padding and preserve 44px minimum touch targets.

- [ ] **Step 4: Accessibility review in CSS/markup**

Ensure focus ring is always visible, region meaning never depends only on color, decorative SVG is hidden from assistive tech, buttons/links have labels, and `prefers-reduced-motion` remains.

- [ ] **Step 5: Remove obsolete dark-only styles**

Search `global.css`, `landscape.css`, and `mobile-layout.css` for hard-coded dark canvas values (`#08090b`, `#0e1014`, `rgba(14,16,20`, white-only text hover assumptions). Replace them with semantic tokens where they affect visible UI. Keep brand-logo-specific inversion rules only where required by the icon asset.

- [ ] **Step 6: Run full mandatory verification**

Run:

```bash
npm run check
npm test
npm run build
npx wrangler deploy --dry-run
```

All four must pass.

- [ ] **Step 7: Responsive visual verification**

Render Home, Atlas, Explorer, one Technology detail, one Compare page, Journeys list, and one Journey detail at 320 / 360 / 390 / 430 / 768 / 1024 / 1440px. Confirm no page-level overflow; Atlas node lanes are the only intentional horizontal scrolling area.

- [ ] **Step 8: PR review and publish**

Update PR #13 with verification results, mark ready for review, resolve valid review findings, squash merge, confirm main CI success and GitHub Pages deployment success. Do not claim live visual verification unless the deployed artifact/live site was actually rendered after deploy.
