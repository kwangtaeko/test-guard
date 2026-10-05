import assert from 'node:assert';
import { describe, expect, it, test } from 'vitest';

describe('math', () => {
  it('adds', () => {
    expect(1 + 1).toBe(2);
    expect(2 + 2).toBe(4);
  });

  test('subtracts', () => {
    assert.strictEqual(3 - 1, 2);
  });

  it.each([1, 2, 3])('is positive: %i', (n) => {
    assert(n > 0);
  });

  it.skip('skipped', () => {
    expect(true).toBe(true);
  });

  it.todo('later');
});

xdescribe('disabled', () => {
  xit('old', () => {
    expect(0).toBe(0);
  });
  fit('focused', () => {
    expect(1).toBe(1);
  });
});

describe.only('focused suite', () => {
  test.only('one', () => {
    expect([]).toHaveLength(0);
  });
});
