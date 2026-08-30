# Tech Adventure 現代Web技術地図 拡張設計

## 1. 決定事項

Tech Adventureを、2026年8月時点の主要な現代Web技術を役割と関係から理解できる静的サイトへ拡張する。

最終構成は **179技術、22カテゴリ、320関係以上** とする。ユーザー指定の175技術をすべて収録し、既存ページを維持するCloudflare D1・R2・KVと、2026年のReact系を理解する基準点であるReact Routerを加える。

179件は名前の収集目標ではない。各技術について、同じ役割で比較する相手と、異なる役割で組み合わせる相手をたどれる状態を完了条件とする。

## 2. 現在の構成と守る範囲

現在は22技術、10カテゴリ、24関係を収録している。Astro 7による静的生成、GitHub Pagesの `/tech-adventure` 配下、Cloudflare Workers Static Assetsの互換確認、黒基調と紫アクセントの画面は正常に動作している。

今回も次を維持する。

- Astroの静的出力
- GitHub Pagesのproject site用base path
- 1技術1 JSONファイル
- サーバーAPIと永続データベースを持たない構成
- UIフレームワークを追加しない素のJavaScriptによる絞り込み
- 黒基調、紫アクセント、既存の文字階層と余白
- 既存技術ページと既存journeyのURL

新しい実行時依存は追加しない。179枚のカードと179件の詳細ページは静的生成で十分扱えるため、検索サービス、仮想スクロール、クライアント側フレームワークは導入しない。

## 3. 収録基準

次のいずれかを満たす技術を収録する。

1. 実務で広く使われている。
2. 利用や関心が急速に伸びている。
3. 他と区別できる設計思想を持つ。
4. 同じ役割の技術を理解する基準点になる。

利用実績の多さだけでは決めない。たとえばSolidは利用率だけなら上位ではないが、signalsを中心にした反応性の設計を理解する基準点になる。反対に、長い歴史があっても現在のWeb技術を整理する助けにならない技術は追加しない。

調査資料の役割も分ける。State of JS、State of CSS、Stack Overflow Developer Surveyは収録範囲と相対的な普及を確認する材料に使う。各技術の役割、対応環境、安定性は公式サイト、公式文書、公式の公開記事で確認する。

## 4. 収録範囲

表示名の後ろに「既存」とある3件は、現在のURLを残すために指定一覧へ追加する。「追加」とあるReact Routerは、Remix v2の機能統合先であり、2026年6月にv8が公開されたため加える。

