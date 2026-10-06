import { CONFIG_FILE } from '../config.js';
import type { Rule, RuleFinding } from './types.js';

// test-guard protecting itself, file side (ROADMAP §3.3): any change to its
// config, and in hook / CI / agent settings files any removed or changed line
// that runs it, a narrower hook matcher, a failure made non-blocking, a
// condition that keeps it from running, or the file renamed away.
export const tg006: Rule = ({
  guardFile,
  beforePath,
  afterPath,
  beforeLines,
  afterLines,
}) => {
  if (guardFile === 'config') {
    const what = !beforePath ? 'added' : !afterPath ? 'deleted' : 'changed';
    return [
      {
        ruleId: 'TG006',
        path: CONFIG_FILE,
        message: `${what} test-guard config (needs human approval)`,
      },
    ];
  }
  if (guardFile !== 'hook') return [];
  const path = afterPath ?? beforePath ?? '';
  const findings: RuleFinding[] = [];
  const add = (message: string, extra: Partial<RuleFinding> = {}) =>
    findings.push({ ruleId: 'TG006', path, message, ...extra });
  const mentions = (line: string) => line.includes('test-guard');

  if (
    beforePath &&
    afterPath &&
    beforePath !== afterPath &&
    beforeLines.some(mentions) &&
    !/^\.github\/workflows\/[^/]+\.ya?ml$/.test(afterPath)
  ) {
    add(`renamed ${beforePath}, which ran test-guard`);
  }

  // Agent settings are compared as data, so reformatting doesn't count.
  const beforeHooks = agentHooks(beforeLines);
  const afterHooks = agentHooks(afterLines);
  if (beforeHooks && afterHooks) {
    const lost = (a: Set<string>, b: Set<string>) =>
      [...a].filter((k) => !b.has(k));
    const hooks = lost(beforeHooks.hooks, afterHooks.hooks);
    if (hooks.length > 0) {
      add(`removed or changed test-guard's hook (${hooks[0]?.split(' ')[0]})`);
    }
    const matchers = lost(beforeHooks.matchers, afterHooks.matchers);
    if (matchers.length > 0) {
      add(`changed the matcher of test-guard's hook (${matchers.join(', ')})`);
    }
  } else {
    lineChanges(beforeLines.filter(mentions), afterLines.filter(mentions), add);
  }

  // Claude Code: `"disableAllHooks": true` turns every hook off.
  const disables = (lines: string[]) =>
    lines.filter((line) => /"disableAllHooks"\s*:\s*true/.test(line)).length;
  if (disables(afterLines) > disables(beforeLines)) {
    add('turned on `disableAllHooks`, which stops test-guard’s agent hooks');
  }

  const nonBlocking = (lines: string[]) =>
    lines.filter((_, i) => continuesOnError(lines, i)).length;
  if (nonBlocking(afterLines) > nonBlocking(beforeLines)) {
    add('made test-guard’s CI step non-blocking (`continue-on-error`)');
  }

  const script = !/\.(?:ya?ml|json)$/.test(path);
  const skipped = added(
    conditions(beforeLines, script),
    conditions(afterLines, script),
  );
  if (skipped.length > 0) {
    add(
      `added a condition that can keep test-guard from running: \`${skipped[0]}\``,
    );
  }
  return findings;
};

// A line that runs test-guard removed, or changed (`|| true`, other
// arguments). Indentation, a trailing comma and the package version don't
// count, so dependency bumps pass.
function lineChanges(
  before: string[],
  after: string[],
  add: (message: string, extra?: Partial<RuleFinding>) => void,
): void {
  const lost = added(after, before);
  if (after.length < before.length) {
    add(
      `removed test-guard from hook config (lines ${before.length} → ${after.length})`,
      { before: before.length, after: after.length },
    );
  } else if (lost.length > 0) {
    add(`changed how test-guard runs: \`${lost[0]}\``);
  }
}

const normalize = (line: string) =>
  line
    .trim()
    .replace(/,$/, '')
    .replace(/(test-guard)@[\w.^~<>=*-]+/g, '$1')
    .replace(/^("test-guard"\s*:\s*)"[^"]*"$/, '$1"*"');

// Lines (normalized) in `after` that `before` doesn't have, counting repeats.
function added(before: string[], after: string[]): string[] {
  const remaining = new Map<string, number>();
  for (const line of before) {
    remaining.set(normalize(line), (remaining.get(normalize(line)) ?? 0) + 1);
  }
  return after
    .filter((line) => {
      const left = remaining.get(normalize(line)) ?? 0;
      if (left > 0) remaining.set(normalize(line), left - 1);
      return left === 0;
    })
    .map(normalize);
}

