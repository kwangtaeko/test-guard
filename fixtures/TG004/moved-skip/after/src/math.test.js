import { add, sub } from './math.js';

describe('math', () => {
  it.skip('subtracts', () => {
    expect(sub(3, 1)).toBe(2);
  });

  it('adds', () => {
    expect(add(1, 2)).toBe(3);
    expect(add(2, 2)).toBe(4);
  });
});