| カテゴリID | 表示名 | 件数 | 収録技術 |
| --- | --- | ---: | --- |
| `language` | Web標準・言語 | 11 | HTML、CSS、JavaScript、TypeScript、Python、Go、Rust、PHP、Java、C#、Ruby |
| `ui-library` | UIライブラリ | 10 | React、Vue、Angular、Svelte、Solid、Preact、HTMX、Alpine.js、Lit、Qwik |
| `web-framework` | Webフレームワーク | 10 | Next.js、Nuxt、Astro、SvelteKit、TanStack Start、Remix、React Router（追加）、Gatsby、Fresh、Docusaurus |
| `server-framework` | サーバーフレームワーク | 14 | Hono、Express、Fastify、NestJS、Elysia、Nitro、FastAPI、Django、Flask、Laravel、Rails、Spring Boot、ASP.NET Core、Phoenix |
| `runtime` | 実行環境 | 6 | Node.js、Bun、Deno、Browser、Cloudflare Workers、AWS Lambda |
| `styling` | CSS設計・生成 | 7 | Tailwind CSS、Bootstrap、Sass、CSS Modules、styled-components、Emotion、UnoCSS |
| `ui-components` | UI部品集 | 4 | shadcn/ui、MUI、Ant Design、Chakra UI |
| `state-data` | 状態・データ取得 | 6 | Redux Toolkit、Zustand、TanStack Query、SWR、Apollo Client、Pinia |
| `protocol-api` | 通信・API方式 | 6 | HTTP、REST、GraphQL、WebSocket、Server-Sent Events、gRPC |
| `package-monorepo` | パッケージ・モノレポ | 5 | npm、pnpm、Yarn、Turborepo、Nx |
| `build-transform` | ビルド・変換 | 10 | Vite、webpack、Rollup、esbuild、SWC、Turbopack、Rspack、Rolldown、Parcel、Babel |
| `quality-validation` | 品質・入力検証 | 6 | ESLint、Prettier、Biome、oxlint、Zod、Valibot |
| `testing` | テスト | 9 | Vitest、Jest、Playwright、Cypress、Testing Library、Storybook、MSW、Puppeteer、Selenium |
| `orm` | DB操作支援 | 9 | Prisma、Drizzle ORM、TypeORM、Sequelize、Mongoose、Kysely、SQLAlchemy、Hibernate、Entity Framework Core |
| `database` | データベース | 13 | PostgreSQL、MySQL、SQLite、MongoDB、Redis、MariaDB、SQL Server、DynamoDB、Firestore、Elasticsearch、OpenSearch、ClickHouse、Cloudflare D1（既存） |
| `backend-platform` | バックエンド基盤 | 10 | Supabase、Firebase、Neon、PlanetScale、Turso、Convex、Appwrite、PocketBase、Cloudflare R2（既存）、Cloudflare KV（既存） |
| `auth` | 認証・認可 | 8 | OAuth 2.0、OpenID Connect、Auth.js、Clerk、Better Auth、Keycloak、Firebase Auth、Supabase Auth |
| `cloud-hosting` | クラウド・公開基盤 | 11 | AWS、Azure、Google Cloud、Cloudflare、Vercel、Netlify、Render、Railway、Fly.io、DigitalOcean、Heroku |
| `infrastructure` | 実行・配信基盤 | 8 | Docker、Kubernetes、Terraform、Pulumi、SST、Nginx、Apache HTTP Server、Caddy |
| `ci-cd` | 自動検証・公開 | 4 | GitHub Actions、GitLab CI/CD、CircleCI、Jenkins |
| `cms` | コンテンツ管理 | 7 | WordPress、Strapi、Payload CMS、Directus、Sanity、Contentful、Ghost |
| `observability` | 監視・可観測性 | 5 | Sentry、OpenTelemetry、Datadog、Prometheus、Grafana |
|  | **合計** | **179** |  |

### 2026年時点で説明に注意する技術

- **Remix**: Remix v2のフルスタック機能はReact Routerへ統合された。一方、Remix 3は別の設計で2026年4月にbeta previewが公開されている。単に「React Routerへ改名された」とは書かず、既存系と新系を分けて説明する。
- **React Router**: ルーティングライブラリとしても、フレームワークモードを持つWebフレームワークとしても使える。今回はRemixとの関係を示すため `web-framework` に置く。
- **TanStack Start**: 2026年8月時点でv1 Release Candidate。機能完成に近いが正式版前なので `maturity: emerging` とする。
- **Gatsby**: Reactを基盤にした静的サイト生成の代表例として残す。現在の新規採用候補として無条件に勧めず、成熟した既存資産と過去の設計上の基準点として説明する。
- **Turbopack**: Next.js 16で開発・本番ビルドとも安定版になったため、実験的技術として扱わない。
- **Rolldown**: Vite 8の統合バンドラーとして位置付け、単独利用だけを前提に説明しない。

## 5. カテゴリとecosystemの違い

カテゴリは「何を担当するか」を一つだけ表す。ecosystemは「どの技術圏で使われるか」を複数表せるようにする。

たとえばNext.jsのカテゴリは `web-framework` の一つだけだが、ecosystemは `javascript`、`typescript`、`react`、`node` を持てる。Prismaのカテゴリは `orm` で、ecosystemは `javascript`、`typescript`、`node`、`data` を持てる。

