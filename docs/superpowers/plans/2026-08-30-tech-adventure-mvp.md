# Tech Adventure MVP Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** AstroでTech AdventureのMVPを構築し、技術の役割・比較・関係・用途別旅程を静的サイトとして公開可能にする。

**Architecture:** 技術情報は1技術1JSONファイルと関係JSONを正本にし、Astroの静的生成で一覧・詳細・比較・旅程ページを生成する。サーバーAPIとDBは導入せず、検索・絞り込みだけクライアント側の最小JavaScriptで実装する。Cloudflare Workers Static Assetsへ`dist/`を配信できる構成にする。

**Tech Stack:** Astro 7 / TypeScript strict / Node.js 22 / npm / Node built-in test runner / Cloudflare Wrangler 4 / GitHub Actions

**Spec:** `docs/superpowers/specs/2026-08-30-tech-adventure-mvp-design.md`

## Global Constraints

- Astro 7系を使用する。
- TypeScriptはstrictを有効にする。
- UIフレームワークを導入しない。
- サーバーAPI、DB、HonoはMVPに導入しない。
- 技術情報は公式一次情報を優先する。
- 1技術1JSONファイルを正本とする。
- Cloudflare Pages固有構成ではなくWorkers Static Assetsを使う。
- 変更後は `npm run check`、`npm test`、`npm run build` をすべて成功させる。

---

### Task 1: Astro基盤・品質ゲート

**Files:**
- Create: `package.json`
- Create: `tsconfig.json`
- Create: `astro.config.mjs`
- Create: `.gitignore`
- Create: `src/env.d.ts`
- Create: `src/pages/index.astro`
- Create: `tests/smoke.test.mjs`
- Create: `.github/workflows/ci.yml`

**Interfaces:**
- Consumes: なし
- Produces: `npm run dev`, `npm run check`, `npm test`, `npm run build` が利用できるAstro静的サイト基盤

- [ ] **Step 1: 最初の失敗テストを書く**

`tests/smoke.test.mjs` で `package.json` がAstro 7系を依存に持ち、必須スクリプトがあることを検証する。

```js
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

test('project exposes the required quality scripts on Astro 7', async () => {
  const pkg = JSON.parse(await readFile(new URL('../package.json', import.meta.url), 'utf8'));
  assert.match(pkg.dependencies.astro, /^\^7\./);
  assert.equal(pkg.scripts.check, 'astro check');
  assert.equal(pkg.scripts.test, 'node --test');
  assert.equal(pkg.scripts.build, 'astro build');
});
```

- [ ] **Step 2: テストが失敗することを確認する**

Run: `node --test tests/smoke.test.mjs`
Expected: FAIL because `package.json` does not exist yet.

- [ ] **Step 3: 最小のAstro基盤を実装する**

`package.json`:

```json
{
  "name": "tech-adventure",
  "version": "0.1.0",
  "private": true,
  "type": "module",
  "scripts": {
    "dev": "astro dev",
    "check": "astro check",
    "test": "node --test",
    "build": "astro build"
  },
  "dependencies": {
    "astro": "^7.2.9"
  },
  "devDependencies": {
    "@astrojs/check": "^0.9.4",
    "typescript": "^5.9.2",
    "wrangler": "^4.34.0"
  }
}
```

`tsconfig.json`:

```json
{
  "extends": "astro/tsconfigs/strict"
}
```

`astro.config.mjs`:

```js
import { defineConfig } from 'astro/config';

export default defineConfig({
  output: 'static',
  trailingSlash: 'never'
});
```

`src/env.d.ts`:

```ts
/// <reference types="astro/client" />
```

`src/pages/index.astro` は最小のHTMLを返す。

- [ ] **Step 4: テストを成功させる**

Run: `npm install && npm test`
Expected: PASS.

- [ ] **Step 5: Astroの型チェックとビルドを確認する**

Run: `npm run check && npm run build`
Expected: both exit 0 and `dist/index.html` exists.

- [ ] **Step 6: CIを追加する**

Node.js 22で `npm ci`, `npm run check`, `npm test`, `npm run build` をPRとmain pushで実行するGitHub Actionsを作る。

- [ ] **Step 7: コミットする**

```bash
git add package.json package-lock.json tsconfig.json astro.config.mjs .gitignore src tests .github/workflows/ci.yml
git commit -m "chore: scaffold Astro quality gates"
```

