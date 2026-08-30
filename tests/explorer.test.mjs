import assert from 'node:assert/strict';
import test from 'node:test';
import { filterTechnologies } from '../src/lib/explorer.mjs';

const records = [
  {
    id: 'react', name: 'React', shortDescription: 'UIライブラリ', role: 'コンポーネントUI',
    category: 'ui-library', ecosystem: ['javascript', 'react'], maturity: 'mature', importance: 'core',
    aliases: ['React.js'], tags: ['UI', 'component']
  },
  {
    id: 'nextjs', name: 'Next.js', shortDescription: 'Reactメタフレームワーク', role: 'Webアプリ全体',
    category: 'web-framework', ecosystem: ['javascript', 'typescript', 'react'], maturity: 'established', importance: 'core',
    aliases: ['Next'], tags: ['SSR', 'full-stack']
  },
  {
    id: 'django', name: 'Django', shortDescription: 'Python Webフレームワーク', role: '業務Webアプリ',
    category: 'server-framework', ecosystem: ['python'], maturity: 'mature', importance: 'core',
    aliases: [], tags: ['server', 'ORM']
  }
];

test('explorer combines text, category, ecosystem, maturity, and importance filters', () => {
  assert.deepEqual(
    filterTechnologies(records, {
      query: 'full stack', category: 'web-framework', ecosystem: 'react',
      maturity: 'established', importance: 'core'
    }).map((technology) => technology.id),
    ['nextjs']
  );
});

test('explorer search includes aliases and ignores punctuation and letter case', () => {
  assert.deepEqual(
    filterTechnologies(records, { query: 'REACTJS' }).map((technology) => technology.id),
    ['react']
  );
});

test('empty explorer filters preserve every record', () => {
  assert.deepEqual(filterTechnologies(records, {}).map((technology) => technology.id), ['react', 'nextjs', 'django']);
});
