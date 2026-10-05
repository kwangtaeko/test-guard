import { expect, test } from 'vitest';
import { VERSION } from './index.js';

test('exports a semver VERSION', () => {
  expect(VERSION).toMatch(/^\d+\.\d+\.\d+$/);
});
