import type { Journey } from './schema';

export const journeys: Journey[] = [
  { id: 'blog', title: 'ブログを作る', summary: '読み物中心なら、まず静的HTMLを速く届ける構成から始める。', technologyIds: ['typescript', 'astro', 'cloudflare-workers'], reasoning: ['Astroは記事やコンテンツ中心のサイトと相性がよい。','TypeScriptでデータ構造を明確にできる。','Cloudflare Workers Static Assetsで静的成果物を配信できる。'], alternatives: ['Next.js + React', 'Nuxt + Vue'] },
  { id: 'corporate-site', title: '企業サイトを作る', summary: '更新しやすさと表示性能を優先し、必要な場所だけ動かす。', technologyIds: ['typescript', 'astro', 'cloudflare-workers'], reasoning: ['大半が情報閲覧なら、全画面をJavaScriptアプリにする必要がない。','AstroはReactやVueなどを必要な部分だけ足せる。','静的配信なら運用するサーバーを増やさずに済む。'], alternatives: ['Next.js + React', 'Nuxt + Vue'] },
  { id: 'api', title: 'APIを作る', summary: '画面が不要なら、サーバーフレームワークと実行環境を直接選ぶ。', technologyIds: ['typescript', 'hono', 'cloudflare-workers'], reasoning: ['HonoはHTTP/API処理を小さく書ける。','Cloudflare WorkersとWeb標準APIの相性がよい。','同じHonoコードをNode.jsやBunなどへ持ち込む選択肢もある。'], alternatives: ['Express + Node.js', 'Fastify + Node.js'] },
  { id: 'small-saas', title: '小規模SaaSを作る', summary: '最初から巨大な構成にせず、画面・実行・データ保存を一つずつ選ぶ。', technologyIds: ['typescript', 'astro', 'cloudflare-workers', 'cloudflare-d1'], reasoning: ['情報閲覧中心の画面ならAstroから始められる。','動的処理が必要になればWorkers側へ段階的に足せる。','D1ならCloudflare内でSQLデータを扱える。'], alternatives: ['Next.js + PostgreSQL', 'Nuxt + PostgreSQL'] }
];

export function getJourneyById(id: string): Journey | undefined {
  return journeys.find((journey) => journey.id === id);
}
