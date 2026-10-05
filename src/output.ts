import type { createColors } from 'picocolors';
import type { CheckResult } from './engine/check.js';

type Colors = ReturnType<typeof createColors>;

const COMPARE_LABELS = {
  worktree: 'working tree ↔ HEAD',
  staged: 'staged ↔ HEAD',
};

export function formatJson(result: CheckResult, version: string): string {
  const count = (severity: string) =>
    result.findings.filter((f) => f.severity === severity).length;
  return `${JSON.stringify(
    {
      tool: 'test-guard',
      version,
      compare: { mode: result.mode.kind, from: result.from },
      findings: result.findings,
      summary: {
        error: count('error'),
        warn: count('warn'),
        filesScanned: result.filesScanned,
      },
    },
    null,
    2,
  )}\n`;
}

export function formatText(
  result: CheckResult,
  version: string,
  c: Colors,
): string {
  const { mode, findings, filesScanned } = result;
  const compare =
    mode.kind === 'base'
      ? `HEAD ↔ merge-base(${mode.ref})`
      : COMPARE_LABELS[mode.kind];
  const lines = [
    `test-guard ${version} · compare: ${compare} · ${plural(filesScanned, 'test file')}`,
    '',
  ];

  if (findings.length === 0) {
    lines.push(c.green('No test weakening found.'));
    return `${lines.join('\n')}\n`;
  }

  const locations = findings.map((f) =>
    f.line === undefined ? f.path : `${f.path}:${f.line}`,
  );
  const width = Math.max(...locations.map((l) => l.length));
  findings.forEach((f, i) => {
    const badge =
      f.severity === 'error'
        ? c.bgRed(c.white(c.bold(' ERROR ')))
        : c.bgYellow(c.black(c.bold(' WARN  ')));
    lines.push(
      ` ${badge}  ${f.ruleId}  ${(locations[i] ?? '').padEnd(width)}   ${f.message}`,
    );
  });
  lines.push('');
  const hasError = findings.some((f) => f.severity === 'error');
  lines.push(
    plural(findings.length, 'violation') +
      (hasError ? ' · Fix the implementation instead of weakening tests.' : ''),
  );
  return `${lines.join('\n')}\n`;
}

function plural(n: number, word: string): string {
  return `${n} ${word}${n === 1 ? '' : 's'}`;
}
