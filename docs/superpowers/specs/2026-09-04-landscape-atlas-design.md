# Tech Adventure Layered Technology Atlas Design

Date: 2026-09-04
Status: approved design, implementation not started

## 1. Purpose

Tech Adventure を「技術をカテゴリ別に並べたカタログ」から、Web技術の現在地・役割・比較候補・組み合わせを一目で掴める地図へ進化させる。

既存の目的である「人気ランキングではなく、技術世界の役割・比較・組み合わせを理解するための地図」を、サイト上の中心体験として実装する。

今回の中心成果物は新しい `/landscape` ページである。179技術を一度に線で結ぶ巨大な力学グラフにはせず、22カテゴリを上位の6地域へまとめた **Layered Atlas** とする。全体像は常に読め、利用者が1技術を選んだときだけ関係を強調する。

同時に、2026年時点の主要Web技術の網羅性を再監査し、明確な欠落だけを補完する。

## 2. Non-goals

今回やらないこと:

- 人気順・満足度順などのランキング化
- 179ノード・468関係を常時すべて線で描く巨大グラフ
- サーバーAPI、DB、検索バックエンドの追加
- 新しいグラフ描画ライブラリの導入
- 既存22カテゴリの全面再設計
- 既存Technology Explorer、比較ページ、Journeyの置き換え
- 監査で見つけた候補を根拠なしに大量追加すること

## 3. Why a layered atlas

### Rejected: full graph

179技術と468関係を同時表示すると、関係線が重なって初学者が意味を読めない。ノード数が増えるほど位置も安定せず、Tech Adventureの「役割を理解してから関係を見る」という順番と逆になる。

### Rejected: journey-first map

目的別Journeyは既に12本あり、作りたいものから技術を辿る機能として機能している。地図までJourney中心にすると役割が重複し、技術世界そのものの構造を俯瞰できない。

### Chosen: layered atlas

技術を役割地域に固定配置し、通常時は「どの場所に何があるか」を読む。選択時だけ直接関係するノードと線を強調する。これならノードが増えても地図の意味が壊れにくく、静的HTMLを基本に保てる。

## 4. Atlas regions

既存22カテゴリはデータモデル上そのまま維持し、表示専用の上位地域に集約する。

### A. FOUNDATION / Webの土台

- `language`
- `runtime`
- `protocol-api`

ブラウザやサーバーが理解する言語、コードを動かす場所、通信の約束を置く。

### B. INTERFACE / 画面をつくる

- `ui-library`
- `styling`
- `ui-components`
- `state-data`

UIの組み立て、見た目、部品集、画面状態・データ取得を置く。

### C. APPLICATION / サイトとAPIを組む

- `web-framework`
- `server-framework`
- `cms`

Webサイト、Webアプリ、API、コンテンツ配信のアプリケーション層を置く。

### D. DATA & IDENTITY / データと利用者

- `orm`
- `database`
- `backend-platform`
- `auth`

保存、DB操作、Backend as a Service、認証・認可を置く。

### E. DELIVERY / 公開して動かす

- `cloud-hosting`
- `infrastructure`
- `ci-cd`

サービスの配置、ネットワーク・実行基盤、自動検証・公開を置く。

### F. ENGINEERING / 開発を支える

- `package-monorepo`
- `build-transform`
- `quality-validation`
- `testing`
- `observability`

依存管理、ビルド、静的検査、テスト、監視を置く。

この地域分類は表示用データとして独立させ、`Technology.category` の意味を変えない。

## 5. Page structure

新規ページ: `src/pages/landscape.astro`

### Header

- `TECHNOLOGY ATLAS`
- 「Web技術の全体像を、役割から眺める。」
- technology / relation / region の件数
- ExplorerとJourneyへの補助導線

### Controls

- テキスト検索
- ecosystem
- importance (`core` / `major`)
- relation legend
- `Reset focus`

カテゴリフィルタはAtlasでは地域構造そのものがカテゴリを表現するため、初期実装では追加しない。

### Atlas canvas

6地域を縦方向に並べる。各地域内は既存カテゴリごとの小区画を持ち、技術ノードをカードより小さいチップとして配置する。

ノードは常に通常のHTMLリンクとして存在する。JavaScript無効でも全技術と地域構造を閲覧できる。

