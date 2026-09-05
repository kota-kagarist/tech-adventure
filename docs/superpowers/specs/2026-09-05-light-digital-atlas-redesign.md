# Tech Adventure Light Digital Atlas Redesign

Status: visual direction approved; implementation starts after written-spec review.

## 1. Goal

Tech Adventure を、現在の黒基調の技術ダッシュボードから **明るい Digital Atlas（デジタル技術地図帳）** へ全面刷新する。

正本の機能・情報構造は維持する。2026-09-05 時点の main は、186 技術・22 カテゴリ・6 地域・485 関係を持ち、Technology Atlas、Explorer、比較、Journey、技術詳細を GitHub Pages 上の静的サイトとして提供している。

今回の刷新で変えるのは情報そのものではなく、**情報の見え方・探索のしやすさ・Tech Adventure 固有の視覚言語** である。

成功状態は次の通り。

- 長時間眺めても疲れにくい明るい画面
- 186 件以上の技術が増えても一覧性が崩れない
- 「地図」「地域」「経路」「凡例」という Tech Adventure の比喩が、装飾ではなく情報構造として見える
- 初学者が一目で「どこを見るサイトか」を理解できる
- 技術者が Explorer / Compare / Detail を実用的に読める
- desktop / tablet / mobile で同じ情報階層を保つ
- 現在の静的 HTML、GitHub Pages、アクセシビリティ、データ構造を壊さない

## 2. Selected direction

比較した 3 方向のうち、**A: 明るい Digital Atlas** を採用する。

### 採用

- オフホワイトのキャンバス
- 白い情報面
- 濃紺の本文
- 6 地域を淡い色面で識別
- 地形・等高線・航路を思わせる軽い視覚要素
- 公式技術アイコンを主役にする
- Atlas は「地域を眺める」体験を中心にする
- 図鑑らしさは残すが、子ども向けイラストには寄せない

### 採用しない

- 黒・濃紺をページ全面の背景にする
- 羊皮紙・古地図・強いセピア調
- 水彩イラストを各カードに大量配置する
- SaaS 管理画面のような無機質な白カードだけの構成
- 強いドロップシャドウ、大きすぎる角丸、ガラス表現
- 装飾目的だけのアニメーション

## 3. Core design principle

### 3.1 Map first

Tech Adventure の個性は「冒険っぽい絵」ではなく、技術を **位置・地域・接続・経路** として理解できることから作る。

- region = 大きな役割地域
- category = 地域内の地区
- technology = 地点
- relation = 経路
- journey = 旅程
- compare = 隣接候補を見比べる
- explorer = 索引

画面内のラベルや余白は、この比喩を助ける範囲で使う。

### 3.2 Readability before decoration

背景は引き、情報を前に出す。淡色は領域識別に使い、本文は十分に濃い文字色を使う。

### 3.3 Illustration at medium strength

A 案の地形感は残す。ただし UI 全体を水彩画にはしない。

- Home hero: 1 枚の軽量な「技術世界の地形」ビジュアルを使う
- Region cards: CSS / SVG の薄い等高線・地形シルエット程度
- Technology cards: イラストを置かず、公式アイコン + 情報を優先
- Detail / Compare / Explorer: ほぼ情報 UI に寄せる

## 4. Design tokens

既存 dark v2 tokens を light atlas tokens に置き換える。最終実装では用途ベースの token 名に寄せ、個別コンポーネントが生の色コードを持ちすぎないようにする。

### Base

```text
--canvas: #F6F7F4
--surface: #FFFFFF
--surface-subtle: #F1F4F6
--surface-raised: #FFFFFF
--ink: #14233B
--ink-muted: #4E5D72
--ink-dim: #748195
--line: #D9E0E7
--line-strong: #BCC7D2
--brand: #1D5FD1
--brand-hover: #174FB0
--brand-soft: #E8F0FD
--focus-ring: #1D5FD1
```

### Region palette

色だけで意味を伝えない。region name / icon / label を常に併記する。

```text
FOUNDATION       bg #EAF3FF / ink #245A93
INTERFACE        bg #FFF0F5 / ink #9B4664
APPLICATION      bg #FFF3E7 / ink #9A5A22
DATA & IDENTITY  bg #EAF7F0 / ink #2D7054
DELIVERY         bg #EDF4FF / ink #3D669E
ENGINEERING      bg #F2EEFF / ink #6853A4
```

