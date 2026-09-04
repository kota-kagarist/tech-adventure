import type { CategoryId } from './schema';

export interface LandscapeRegion {
  id: 'foundation' | 'interface' | 'application' | 'data-identity' | 'delivery' | 'engineering';
  label: string;
  name: string;
  description: string;
  categories: readonly CategoryId[];
}

export const landscapeRegions: LandscapeRegion[] = [
  {
    id: 'foundation',
    label: 'FOUNDATION',
    name: 'Webの土台',
    description: '言語、実行環境、通信方式など、他の技術が前提にする基礎。',
    categories: ['language', 'runtime', 'protocol-api'],
  },
  {
    id: 'interface',
    label: 'INTERFACE',
    name: '画面をつくる',
    description: 'UI、見た目、部品、画面状態とデータ取得を組み立てる。',
    categories: ['ui-library', 'styling', 'ui-components', 'state-data'],
  },
  {
    id: 'application',
    label: 'APPLICATION',
    name: 'サイトとAPIを組む',
    description: 'Webサイト、Webアプリ、API、コンテンツ配信の骨格をつくる。',
    categories: ['web-framework', 'server-framework', 'cms'],
  },
  {
    id: 'data-identity',
    label: 'DATA & IDENTITY',
    name: 'データと利用者',
    description: '保存、DB操作、バックエンド基盤、認証と認可を扱う。',
    categories: ['orm', 'database', 'backend-platform', 'auth'],
  },
  {
    id: 'delivery',
    label: 'DELIVERY',
    name: '公開して動かす',
    description: 'サービスの配置、実行基盤、通信の入口、自動公開を担う。',
    categories: ['cloud-hosting', 'infrastructure', 'ci-cd'],
  },
  {
    id: 'engineering',
    label: 'ENGINEERING',
    name: '開発を支える',
    description: '依存管理、ビルド、検査、テスト、監視で開発と運用を支える。',
    categories: ['package-monorepo', 'build-transform', 'quality-validation', 'testing', 'observability'],
  },
];

export const regionByCategory = Object.fromEntries(
  landscapeRegions.flatMap((region) => region.categories.map((category) => [category, region.id])),
) as Record<CategoryId, LandscapeRegion['id']>;
