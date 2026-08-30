# Tech Adventure Catalog Expansion Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 2026年時点の主要Web技術179件を、22カテゴリ・320件以上の意味ある関係と絞り込み可能なExplorerで公開する。

**Architecture:** 1技術1 JSONを正本とし、Viteの `import.meta.glob` で自動読込する。カテゴリとecosystemはTypeScriptの管理済みIDで検証し、Node標準テストがJSONと関係を直接読み込んで完全性を保証する。Astroは179件の詳細ページを静的生成し、Explorerの絞り込みだけを素のブラウザJavaScriptで行う。

**Tech Stack:** Astro 7、TypeScript 5.9、Node.js 22標準テスト、GitHub Actions、GitHub Pages、Cloudflare Workers Static Assets dry-run

**Spec:** `docs/superpowers/specs/2026-08-30-expand-catalog-design.md`

## Global Constraints

- 収録数は179技術、22カテゴリ、320関係以上とする。
- ユーザー指定175技術、既存D1・R2・KV、追加React Routerをすべて含める。
- 全技術が1関係以上、`core` は3関係以上を持つ。
- 1技術1 JSON、サーバーAPIなし、新しい実行時依存なしを維持する。
- GitHub Pagesの `site`、`base`、静的出力と既存URLを維持する。
- 黒基調と紫アクセントを維持する。
- 公式一次情報を優先し、確認日は `2026-08-30` とする。

---

### Task 1: データ契約をテストで固定する

**Files:**
- Modify: `tests/data.test.mjs`
- Create: `tests/fixtures/required-technologies.mjs`

**Interfaces:**
- Produces: `requiredTechnologyIds: readonly string[]`
- Produces: JSONデータとrelationに対する失敗条件

- [ ] **Step 1: 必須IDの固定fixtureを作る**

カテゴリ別のID配列をリテラルで定義し、flattenした `requiredTechnologyIds` と件数179をexportする。期待値は実装側から計算しない。

- [ ] **Step 2: 179技術と新項目を要求するテストを書く**

`tests/data.test.mjs` でファイル名とid、重複、22カテゴリ、必須ID、`role`、`importance`、`ecosystem`、`aliases`、`lastVerified`、HTTPS URL、日付、説明配列を検証する。壊れたJSONフィールドを削除すれば失敗するテストにする。

- [ ] **Step 3: 関係地図の契約テストを書く**

320件以上、未知ID、自己参照、正規化した重複、対称関係の逆向き重複、`competes-with` のカテゴリ一致、全技術次数1以上、core次数3以上を検証する。

- [ ] **Step 4: テストが期待理由で失敗することを確認する**

Run: `node --test tests/data.test.mjs`

Expected: 22技術しかなく、必須項目と関係数も不足しているためFAILする。構文エラーではないことを確認する。

- [ ] **Step 5: RED状態をコミットする**

```bash
git add tests/data.test.mjs tests/fixtures/required-technologies.mjs
git commit -m "test: define expanded catalog contracts"
```

---

### Task 2: 分類・スキーマ・自動読込を実装する

**Files:**
- Modify: `src/data/schema.ts`
- Modify: `src/data/categories.ts`
- Create: `src/data/ecosystems.ts`
- Modify: `src/data/technologies/index.ts`
- Modify: `src/data/load.ts`

**Interfaces:**
- Produces: `CategoryId` 22値
- Produces: `EcosystemId` 24値と `ecosystems` 表示定義
- Produces: 拡張後の `Technology`
- Produces: 自動読込された `technologies: Technology[]`

- [ ] **Step 1: 22カテゴリとecosystem定義を実装する**

仕様書のID、表示名、説明、順序を `categories.ts` と `ecosystems.ts` にリテラルで定義する。

- [ ] **Step 2: TechnologyとRelationTypeを拡張する**

`role`、`importance`、`ecosystem`、`aliases`、`lastVerified` と、relationの `implements`、`part-of` を型へ追加する。

- [ ] **Step 3: 個別importをglobへ置き換える**

```ts
const modules = import.meta.glob<Technology>('./*.json', {
  eager: true,
  import: 'default'
});

export const technologies = Object.values(modules);
```

- [ ] **Step 4: 型と読込構造を確認する**

Run: `npm run check`

Expected: 型とglob構文に問題がなくPASSする。JSON内容の不足はTask 1のデータテストが引き続きREDとして検出する。