ecosystemは自由入力にしない。表記揺れで絞り込みが壊れないよう、次のIDから選ぶ。

```ts
type EcosystemId =
  | 'web-platform'
  | 'javascript'
  | 'typescript'
  | 'react'
  | 'vue'
  | 'svelte'
  | 'python'
  | 'go'
  | 'rust'
  | 'php'
  | 'java'
  | 'dotnet'
  | 'ruby'
  | 'elixir'
  | 'node'
  | 'bun'
  | 'deno'
  | 'cloudflare'
  | 'aws'
  | 'azure'
  | 'gcp'
  | 'data'
  | 'devops'
  | 'content';
```

Explorerの選択肢はデータから場当たり的に生成せず、ID、表示名、順序を持つ `ecosystems.ts` から生成する。

## 6. 技術データ

各 `src/data/technologies/<id>.json` は次の形に統一する。

```ts
interface Technology {
  id: string;
  name: string;
  shortDescription: string;
  category: CategoryId;
  officialUrl: string;
  whatItDoes: string;
  role: string;
  whenToUse: string[];
  whenNotToUse: string[];
  maturity: 'emerging' | 'established' | 'mature';
  importance: 'core' | 'major';
  ecosystem: EcosystemId[];
  aliases: string[];
  tags: string[];
  lastVerified: string;
}
```

### 各項目の意味

- `id`: 小文字kebab-case。ファイル名と一致させる。
- `shortDescription`: 一覧で役割を判別する一文。宣伝文句を書かない。
- `whatItDoes`: 入力、処理、出力のどこを担当するかが分かる説明。
- `role`: 構成の中で担う責務。カテゴリ名の言い換えだけにしない。
- `officialUrl`: 公式トップ、公式文書、または仕様の公式ページ。HTTPSを使う。
- `whenToUse`: 選ぶ条件を1件以上。単なる長所ではなく利用場面を書く。
- `whenNotToUse`: 避ける条件を1件以上。競合技術との差が出る条件を書く。
- `maturity`: APIと運用実績の安定度。人気や将来性は表さない。
- `importance`: Web全体を理解する基準点を `core`、特定の技術圏で重要な選択肢を `major` とする。優劣や推奨順位ではない。
- `ecosystem`: 前節の管理済みIDを1件以上持つ。
- `aliases`: 略称、旧称、表記揺れ、検索されやすい別名。なければ空配列を許可する。
- `tags`: 用途や設計特徴。ecosystemと同じ値を機械的に重複させない。
- `lastVerified`: 内容を公式情報と照合した日。`YYYY-MM-DD` で記録する。

`lastVerified` はURLが応答した日ではない。説明、安定性、対応環境を公式情報で見直した日とする。CIは日付形式と未来日だけを検証し、時間経過だけでビルドを失敗させない。

## 7. 自動読込

現在の `src/data/technologies/index.ts` は、JSONを1件ずつimportして配列へ追加している。この方法ではファイル追加と登録の二重管理が発生する。

次の形へ変更し、ディレクトリ内のJSONを自動で読み込む。

```ts
const modules = import.meta.glob<Technology>('./*.json', {
  eager: true,
  import: 'default'
});

export const technologies = Object.values(modules);
```

並び順はファイルシステムへ依存させず、既存の `getTechnologies()` がカテゴリ順、次に英語名順で整える。型だけではJSONの欠損を検出できないため、完全性はデータテストで保証する。

## 8. 技術関係

関係は「同じ仕事をする比較相手」と「異なる仕事を分担する組み合わせ相手」を区別する。

| 種類 | 向き | 意味 |
| --- | --- | --- |
| `competes-with` | 対称 | 同じカテゴリで、同じ主目的を直接比較できる |
| `alternative-to` | 対称 | 目的は近いが、抽象度や適用範囲がずれる代替候補 |
| `works-with` | 対称 | 典型的に組み合わせて役割を分担する |
| `runs-on` | 有向 | sourceがtargetの実行環境で動く |
| `built-on` | 有向 | sourceがtargetを技術的な土台にする |
| `implements` | 有向 | sourceがtargetの規格や方式を実装・利用する |
| `part-of` | 有向 | sourceがtargetの製品群または基盤に含まれる |

