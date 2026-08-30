# Tech Adventure Redesign v2 Design

## 1. 目的

Tech Adventure の現行UIを全面的に再設計し、「冒険・フィールドガイド」の比喩を装飾で表現するのではなく、**技術の分類・関係・探索そのものを視覚的な地図として見せる**。

現行の生成り背景、苔色、強いカード影、大きな角丸は廃止する。Web技術を扱うプロダクトとして、情報密度が高くても落ち着いて読める、現代的で高信頼なUIへ移行する。

既存機能・情報量・GitHub Pages公開方式は維持する。

## 2. 参考サイトから採用する原則

### Linear

参考: https://linear.app/

採用するもの:
- 視覚ノイズを抑え、見出し・本文・補助情報の階層を明確にする
- ナビゲーションを控えめにし、主コンテンツを前に出す
- 面ではなく細い境界線と余白で情報を分ける
- 一貫した部品サイズと間隔

採用しないもの:
- LinearそのもののUI配置やアイコンの模倣
- 業務アプリ的なサイドバー構成

### roadmap.sh

参考: https://roadmap.sh/

採用するもの:
- 多数の技術をカテゴリで整理し、一覧性を落とさない情報密度
- 「何を学ぶか／どこへ進むか」を迷わせない分類軸
- 技術名をクリック可能なノードとして扱う考え方

採用しないもの:
- 学習進捗管理やアカウント機能
- 大量の機能追加

### Raycast

参考: https://www.raycast.com/

採用するもの:
- 黒を基調にした高コントラストな画面
- 強いアクセント色を一色だけ使って焦点を作る
- ヒーローでブランドを強く見せる

採用しないもの:
- 大量のグラデーション・3D・ガラス表現
- 装飾のためのアニメーション

## 3. デザイン原則

1. **情報が主役**: 装飾より、役割・関係・分類が一目で分かることを優先する。
2. **密度を怖がらない**: 余白は使うが、1画面に見える技術数を減らしすぎない。
3. **アクセントは一色**: 紫系を主アクセントとし、状態色以外の多色化を避ける。
4. **カード感を弱める**: 大きな影と過度な角丸を使わず、境界線と背景差で区切る。
5. **地図は構造で表現**: 羅針盤・紙・山などの冒険モチーフではなく、ノード・列・線・座標感でTech Adventureらしさを出す。
6. **静的HTMLを基本**: 検索・絞り込み以外はJavaScriptなしでも読める状態を守る。

## 4. デザイントークン

### 色

```text
--bg: #08090b
--surface: #0e1014
--surface-2: #14171d
--surface-hover: #181b22
--border: #242832
--border-strong: #343946
--text: #f4f6f8
--text-muted: #949ba8
--text-dim: #69707d
--accent: #8b5cf6
--accent-soft: rgba(139, 92, 246, .14)
--accent-line: rgba(139, 92, 246, .38)
```

背景は黒に近い無彩色。紫はCTA、選択状態、重要な関係、フォーカスに限定する。

### 角丸・影

- 基本角丸: 8px
- 大型パネル: 12px
- ピル型はタグ・小さな状態表示だけ
- box-shadow は原則使わない
- ヒーロー背景のみ、極薄い紫のradial-gradientを許容する

### タイポグラフィ

外部フォントは読み込まない。

- Display: OS標準のsans-serif、`font-weight: 650-750`
- Hero: `clamp(3.25rem, 8vw, 6.5rem)`、tight line-height
- Page heading: `clamp(2.4rem, 5vw, 4.4rem)`
- Section heading: `clamp(1.6rem, 3vw, 2.4rem)`
- Body: 1rem / line-height 1.65
- Metadata: 0.75-0.82rem、uppercaseは英字ラベルだけ

## 5. グローバルナビゲーション

高さ約64px。背景は半透明の黒、下に1px border。

左:
- 小さな幾何学マーク
- `TECH ADVENTURE`

右:
- Technologies
- Journeys
- Compare
- GitHub（外部リンク）

モバイルでは主要3項目を維持し、GitHubリンクを省略可能。

## 6. トップページ

### Hero

左側を主コピー、右側を技術世界のプレビューにする2カラム。

