# Tech Adventure MVP Design

## 1. 目的

Tech Adventure は、AI時代の技術選定で起きる「名前は聞くが、何者で、何と比較すべきか分からない」という混乱を解消する、公開型の技術世界ガイドである。

最初の対象は Web 開発周辺とし、単なる技術一覧ではなく、各技術の **役割・競合・組み合わせ・向き不向き** を関係として理解できることを価値の中心に置く。

MVP の成功条件は、初見の利用者が Astro / Hono / React / Cloudflare Workers などを見て、次の3点を短時間で理解できること。

1. その技術は何を担当するのか
2. 何と競合し、何とは組み合わせるのか
3. 自分の目的なら使うべきか、使わなくてもよいか

## 2. 対象ユーザー

主対象は、AIを使ってWebサービスを作り始めた初学者・非専門職・経験の浅い開発者。

典型的な状況は次の通り。

- AIから Astro / Hono / D1 / Wrangler など複数の名前を一度に提示された
- React と Next.js の違いが曖昧
- Astro と Hono のように、そもそも同じ層ではない技術を比較してしまう
- 「おすすめ構成」は得られるが、なぜその構成なのか理解できない

熟練者向けの網羅的リファレンスより、技術世界の構造を理解するための入口を優先する。

## 3. MVP の範囲

### 含める

- トップページ
- 技術一覧
- 技術詳細ページ
- 技術カテゴリ
- 技術間の関係データ
- 2技術の比較表示
- 目的別の代表的な構成例
- GitHub上で編集可能な構造化データ
- 静的ビルド
- 自動テスト / 型チェック / ビルド確認
- Cloudflare Workers Static Assets へ公開できる設定
- OSSとして最低限必要な README / LICENSE / CONTRIBUTING / AGENTS

### MVP では含めない

- ユーザー登録
- お気に入り
- コメント
- 独自DB
- HonoによるAPI
- AIチャット
- 自動技術選定AI
- 課金
- 管理画面
- 外部からの自動クロール

必要性が確認できるまで、サーバー処理とDBを持たない。

## 4. 技術構成

### アプリケーション

- Astro 7 系
- TypeScript strict
- Astro の静的出力（SSG）
- UIフレームワークは導入しない
- クライアントJavaScriptは比較UIなど必要箇所だけ素の TypeScript で追加する

Astroを選ぶ理由は、コンテンツ中心のサイトであり、静的HTMLを基本にしながら必要な箇所だけ対話性を足せるため。

### 公開基盤

- Cloudflare Workers Static Assets
- `dist/` を静的資産として配信
- `wrangler.jsonc` で設定

2026年時点でCloudflareは新規アプリケーションにWorkersを主軸として案内しており、Pages固有構成は採用しない。

### パッケージ管理

- npm
- `package-lock.json` をコミットする

特殊なパッケージ管理ツールを増やさず、初学者が最も追いやすい構成を優先する。

## 5. 情報設計

技術を「名前の一覧」ではなく、「世界の中の場所」として扱う。

### カテゴリ

MVPでは次を基本カテゴリとする。

- `language`: 言語
- `ui-library`: UI部品
- `web-framework`: Webサイト / Webアプリ全体
- `server-framework`: API / サーバー処理
- `runtime`: 実行環境
- `database`: データベース
- `storage`: ファイル保存
- `deployment`: 公開・実行基盤
- `build-tool`: 開発・ビルド
- `orm`: DB操作支援

カテゴリは技術同士の比較範囲を理解するための第一の軸とする。

### 技術データ

各技術は `src/data/technologies/*.json` に1技術1ファイルで置く。

必須項目:

```ts
interface Technology {
  id: string;
  name: string;
  shortDescription: string;
  category: CategoryId;
  officialUrl: string;
  whatItDoes: string;
  whenToUse: string[];
  whenNotToUse: string[];
  maturity: "emerging" | "established" | "mature";
  tags: string[];
}
```

`id` は小文字 kebab-case とする。

### 関係データ

技術間の関係は `src/data/relations.json` に置く。

```ts
type RelationType =
  | "competes-with"
  | "works-with"
  | "runs-on"
  | "built-on"
  | "alternative-to";

interface TechnologyRelation {
  source: string;
  target: string;
  type: RelationType;
  note: string;
}
```

方向性のある関係（`runs-on`, `built-on`）と、対称に近い関係（`competes-with`, `works-with`, `alternative-to`）を区別する。

## 6. 初期収録技術

MVPでは、利用者が実際に混乱しやすく、Web技術の層を横断して理解できる技術に絞る。

### 言語

- JavaScript
- TypeScript

### UI

- React
- Vue
- Svelte

### Webサイト / Webアプリ

- Astro
- Next.js
- Nuxt
- SvelteKit

### API / サーバー

- Hono
- Express
- Fastify

### 実行環境

- Node.js
- Bun
- Deno
- Cloudflare Workers

### 開発・ビルド

- Vite

### データ

- PostgreSQL
- SQLite
- Cloudflare D1
- Cloudflare R2
- Cloudflare KV

初期件数は20前後に抑え、「100個並べる」より関係の精度を優先する。

## 7. 画面設計

### `/`

目的: サービスの価値を即座に理解させ、探索を始めてもらう。

構成:

