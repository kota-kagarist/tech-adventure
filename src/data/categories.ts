import type { CategoryId } from './schema';

export interface Category {
  id: CategoryId;
  name: string;
  description: string;
  order: number;
}

export const categories: Category[] = [
  { id: 'language', name: 'Web標準・言語', description: 'ブラウザへ内容を伝え、処理を書くための基礎', order: 10 },
  { id: 'ui-library', name: 'UI部品', description: '画面の部品や状態を組み立てる', order: 20 },
  { id: 'web-framework', name: 'Webサイト・Webアプリ', description: 'ページ構成や表示方式をまとめる', order: 30 },
  { id: 'server-framework', name: 'API・サーバー', description: 'HTTPリクエストを受けて処理する', order: 40 },
  { id: 'runtime', name: '実行環境', description: 'JavaScriptやサーバー処理を実際に動かす', order: 50 },
  { id: 'styling', name: 'CSS設計・生成', description: '見た目を設計し、保守しやすいCSSを作る', order: 60 },
  { id: 'ui-components', name: 'UI部品集', description: '再利用できる画面部品とデザイン規則を提供する', order: 70 },
  { id: 'state-data', name: '状態・データ取得', description: '画面の状態とサーバーから得るデータを管理する', order: 80 },
  { id: 'protocol-api', name: '通信・API方式', description: 'ブラウザ、サーバー、サービス間の通信方法を定める', order: 90 },
  { id: 'package-monorepo', name: 'パッケージ・モノレポ', description: '依存関係と複数プロジェクトを管理する', order: 100 },
  { id: 'build-transform', name: 'ビルド・変換', description: '開発中の変換と配布用ファイルの生成を支える', order: 110 },
  { id: 'quality-validation', name: '品質・入力検証', description: 'コードの問題、書式、データの形を検査する', order: 120 },
  { id: 'testing', name: 'テスト', description: '部品からブラウザ操作まで期待どおりか確かめる', order: 130 },
  { id: 'orm', name: 'DB操作支援', description: 'アプリからデータベースを扱いやすくする', order: 140 },
  { id: 'database', name: 'データベース', description: '用途に合わせてデータを保存し、検索する', order: 150 },
  { id: 'backend-platform', name: 'バックエンド基盤', description: 'データ保存、API、同期などをまとめて提供する', order: 160 },
  { id: 'auth', name: '認証・認可', description: '利用者を確認し、操作できる範囲を制御する', order: 170 },
  { id: 'cloud-hosting', name: 'クラウド・公開基盤', description: 'サービスをインターネットへ配置して運用する', order: 180 },
  { id: 'infrastructure', name: '実行・配信基盤', description: '実行環境、構成、通信の入口を整える', order: 190 },
  { id: 'ci-cd', name: '自動検証・公開', description: '変更ごとの検証と公開を自動化する', order: 200 },
  { id: 'cms', name: 'コンテンツ管理', description: '記事やページを編集し、配信する', order: 210 },
  { id: 'observability', name: '監視・可観測性', description: 'エラー、ログ、指標、処理の流れを観測する', order: 220 }
];

export const categoryById = Object.fromEntries(
  categories.map((category) => [category.id, category])
) as Record<CategoryId, Category>;