---

### Task 2: 技術データモデルと整合性検証

**Files:**
- Create: `src/data/schema.ts`
- Create: `src/data/categories.ts`
- Create: `src/data/load.ts`
- Create: `src/data/relations.json`
- Create: `src/data/technologies/*.json`
- Create: `tests/data.test.mjs`

**Interfaces:**
- Consumes: Node / Astro基盤
- Produces: `Technology`, `CategoryId`, `TechnologyRelation`, `getTechnologies()`, `getRelations()`, `getTechnologyById(id)`

- [ ] **Step 1: データ整合性の失敗テストを書く**

テストは `src/data/technologies` のJSONを直接読み、次を検証する。

```js
assert.equal(ids.size, files.length);
assert.ok(technology.id.length > 0);
assert.ok(technology.name.length > 0);
assert.ok(technology.officialUrl.startsWith('https://'));
assert.ok(categoryIds.has(technology.category));
assert.ok(technology.whenToUse.length > 0);
assert.ok(technology.whenNotToUse.length > 0);
```

relationについては次を検証する。

```js
assert.ok(ids.has(relation.source));
assert.ok(ids.has(relation.target));
assert.notEqual(relation.source, relation.target);
assert.ok(relation.note.trim().length > 0);
```

- [ ] **Step 2: データが存在しないためテストが失敗することを確認する**

Run: `npm test`
Expected: FAIL because technology data is absent.

- [ ] **Step 3: 型とローダーを実装する**

`schema.ts` で設計書の型を定義し、`load.ts` では `import.meta.glob('./technologies/*.json', { eager: true })` を使ってデータを読み込む。

`getTechnologyById(id: string): Technology | undefined` はid一致の技術を返す。

- [ ] **Step 4: 初期20技術前後を追加する**

JavaScript, TypeScript, React, Vue, Svelte, Astro, Next.js, Nuxt, SvelteKit, Hono, Express, Fastify, Node.js, Bun, Deno, Cloudflare Workers, Vite, PostgreSQL, SQLite, Cloudflare D1, Cloudflare R2, Cloudflare KVを収録する。

各JSONは設計書の必須項目をすべて埋め、公式URLのみを使用する。

- [ ] **Step 5: 代表的な関係を追加する**

最低限次を明示する。

```text
Astro competes-with Next.js
Astro works-with React
Astro works-with Vue
Astro works-with Svelte
Hono runs-on Cloudflare Workers
Hono runs-on Node.js
Hono runs-on Bun
Hono runs-on Deno
Next.js built-on React
Nuxt built-on Vue
SvelteKit built-on Svelte
Cloudflare D1 alternative-to SQLite
```

Astro と Hono は `competes-with` にしない。

- [ ] **Step 6: テスト・型チェックを成功させる**

Run: `npm test && npm run check`
Expected: all pass.

- [ ] **Step 7: コミットする**

```bash
git add src/data tests/data.test.mjs
git commit -m "feat: add technology knowledge model"
```

---

### Task 3: 共通レイアウトとデザインシステム

**Files:**
- Create: `src/layouts/BaseLayout.astro`
- Create: `src/components/SiteHeader.astro`
- Create: `src/components/SiteFooter.astro`
- Create: `src/components/TechnologyCard.astro`
- Create: `src/styles/global.css`
- Create: `tests/presentation.test.mjs`

**Interfaces:**
- Consumes: `Technology`
- Produces: `BaseLayout`, `TechnologyCard`

- [ ] **Step 1: 表示契約の失敗テストを書く**

ソースを読み、アクセシビリティと主要ブランド文言を確認する。

```js
assert.match(layoutSource, /<main/);
assert.match(headerSource, /TECH ADVENTURE/);
assert.match(cssSource, /--space-/);
assert.match(cssSource, /prefers-reduced-motion/);
```

- [ ] **Step 2: テスト失敗を確認する**

Run: `npm test`
Expected: FAIL because layout/components/styles do not exist.

- [ ] **Step 3: 共通UIを実装する**

ブランド文言は `TECH ADVENTURE`、主コピーは `技術の世界を、迷わず冒険する。` とする。

CSSはOS標準フォント、レスポンシブ余白、CSS変数、フォーカス表示、reduced-motion対応を含める。