- [ ] **Step 5: 分類とloaderをコミットする**

```bash
git add src/data/schema.ts src/data/categories.ts src/data/ecosystems.ts src/data/technologies/index.ts src/data/load.ts
git commit -m "refactor: auto-load catalog records"
```

---

### Task 3: 179技術のデータを整備する

**Files:**
- Modify: `src/data/technologies/*.json`
- Create: `docs/research/2026-catalog-sources.md`

**Interfaces:**
- Consumes: `Technology` と管理済みcategory/ecosystem ID
- Produces: 179個の完全な技術JSON

- [ ] **Step 1: カテゴリごとのレコード定義を作る**

作業用生成スクリプトを一時ファイルとして用意し、各レコードに `id`、`name`、公式URL、短い説明、役割、利用条件、避ける条件、成熟度、主要度、ecosystem、aliases、tagsをリテラルで持たせる。既存22件も同じ品質へ更新する。

- [ ] **Step 2: 1技術1 JSONを生成し、一時スクリプトを削除する**

JSONは2空白で整形し、末尾改行を付ける。生成後に一時スクリプトを削除し、正本を `src/data/technologies/*.json` だけに戻す。

- [ ] **Step 3: 変化の速い技術の公式根拠を記録する**

`docs/research/2026-catalog-sources.md` にState of JS/CSS、Stack Overflow調査、Remix、React Router、TanStack Start、Astro、Turbopack、Rolldownの公式URLと確認内容を記録する。

- [ ] **Step 4: 技術データ部分のテストを通す**

Run: `node --test --test-name-pattern="technology|catalog|official|verified" tests/data.test.mjs`

Expected: 技術データ関連PASS。relation件数のテストはまだFAILしてよい。

- [ ] **Step 5: Astro checkを通す**

Run: `npm run check`

Expected: 0 errors、0 warnings、0 hints。

- [ ] **Step 6: 技術データをコミットする**

```bash
git add src/data/technologies docs/research/2026-catalog-sources.md
git commit -m "feat: expand catalog to 179 technologies"
```

---

### Task 4: 320件以上の関係地図を作る

**Files:**
- Modify: `src/data/relations.json`
- Modify: `src/components/TechnologyRelations.astro`

**Interfaces:**
- Consumes: 179技術のid、category、role
- Produces: 参照整合性を満たす `TechnologyRelation[]`

- [ ] **Step 1: 同一役割の比較群を作る**

UIライブラリ、Webフレームワーク、サーバーフレームワーク、実行環境、CSS、状態管理、通信方式、build、testing、ORM、DB、BaaS、auth、cloud、CI、CMS、observabilityごとに直接比較できる組を定義する。

- [ ] **Step 2: 異なる層の組み合わせを作る**

`built-on`、`runs-on`、`works-with`、`implements`、`part-of` を、公式対応が明確な構成だけに付ける。noteには比較軸または具体的な組み合わせ方を書く。

- [ ] **Step 3: 全データテストを通す**

Run: `node --test tests/data.test.mjs`

Expected: 179技術、320関係以上、孤立0、core次数3以上を含めてPASS。

- [ ] **Step 4: 新relationを詳細画面で読めるようにする**

`implements` と `part-of` を向き別の日本語見出しで表示し、既存5種類を壊さない。

- [ ] **Step 5: 関係地図をコミットする**

```bash
git add src/data/relations.json src/components/TechnologyRelations.astro
git commit -m "feat: connect the modern web technology map"
```

---

### Task 5: Explorerと詳細画面を拡張する

**Files:**
- Modify: `tests/design-v2.test.mjs`
- Create: `tests/explorer.test.mjs`
- Create: `src/lib/explorer.mjs`
- Modify: `src/components/TechnologyCard.astro`
- Modify: `src/pages/technologies/index.astro`
- Modify: `src/pages/technologies/[id].astro`
- Modify: `src/styles/global.css`

**Interfaces:**
- Consumes: category、ecosystem、importance、maturity、aliases、tags
- Produces: 5条件AND検索、URL同期、解除、0件表示、詳細メタ情報

- [ ] **Step 1: Explorerの利用者向け挙動をテストする**

`src/lib/explorer.mjs` に公開する `normalizeSearchText`、`matchesTechnology`、`readFilters`、`writeFilters` の望ましいAPIを先にテストする。aliasesやecosystemを検索対象から外した場合、AND条件をORへ変えた場合、空のquery parameterを残した場合に失敗する、実データを使わないリテラル期待値にする。

