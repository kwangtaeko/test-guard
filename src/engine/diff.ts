// Line diff for locating added skips (TG004) and pairing changed assertions (TG007).
// LCS over the lines left after trimming the common prefix and suffix.
// Past MAX_CELLS the middle is split at lines found once on each side (patience
// diff); a part still too large and without such lines becomes one hunk.

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
    // Too large: split at lines that occur once on each side, in order
    // (patience diff), and diff the parts between them.
    const anchors = uniqueAnchors(before, after);
    if (anchors.length === 0) {
      return [...Array(n).fill('-'), ...Array(m).fill('+')];
    }
    const ops: string[] = [];
    let i = 0;
    let j = 0;
    for (const [a, b] of anchors) {
      ops.push(...editScript(before.slice(i, a), after.slice(j, b)), '=');
      i = a + 1;
      j = b + 1;
    }
    ops.push(...editScript(before.slice(i), after.slice(j)));
    return ops;
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

// Pairs [index in before, index in after] of lines found once on each side,
// the longest run in the same order on both.
function uniqueAnchors(before: string[], after: string[]): [number, number][] {
  const seen = new Map<
    string,
    { b: number; a: number; nb: number; na: number }
  >();
  const entry = (line: string) => {
    let e = seen.get(line);
    if (!e) {
      e = { b: -1, a: -1, nb: 0, na: 0 };
      seen.set(line, e);
    }
    return e;
  };
  before.forEach((line, i) => {
    const e = entry(line);
    e.b = i;
    e.nb++;
  });
  after.forEach((line, j) => {
    const e = entry(line);
    e.a = j;
    e.na++;
  });
  const pairs = [...seen.values()]
    .filter((e) => e.nb === 1 && e.na === 1)
    .map((e): [number, number] => [e.b, e.a])
    .sort((x, y) => x[0] - y[0]);
  // Longest increasing run of `after` indexes (patience sorting).
  const tails: number[] = []; // index into pairs ending a run of each length
  const previous: number[] = [];
  pairs.forEach(([, a], k) => {
    let lo = 0;
    let hi = tails.length;
    while (lo < hi) {
      const mid = (lo + hi) >> 1;
      if ((pairs[tails[mid] ?? 0]?.[1] ?? 0) < a) lo = mid + 1;
      else hi = mid;
    }
    previous[k] = lo > 0 ? (tails[lo - 1] ?? -1) : -1;
    tails[lo] = k;
  });
  const run: [number, number][] = [];
  for (let k = tails.at(-1) ?? -1; k !== -1; k = previous[k] ?? -1) {
    const pair = pairs[k];
    if (pair) run.unshift(pair);
  }
  return run;
}
