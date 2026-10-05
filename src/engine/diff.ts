// Line diff for locating added skips (TG004) and pairing changed assertions (TG007).
// LCS over the lines left after trimming the common prefix and suffix.
// Past MAX_CELLS the middle becomes one hunk, which only coarsens line pairing.

export interface Hunk {
  deleted: number[]; // 1-based line numbers in `before`
  added: number[]; // 1-based line numbers in `after`
}

const MAX_CELLS = 4_000_000;

export function diffLines(before: string[], after: string[]): Hunk[] {
  let start = 0;
  while (
    start < before.length &&
    start < after.length &&
    before[start] === after[start]
  ) {
    start++;
  }
  let endB = before.length;
  let endA = after.length;
  while (endB > start && endA > start && before[endB - 1] === after[endA - 1]) {
    endB--;
    endA--;
  }

  const ops = editScript(before.slice(start, endB), after.slice(start, endA));

  const hunks: Hunk[] = [];
  let current: Hunk | null = null;
  let b = start;
  let a = start;
  for (const op of ops) {
    if (op === '=') {
      current = null;
      b++;
      a++;
      continue;
    }
    if (!current) {
      current = { deleted: [], added: [] };
      hunks.push(current);
    }
    if (op === '-') current.deleted.push(++b);
    else current.added.push(++a);
  }
  return hunks;
}

function editScript(before: string[], after: string[]): string[] {
  const n = before.length;
  const m = after.length;
  if ((n + 1) * (m + 1) > MAX_CELLS) {
    return [...Array(n).fill('-'), ...Array(m).fill('+')];
  }
  // lcs[i * w + j] = LCS length of before[i..] and after[j..]
  const w = m + 1;
  const lcs = new Uint32Array((n + 1) * w);
  for (let i = n - 1; i >= 0; i--) {
    for (let j = m - 1; j >= 0; j--) {
      lcs[i * w + j] =
        before[i] === after[j]
          ? (lcs[(i + 1) * w + j + 1] ?? 0) + 1
          : Math.max(lcs[(i + 1) * w + j] ?? 0, lcs[i * w + j + 1] ?? 0);
    }
  }
  const ops: string[] = [];
  let i = 0;
  let j = 0;
  while (i < n && j < m) {
    if (before[i] === after[j]) {
      ops.push('=');
      i++;
      j++;
    } else if ((lcs[(i + 1) * w + j] ?? 0) >= (lcs[i * w + j + 1] ?? 0)) {
      ops.push('-');
      i++;
    } else {
      ops.push('+');
      j++;
    }
  }
  for (; i < n; i++) ops.push('-');
  for (; j < m; j++) ops.push('+');
  return ops;
}