- [ ] **Step 2: テストが期待理由で失敗することを確認する**

Run: `node --test tests/explorer.test.mjs tests/design-v2.test.mjs`

Expected: `src/lib/explorer.mjs` が存在しないためFAIL。構文エラーではなく未実装moduleが理由であることを確認する。

- [ ] **Step 3: 絞り込み関数、カード、Explorerを実装する**

純粋関数を `src/lib/explorer.mjs` に実装し、Astroのブラウザscriptから同じ関数を使う。必要な検索値をdata属性へ正規化して埋め込み、5条件をAND適用する。query parameterを初期値として読み、操作後に `history.replaceState` へ反映する。件数はaria-liveで通知する。

- [ ] **Step 4: 解除と0件表示を実装する**

全条件を初期化するボタン、該当なし表示、空カテゴリの非表示を実装する。

- [ ] **Step 5: 詳細メタ情報とCSSを実装する**

role、importance、maturity、ecosystem、lastVerifiedを詳細画面へ加え、既存の黒・紫の設計とモバイル幅を維持する。

- [ ] **Step 6: ExplorerテストとAstro checkを通す**

Run: `node --test tests/explorer.test.mjs tests/design-v2.test.mjs && npm run check`

Expected: 全PASS、Astro 0 diagnostics。

- [ ] **Step 7: 画面をコミットする**

```bash
git add tests/explorer.test.mjs tests/design-v2.test.mjs src/lib/explorer.mjs src/components/TechnologyCard.astro src/pages/technologies src/styles/global.css
git commit -m "feat: filter the expanded technology explorer"
```

---

### Task 6: 文書・静的生成・Pages互換を仕上げる

**Files:**
- Modify: `README.md`
- Modify: `CONTRIBUTING.md`
- Modify: `AGENTS.md`
- Modify: `tests/github-pages.test.mjs`

**Interfaces:**
- Produces: 自動読込を前提とした追加手順
- Produces: 179詳細ページとGitHub Pages互換の検証

- [ ] **Step 1: 文書を新しい追加手順へ更新する**

手動index importを削除し、必須項目、関係規則、ecosystem規則、4つの必須検証を記載する。

- [ ] **Step 2: 静的生成物の利用者向け契約を追加する**

build後に代表技術ページ、Explorer、base pathを含むリンク、Pages artifact設定が存在することを検証する。Astro自体の動作ではなく、本サイトが公開に必要とする生成物を検証する。

- [ ] **Step 3: 全ローカル検証を実行する**

```bash
npm run check
npm test
npm run build
npx wrangler deploy --dry-run
```

Expected: すべてexit 0。Astroは179技術ページを含む静的ページを生成する。

- [ ] **Step 4: 差分と生成件数を確認する**

`git diff --check`、技術JSON数、relation数、dist内技術ページ数を独立したコマンドで確認する。

- [ ] **Step 5: 仕上げをコミットする**

```bash
git add README.md CONTRIBUTING.md AGENTS.md tests/github-pages.test.mjs
git commit -m "docs: document the expanded technology map"
```

---

### Task 7: 自己レビュー・CI・公開を完了する

**Files:**
- Review: all changes from `main...feat/expand-catalog`

**Interfaces:**
- Produces: main向けPull Request、成功したCI、統合済みmain、公開済みPages

- [ ] **Step 1: 仕様との対応を自己レビューする**

仕様の各完了条件に対応するファイルと検証結果を確認し、弱いrelation、説明の重複、誤ったカテゴリ、古い手動importを検索する。

- [ ] **Step 2: branchをpushしてPull Requestを作る**

PR本文に技術数、カテゴリ数、関係数、自動読込、Explorer、検証結果、2026年情報の注意点を記載する。

- [ ] **Step 3: GitHub Actionsを確認する**

CIのcheck、test、build、Workers dry-runが成功するまで確認する。失敗時はmainへ統合せず、同じbranchで修正して再実行する。

- [ ] **Step 4: mainへ統合する**

CI成功後にPRをsquash mergeし、mainのcommit SHAを取得する。

- [ ] **Step 5: GitHub Pages公開を確認する**

mainのPages workflow成功と、公開URLのExplorerおよび代表詳細ページのHTTP応答を確認する。
