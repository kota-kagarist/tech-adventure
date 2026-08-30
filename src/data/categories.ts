import type { CategoryId } from './schema';

export interface Category {
  id: CategoryId;
  name: string;
  description: string;
  order: number;
}

export const categories: Category[] = [
  { id: 'language', name: '言語', description: 'コードを書くための言葉', order: 10 },
  { id: 'ui-library', name: 'UI部品', description: '画面の部品や状態を組み立てる', order: 20 },
  { id: 'web-framework', name: 'Webサイト・Webアプリ', description: 'ページ構成や表示方式をまとめる', order: 30 },
  { id: 'server-framework', name: 'API・サーバー', description: 'HTTPリクエストを受けて処理する', order: 40 },
  { id: 'runtime', name: '実行環境', description: 'JavaScriptやサーバー処理を実際に動かす', order: 50 },
  { id: 'build-tool', name: '開発・ビルド', description: '開発中の変換や配布用ビルドを支える', order: 60 },
  { id: 'database', name: 'データベース', description: '構造化されたデータを保存する', order: 70 },
  { id: 'storage', name: 'ストレージ', description: '画像やオブジェクトなどを保存する', order: 80 },
  { id: 'deployment', name: '公開基盤', description: 'サービスをインターネットへ公開する', order: 90 },
  { id: 'orm', name: 'DB操作支援', description: 'アプリからDBを扱いやすくする', order: 100 }
];

export const categoryById = Object.fromEntries(
  categories.map((category) => [category.id, category])
) as Record<CategoryId, Category>;