// Agent settings (`hooks.<Event>[]`): each hook that runs test-guard, and
// each matcher alternative it is attached to, or null when the file isn't
// such settings.
function agentHooks(
  lines: string[],
): { hooks: Set<string>; matchers: Set<string> } | null {
  let settings: unknown;
  try {
    settings = JSON.parse(lines.join('\n'));
  } catch {
    return null;
  }
  const hooks = isObject(settings) ? settings.hooks : undefined;
  if (!isObject(hooks)) return null;
  const found = { hooks: new Set<string>(), matchers: new Set<string>() };
  for (const [event, entries] of Object.entries(hooks)) {
    if (!Array.isArray(entries)) continue;
    for (const entry of entries) {
      if (!isObject(entry) || !Array.isArray(entry.hooks)) continue;
      const guards = entry.hooks.filter((h) =>
        JSON.stringify(h).includes('test-guard'),
      );
      if (guards.length === 0) continue;
      for (const hook of guards) {
        found.hooks.add(`${event} ${JSON.stringify(hook)}`);
      }
      const matcher = typeof entry.matcher === 'string' ? entry.matcher : '*';
      for (const alt of matcher.split('|')) {
        found.matchers.add(`${event} ${alt.trim() || '*'}`);
      }
    }
  }
  return found.hooks.size > 0 ? found : null;
}

const indent = (s: string) => s.length - s.trimStart().length;

// The YAML block (step or job) that line `index` belongs to.
export function yamlBlock(lines: string[], index: number): string[] {
  const line = lines[index] ?? '';
  const own = indent(line.replace(/-\s*/, (m) => ' '.repeat(m.length)));
  let start = index;
  while (start > 0 && indent(lines[start] ?? '') >= own) start--;
  const parent = indent(lines[start] ?? '');
  let end = index + 1;
  while (
    end < lines.length &&
    ((lines[end] ?? '').trim() === '' || indent(lines[end] ?? '') > parent)
  ) {
    end++;
  }
  return lines.slice(start, end);
}

// GitHub Actions: a truthy `continue-on-error` on a step or job whose block
// runs test-guard.
function continuesOnError(lines: string[], index: number): boolean {
  const line = lines[index] ?? '';
  if (!/^\s*-?\s*continue-on-error\s*:\s*(?!false\b)\S/.test(line)) {
    return false;
  }
  return yamlBlock(lines, index).some((l) => l.includes('test-guard'));
}

// Lines that can keep test-guard from running: in YAML, a condition on the
// step or job that runs it (GitHub Actions `if:`, lefthook `skip:`/`only:`,
// pre-commit `stages:`/`files:`/`exclude:`); in a hook script, an early
// exit, trap, function or `if` above the line that runs it.
function conditions(lines: string[], script: boolean): string[] {
  const last = lines.map((l) => l.includes('test-guard')).lastIndexOf(true);
  return lines.filter((line, i) => {
    if (
      /^\s*-?\s*(?:if|skip|only|stages|files|exclude|glob|exclude_tags|piped|types|types_or|exclude_types)\s*:/.test(
        line,
      )
    ) {
      return yamlBlock(lines, i).some((l) => l.includes('test-guard'));
    }
    if (!script || i >= last) return false;
    const text = line.trim();
    // Husky's own header sources its helper.
    if (text.includes('husky.sh')) return false;
    // Ends the script, or runs code that can.
    if (
      /\b(?:exit|return|exec|kill)\b|^(?:\.|source|eval|trap)\s|^cd\b|\w+\s*\(\)\s*\{|\bPATH=/.test(
        text,
      )
    ) {
      return true;
    }
    // A block that wraps the line that runs test-guard.
    const open = /^(?:if|while|until|case)\b/.exec(text);
    return open !== null && blockEnd(lines, i) > last;
  });
}

// The line that closes the `if`/`while`/`until`/`case` block opened at
// `start` (the same line for one-liners).
function blockEnd(lines: string[], start: number): number {
  let depth = 0;
  for (let i = start; i < lines.length; i++) {
    const text = lines[i] ?? '';
    depth += (text.match(/(?:^|[;\s])(?:if|while|until|case)\b/g) ?? []).length;
    depth -= (text.match(/(?:^|[;\s])(?:fi|done|esac)\b/g) ?? []).length;
    if (depth <= 0) return i;
  }
  return lines.length;
}

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}
