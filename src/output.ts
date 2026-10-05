import type { createColors } from 'picocolors';
import type { CheckResult } from './engine/check.js';

type Colors = ReturnType<typeof createColors>;

// A check result plus the reason from a `Test-Guard-Approved:` trailer, if any.
export interface Report extends CheckResult {
  approval?: string;
}

const COMPARE_LABELS = {
  worktree: 'working tree ↔ HEAD',
  staged: 'staged ↔ HEAD',
};

const ADVICE = 'Fix the implementation instead of weakening tests.';

export function formatJson(report: Report, version: string): string {
  const count = (severity: string) =>
    report.findings.filter((f) => f.severity === severity).length;
  return `${JSON.stringify(
    {
      tool: 'test-guard',
      version,
      compare: { mode: report.mode.kind, from: report.from },
      findings: report.findings,
      summary: {
        error: count('error'),
        warn: count('warn'),
        filesScanned: report.filesScanned,
      },
      ...(report.approval !== undefined && {
        approval: { source: 'trailer', reason: report.approval },
      }),
    },
    null,
    2,
  )}\n`;
}

export function formatText(report: Report, version: string, c: Colors): string {
  const { findings, filesScanned } = report;
  const lines = [
    `test-guard ${version} · compare: ${compareLabel(report)} · ${plural(filesScanned, 'test file')}`,
    '',
  ];

  if (findings.length === 0) {
    lines.push(c.green('No test weakening found.'));
    return `${lines.join('\n')}\n`;
  }

  const locations = findings.map(location);
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
      (hasError && report.approval === undefined ? ` · ${ADVICE}` : ''),
  );
  if (report.approval !== undefined) {
    lines.push(c.yellow(`Approved by commit trailer: ${report.approval}`));
  }
  return `${lines.join('\n')}\n`;
}

// GitHub Job Summary.
export function formatMarkdown(report: Report): string {
  const { findings, filesScanned } = report;
  const lines = [
    '### test-guard',
    '',
    `Compare: ${compareLabel(report)} · ${plural(filesScanned, 'test file')}`,
    '',
  ];
  if (findings.length === 0) {
    lines.push('✅ No test weakening found.');
    return `${lines.join('\n')}\n`;
  }
  lines.push('| Severity | Rule | Location | Message |', '|---|---|---|---|');
  for (const f of findings) {
    const severity = f.severity === 'error' ? '❌ error' : '⚠️ warn';
    lines.push(
      `| ${severity} | ${f.ruleId} | \`${cell(location(f))}\` | ${cell(f.message)} |`,
    );
  }
  lines.push('', `**${plural(findings.length, 'violation')}** · ${ADVICE}`);
  return `${lines.join('\n')}\n`;
}

function compareLabel({ mode }: Report): string {
  return mode.kind === 'base'
    ? `HEAD ↔ merge-base(${mode.ref})`
    : COMPARE_LABELS[mode.kind];
}

function location(f: Report['findings'][number]): string {
  return f.line === undefined ? f.path : `${f.path}:${f.line}`;
}

function cell(text: string): string {
  return text.replace(/\|/g, '\\|').replace(/\n/g, ' ');
}

function plural(n: number, word: string): string {
  return `${n} ${word}${n === 1 ? '' : 's'}`;
}