1. ブランド: `TECH ADVENTURE`
2. 日本語説明: `技術の世界を、迷わず冒険する。`
3. 「技術から探す」「作りたいものから探す」の2導線
4. 技術世界のカテゴリ一覧
5. 代表的な比較: Astro vs Next.js / Astro vs Hono / React vs Next.js
6. 代表的な旅程: ブログ / SaaS / API / 小規模Webサービス

### `/technologies`

全技術をカテゴリ別に表示する。

- テキスト検索
- カテゴリ絞り込み
- 技術カード

検索・絞り込みはクライアント側で行い、サーバーAPIは作らない。

### `/technologies/[id]`

技術詳細。

表示項目:

- 何者？
- 何を担当する？
- いつ使う？
- いつ使わない？
- 同じ土俵の技術
- 一緒に使う技術
- どこで動く？
- 公式サイト

### `/compare/[left]/[right]`

2技術を並べる。

最重要表示は「比較できる関係かどうか」。

例:

- Astro vs Next.js → 同じ `web-framework` で直接比較しやすい
- Astro vs Hono → 主担当が異なるため、単純な競合ではない
- React vs Next.js → UIライブラリとWebフレームワークで層が異なる。Next.jsがReactを利用する関係を説明

### `/journeys`

作りたいものから技術世界を見る。

初期旅程:

- ブログを作る
- 企業サイトを作る
- APIを作る
- 小規模SaaSを作る

各旅程は「唯一の正解」ではなく、代表構成と選択理由を示す。

## 8. 表現方針

「旅行・冒険」の比喩は、理解を助ける範囲で使う。

使用例:

- 技術世界
- 冒険を始める
- 旅程
- 現在地
- 同じ地域の技術

避けること:

- 比喩を優先して技術的意味が分からなくなる表現
- 「地球の歩き方」の名称・ロゴ・表紙意匠への過度な類似
- 技術の優劣を断定するランキング

ブランドは独立した `Tech Adventure` とする。

## 9. デザイン方針

- 冒険地図・フィールドガイドを想起するが、可読性を最優先
- ダークテーマ固定にはしない
- CSS変数で色・余白・文字サイズを管理
- モバイルファースト
- WCAG AA相当のコントラストを目標
- OS標準フォントを基本とし、外部フォント読込を必須にしない
- JavaScript無効でも技術詳細と基本導線は読める

## 10. データ品質

OSSとして価値の中心になるため、技術データには次の原則を適用する。

- 公式サイトURLを必須にする
- 宣伝文ではなく「何を担当するか」を短く書く
- `competes-with` は同一・近接カテゴリを原則とする
- 層が違う場合は競合扱いせず、関係を説明する
- 主観的な「最高」「最強」を避ける
- 時点依存の情報を恒久的な特徴のように書かない

## 11. 検証

### 自動検証

- `npm run check`: Astro / TypeScript のチェック
- `npm test`: データスキーマ・参照整合性テスト
- `npm run build`: 静的ビルド

GitHub Actionsで Pull Request と main push の双方に対して実行する。

テストでは最低限、次を保証する。

- technology id の重複なし
- relation の source / target が実在する
- 自己参照 relation がない
- URL が `https://` である
- 必須文字列が空ではない
- category が定義済み

### 手動検証

- 主要4画面をモバイル幅 / デスクトップ幅で確認
- Astro vs Hono で「競合ではない」と読み取れる
- Astro vs Next.js で直接比較できる
- JavaScript無効でも詳細ページが読める

## 12. OSS運用

### ライセンス

コード・データともにMIT Licenseを初期案とする。

技術説明が将来的に第三者寄稿を大きく受ける場合は、データ・文章のライセンス分離（例: CC BY）を再検討する。MVPでは複雑化しない。

### CONTRIBUTING

寄稿方法を次の2つに分ける。

1. 技術を追加する
2. 既存技術・関係を修正する

PRでは公式情報への根拠リンクを求める。

### AGENTS.md

AIエージェントが変更するときの原則を定義する。

- 既存スキーマを守る
- 技術情報は公式一次情報を優先する
- 不明な関係を推測で追加しない
- 新依存を安易に追加しない
- 変更後に check / test / build を実行する

## 13. デプロイ

MVPはAstroで `dist/` を生成し、Cloudflare Workers Static Assetsとして配信する。

`wrangler.jsonc` の基本形:

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

Workerスクリプトを持たない静的サイトなので、`main` と assets binding は設定しない。

## 14. 将来拡張

利用実績や課題が確認できたものだけ追加する。

候補:

- 技術関係のグラフ可視化
- 「現在地が分からない」診断
- 用途入力から代表構成を出す技術選定支援
- 技術情報の更新日・出典管理
- API公開
- MCP / CLI
- GitHub Starや採用数など外部指標
- Web以外（AI、インフラ、セキュリティ）への世界拡張

APIが複数クライアントから必要になった段階でHonoを候補にする。DBはユーザー固有データや動的データの必要性が発生してから導入する。

## 15. 非目標

Tech Adventure は次を目指さない。

- すべての技術を網羅する百科事典
- 人気順だけで決めるランキングサイト
- 初学者へ特定技術を盲目的に推奨するサイト
- ベンダー公式ドキュメントの代替

目指すのは、技術世界の **構造と選択肢の関係を理解するための地図** である。