### Relation palette

relation は text-first を維持し、線・小ラベルの補助色として使う。

```text
built-on       #2F6FCF
runs-on        #2B8799
works-with     #2F8064
implements     #B96A27
part-of        #667085
competes-with  #7058C7
alternative-to #B94F73
```

## 5. Typography

外部フォントを必須にしない。

```css
font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "Noto Sans JP", "Hiragino Sans", sans-serif;
```

- Hero: `clamp(2.8rem, 6vw, 5.4rem)`
- Page heading: `clamp(2.2rem, 4.5vw, 4rem)`
- Section heading: `clamp(1.45rem, 2.5vw, 2.2rem)`
- Body: 1rem / 1.65
- Card body: .82-.92rem / 1.55
- metadata: .7-.78rem

英字の region / index / relation type は小さな uppercase を許容する。日本語本文の letter-spacing は広げすぎない。

## 6. Shape, spacing, elevation

- base radius: 10px
- large panel radius: 16px
- chips: pill
- 4 / 8px spacing scale
- shadow は `0 8px 28px rgba(27, 45, 70, .06)` 程度を大型の浮いた面だけに使用
- 通常カードは border + background difference を中心にする
- hover でカードを大きく浮かせない

## 7. Global navigation

Header は白〜半透明オフホワイト。下に 1px border。

Desktop:

- 左: compact compass / atlas mark + `Tech Adventure`
- 中〜右: Atlas / Technologies / Journeys / Compare
- 右端: GitHub

現在の Landscape を **Atlas** と表示して第一導線にする。

Mobile (`<= 760px`):

- 2 段 header にする
- 1 段目: compact mark + `Tech Adventure`
- 2 段目: Atlas / Technologies / Journeys / Compare を横スクロール可能な nav として全て残す
- GitHub external link は header から隠し、footer から到達可能にする
- hamburger と menu JavaScript は追加しない

Header の目的は「サイトの機能一覧」ではなく「今どの地図を見ているか」を明確にすること。

## 8. Home

### 8.1 Hero

Desktop は 2 カラム。

Left:

- eyebrow: `WEB TECHNOLOGY ATLAS`
- H1: `Web技術の地図を、一緒に旅しよう。`
- description: 技術を知り、比べ、つなげて、次の一歩を見つけることを説明
- primary CTA: `地図を開く`
- secondary CTA: `技術を探す`

Right:

- pale terrain / island visual
- 6 region を連想できる色の地形
- 小さな route dots / contour lines
- 文字・技術ロゴを大量に描き込まない
- decorative image として `alt=""`

Mobile は illustration を本文の後に置き、CTA を先に見せる。Hero だけで 1 画面以上を消費しない。

### 8.2 Metrics

4 項目を細い区切りで表示。

- technologies
- categories
- relations
- journeys

件数はデータから生成し、ハードコードしない。

### 8.3 Technology Atlas preview

6 region を desktop 3 x 2、mobile 2 x 3 で表示する。

各 region:

- region label
- 日本語 role summary
- count
- 2〜4 representative technology icons
- 淡い region fill
- ごく薄い地形 / contour decoration

カードの内容を「絵」にしない。地図の区域として見えることを優先する。

### 8.4 Start paths

Home では、その後の行動を 3 つに整理する。

- `技術を探す` -> Explorer
- `違いを比べる` -> Compare
- `作りたいものから辿る` -> Journeys

既存の代表技術・比較・Journey・open source セクションは内容を維持しながら、この 3 行動の下へ再整理する。

## 9. Technology Atlas

Atlas は刷新の中心画面。

### 9.1 Page head

現在の説明・件数・Explorer/Journey 導線を維持しつつ、Home よりコンパクトにする。

### 9.2 Toolbar

- white surface
- thin border
- search を最大幅
- ecosystem / importance filters
- visible count
- desktop / tablet (`> 760px`) では sticky
- mobile (`<= 760px`) は 1 列にして search / ecosystem / importance / count の順に積む
- page-level horizontal overflow を発生させない

