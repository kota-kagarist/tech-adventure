# Tech Adventure

> Navigate the technology landscape.

Tech Adventure は、2026年の主要なWeb技術186件を22カテゴリ・6つの役割地域に整理し、単なる名前の一覧ではなく **「何を担当するか」「何と競合するか」「何と組み合わせるか」** で理解するためのオープンガイドです。

明るい Digital Atlas デザインで、技術を **地域・地点・関係・旅程** として眺められます。

**Live:** https://kota-kagarist.github.io/tech-adventure/  
**Built and maintained by:** [kagarist / Kota Tsuda](https://github.com/kota-kagarist)

![Astro 7](https://img.shields.io/badge/Astro-7-BC52EE?style=flat-square&logo=astro&logoColor=white)
![TypeScript 5.9](https://img.shields.io/badge/TypeScript-5.9-3178C6?style=flat-square&logo=typescript&logoColor=white)
![Node.js 22+](https://img.shields.io/badge/Node.js-22%2B-5FA04E?style=flat-square&logo=nodedotjs&logoColor=white)
![GitHub Pages](https://img.shields.io/badge/GitHub_Pages-live-222222?style=flat-square&logo=githubpages&logoColor=white)
![GitHub Actions](https://img.shields.io/badge/GitHub_Actions-CI-2088FF?style=flat-square&logo=githubactions&logoColor=white)
![Cloudflare Workers](https://img.shields.io/badge/Cloudflare_Workers-compatible-F38020?style=flat-square&logo=cloudflareworkers&logoColor=white)

AIにコードを書いてもらえる時代ほど、「出てきた技術名が何者なのか」を把握する地図が必要だと考えています。

## 運営状態

<!-- BEGIN:BUSINESS_STATUS:tech-adventure -->
文書整理日: 2026-10-13。以下の3見出しを運営状態の正本とし、作業後に更新する。実装・公開・実測の確認日時は各記録を参照し、整理日で更新しない。

### 現在地

- 2026-10-27のユーザー指示により、今後の主担当は GPT-6.1 Terra / max とする。この記載は担当方針であり、将来の実行モデルを自動的に固定する設定ではない。
- 公開READMEには、186技術・22カテゴリ・6つの役割地域・485関係を扱うWeb技術の地図と、比較・Journey・Pathfinderを記載している。
- [PR #27](https://github.com/kota-kagarist/tech-adventure/pull/27)の承認済みhead `9b0249d` を `main` の `1f5cdcd` にマージし、[GitHub Pagesの配信](https://github.com/kota-kagarist/tech-adventure/actions/runs/40436247850)が2026-10-27に成功した。
- 配信後、ホーム・Atlas・React詳細・比較・Journey・Pathfinderの代表6ページでHTTP 200、canonical・OG URL・作者情報を確認した。代表3件の旧URLは301で転送され、Pathfinderのクエリも保持された。サイトマップは529件で重複なく、共有画像は1200×630だった。
- 配信artifactでも529ページのcanonical・OG URLとサイトマップの一致を確認し、代表6ページ・サイトマップ・共有画像の内容が公開先と一致した。検索・利用・作者認知への効果は未確認。

### 未完了

- [Issue #17](https://github.com/kota-kagarist/tech-adventure/issues/17)のチェック欄には実装記録と一致しない未更新項目が残る。GitHubのdescription・homepage・topicsは2026-10-27時点で未設定。GitHubの公開プレビューは標準カードで、サイトの共有画像とは異なる。カスタム画像の設定状態は未確認。
- originの `robots.txt` は404だった。プロジェクトのサブパスに置いた `robots.txt` はorigin全体に対する設定にならないため、共用ホストへの変更は行っていない。
- 2026-10-27にDrive上のZenn・Qiita各1本とX用12本の下書きを再確認した。一人称で書かれた制作動機・体験と外部掲載の有無は未確認。
- 記事・図解、コミュニティ、効果測定の計画は継続課題。外部投稿とGitHubの公開設定変更は個別の承認待ち。
- 検索・利用・作者認知への効果は、本書では未確認。

### 次の一手

- GitHubメタデータとsocial previewの設定は内容と現状を確認し、変更は個別承認後に進める。記事・SNS投稿も承認後に進める。
- 検索・利用・作者認知の観測方法と、Issue #17のチェック欄の更新範囲を確認する。


## Live

https://kota-kagarist.github.io/tech-adventure/

`main` への更新は GitHub Actions で検証された後、GitHub Pages へ自動公開されます。

## できること

- 6つの役割地域からWeb技術の全体像を眺め、1技術を選んだときだけ直接関係を浮かび上がらせる
- 技術を役割・ecosystem・成熟度・主要度から絞り込む
- 1つの技術について「何者？」「いつ使う？」「いつ使わない？」を確認する
- 2つの技術が本当に競合するのか比較する
- 2つの技術を選び、485件の関係から最少ホップのつながりを最大3経路まで辿る
- 485件の関係から、基盤・実行環境・規格・組み合わせをたどる
- 「ブログ」「API」など、作りたいものから代表構成をたどる

Pathfinder は関係の人気度やおすすめ度を重み付けしません。既存relationをすべて1 edgeとして扱い、hop数だけで最短経路を決めます。各hopではrelation type、実データ上の向き、登録済みnoteを表示します。

## 技術構成

- Astro 7
- TypeScript 5.9（Astroの言語ツールとの互換性を優先）
- Node.js 22+
- GitHub Pages
- GitHub Actions
- Cloudflare Workers Static Assets（dry-runで互換性確認）
- UIフレームワークなし
- DB / サーバーAPIなし

## 技術アイコン

サイト内のロゴは [Simple Icons](https://simpleicons.org/) を第一候補、[Devicon](https://devicon.dev/) と [theSVG](https://thesvg.org/) を補完候補として、ビルド時にローカルSVGへ変換しています。Emotion・Kysely・Nitroは各プロジェクトの公式リポジトリにある画像を使用しています。ブラウザから外部アイコンサービスへは接続しません。

HTTP・RESTなど固有のブランドロゴがない概念は、カテゴリ色と短いラベルで表示します。ライセンスと出典は [THIRD_PARTY_NOTICES.md](./THIRD_PARTY_NOTICES.md) を参照してください。ブランド名とロゴの権利は各権利者に帰属します。

## ローカル開発

```bash
npm ci
npm run dev
```

品質確認:

```bash
npm run check
npm test
npm run build
npx wrangler deploy --dry-run
```

## 技術を追加する

1. `src/data/technologies/<id>.json` を追加する
2. `src/data/relations.json` または検証単位のrelation補遺に、比較候補・基盤・併用先などの関係を追加する
3. 公式一次情報で内容を確認し、`lastVerified` を更新する
4. `npm run check && npm test && npm run build` を実行する

技術JSONは`import.meta.glob`で自動読込されるため、一覧ファイルへの手動importは不要です。必須フィールドとIDは`src/data/schema.ts`、実データの整合性条件は`tests/data.test.mjs`を参照してください。

`id` は小文字kebab-case、公式URLは`https://`を使います。各技術には役割、採用・非採用条件、成熟度、主要度、ecosystem、aliases、タグ、公式URL、最終確認日を持たせます。

## データの考え方

最重要なのは「人気順位」ではなく **役割の違い** です。

- Astro と Next.js → Webサイト全体を担当するため、比較しやすい
- Astro と Hono → 担当する層が違うため、単純な競合ではない
- React と Next.js → UIライブラリと、それを土台にするWebフレームワーク

関係データは参照先、重複、孤立を自動検査します。Core技術には最低3件の関係が必要です。

## Contributing

修正・追加は歓迎です。詳しくは [CONTRIBUTING.md](./CONTRIBUTING.md) を参照してください。

## License

MIT

## 作業の入口

- 作業ルール: [AGENTS.md](AGENTS.md)
- 現在地・未完了・次の一手: [README.md](#運営状態)
- Claude向けの入口: [CLAUDE.md](CLAUDE.md)

現在地は上記の既存正本だけで更新する。テンプレートと同じファイル名に合わせるために、別のPROJECT.mdやTODO台帳を増やさない。

## 事業の検証と継続判断

- 検証する価値: 技術の人気順位ではなく、役割・比較・組み合わせを理解する地図としての価値を確かめる。次の検証対象は既存のIssue #17を参照する。
- 結果の記録: 発見・検索流入、比較やJourney等の利用、学習者の反応を取得日時・対象期間・取得元付きで分ける。技術件数やサイト公開を、利用・学習効果・作者認知の成立と扱わない。
- 次の検証は、上の「次の一手」と対象Issueを入口にする。施策を始める前に、そのIssueへ仮説・方法・観測期間・継続または見直しの条件・費用と作業時間の上限を記す。既存の決定がある条件はその根拠へリンクし、未合意の数値や期限は未合意として残す。
- 今回の文書整備で新しい施策、予算、投稿、公開、事業の停止・再開を承認したものとは扱わない。実測不足なら結論を保留し、未計測を0へ置き換えない。
