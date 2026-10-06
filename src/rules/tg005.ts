import type { RunnerConfig } from '../watched.js';
import { yamlBlock, yamlBlockRange } from './tg006.js';
import type { Rule, RuleFinding } from './types.js';

// Test runner configuration tampering (ROADMAP §3.2). MVP: an added or changed
// line in a runner config that contains a watched key or flag. A new config
// counts when it lands next to existing files; a new package's config doesn't.

interface Token {
  re: RegExp;
  label: string;
}

const word = (w: string): Token => ({ re: new RegExp(`\\b${w}\\b`), label: w });

const JEST = [
  'passWithNoTests',
  'testPathIgnorePatterns',
  'modulePathIgnorePatterns',
  'testMatch',
  'testRegex',
  'testNamePattern',
  // Code that runs before every test file can stub out what is tested.
  'setupFiles',
  'setupFilesAfterEnv',
  'globalSetup',
];

const VITEST = [
  'passWithNoTests',
  'exclude',
  'include',
  'testNamePattern',
  'allowOnly',
  'setupFiles',
  'globalSetup',
  'projects',
  'dir',
].map(word);

const TOKENS: Record<RunnerConfig, Token[]> = {
  'package.json': JEST.map(word),
  jest: JEST.map(word),
  vitest: VITEST,
  // Vitest reads `test` from vite.config.* too; other keys there aren't tests.
  vite: VITEST,
  mocha: ['ignore', 'exclude', 'spec', 'grep', 'fgrep', 'invert'].map(word),
  pytest: [
    { re: /(?:^|[\s"'=[,])-k(?=[\s"'=]|$)/, label: '-k' },
    { re: /--deselect\b/, label: '--deselect' },
    { re: /--ignore(?:-glob)?\b/, label: '--ignore' },
    // Only plugins that collect tests; `-p no:cacheprovider` is routine.
    {
      re: /-p\s*no:(?:python|unittest|doctest|nose)\b/,
      label: '-p no:',
    },
    // A marker filter; `python -m pytest` in tox.ini is not one.
    {
      re: /(?<!\b(?:py(?:thon)?[\d.]*|coverage\s+run(?:\s+-{1,2}[\w-]+)*)\s*)(?:^|[\s"'=[,])-m(?=[\s"'=]|$)/,
      label: '-m',
    },
    { re: /--co\b|--collect-only\b/, label: '--collect-only' },
    // Collection settings decide which tests exist at all.
    ...[
      'testpaths',
      'norecursedirs',
      'python_files',
      'python_functions',
      'python_classes',
    ].map(word),
  ],
  conftest: [
    word('pytest_collection_modifyitems'),
    word('pytest_ignore_collect'),
    { re: /\bcollect_ignore(?:_glob)?\b/, label: 'collect_ignore' },
    word('pytest_plugins'),
    // Any other pytest hook can change what runs or how it is reported;
    // registering markers and options is routine.
    {
      re: /\bdef\s+pytest_(?!configure\b|addoption\b)\w+/,
      label: 'pytest_* hook',
    },
  ],
  maven: [
    word('skipTests'),
    word('skipITs'),
    { re: /\bmaven\.test\.skip\b/, label: 'maven.test.skip' },
    {
      re: /\bmaven\.test\.failure\.ignore\b/,
      label: 'maven.test.failure.ignore',
    },
    { re: /<skip>/, label: '<skip>' },
    { re: /<excludes?>/, label: '<exclude>' },
    word('testFailureIgnore'),
    { re: /<(?:excludedGroups|groups)>/, label: '<groups>' },
    { re: /<includes?>/, label: '<include>' },
    { re: /<test>/, label: '<test>' },
    word('testSourceDirectory'),
  ],
  gradle: [
    { re: /\benabled\s*=?\s*false\b/, label: 'enabled = false' },
    word('onlyIf'),
    // Dependency excludes (`exclude group: ...`) are not test filters.
    {
      re: /\bexclude(?:TestsMatching)?\b(?!.*\b(?:group|module)\b)/,
      label: 'exclude',
    },
    word('ignoreFailures'),
    ...[
      'excludeTags',
      'includeTags',
      'excludeCategories',
      'includeCategories',
      'includeTestsMatching',
      'includeEngines',
      'excludeEngines',
      'excludedTaskNames',
    ].map(word),
  ],
  // Judged per step in `workflowToken`.
  workflow: [],
};

// A command that runs tests in a CI step. Runner names count only as
// commands: not `mocha@8` or `tox:` in a matrix, nor `extra-mvn-args`.
const TEST_COMMAND =
  /\b(?:npm|pnpm|yarn|bun|nub|deno|turbo|nx|make|just|task)\s+(?:run\s+)?test\b|(?<![\w.@-])(?:jest|vitest|mocha|pytest|tox|nox)(?![\w@.:-])|\bpython3?\s+-m\s+(?:pytest|unittest)\b|\bnode\s+--test\b|(?<![\w@-])(?:\.\/)?mvnw?(?![\w@:-]).*\b(?:test|verify|install|package)\b|(?<![\w@-])(?:\.\/)?gradlew?(?![\w@:-]).*\b(?:test|check|build)\b|\b(?:go|cargo|dotnet)\s+test\b/;

// What the workflow looked like before: its lines, and the ones this change
// deleted.
interface Before {
  lines: string[];
  deleted: string[];
  added: Set<number>; // 0-based indices of added lines in the new file
}

// Added to a test command: makes it unable to fail, or runs fewer tests.
const UNABLE_TO_FAIL: Token = {
  re: /\|\|\s*(?:\S*\/)?(?:true|:|exit\s+0|echo)\b|\|\|\s*:\s*$|;\s*exit\s+0\b/,
  label: '|| true',
};
const TEST_STEP: Token[] = [
  UNABLE_TO_FAIL,
  ...TOKENS.pytest,
  ...['testNamePattern', 'testPathIgnorePatterns', 'passWithNoTests'].map(word),
  {
    re: /(?:^|\s)(?:-t|--grep|--fgrep|--invert)(?=[\s=]|$)/,
    label: '-t/--grep',
  },
  {
    re: /--(?:testPathPatterns?|onlyChanged|changedSince|lf|last-failed|exclude|project|filter|skip)\b|(?:^|\s)-(?:run|skip)(?=[\s=])/,
    label: 'test filter',
  },
  {
    re: /(?:^|\s)(?:-u|--updateSnapshot|--update-snapshots?|--snapshot-update)(?=[\s=]|$)/,
    label: '-u',
  },
  {
    re: /-D(?:[\w.]*skip\w*|maven\.test\.failure\.ignore|test=|testFailureIgnore)|(?:^|\s)(?:-fn|--fail-never)(?=\s|$)/i,
    label: '-DskipTests',
  },
];
// Gradle only: pytest's `-x` is fail-fast.
const GRADLE_EXCLUDE: Token = {
  re: /(?:\s-x|--exclude-task)\s+\S*test\b|\s--tests\b/i,
  label: '-x test',
};

// A condition that never skips the step.
const ALWAYS_RUNS =
  /^\s*-?\s*if\s*:\s*(?:\$\{\{\s*)?(?:always\(\)|success\(\)|!\s*cancelled\(\))\s*(?:\}\})?\s*$/;
const NEVER_RUNS =
  /^\s*-?\s*if\s*:\s*(?:\$\{\{\s*)?(?:false|0)\s*(?:\}\})?\s*$/;

// The `run: |` block an indented line belongs to.
function runBlock(lines: string[], index: number): string[] {
  const indent = (s: string) => s.length - s.trimStart().length;
  let own = indent(lines[index] ?? '');
  for (let i = index - 1; i >= 0; i--) {
    const line = lines[i] ?? '';
    if (line.trim() === '' || indent(line) >= own) continue;
    if (!/^\s*-?\s*run\s*:\s*[|>]/.test(line)) {
      // A less indented script line (a continued command); other keys end it.
      if (/^\s*-?\s*[\w-]+\s*:/.test(line)) return [];
      own = indent(line);
      continue;
    }
    const block = [line];
    for (let j = i + 1; j < lines.length; j++) {
      const next = lines[j] ?? '';
      if (next.trim() !== '' && indent(next) <= indent(line)) break;
      block.push(next);
    }
    return block;
  }
  return [];
}

// GitHub Actions: an added line on a step that already ran tests. A new step
// or job takes nothing away (`-DskipTests` on a new build step is routine).
function workflowToken(
  lines: string[],
  index: number,
  before: Before,
): Token | undefined {
  // YAML comments aren't commands.
  const text = (lines[index] ?? '').replace(/(?:^|\s)#.*$/, '');
  // Lines that run test-guard belong to TG006.
  if (text.includes('test-guard')) return undefined;
  // A test command that was in the workflow before (anywhere on a line).
  const existed = (l: string) => {
    const command = TEST_COMMAND.exec(l)?.[0];
    return (
      command !== undefined && before.lines.some((b) => b.includes(command))
    );
  };
  const block = () => yamlBlock(lines, index);
  // The step or job existed (its first line isn't new, or it replaced a
  // test command) and runs a test command that was there before.
  const runsTests = () => {
    const [start] = yamlBlockRange(lines, index);
    const old =
      !before.added.has(start) ||
      before.deleted.some((l) => TEST_COMMAND.test(l));
    return (
      old &&
      block().some((l) => TEST_COMMAND.test(l) && existed(l)) &&
      !block().some((l) => l.includes('test-guard'))
    );
  };
  const flag = (label: string) => ({ re: /./, label });
  if (/^\s*-?\s*continue-on-error\s*:\s*(?!false\b)\S/.test(text)) {
    return runsTests() ? flag('continue-on-error') : undefined;
  }
  if (/^\s*-?\s*shell\s*:.*\{0\}/.test(text)) {
    return runsTests() ? flag('shell: {0}') : undefined;
  }
  if (/^\s*-?\s*if\s*:/.test(text)) {
    if (ALWAYS_RUNS.test(text) || !runsTests()) return undefined;
    // On a step any condition counts; on a job only one that never runs.
    return /^\s*-/.test(block()[0] ?? '') || NEVER_RUNS.test(text)
      ? flag('if:')
      : undefined;
  }
  const command = TEST_COMMAND.exec(text);
  if (command) {
    // The test command this change replaced; none means a new step.
    const previous = before.deleted.filter((l) => TEST_COMMAND.test(l));
    if (previous.length === 0) return undefined;
    // Flags after the test command (`docker run -t img npm test` is fine).
    const rest = text.slice(command.index);
    const tokens = /\bgradlew?\b/.test(text)
      ? [...TEST_STEP, GRADLE_EXCLUDE]
      : TEST_STEP;
    return tokens.find(
      (t) => t.re.test(rest) && !previous.some((l) => t.re.test(l)),
    );
  }
  // A later line of a multi-line `run:` that ran tests.
  const script = runBlock(lines, index);
  if (!script.some((l) => TEST_COMMAND.test(l) && existed(l))) return undefined;
  // Steps run under `bash -e`, so a later `exit 0` alone changes nothing.
  if (/^\s*set\s+\+e\b/.test(text)) return flag('set +e');
  // `npm test \` continued with `|| true`.
  const previous = lines[index - 1] ?? '';
  return /\\\s*$/.test(previous) && UNABLE_TO_FAIL.re.test(text)
    ? UNABLE_TO_FAIL
    : undefined;
}

// Test commands that are gone from a workflow (the step deleted, the command
// replaced, the file deleted or renamed away).
function removedTestCommands(before: string[], after: string[]): string[] {
  const commands = (lines: string[]) =>
    lines
      .map((l) => l.replace(/(?:^|\s)#.*$/, '').trim())
      .filter((l) => TEST_COMMAND.test(l) && !l.includes('test-guard'));
  const left = commands(after);
  const removed = commands(before).filter((l) => {
    const i = left.indexOf(l);
    if (i === -1) return true;
    left.splice(i, 1);
    return false;
  });
  // A command changed in place (new flags) still runs tests.
  return removed.slice(left.length);
}

const TEST_SCRIPT = /"test(?::[^"]*)?"\s*:/;

// Settings with the same names that don't pick tests: Vitest `coverage`
// include/exclude, Maven resource includes.
function outOfScope(
  kind: RunnerConfig,
  lines: string[],
  index: number,
): boolean {
  if (kind === 'vitest' || kind === 'vite') {
    const indent = (s: string) => s.length - s.trimStart().length;
    let own = Number.POSITIVE_INFINITY;
    for (let i = index; i >= 0; i--) {
      const line = lines[i] ?? '';
      if (line.trim() === '' || (i < index && indent(line) >= own)) continue;
      if (/\bcoverage\b/.test(line)) return true;
      if (kind === 'vite' && /\btest\s*:/.test(line)) return false;
      own = indent(line);
      if (own === 0) break;
    }
    return kind === 'vite';
  }
  if (kind === 'maven') {
    for (let i = index; i >= 0; i--) {
      const line = lines[i] ?? '';
      if (/<\/?(?:testR|r)esources?>|<configuration>|<\/build>/.test(line)) {
        if (/<(?:testR|r)esources?>/.test(line)) return true;
        break;
      }
    }
    // Inside a plugin, only the test plugins' settings pick tests (`<skip>`
    // on gpg or deploy is routine).
    const plugin = enclosingPlugin(lines, index);
    return plugin !== null && !/surefire|failsafe/.test(plugin);
  }
  return false;
}

// The artifactId of the Maven `<plugin>` a line is in, or null outside one.
function enclosingPlugin(lines: string[], index: number): string | null {
  let depth = 0;
  for (let i = index; i >= 0; i--) {
    const line = lines[i] ?? '';
    if (/<\/plugin>/.test(line) && i !== index) depth++;
    if (/<plugin>/.test(line)) {
      if (depth > 0) {
        depth--;
        continue;
      }
      for (let j = i; j <= index; j++) {
        const id = /<artifactId>([^<]*)<\/artifactId>/.exec(lines[j] ?? '');
        if (id) return id[1] ?? '';
      }
      return '';
    }
    if (/<\/?plugins>/.test(line)) return null;
  }
  return null;
}

export const tg005: Rule = ({
  runnerConfig,
  beforePath,
  afterPath,
  beforeLines,
  afterLines,
  hunks,
  addedToExistingDir,
}) => {
  const findings: RuleFinding[] = [];
  const path = afterPath ?? beforePath;
  if (runnerConfig === 'workflow' && beforePath && path) {
    const [removed] = removedTestCommands(beforeLines, afterLines);
    if (removed) {
      findings.push({
        ruleId: 'TG005',
        path,
        message: `removed test command \`${removed}\` from CI`,
      });
    }
  }
  if (!runnerConfig || !afterPath) return findings;
  if (!beforePath && !addedToExistingDir) return findings;
  const before: Before = {
    lines: beforeLines,
    added: new Set(hunks.flatMap((hunk) => hunk.added.map((line) => line - 1))),
    deleted: hunks.flatMap((hunk) =>
      hunk.deleted.map((line) => beforeLines[line - 1] ?? ''),
    ),
  };
  for (const line of hunks.flatMap((hunk) => hunk.added)) {
    const text = afterLines[line - 1] ?? '';
    const token =
      runnerConfig === 'workflow'
        ? workflowToken(afterLines, line - 1, before)
        : outOfScope(runnerConfig, afterLines, line - 1)
          ? undefined
          : TOKENS[runnerConfig].find((t) => t.re.test(text));
    // A brand-new package.json naturally has a "test" script, and a new
    // `test:*` script next to the old ones changes nothing that ran.
    // A comma added after a sibling is no change either.
    const key = TEST_SCRIPT.exec(text)?.[0].replace(/\s*:$/, '');
    const bare = (l: string) => l.trim().replace(/,$/, '');
    const testScript =
      beforePath !== null &&
      runnerConfig === 'package.json' &&
      key !== undefined &&
      beforeLines.some((l) => l.includes(key)) &&
      !beforeLines.some((l) => bare(l) === bare(text));
    if (!token && !testScript) continue;
    findings.push({
      ruleId: 'TG005',
      path: afterPath,
      line,
      message: token
        ? `added \`${token.label}\`${testScript ? ' to "test" script' : ''}`
        : 'changed "test" script',
    });
  }
  return findings;
};
