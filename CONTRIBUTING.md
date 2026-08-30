# Contributing to Tech Adventure

Tech Adventure は「数を増やすこと」より、技術同士の関係を正確に説明することを優先します。

## 技術を追加する

1. 公式ドキュメントを確認する
2. `src/data/technologies/<id>.json` を追加する
3. 既存技術との関係が明確なら `relations.json` に追加する
4. `lastVerified` に確認日を記録する
5. `npm run check && npm test && npm run build` を実行する

JSONは自動読込されます。`index.ts`への手動importは不要です。追加前に、次を確認してください。

- 広く使われる、急速に伸びる、代表的な設計思想を持つ、基準点になる、のいずれかに当てはまる
- `whatItDoes`と`role`が、製品名の言い換えではなく担当範囲を説明している
- `whenToUse`と`whenNotToUse`が具体的な判断条件になっている
- `officialUrl`は公式一次情報のHTTPS URLである
- `maturity`、`importance`、`ecosystem`、`aliases`、`tags`、`lastVerified`が揃っている

## 関係を追加・修正する

- `competes-with`: 同じ役割で直接比較しやすい
- `works-with`: 一緒に役割分担できる
- `runs-on`: 実行環境
- `built-on`: 土台・基盤
- `alternative-to`: 近い役割の代替候補
- `implements`: 規格やプロトコルを実装する
- `part-of`: 製品・クラウド・プラットフォームに含まれる

層が違う技術を、知名度だけを理由に `competes-with` にしないでください。
Core技術には最低3件の意味のある関係を付け、孤立ノードを作らないでください。

## 根拠

PRでは、できるだけ公式サイト・公式ドキュメント・公式リポジトリへのリンクを示してください。二次記事だけを根拠に技術の性質を断定しないでください。

## 文体

- 初学者が読める日本語
- 専門用語は役割を先に説明する
- 「最強」「絶対」などの断定を避ける
- 比喩より技術的な意味を優先する
