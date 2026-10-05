import type { Rule } from './types.js';

// More skip/disable/only/todo markers. Only an increase counts, so moving an
// existing `it.skip` is fine; the added lines locate the new markers.
export const tg004: Rule = ({ before, after, hunks }) => {
  if (!after) return [];
  const beforeSkips = before?.stats.skips ?? 0;
  const afterSkips = after.stats.skips;
  if (afterSkips <= beforeSkips) return [];

  const added = new Set(hunks.flatMap((hunk) => hunk.added));
  const hits = after.skips.filter((skip) => added.has(skip.line));
  if (hits.length === 0) {
    return [
      {
        ruleId: 'TG004',
        path: after.stats.path,
        message: `skips ${beforeSkips} → ${afterSkips}`,
        before: beforeSkips,
        after: afterSkips,
      },
    ];
  }
  return hits.map((skip) => ({
    ruleId: 'TG004',
    path: after.stats.path,
    line: skip.line,
    message: `added \`${skip.text}\``,
  }));
};
