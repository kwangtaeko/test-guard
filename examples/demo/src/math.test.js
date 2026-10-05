import { describe, expect, it } from 'vitest';
import { add, sub } from './math.js';

describe('math', () => {
  it('adds', () => {
    expect(add(1, 2)).toBe(3);
  });

  it('subtracts', () => {
    expect(sub(3, 1)).toBe(2);
    expect(sub(5, 5)).toBe(0);
  });
});