### 9.3 Region structure

6 region は縦方向の「地図の帯」として積む。

各 region:

- pale region background
- region label + number
- short description
- category lanes
- technology nodes

22 category は消さず、region の内部構造として維持する。

### 9.4 Technology nodes

- white / near-white
- 公式 icon
- technology name
- importance indicator は控えめ
- focus button と detail link の分離を維持
- hover だけに意味を持たせない

Selected:

- brand outline + subtle fill
- direct neighbors remain full contrast
- unrelated nodes dim to about 35-45%

### 9.5 Relationship lines

Desktop の focus-only SVG lines を維持する。

- relation type に応じた薄い色
- line width は 1.5-2px 程度
- focus node から direct neighbor だけ
- 全 relation を同時表示しない

Mobile は現在通り line graph に依存しない。Relationship Inspector の text UI が正本。

### 9.6 Inspector

Desktop wide (`>= 1100px`):

- Atlas 左、Inspector 右の 2 カラム
- Inspector width は 300-340px
- Inspector は viewport 内で sticky

Tablet / mobile (`< 1100px`):

- Toolbar -> Inspector -> Atlas の 1 カラム順にする
- Inspector は通常フローに置き、sticky side panel にしない
- Focus 操作後、Inspector が viewport 外なら reduced-motion 設定を尊重した上で Inspector へスクロールする
- Inspector に `地図へ戻る` anchor を置く

Inspector content:

- selected technology summary
- relation groups
- relation direction sentence
- note
- detail link
- clear focus

focus 未選択時は短い使い方を表示する。

## 10. Explorer

Explorer は「索引」。Atlas より装飾を減らす。

- compact page head
- sticky search/filter panel on desktop
- categories are clearly separated
- technology cards: icon / category / name / shortDescription / small metadata
- 4 columns wide desktop, 2 tablet, 1 mobile
- tag soup を避ける
- card 全体を clickable にしても、focus/secondary actions がある場合は nested interaction を作らない

## 11. Technology detail

ページを図鑑の 1 項目として見せる。

Top:

- breadcrumb
- category / region
- large official icon
- name
- shortDescription
- official site
- ecosystem / maturity / importance metadata

Body:

- 何者？
- いつ使う？
- いつ使わない？

Relationships:

- desktop right rail / side panel
- text-first relation groups
- relation type は色 + label
- compare links は比較可能な関係だけ

Mobile は 1 column で本文 -> relationships の順。

## 12. Compare

比較結果を先に見せる。

- top verdict
- relation / layer status
- technology A / B cards
- role, when-to-use, when-not-to-use, ecosystem metadata
- shared facts and differences

巨大な VS や暗い split screen は使わない。

Desktop は 2 columns。Mobile は A -> B の順で 1 column。

## 13. Journeys

Journey は「航路」として見せる。

List:

- outcome name
- short description
- step count
- representative icons
- subtle dotted route motif

Detail:

- vertical route rail
- numbered stops
- role label
- technology icon + name
- why this stop
- alternatives / trade-offs

Mobile でも rail が本文幅を圧迫しないよう、rail は 24-36px 程度に留める。

## 14. Illustration assets

Home hero 用に 1 点だけ新規の地形ビジュアルを作成する。

条件:

- text を画像に焼き込まない
- technology logo を画像に焼き込まない
- pale blue / green / lavender / warm sand
- watercolor texture は弱め
- contemporary editorial atlas, not fantasy RPG
- WebP/AVIF 等に最適化
- desktop で 160KB 程度を目標
- mobile は smaller source または CSS crop
- asset が読み込めなくても情報欠落がない decorative content

Region decoration は CSS / lightweight SVG で作り、6 枚の重い画像を追加しない。

## 15. Accessibility

- WCAG AA 相当の本文 contrast
- pastel background 上でも本文は濃色
- region color だけに意味を依存しない
- `:focus-visible` は明確な 2px ring
- hover-only controls を作らない
- button / link の役割を混同しない
- reduced motion を維持
- semantic heading hierarchy を維持
- JS disabled でも主要コンテンツと detail links を読める

## 16. Responsive contract

Mobile は「desktop を縮める」のではなく、情報階層を保った別レイアウトとして扱う。

