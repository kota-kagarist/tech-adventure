# Tech Adventure

> Navigate the technology landscape.

Tech Adventure は、2026年の主要なWeb技術179件を22カテゴリに整理し、単なる名前の一覧ではなく **「何を担当するか」「何と競合するか」「何と組み合わせるか」** で理解するためのオープンガイドです。

![Astro 7](https://img.shields.io/badge/Astro-7-BC52EE?style=flat-square&logo=astro&logoColor=white)
![TypeScript 5.9](https://img.shields.io/badge/TypeScript-5.9-3178C6?style=flat-square&logo=typescript&logoColor=white)
![Node.js 22+](https://img.shields.io/badge/Node.js-22%2B-5FA04E?style=flat-square&logo=nodedotjs&logoColor=white)
![GitHub Pages](https://img.shields.io/badge/GitHub_Pages-live-222222?style=flat-square&logo=githubpages&logoColor=white)
![GitHub Actions](https://img.shields.io/badge/GitHub_Actions-CI-2088FF?style=flat-square&logo=githubactions&logoColor=white)
![Cloudflare Workers](https://img.shields.io/badge/Cloudflare_Workers-compatible-F38020?style=flat-square&logo=cloudflareworkers&logoColor=white)

AIにコードを書いてもらえる時代ほど、「出てきた技術名が何者なのか」を把握する地図が必要だと考えています。

## Live

https://kota-kagarist.github.io/tech-adventure/

`main` への更新は GitHub Actions で検証された後、GitHub Pages へ自動公開されます。

## できること

- 技術を役割・ecosystem・成熟度・主要度から絞り込む
- 1つの技術について「何者？」「いつ使う？」「いつ使わない？」を確認する
- 2つの技術が本当に競合するのか比較する
- 468件の関係から、基盤・実行環境・規格・組み合わせをたどる
- 「ブログ」「API」など、作りたいものから代表構成をたどる

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
2. `src/data/relations.json` に比較候補・基盤・併用先などの関係を追加する
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