- [ ] **Step 4: テストとビルドを確認する**

Run: `npm test && npm run check && npm run build`
Expected: all pass.

- [ ] **Step 5: コミットする**

```bash
git add src/layouts src/components src/styles tests/presentation.test.mjs
git commit -m "feat: add field-guide visual system"
```

---

### Task 4: 技術一覧と詳細ページ

**Files:**
- Create: `src/pages/technologies/index.astro`
- Create: `src/pages/technologies/[id].astro`
- Create: `src/components/TechnologyRelations.astro`
- Create: `src/scripts/technology-filter.ts`
- Create: `tests/routes.test.mjs`

**Interfaces:**
- Consumes: `getTechnologies()`, `getRelations()`, `getTechnologyById()`
- Produces: `/technologies` と `/technologies/[id]`

- [ ] **Step 1: 静的ルート期待値の失敗テストを書く**

ビルド後に次のファイルが存在することを検証する。

```text
dist/technologies/index.html
dist/technologies/astro/index.html
dist/technologies/hono/index.html
```

HTMLに `何者？`, `いつ使う？`, `いつ使わない？` が含まれることも検証する。

- [ ] **Step 2: ビルド後テストが失敗することを確認する**

Run: `npm run build && npm test`
Expected: FAIL because pages are absent.

- [ ] **Step 3: 一覧ページを実装する**

カテゴリ別カード、テキスト検索、カテゴリ絞り込みを実装する。全技術はHTMLに初期描画し、JavaScript無効でも一覧として読めるようにする。

- [ ] **Step 4: 詳細ページを実装する**

`getStaticPaths()` で全技術を静的生成し、関係データから同じ土俵・一緒に使う・実行環境を表示する。

- [ ] **Step 5: テスト・型チェック・ビルドを成功させる**

Run: `npm run check && npm run build && npm test`
Expected: all pass.

- [ ] **Step 6: コミットする**

```bash
git add src/pages/technologies src/components/TechnologyRelations.astro src/scripts tests/routes.test.mjs
git commit -m "feat: add technology explorer"
```

---

### Task 5: 技術比較ページ

**Files:**
- Create: `src/lib/compare.ts`
- Create: `src/pages/compare/[left]/[right].astro`
- Create: `tests/compare.test.mjs`

**Interfaces:**
- Consumes: `Technology`, `TechnologyRelation[]`
- Produces: `compareTechnologies(left, right, relations): ComparisonResult`

`ComparisonResult`:

```ts
interface ComparisonResult {
  comparable: boolean;
  kind: 'same-category' | 'related-layers' | 'different-layers';
  summary: string;
  directRelations: TechnologyRelation[];
}
```

- [ ] **Step 1: 比較ロジックの失敗テストを書く**

最低限3ケースをテストする。

```js
Astro vs Next.js => comparable true, same-category
Astro vs Hono => comparable false, different-layers
React vs Next.js => comparable false, related-layers
```

- [ ] **Step 2: 失敗を確認する**

Run: `npm test`
Expected: FAIL because `compareTechnologies` does not exist.

- [ ] **Step 3: 最小比較ロジックを実装する**

同カテゴリなら `same-category`。異カテゴリで `built-on` / `runs-on` など直接関係があれば `related-layers`。それ以外は `different-layers`。

- [ ] **Step 4: 静的比較ページを実装する**

初期収録技術の全順列は生成せず、代表比較と直接関係がある組み合わせのみを `getStaticPaths()` で生成する。

- [ ] **Step 5: テスト・ビルドを確認する**

Run: `npm test && npm run check && npm run build`
Expected: all pass.

- [ ] **Step 6: コミットする**

```bash
git add src/lib/compare.ts src/pages/compare tests/compare.test.mjs
git commit -m "feat: explain technology comparisons"
```

---

### Task 6: 目的別旅程とトップページ

**Files:**
- Create: `src/data/journeys.ts`
- Create: `src/pages/journeys/index.astro`
- Create: `src/pages/journeys/[id].astro`
- Modify: `src/pages/index.astro`
- Create: `tests/journeys.test.mjs`

**Interfaces:**
- Consumes: technology ids
- Produces: `Journey`, `getJourneys()` とトップページ主要導線

`Journey`:

