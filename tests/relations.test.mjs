import assert from 'node:assert/strict';
import test from 'node:test';
import { groupRelationsForTechnology } from '../src/lib/relations.mjs';

const relations = [
  { source: 'authjs', target: 'openid-connect', type: 'implements', note: 'Auth.jsはOpenID Connectを実装する。' },
  { source: 'firebase-auth', target: 'firebase', type: 'part-of', note: 'Firebase AuthはFirebaseの一部である。' },
  { source: 'nextjs', target: 'react', type: 'built-on', note: 'Next.jsはReactを基盤にする。' }
];

test('directed relations are grouped from the selected technology perspective', () => {
  assert.deepEqual(groupRelationsForTechnology('authjs', relations), {
    implements: [relations[0]],
    implementedBy: [],
    partOf: [],
    includes: []
  });
  assert.deepEqual(groupRelationsForTechnology('firebase', relations), {
    implements: [],
    implementedBy: [],
    partOf: [],
    includes: [relations[1]]
  });
});
