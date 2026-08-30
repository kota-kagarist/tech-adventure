import type { Journey } from './schema';

export const journeys: Journey[] = [
  {
    id: 'blog',
    title: 'ブログを作る',
    summary: '記事を主役にして、少ないJavaScriptで高速に配信する構成です。',
    technologyIds: ['typescript', 'astro', 'cloudflare-workers', 'github-actions'],
    reasoning: [
      'Astroは記事中心の画面を静的HTMLとして出力しやすい。',
      'TypeScriptで記事のメタデータや部品の型を揃えられる。',
      'Cloudflare Workersで静的成果物を世界各地から配信できる。',
    ],
    tradeoffs: [
      'ログイン後の操作が中心なら、アプリ向けのフレームワークが扱いやすい。',
      '編集者が管理画面を必要とする場合は、別途CMSを組み合わせる必要がある。',
    ],
    alternatives: [
      'Reactも使うなら、Next.jsで記事と動的画面をまとめる。',
      'Vueに慣れているなら、Nuxtのコンテンツ機能を使う。',
    ],
  },
  {
    id: 'corporate-site',
    title: '企業サイトを作る',
    summary: '表示性能と更新しやすさを両立し、動きが必要な場所だけを実装します。',
    technologyIds: ['typescript', 'astro', 'sanity', 'cloudflare', 'github-actions'],
    reasoning: [
      'Astroなら案内ページの大半を静的HTMLとして配信できる。',
      'Sanityを使うと、広報担当者がコードを触らず内容を更新できる。',
      'Cloudflareは静的配信と独自ドメインの運用を一か所にまとめやすい。',
    ],
    tradeoffs: [
      '会員向け機能が主役になると、静的サイト中心の設計は複雑になりやすい。',
      '外部CMSを使うため、記事構造と公開手順を別サービスでも管理する。',
    ],
    alternatives: [
      'React資産が多い組織なら、Next.jsとヘッドレスCMSを組み合わせる。',
      '小規模で更新頻度が低ければ、CMSを置かずGitで原稿を管理する。',
    ],
  },
  {
    id: 'documentation',
    title: '技術文書サイトを作る',
    summary: '検索可能な文書と版管理を、普段の開発手順に組み込む構成です。',
    technologyIds: ['typescript', 'docusaurus', 'react', 'github-actions', 'cloudflare'],
    reasoning: [
      'Docusaurusは文書の階層、版管理、検索連携をまとめて扱える。',
      'MarkdownとGitを使うため、コード変更と同じ手順で文書をレビューできる。',
      'React部品を使えば、説明用の操作例を文書内へ埋め込める。',
    ],
    tradeoffs: [
      '非開発者だけで頻繁に更新するなら、Git中心の編集手順が負担になる。',
      '単純な数ページの説明には、版管理機能を含む構成が過剰になりやすい。',
    ],
    alternatives: [
      '製品サイトと文書を一体化するなら、Astroで同じ構成にまとめる。',
      '編集画面を優先するなら、ContentfulなどのCMSから文書を配信する。',
    ],
  },
  {
    id: 'api',
    title: 'エッジAPIを作る',
    summary: 'Web標準のAPIを使い、利用者に近い場所で小さな処理を実行します。',
    technologyIds: ['typescript', 'hono', 'cloudflare-workers', 'cloudflare-d1', 'zod'],
    reasoning: [
      'HonoはHTTP処理を小さく書けて、Workers上でも動かしやすい。',
      'Cloudflare D1を使うと、同じ基盤内でSQLデータを扱える。',
      'Zodで外部入力を検証し、TypeScriptの型と実行時の境界を揃えられる。',
    ],
    tradeoffs: [
      '長時間処理や常駐プロセスが必要なら、Workersの実行モデルに合わない。',
      '特定基盤のデータサービスを使うほど、別環境への移行作業は増える。',
    ],
    alternatives: [
      'Node.jsの豊富な資産を優先するなら、FastifyとPostgreSQLを使う。',
      'Pythonでデータ処理も行うなら、FastAPIを中心に構成する。',
    ],
  },
  {
    id: 'small-saas',
    title: 'Reactで小規模SaaSを作る',
    summary: '画面、認証、データ保存、公開までをReact系の定番構成で揃えます。',
    technologyIds: ['typescript', 'react', 'nextjs', 'postgresql', 'prisma', 'authjs', 'vercel'],
    reasoning: [
      'Next.jsで公開ページとログイン後の画面を一つのプロジェクトに置ける。',
      'PostgreSQLとPrismaで、関係を持つ業務データを型付きで操作できる。',
      'Auth.jsを使うと、複数の認証方法をアプリへ組み込みやすい。',
    ],
    tradeoffs: [
      '画面がほぼ静的なら、Reactを全面的に使う構成は配信量が増えやすい。',
      'フレームワークの機能へ寄せるほど、実行環境を替える際の確認事項が増える。',
    ],
    alternatives: [
      'Vueを採用するチームなら、Nuxtと同等のデータ構成を組み合わせる。',
      'Cloudflare内で完結させるなら、HonoとD1から小さく始める。',
    ],
  },
  {
    id: 'vue-saas',
    title: 'Vueで小規模SaaSを作る',
    summary: 'Vueの段階的な学びやすさを保ちつつ、画面とサーバー処理をまとめます。',
    technologyIds: ['typescript', 'vue', 'nuxt', 'pinia', 'postgresql', 'prisma', 'netlify'],
    reasoning: [
      'NuxtはVueの画面、経路、サーバー処理を規約に沿ってまとめられる。',
      'Piniaで画面をまたぐクライアント状態を明示的に管理できる。',
      'PostgreSQLとPrismaは、業務データの関係と型を揃えやすい。',
    ],
    tradeoffs: [
      'React向けだけに提供される部品やサービスは、そのまま利用できない。',
      '単純な管理画面だけなら、フルスタック構成が必要以上に大きくなりうる。',
    ],
    alternatives: [
      'React人材と部品を優先するなら、Next.jsを中心に組み立てる。',
      '外部APIだけを表示するなら、VueとViteによる単一画面構成に絞る。',
    ],
  },
  {
    id: 'python-api',
    title: 'PythonでAPIを作る',
    summary: 'Pythonのデータ処理資産を活かしながら、型の見えるAPIを提供します。',
    technologyIds: ['python', 'fastapi', 'sqlalchemy', 'postgresql', 'docker', 'github-actions'],
    reasoning: [
      'FastAPIはPythonの型注釈から入力検証とAPI文書を生成できる。',
      'SQLAlchemyならSQLの制御を残しつつ、Pythonからデータを操作できる。',
      'Dockerで実行環境を固定し、開発から公開までの差を小さくできる。',
    ],
    tradeoffs: [
      'ブラウザ画面まで同じ言語で作りたい場合は、別の構成が必要になる。',
      '極端に短い応答時間や少ないメモリを優先する処理では不利になりうる。',
    ],
    alternatives: [
      '管理画面や認証も一体で必要なら、Djangoの標準機能を使う。',
      'TypeScriptへ統一するなら、NestJSやFastifyを中心に構成する。',
    ],
  },
  {
    id: 'java-enterprise',
    title: 'Javaで業務システムを作る',
    summary: '長期運用する業務処理を、明確な層と監視可能な実行基盤に分けます。',
    technologyIds: ['java', 'spring-boot', 'hibernate', 'postgresql', 'docker', 'kubernetes', 'opentelemetry'],
    reasoning: [
      'Spring BootはWeb、認証、データ接続の広い選択肢を一貫して扱える。',
      'Hibernateで業務オブジェクトと関係データベースの対応を管理できる。',
      'OpenTelemetryを組み込むと、複数サービスをまたぐ処理を追跡できる。',
    ],
    tradeoffs: [
      '少人数で試作する段階では、層や運用基盤の設計負担が大きくなりやすい。',
      'Kubernetesは複数サービスの運用に有効だが、専任知識と監視が必要になる。',
    ],
    alternatives: [
      'Microsoft製品との統合を優先するなら、ASP.NET Coreを選ぶ。',
      '小さな独立APIなら、GoやTypeScriptで構成を簡素化する。',
    ],
  },
  {
    id: 'dotnet-business-app',
    title: '.NETで業務アプリを作る',
    summary: 'Microsoft製品と連携する業務アプリを、型付きの共通基盤で構築します。',
    technologyIds: ['csharp', 'aspnet-core', 'ef-core', 'sql-server', 'azure', 'docker'],
    reasoning: [
      'ASP.NET CoreはAPI、認証、画面配信を同じ基盤で構成できる。',
      'EF CoreでC#のモデルとSQL Serverのデータを対応付けられる。',
      'Azureを使うと、企業のID管理や監視サービスと連携しやすい。',
    ],
    tradeoffs: [
      'Microsoft製品との連携が少ない場合は、この構成の利点が小さくなる。',
      '小さな静的サイトには、サーバーとデータ層を含む構成が過剰になる。',
    ],
    alternatives: [
      'Java資産が多い組織なら、Spring BootとHibernateを使う。',
      '単一の軽量APIなら、FastAPIやHonoで運用要素を減らす。',
    ],
  },
  {
    id: 'realtime-app',
    title: 'リアルタイムアプリを作る',
    summary: '双方向通信と共有状態を分け、切断や再接続を前提に設計します。',
    technologyIds: ['typescript', 'react', 'nodejs', 'websocket', 'redis', 'postgresql'],
    reasoning: [
      'WebSocketでサーバーとブラウザの双方向通信を維持できる。',
      'Redisを使うと、複数サーバー間の一時的な通知を中継できる。',
      'PostgreSQLには、失ってはいけない確定データを保存できる。',
    ],
    tradeoffs: [
      '常時接続は通常のHTTP要求より、障害時の再接続と監視が複雑になる。',
      '更新頻度が低い画面なら、一定間隔の取得やSSEの方が簡単に保てる。',
    ],
    alternatives: [
      'サーバーからの一方向通知だけなら、SSEで接続管理を簡素化する。',
      '同期基盤を自前で運用しないなら、FirebaseやConvexを利用する。',
    ],
  },
  {
    id: 'headless-content',
    title: 'ヘッドレスCMSでメディアを作る',
    summary: '編集画面と表示層を分け、同じ記事を複数の接点へ配信します。',
    technologyIds: ['typescript', 'react', 'nextjs', 'sanity', 'vercel'],
    reasoning: [
      'Sanityで編集者向けの入力画面と記事構造を定義できる。',
      'Next.jsは記事の事前生成と更新後の再生成を組み合わせられる。',
      '表示層を分けるため、同じ内容をWeb以外の接点でも利用できる。',
    ],
    tradeoffs: [
      'CMSと表示側の二つを運用するため、障害箇所と権限設定が増える。',
      '画面上で完成形を直接編集したいチームには、分離した操作が分かりにくい。',
    ],
    alternatives: [
      'Webサイトだけを簡単に編集するなら、WordPressで一体運用する。',
      '原稿を開発者が管理するなら、AstroとMarkdownに絞る。',
    ],
  },
  {
    id: 'self-hosted-cms',
    title: 'CMSを自社運用する',
    summary: '公開先とデータを自分で管理し、一般的な運用部品でサイトを支えます。',
    technologyIds: ['php', 'wordpress', 'mysql', 'nginx', 'docker'],
    reasoning: [
      'WordPressは編集画面、テーマ、拡張機能を一体で提供する。',
      'MySQLはWordPressの標準的なデータ保存先として情報が豊富にある。',
      'DockerでPHP、Webサーバー、データベースの構成を再現しやすくする。',
    ],
    tradeoffs: [
      '本体と拡張機能の更新、バックアップ、脆弱性対応を自分で行う必要がある。',
      '複数の表示先へ同じ内容を配る用途では、画面と一体の構成が制約になる。',
    ],
    alternatives: [
      '運用をサービス側へ任せるなら、WordPressの管理型提供を選ぶ。',
      '表示層を自由に作るなら、DirectusなどのヘッドレスCMSを使う。',
    ],
  },
];

const featuredJourneyIds = ['blog', 'small-saas', 'api', 'python-api'];

export const featuredJourneys = featuredJourneyIds
  .map((id) => journeys.find((journey) => journey.id === id))
  .filter((journey): journey is Journey => Boolean(journey));

export function getJourneyById(id: string): Journey | undefined {
  return journeys.find((journey) => journey.id === id);
}
