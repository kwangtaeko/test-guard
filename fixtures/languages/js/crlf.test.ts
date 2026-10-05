import { expect, test } from 'vitest';

test('one', () => {
  expect(1).toBe(1);
});

// test('commented', () => {});
test.skip('two', () => {
  expect(2).toBe(2);
});
