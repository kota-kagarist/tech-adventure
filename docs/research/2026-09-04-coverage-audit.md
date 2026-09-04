# Tech Adventure 2026 Coverage Audit

Date: 2026-09-04

## Purpose

Tech Adventure の収録数を増やすこと自体ではなく、Web技術の役割・比較・組み合わせを理解するうえで、現行カタログに説明上の穴がないかを再点検した。

追加判断は次の3条件をすべて満たすものに限定した。

1. **Role gap**: 現行カタログだけでは重要な役割・方式を説明しにくい
2. **Current relevance**: 2025–2026時点でも学ぶ価値が確認できる
3. **Relationship evidence**: 公式一次情報から既存技術との関係を説明できる

人気順位やGitHub Starsだけでは採用しない。

## Added

### Web Components

- ID: `web-components`
- Category: `language`
- Primary source: https://developer.mozilla.org/en-US/docs/Web/API/Web_components
- Role gap: React/Vue/Svelte等のライブラリは収録済みだったが、Custom Elements、Shadow DOM、template/slotというブラウザ標準のコンポーネント基盤を独立して説明する項目がなかった。
- Relations: HTMLを土台にし、JavaScript APIと組み合わせる。LitはWeb Componentsを基盤にする。

### Service Worker

- ID: `service-worker`
- Category: `runtime`
- Primary source: https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API
- Role gap: Browser runtimeは収録済みだったが、ページとは別のWorkerコンテキストで通信を仲介し、オフライン・キャッシュ・Push等を支える実行環境が欠けていた。
- Relations: Browser上で動き、HTTP通信と組み合わせる。

### Web App Manifest

- ID: `web-app-manifest`
- Category: `language`
- Primary source: https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps/Manifest
- Role gap: PWAのインストール性やOS統合を説明するとき、名前・アイコン・開始URL・表示方式を宣言する標準メタデータが欠けていた。
- Relations: Browserが読み、Service Workerと組み合わせることでPWAの代表的な構成を説明できる。

### tRPC

- ID: `trpc`
- Category: `protocol-api`
- Primary source: https://trpc.io/
- Role gap: REST / GraphQL / gRPCは収録済みだったが、TypeScriptの型推論をクライアントとサーバー間で直接共有する代表的なAPI設計が欠けていた。
- Relations: TypeScriptを土台にし、入力validatorとしてZod等と組み合わせられる。

### TanStack Router

- ID: `tanstack-router`
- Category: `web-framework`
- Primary source: https://tanstack.com/router/latest/docs/overview
- Role gap: React Routerは収録済みだったが、検索パラメータやloaderまで強く型付けするTanStack系の独立routerが欠けていた。
- Relations: React/Solidと組み合わせ、TanStack Queryとも連携できる。React Routerとは同じrouting層で比較できる。

### SolidStart

- ID: `solidstart`
- Category: `web-framework`
- Primary source: https://docs.solidjs.com/solid-start/v2
- Role gap: Solid本体は収録済みだったが、Solidでフルスタックアプリを組む公式アプリケーションフレームワークが欠けていた。
- Relations: Solidを土台にし、v2ではVite Environment APIを利用する。

### tsdown

- ID: `tsdown`
- Category: `build-transform`
- Primary source: https://tsdown.dev/
- Migration source: https://tsdown.dev/guide/migrate-from-tsup
- Role gap: Webアプリ向けビルドツールは厚い一方、TypeScriptライブラリ配布向けの現行Rolldown系ツールを説明する項目がなかった。
- Relations: Rolldownを土台にし、TypeScriptライブラリの配布ビルドを担う。

## Audited but not added now

### tsup

- Official repository: https://github.com/egoist/tsup
- Decision: **not added**
- Reason: 利用実績は大きいが、公式repositoryが「actively maintainedではない」と明記し、tsdownへの移行を案内している。2026年の地図へ新規項目として追加するより、現行の移行先であるtsdownを採用する方が説明として自然。

### WebdriverIO

- Official site: https://webdriver.io/
- Decision: **not added in this batch**
- Reason: 重要なテスト自動化ツールだが、現行カタログにはPlaywright / Cypress / Selenium / Puppeteerがあり、今回のAtlasで新しい役割地域を埋める優先度は低い。テスト領域の比較をさらに深掘りする回で再検討する。

### Koa

- Official site: https://koajs.com/
- Decision: **not added in this batch**
- Reason: Node.jsのserver-frameworkとして重要だが、Express / Fastify / Hono / NestJS / Elysia等が既にあり、今回の「役割の穴」を埋める項目ではない。Express系server-frameworkの歴史や比較を厚くする場合に再検討する。

### Node.js Test Runner

- Official docs: https://nodejs.org/api/test.html
- Decision: **not added as a top-level technology**
- Reason: 独立した製品・プロジェクトというよりNode.js本体の標準機能として扱う方が地図上の粒度が自然。将来Node.jsの技術詳細を拡張し、標準test runnerとして説明する。

### Bun test

- Official docs: https://bun.com/docs/test
- Decision: **not added as a top-level technology**
- Reason: Bun runtimeに内蔵されたtest runnerであり、独立ノードにするとNode.js/Bun本体と機能項目の粒度が混在する。Bun詳細の拡張候補とする。

## Secondary relevance signals

以下は採用可否を決める一次技術仕様ではなく、「2025–2026でも学ぶ価値があるか」を見る補助信号としてのみ利用した。

- State of HTML 2025 / Web Components: https://2025.stateofhtml.com/en-US/features/web_components/
  - Custom ElementsやShadow DOMが実利用されており、Web Componentsを現役のWeb標準領域として監査する根拠になった。
- State of JavaScript 2025 / Libraries: https://2025.stateofjs.com/en-US/libraries/
  - tRPC、tsup、Node Test Runner等が現行JavaScriptエコシステムの調査対象として現れていることを確認した。

## Relation storage

今回追加した関係は、既存の大きな `src/data/relations.json` を不用意に書き換えず、検証日と変更範囲を追いやすくするため `src/data/relations-atlas.json` に分離した。`src/data/load.ts` で既存関係と統合し、サイト・比較生成・Atlasからは一つのrelation集合として扱う。

将来この補遺が増えすぎた場合は、日付別ファイルを増殖させるのではなく、relationデータ自体の分割方針を別設計として整理する。