### 関係の品質条件

- 320件以上を収録する。
- 全技術が1件以上の関係を持ち、孤立ノードを0件にする。
- `core` は比較関係と組み合わせ関係を合わせて3件以上持つ。
- `competes-with` は同じカテゴリの技術間だけに付ける。
- 対称関係を逆向きに重複登録しない。
- 同じsource、target、typeの重複、自己参照、未知IDを禁止する。
- noteは技術名の言い換えではなく、比較軸または組み合わせ方を書く。

関係数は目的ではない。まず同一カテゴリの代表的な比較群を作り、その後に公式対応が確認できる実行環境、基盤、統合を接続する。弱い「一緒に使える」を大量に追加して件数を満たさない。

### 代表的な関係群

- React、Vue、Angular、SvelteのUI設計比較
- Next.js→React、Nuxt→Vue、SvelteKit→Svelte
- Remix v2→React Router、Remix 3とReact Routerの系譜上の違い
- Hono→Workers・Node.js・Bun・Deno
- Prisma・Drizzle ORM→PostgreSQL・MySQL・SQLite
- Firebase Auth→Firebase、Supabase Auth→Supabase
- OpenTelemetry→Datadog・Prometheus・Grafana
- GitHub Actions→Docker・AWS・Cloudflare、Docker→Kubernetes、Terraform→AWS・Azure・Google Cloud

## 9. Explorer

179件を一度に表示しても現在の静的構成で扱える。ただし、目的の層へ戻りやすい絞り込みと、条件を解除する手段が必要になる。

### 絞り込み条件

- 自由語 `q`
- カテゴリ `category`
- ecosystem `ecosystem`
- 主要度 `importance`
- 成熟度 `maturity`

各条件はANDで適用する。自由語は名称、aliases、短い説明、role、tags、ecosystemを検索対象とし、英字の大小と全角・半角の違いを正規化する。

初期表示ではURLのquery parameterを読み、操作後は `history.replaceState` でURLへ反映する。GitHub Pagesのbase pathを壊さず、絞り込み状態を共有できるようにする。

### 操作と表示

- 件数を `aria-live="polite"` で通知する。
- 条件を一度に解除するボタンを置く。
- 0件の場合は空白にせず、該当なしの表示と解除ボタンを出す。
- 条件に合うカードがないカテゴリ見出しは隠す。
- カードにカテゴリ、主要度、代表ecosystem、タグを表示する。
- 既存の黒と紫の配色、カード密度、キーボード操作を維持する。

## 10. 詳細画面と関係表示

詳細画面には次を表示する。

- 何者か
- 構成内での役割
- いつ使うか
- いつ使わないか
- 主要度
- 成熟度
- ecosystem
- 最終確認日
- 公式URL
- 関係地図

関係表示は既存5種類に `implements` と `part-of` を加え、source側とtarget側で見出しを変える。たとえばFirebase Auth側では「含まれる基盤: Firebase」、Firebase側では「含まれる機能: Firebase Auth」と読めるようにする。

比較ページを全関係分だけ生成する変更は行わない。179技術の理解には詳細ページの関係地図で足り、比較ページの大量生成は内容の薄いページを増やすためである。既存の代表比較ページは維持する。

## 11. 調査と記録

技術説明は次の順で確認する。

1. 公式トップまたは公式文書で役割と対象環境を確認する。
2. 安定性に注意が必要な技術は、公式release noteまたは公式blogで状態を確認する。
3. 採用範囲はState of JS 2025、State of CSS 2025、Stack Overflow Developer Survey 2025と照合する。
4. `lastVerified` を実際の確認日にする。