必ず確認する viewport:

- 320px
- 360px
- 390px
- 430px
- 768px
- 1024px
- 1440px

Contract:

- `documentElement.scrollWidth <= viewport width` を原則とする
- Atlas category lane の意図的な内部横スクロールだけを例外とする
- fixed `min-width` を page-level grid に持たせない
- grid children には必要に応じて `min-width: 0`
- long technology names / URLs は overflow-wrap で処理
- CTA / filter / metadata は 320px で切れない

## 17. Architecture and implementation boundaries

既存の Astro コンポーネントとデータ API を活かし、デザイン変更のために framework を追加しない。

Main areas expected to change:

- `src/styles/global.css`
- `src/styles/mobile-layout.css`
- `src/styles/landscape.css`
- `src/styles/landscape-tokens.css`（light global tokens と重複する alias は除去する）
- `src/layouts/BaseLayout.astro`
- `src/components/SiteHeader.astro`
- `src/components/SiteFooter.astro`
- `src/components/LandscapePreview.astro`
- `src/components/TechnologyAtlas.astro`
- `src/components/RelationshipInspector.astro`
- `src/components/TechnologyCard.astro`
- `src/components/TechnologyRelations.astro`
- `src/pages/index.astro`
- `src/pages/landscape.astro`
- `src/pages/technologies/index.astro`
- technology detail / compare / journey page templates

Prefer adding small presentational components only when duplication becomes clear. Avoid a one-off component for every decorative element.

## 18. Migration order

1. Lock light design tokens and shared primitives.
2. Update header/footer/BaseLayout and accessibility states.
3. Rebuild Home visual hierarchy.
4. Rebuild Atlas and Inspector while preserving all focus/filter behavior.
5. Update Explorer and technology cards.
6. Update technology detail and relationship panels.
7. Update Compare.
8. Update Journeys.
9. Finish mobile/tablet responsive pass.
10. Run visual regression checks and required repository verification.

Do not mix technology catalog additions into this redesign PR unless required to fix a broken existing view.

## 19. Testing strategy

TDD for behavior and layout contracts.

Update existing tests that intentionally describe dark v2; do not merely delete them.

Add/strengthen coverage for:

- light atlas design tokens exist
- legacy dark page canvas is no longer the default
- 6 region palette mappings exist
- Home hero + 6 region preview contract
- Header first-class Atlas path
- Atlas filter/focus behavior unchanged
- no nested interactive controls
- relation inspector text states
- GitHub Pages base-path awareness
- mobile responsive constraints
- required routes still build
- local technology icons still render

Where static source tests cannot prove real layout, verify the generated site with browser tooling at the viewport matrix above. Do not add a browser framework dependency solely for this redesign if the existing validation environment can perform the viewport check.

## 20. Required verification

Repository rules remain authoritative:

```bash
npm run check
npm test
npm run build
npx wrangler deploy --dry-run
```

Additionally before completion:

- visually inspect Home, Atlas, Explorer, one technology detail, one Compare, Journey list, one Journey detail
- inspect at 390px and 1440px minimum; viewport overflow check covers the full matrix
- verify no unintended page-level horizontal overflow
- verify focus/filter states on Atlas
- verify keyboard focus visibility
- verify light UI text contrast
- verify GitHub Pages deployment after merge

## 21. Non-goals

Not part of this redesign:

- dark mode toggle
- account / login
- user progress
- backend API / DB
- D3 / Canvas / WebGL graph
- catalog expansion
- relation-data expansion
- ranking or popularity scores
- changing the meaning of the 6 regions or 22 categories

## 22. Definition of done

This redesign is complete only when:

1. All primary screens use the light Digital Atlas design language.
2. The site feels like one product rather than a mixture of old dark and new light pages.
3. Home communicates the map metaphor immediately.
4. Atlas remains readable with all current technologies and relations.
5. Mobile has no unintended viewport overflow at the defined widths.
6. Existing data behavior and static-navigation behavior remain intact.
7. All required commands pass.
8. The merged main branch deploys successfully to GitHub Pages.
9. The live site is visually rechecked after deployment.
10. The next resume point is recorded in the PR / relevant repository document.