デスクトップでは地域内を複数列で表示する。小さい画面では横スクロール可能なレーンにし、強制的に全体を縮小しない。

### Focus interaction

技術ノードをクリックまたはキーボードでFocusすると:

1. 選択ノードを強調
2. 直接関係するノードを強調
3. 無関係ノードを薄くする
4. 選択ノードから直接関係ノードへの線だけをSVG overlayで描く
5. 下部または右側のRelationship Inspectorに関係をテキスト表示

通常の詳細ページへ移動するリンクも明示する。Focus操作と詳細遷移を同じクリックにしない。

### Relationship Inspector

選択技術について、既存relation typeごとにまとめる。

- `competes-with`: 同じ土俵の比較候補
- `alternative-to`: 置き換え候補
- `works-with`: よく組み合わせる
- `built-on`: 土台にしている / されている
- `runs-on`: 実行される場所
- `implements`: 規格・方式を実装する
- `part-of`: 大きなサービス・仕組みの一部

方向を持つ関係はsource/targetを保って説明する。

## 6. Rendering architecture

新しい依存パッケージは追加しない。

### Static layer

Astro build時に以下を生成する。

- 6地域
- 22カテゴリ区画
- 全technology node
- 各nodeの検索・絞り込み用data attributes
- Relationship Inspectorの初期説明

### Interactive layer

Vanilla JavaScriptで以下のみ行う。

- filter state
- focus state
- adjacency lookup
- SVG relationship line placement
- resize / scroll後のline再計算
- query parameter同期

関係データはページ内のJSONとしてビルド時に埋め込む。外部APIは呼ばない。

SVG線はfocus時だけ生成する。全468関係を常時DOMへ描画しない。

### Suggested modules

- `src/data/landscape.ts`
  - 6地域定義
  - category -> region mapping
- `src/lib/landscape.mjs`
  - filter
  - relation adjacency
  - focus stateからvisible/highlight対象を計算
  - DOMに依存しない部分をテスト可能にする
- `src/components/TechnologyAtlas.astro`
  - static atlas markup
- `src/components/RelationshipInspector.astro`
  - 選択時説明UI
- `src/pages/landscape.astro`
  - page composition and small DOM controller

既存の`TechnologyIcon.astro`、`withBase()`、`getTechnologies()`、`getRelations()`を再利用する。

## 7. Home-page integration

現在の`LandscapePreview.astro`は6グループ・18代表ノードの静的プレビューであり、実際の全体地図とは異なる。

今回:

- 18ノード構成を「6地域のミニAtlas」に変更
- 各地域の技術件数を表示
- 代表Core技術を1〜3件だけ表示
- CTAを `/landscape` の `Open full atlas` に変更
- 既存 `/technologies` Explorerへの導線は残す

ホームで全179ノードを描かない。

## 8. Coverage audit

### Goal

「数を増やす」ことではなく、2026年のWeb技術世界を理解する上で説明上の穴になっている技術を見つける。

### Inclusion gate

新規technologyは原則として次の3条件をすべて満たす。

1. **Role gap**: 既存179技術だけでは重要な役割・方式を説明できない、または主要な比較軸が欠けている
2. **Current relevance**: 2025–2026の公式情報、主要調査、または広い実利用から現在も学ぶ価値が確認できる
3. **Relationship evidence**: 公式一次情報から既存技術との`works-with` / `built-on` / `runs-on` / `implements` / `competes-with` / `alternative-to`等を説明できる

単に新しい、話題、GitHub Starsが多い、という理由だけでは追加しない。

### Initial audit candidates

現行ファイル一覧から、少なくとも次を監査対象にする。ここに列挙しただけでは追加確定ではない。

- Web Components / Custom Elements / Shadow DOM
- Service Worker / PWA / Web App Manifest
- tRPC
- TanStack Router
- tsup / tsdown周辺
- SolidStart
- WebdriverIO
- Koa
- Node Test Runner
- bun test

State of JavaScript 2025では`tsup`、`tRPC`、Node Test Runner等が主要ライブラリ群に含まれ、State of HTML 2025ではCustom Elements利用経験が過半数に達しているため、現行カタログに存在しないものは監査優先度が高い。

### Audit output