コピー:
- Eyebrow: `TECHNOLOGY LANDSCAPE`
- H1: `Navigate the technology landscape.`
- 日本語説明: 技術名を覚える前に「何者か」「何と競合するか」「何と組むか」を理解する。
- CTA: `Explore technologies` / `Choose a journey`
- 補助数値: 収録技術数 / 関係数 / 旅程数

### Technology Landscape Preview

新規 `LandscapePreview.astro` を作る。

6列程度のカテゴリを横断し、各列に代表技術を小さなノードとして表示する。

例:

```text
LANGUAGE       UI          FRAMEWORK       SERVER       RUNTIME       DATA
JavaScript     React       Astro           Hono         Node.js       PostgreSQL
TypeScript     Vue         Next.js         Fastify      Bun           SQLite
               Svelte      Nuxt            Express      Deno          D1
```

背景に薄いグリッド線、列間に薄い線を置く。SVGグラフやCanvasは使わない。

### Subsequent sections

1. `Explore by role` — 役割カテゴリを高密度な行/グリッドで表示
2. `Start here` — Astro / Hono / React / Workers の代表技術
3. `Compare` — 代表比較3組
4. `Journeys` — 4旅程
5. `Open source` — GitHubでデータを編集できることを短く説明

## 7. 技術一覧

- ページ上部をコンパクトにし、検索UIをすぐ見せる
- 検索欄とカテゴリ選択を1行に配置
- カテゴリ見出しの下に小さく密度の高い技術カードを3〜4列で並べる
- カードは `border + surface` で、hover時のみ `border-strong` とごく薄い `accent-soft`
- タグは最大3つ、主張を弱くする
- 件数表示は検索欄と同じ行に置く

## 8. 技術詳細

Desktopは12カラム相当の2領域。

左 7〜8カラム:
- カテゴリ
- 技術名
- shortDescription
- 公式サイト
- 何者？
- いつ使う？
- いつ使わない？

右 4〜5カラム:
- `Relationship map`
- 同じ土俵
- 一緒に使う
- 動く場所
- 土台

関係カードは大きなカードの連続ではなく、ラベル付きのリンク行として表示する。

## 9. 比較ページ

最上部に比較結果を一文で示す。

- 同カテゴリ: `Direct comparison`
- 別カテゴリ: `Different layers`
- 直接関係あり: 関係の種類も表示

その下に左右2カラムで技術を比較する。

中央の巨大な `VS` は廃止し、細いdividerと小さな状態ラベルで比較感を出す。

## 10. Journeys

「旅」をイラストではなく手順として見せる。

- 一覧: 目的 + 技術数 + 一文説明の行型カード
- 詳細: 技術を縦のrailでつなぐ
- railに番号、技術名、役割、短い説明
- 下部に `Why this route` と `Alternatives`

## 11. アクセシビリティ

- WCAG AA相当の文字コントラスト
- `:focus-visible` はaccentで明確にする
- hoverだけに情報を依存しない
- `prefers-reduced-motion` を維持
- semantic heading hierarchyを守る
- 主要リンクはJavaScriptなしで機能する

## 12. 技術制約

- Astro 7 + TypeScriptを維持
- UIライブラリを追加しない
- 外部フォントを追加しない
- 外部画像を必須にしない
- GitHub Pagesの `/tech-adventure/` base path対応を維持
- 既存22技術、関係データ、4旅程を維持
- 検索・カテゴリ絞り込みを維持
- `npm ci`, `npm run check`, `npm test`, `npm run build` を全て成功させる

## 13. 検証条件

自動テストで最低限以下を固定する。

- 新しいdark design tokensが存在する
- 旧 `--paper`, `--moss`, `--signal` トークンが残っていない
- `LandscapePreview` がトップページに存在する
- トップに `TECHNOLOGY LANDSCAPE` と `Navigate the technology landscape.` がある
- 技術一覧・詳細・比較・旅程に新しい構造クラスがある
- GitHub Pages base path契約が壊れていない
- 既存データ整合性テストが全て通る

## 14. 今回やらないこと

- ドラッグ可能なグラフ
- D3 / Canvas / WebGL
- AI技術選定
- ユーザーアカウント
- ライトテーマ
- ロゴ制作の大規模なブランドプロジェクト
- 技術データの追加

まずデザインと情報体験を高品質にすることへ集中する。
