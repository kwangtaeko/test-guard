import { add, sub } from './math.js';

describe('math', () => {
  it('adds', () => {
    expect(add(1, 2)).toBe(3);
    expect(add(2, 2)).toBe(4);
  });

  it.skip('subtracts', () => {
    expect(sub(3, 1)).toBe(2);
  });
});
