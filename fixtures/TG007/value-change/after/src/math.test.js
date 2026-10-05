import { add, sub } from './math.js';

describe('math', () => {
  it('adds', () => {
    expect(add(1, 1)).toBe(2);
    expect(add(2, 2)).toBe(4);
  });

  it('subtracts', () => {
    expect(sub(3, 1)).toBe(2);
  });
});
