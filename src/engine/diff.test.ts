import { describe, expect, it } from 'vitest';
import { diffLines } from './diff.js';

const lines = (s: string) => (s === '' ? [] : s.split(''));

describe('diffLines', () => {
  it('returns no hunks for identical input', () => {
    expect(diffLines(lines('abc'), lines('abc'))).toEqual([]);
    expect(diffLines([], [])).toEqual([]);
  });

  it('reports pure additions', () => {
    expect(diffLines(lines('ac'), lines('abc'))).toEqual([
      { deleted: [], added: [2] },
    ]);
    expect(diffLines([], lines('ab'))).toEqual([
      { deleted: [], added: [1, 2] },
    ]);
  });

  it('reports pure deletions', () => {
    expect(diffLines(lines('abc'), lines('ac'))).toEqual([
      { deleted: [2], added: [] },
    ]);
    expect(diffLines(lines('ab'), [])).toEqual([
      { deleted: [1, 2], added: [] },
    ]);
  });

  it('groups a replacement into one hunk', () => {
    expect(diffLines(lines('axyd'), lines('apqd'))).toEqual([
      { deleted: [2, 3], added: [2, 3] },
    ]);
  });

  it('keeps separate hunks apart', () => {
    expect(diffLines(lines('abcde'), lines('aXcdeY'))).toEqual([
      { deleted: [2], added: [2] },
      { deleted: [], added: [6] },
    ]);
  });

  it('tracks line numbers on both sides', () => {
    expect(diffLines(lines('abcd'), lines('xxabd'))).toEqual([
      { deleted: [], added: [1, 2] },
      { deleted: [3], added: [] },
    ]);
  });
});
