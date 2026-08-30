import assert from 'node:assert/strict';
import test from 'node:test';
import { getTechnologyMetadata } from '../src/lib/technology-metadata.mjs';

test('technology metadata resolves decision labels and ecosystem names', () => {
  assert.deepEqual(getTechnologyMetadata({
    maturity: 'established', importance: 'core', ecosystem: ['javascript', 'react'], aliases: ['React.js']
  }, { javascript: 'JavaScript', react: 'React' }), {
    maturity: '定着',
    importance: 'Core',
    ecosystems: ['JavaScript', 'React'],
    aliases: ['React.js']
  });
});