実装PRには以下を残す。

- 追加したtechnologyと根拠
- 監査したが追加しなかった候補と理由
- 追加relationと一次情報

大量追加を一括で行わず、今回のAtlas理解に必要な穴を優先する。

## 9. Data rules

既存`AGENTS.md`をそのまま適用する。

- 1技術1JSON
- 公式一次情報優先
- 不明な関係は推測しない
- 異なる層を安易に`competes-with`にしない
- 平易な日本語
- popularity ranking表現を避ける

`lastVerified`は今回確認した日付へ更新する場合、実際に一次情報を再確認したtechnologyだけ変更する。

## 10. Accessibility and fallback

- 技術ノードはキーボード操作可能
- Focus状態は色だけでなくborder / opacity / text labelで表現
- relation typeは線種だけでなくInspector内の文字でも示す
- JavaScript無効でも全技術ノードと地域分類を読める
- prefers-reduced-motionではtransitionを抑える
- mobileではrelation linesに依存せずInspectorを主表示にする

## 11. URL state

共有可能な状態として最低限以下をquery parameterへ反映する。

- `focus=<technology-id>`
- `query=<text>`
- `ecosystem=<id>`
- `importance=core|major`

無効な値は無視して安全に初期状態へ戻す。

GitHub Pagesの`/tech-adventure/` base pathを壊さない。

## 12. Error handling

- relationが存在しないtechnologyをfocusしてもInspectorに「直接関係は未登録」と表示しクラッシュしない
- relationのsource/targetが存在しない場合は既存data validation testで失敗させる
- URLに未知technology idがあればfocusなしで表示
- DOM上の座標が取得できない場合は線を描かず、Inspectorだけを正常表示

可視化は補助であり、線の描画失敗で地図本体を使えなくしない。

## 13. Tests

TDDで進める。

最低限追加するテスト:

### Data / mapping

- 全22カテゴリがちょうど1地域に割り当てられる
- 6地域に重複idがない
- technologyが必ず有効な地域へ解決される

### Filtering

- query / ecosystem / importanceの組み合わせ
- aliases / tagsも検索対象
- 無効filterで0件になっても安全

### Focus / relations

- focus technologyの直接relationだけを返す
- source / target方向を壊さない
- relation type別grouping
- unknown focus idを安全に無視

### Static page contracts

- `/landscape`がbuildされる
- GitHub Pages base pathを守る
- 主要nodeが通常のanchorとしてHTMLに存在する
- homepage previewが`/landscape`へ導線を持つ

### Catalog audit

- 新規technology JSON schema
- relation参照切れなし
- Core technology relation coverageの既存保証を維持

## 14. Required verification

リポジトリの必須検証をすべて通す。

```bash
npm run check
npm test
npm run build
npx wrangler deploy --dry-run
```

加えてbuild後に:

- `/landscape/index.html`生成確認
- GitHub Pages base path内部リンク切れ確認
- desktop / mobileでAtlasの表示確認
- keyboard focusとInspector操作確認

## 15. Success criteria

完了条件:

1. `/landscape`を開けば、初学者がWeb技術を6つの大きな役割地域として俯瞰できる
2. 全technologyがAtlas内のどこかに存在する
3. 1技術を選ぶと、直接の比較・代替・組み合わせ・依存関係だけが読める
4. 全relationを常時表示せず、情報密度を制御できる
5. Explorer / Journey / technology detail / comparisonの既存導線を壊さない
6. 明確なカタログ欠落を一次情報で監査し、必要分だけ補完する
7. JavaScriptがなくても役割別の全技術一覧として利用できる
8. 新規runtime dependencyを追加しない
9. 必須検証がすべて成功する

## 16. Research references

監査の入口として使用する。個々のtechnology追加時は必ず各公式一次情報も確認する。

- State of JavaScript 2025 Libraries: https://2025.stateofjs.com/en-US/libraries/
- State of JavaScript 2025 Build Tools: https://2025.stateofjs.com/en-US/libraries/build-tools/
- State of HTML 2025 Web Components: https://2025.stateofhtml.com/en-US/features/web_components/
- MDN Web Components: https://developer.mozilla.org/en-US/docs/Web/API/Web_components
- MDN Progressive Web Apps: https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps/
