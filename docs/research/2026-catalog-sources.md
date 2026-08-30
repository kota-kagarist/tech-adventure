# 2026年版カタログの調査根拠

確認日: 2026-08-30

## 収録範囲の確認

- [State of JavaScript 2025](https://2025.stateofjs.com/en-US/): JavaScriptのUI、meta-framework、server、build、testの利用状況と関心を確認した。2025年調査は13,002件の回答を集め、2026年2月3日に結果が公開された。
- [State of CSS 2025](https://2025.stateofcss.com/en-US/): CSS機能、手法、toolの収録範囲を確認した。
- [Stack Overflow Developer Survey 2025 — Technology](https://survey.stackoverflow.co/2025/technology): 言語、Web技術、database、cloud・infrastructureの広い利用状況を確認した。

これらの調査は人気順位を作るためではなく、主要分野の抜けを検出するために使った。各技術の説明は、技術JSONの `officialUrl` に記録した公式情報を優先した。

## 状態変化の速い技術

### RemixとReact Router

- [Merging Remix and React Router](https://remix.run/blog/merging-remix-and-react-router): Remix v2の機能がReact Router v7のframework modeへ統合された経緯を確認した。
- [Remix 3 Beta Preview](https://remix.run/blog/remix-3-beta-preview): 2026年4月30日時点でRemix 3がproduction readyではないbeta previewであることを確認した。
- [React Router](https://reactrouter.com/): 宣言的、data、frameworkの3 modeと、2026年時点のv8系を確認した。

カタログではRemixを単なる旧名として扱わない。既存Remix v2の移行先と、新たに設計されたRemix 3 betaを同じ説明内で区別する。

### TanStack Start

- [TanStack Start Overview](https://tanstack.com/start/latest/docs/framework/react/overview): v1 Release Candidateで、APIは安定扱いだが正式版前であることを確認した。

この状態を反映し、`maturity` は `emerging` とした。

### Astro

- [The Astro Technology Company joins Cloudflare](https://astro.build/blog/joining-cloudflare/): 2026年1月のCloudflare参加後も、MIT license、platform非依存、公開governanceを維持することを確認した。
- [Astro documentation](https://docs.astro.build/): island architecture、静的生成、server renderingの現在の役割を確認した。

### Turbopack

- [Next.js 16](https://nextjs.org/blog/next-16): 開発とproduction buildの両方で安定版となり、新規Next.js appの既定bundlerになったことを確認した。
- [Turbopack documentation](https://nextjs.org/docs/app/api-reference/turbopack): Next.jsへ統合された増分bundlerとしての現在の役割を確認した。

### Rolldown

- [Rolldown](https://rolldown.rs/): Rust製、Rollup互換API、esbuild相当機能、Vite向け設計を確認した。
- [Vite](https://vite.dev/): Vite 8でRolldownが統合された現在のbuild構成を確認した。

## 更新方針

`lastVerified` はURLの生存確認日ではなく、説明、安定性、対応環境を公式情報と照合した日を表す。CIではHTTPS形式と日付形式を検証する。外部siteの一時障害でbuildを止めないため、179件へのlive requestはCIの必須処理にしない。
