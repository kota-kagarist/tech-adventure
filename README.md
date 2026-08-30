# Tech Adventure

> 技術の世界を、迷わず冒険する。

Tech Adventure は、Astro / Hono / React / Cloudflare Workers などのWeb技術を、単なる名前の一覧ではなく **「何を担当するか」「何と競合するか」「何と組み合わせるか」** で理解するためのオープンガイドです。

AIにコードを書いてもらえる時代ほど、「出てきた技術名が何者なのか」を把握する地図が必要だと考えています。

## できること

- 技術を役割ごとに見る
- 1つの技術について「何者？」「いつ使う？」を確認する
- 2つの技術が本当に競合するのか比較する
- 「ブログ」「API」など、作りたいものから代表構成をたどる

## 技術構成

- Astro 7
- TypeScript 5.9（Astroの言語ツールとの互換性を優先）
- Node.js 22+
- Cloudflare Workers Static Assets
- UIフレームワークなし
- DB / サーバーAPIなし

## ローカル開発

```bash
npm install
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
2. `src/data/technologies/index.ts` にimportを追加する
3. 必要なら `src/data/relations.json` に関係を追加する
4. 公式一次情報で内容を確認する
5. `npm run verify` を実行する

`id` は小文字 kebab-case。公式URLは `https://` を使います。

## データの考え方

最重要なのは「人気順位」ではなく **役割の違い** です。

- Astro と Next.js → Webサイト全体を担当するため、比較しやすい
- Astro と Hono → 担当する層が違うため、単純な競合ではない
- React と Next.js → UIライブラリと、それを土台にするWebフレームワーク

## Contributing

修正・追加は歓迎です。詳しくは [CONTRIBUTING.md](./CONTRIBUTING.md) を参照してください。

## License

MIT