CIで179件の外部URLへ接続すると、一時障害や速度制限で無関係なbuildが失敗する。CIではURLの構文とHTTPSを検証し、外部応答確認は今回の作業中に一度実行して結果を自己レビューへ記録する。

急速に状態が変わる技術の根拠は `docs/research/2026-catalog-sources.md` に残す。最低限、Remix、React Router、TanStack Start、Astro、Turbopack、Rolldownと、収録範囲を決めた3調査を記録する。

## 12. テスト駆動の実装順

### 第1段階: データ契約

1. 179技術、22カテゴリ、必須ID、新規項目を要求するテストを書く。
2. 現在の22技術で失敗することを確認する。
3. スキーマ、カテゴリ、ecosystem定義を更新する。
4. 179件の技術JSONを整備してテストを通す。

### 第2段階: 自動読込

1. 個別JSON importが残っていると失敗する契約テストを書く。
2. 失敗を確認してから `import.meta.glob` へ置き換える。
3. Astro checkと静的buildで全179ページが生成されることを確認する。

### 第3段階: 関係地図

1. 320件、参照整合性、重複、孤立ノード、coreの次数を検証するテストを書く。
2. 現在の24関係で失敗することを確認する。
3. 比較群と組み合わせ群に分けて関係を追加する。
4. 件数だけで通していないかnoteとカテゴリ規則を自己レビューする。

### 第4段階: Explorerと詳細画面

1. 5条件、URL同期、解除、空表示、詳細メタ情報の契約テストを書く。
2. 失敗を確認してから画面と素のJavaScriptを変更する。
3. 既存デザイン契約、base path、アクセシビリティ契約を再実行する。

### 第5段階: 文書と公開

1. README、CONTRIBUTING、AGENTS.mdを新しい追加方法と検証方法へ更新する。
2. 全ローカル検証を実行する。
3. 差分を自己レビューし、feat/expand-catalogをpushする。
4. Pull RequestのCI成功後にmainへ統合する。
5. Pagesのdeploy成功と公開ページを確認する。

## 13. 自動検証

データテストは次を保証する。

- 技術数が179、カテゴリ数が22
- 指定された175技術と追加4技術が存在する
- ファイル名とidが一致する
- idがkebab-caseで重複しない
- categoryとecosystemが定義済みIDを参照する
- 全必須項目があり、aliasesを除く配列と説明が空でない
- maturityとimportanceが定義済み値である
- officialUrlがHTTPSの有効なURL形式である
- lastVerifiedが実在するISO日付で未来日ではない
- relationが320件以上ある
- relationのsourceとtargetが実在し、自己参照と重複がない
- `competes-with` が同一カテゴリ内に限られる
- 全技術が1関係以上、coreが3関係以上を持つ
- journeyが実在技術だけを参照する
- 手動の技術JSON importが残っていない

リポジトリ全体では次を実行する。

```bash
npm run check
npm test
npm run build
npx wrangler deploy --dry-run
```

静的build後は、生成された技術詳細ページ数、`/tech-adventure` を含む内部リンク、404ページ、Pages workflowのartifact pathを確認する。

## 14. 公開と失敗時の扱い

作業ブランチは既存の `feat/expand-catalog` を使う。実装コミットをpushしてmain向けPull Requestを作り、GitHub Actionsが成功した場合だけmainへ統合する。統合後はPages workflowの成功と公開URLを確認する。

CIが失敗した場合はmainへ統合しない。データ不整合、型検査、静的build、Pages設定のどこで失敗したかを切り分け、同じブランチで修正して再実行する。

## 15. 対象外

- 人気順位や点数による技術ランキング
- 全技術の詳細な学習教材、入門手順、コード例
- すべてのrelationに対応する比較ページの生成
- サーバー検索、外部検索サービス、永続データベース
- GitHub Pagesから別の公開基盤への移行
- 既存の視覚設計を置き換える全面改修
