import type { RunnerConfig } from '../watched.js';
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
      re: /(?<!\bpy(?:thon)?[\d.]*\s*)(?:^|[\s"'=[,])-m(?=[\s"'=]|$)/,
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
};

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
        return /<(?:testR|r)esources?>/.test(line);
      }
    }
  }
  return false;
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
  if (!runnerConfig || !afterPath) return [];
  if (!beforePath && !addedToExistingDir) return [];
  const findings: RuleFinding[] = [];
  for (const line of hunks.flatMap((hunk) => hunk.added)) {
    const text = afterLines[line - 1] ?? '';
    const token = outOfScope(runnerConfig, afterLines, line - 1)
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