```ts
interface Journey {
  id: string;
  title: string;
  summary: string;
  technologyIds: string[];
  reasoning: string[];
  alternatives: string[];
}
```

- [ ] **Step 1: 旅程整合性の失敗テストを書く**

全 `technologyIds` が実在し、各旅程に `reasoning` と `alternatives` が1件以上あることを検証する。

- [ ] **Step 2: 失敗を確認する**

Run: `npm test`
Expected: FAIL because journeys are absent.

- [ ] **Step 3: 4旅程を実装する**

- ブログを作る
- 企業サイトを作る
- APIを作る
- 小規模SaaSを作る

各旅程は代表構成と代替案を示し、「唯一の正解」と表現しない。

- [ ] **Step 4: トップページを完成させる**

技術探索、旅程探索、代表比較、カテゴリ入口を配置する。

- [ ] **Step 5: テスト・ビルドを成功させる**

Run: `npm test && npm run check && npm run build`
Expected: all pass.

- [ ] **Step 6: コミットする**

```bash
git add src/data/journeys.ts src/pages/journeys src/pages/index.astro tests/journeys.test.mjs
git commit -m "feat: add guided technology journeys"
```

---

### Task 7: OSS文書とCloudflare Workers公開設定

**Files:**
- Modify: `README.md`
- Create: `LICENSE`
- Create: `CONTRIBUTING.md`
- Create: `AGENTS.md`
- Create: `wrangler.jsonc`
- Create: `tests/project-docs.test.mjs`

**Interfaces:**
- Consumes: 完成したMVP構成
- Produces: 外部寄稿可能でCloudflare Workersへデプロイ可能な公開リポジトリ

- [ ] **Step 1: プロジェクト契約の失敗テストを書く**

READMEに目的・ローカル起動・品質コマンド・データ追加方法があること、Wranglerが `./dist` をassets directoryに指定することを検証する。

- [ ] **Step 2: 失敗を確認する**

Run: `npm test`
Expected: FAIL because docs/config are absent or incomplete.

- [ ] **Step 3: OSS文書を実装する**

READMEは「何のためのプロジェクトか」を最初に説明する。CONTRIBUTINGは技術追加と関係修正の手順を示す。AGENTSは公式一次情報優先・推測禁止・依存追加抑制・検証必須を定める。

- [ ] **Step 4: Workers Static Assets設定を追加する**

```jsonc
{
  "$schema": "./node_modules/wrangler/config-schema.json",
  "name": "tech-adventure",
  "compatibility_date": "2026-08-30",
  "assets": {
    "directory": "./dist"
  }
}
```

- [ ] **Step 5: 全品質ゲートを実行する**

Run: `npm run check && npm test && npm run build`
Expected: all pass.

- [ ] **Step 6: Wrangler dry-runを実行する**

Run: `npx wrangler deploy --dry-run`
Expected: exit 0 and static assets are discovered from `dist`.

- [ ] **Step 7: コミットする**

```bash
git add README.md LICENSE CONTRIBUTING.md AGENTS.md wrangler.jsonc tests/project-docs.test.mjs
git commit -m "docs: prepare Tech Adventure for open source release"
```

---

### Task 8: 最終検証

**Files:**
- Modify only if verification finds defects

**Interfaces:**
- Consumes: Tasks 1-7
- Produces: merge-ready MVP

- [ ] **Step 1: 依存関係を再現可能状態で検証する**

Run: `rm -rf node_modules dist && npm ci`
Expected: exit 0.

- [ ] **Step 2: 全品質ゲートを再実行する**

Run: `npm run check && npm test && npm run build && npx wrangler deploy --dry-run`
Expected: all exit 0.

- [ ] **Step 3: 生成物を確認する**

最低限次が存在することを確認する。

```text
dist/index.html
dist/technologies/index.html
dist/technologies/astro/index.html
dist/technologies/hono/index.html
dist/compare/astro/hono/index.html
dist/compare/astro/nextjs/index.html
dist/journeys/index.html
```

- [ ] **Step 4: リポジトリ内の禁止パターンを確認する**

秘密情報、`.env`、生成済み `dist/`、`node_modules/` がGit管理されていないことを確認する。

- [ ] **Step 5: 最終コミットまたは修正コミットを作成する**

不具合があれば原因を修正し、全品質ゲートを再実行してからコミットする。不具合がなければ追加コミットは作らない。
