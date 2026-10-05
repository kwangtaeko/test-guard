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
];

const TOKENS: Record<RunnerConfig, Token[]> = {
  'package.json': JEST.map(word),
  jest: JEST.map(word),
  vitest: [
    'passWithNoTests',
    'exclude',
    'include',
    'testNamePattern',
    'allowOnly',
  ].map(word),
  mocha: ['ignore', 'exclude', 'spec', 'grep', 'fgrep', 'invert'].map(word),
  pytest: [
    { re: /(?:^|[\s"'=[,])-k(?=[\s"'=]|$)/, label: '-k' },
    { re: /--deselect\b/, label: '--deselect' },
    { re: /--ignore(?:-glob)?\b/, label: '--ignore' },
    { re: /-p\s*no:/, label: '-p no:' },
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
  ],
  gradle: [
    { re: /\benabled\s*=\s*false\b/, label: 'enabled = false' },
    word('onlyIf'),
    // Dependency excludes (`exclude group: ...`) are not test filters.
    {
      re: /\bexclude(?:TestsMatching)?\b(?!.*\b(?:group|module)\b)/,
      label: 'exclude',
    },
    word('ignoreFailures'),
  ],
};

const TEST_SCRIPT = /"test(?::[^"]*)?"\s*:/;

export const tg005: Rule = ({
  runnerConfig,
  beforePath,
  afterPath,
  afterLines,
  hunks,
  addedToExistingDir,
}) => {
  if (!runnerConfig || !afterPath) return [];
  if (!beforePath && !addedToExistingDir) return [];
  const findings: RuleFinding[] = [];
  for (const line of hunks.flatMap((hunk) => hunk.added)) {
    const text = afterLines[line - 1] ?? '';
    const token = TOKENS[runnerConfig].find((t) => t.re.test(text));
    // A brand-new package.json naturally has a "test" script.
    const testScript =
      beforePath !== null &&
      runnerConfig === 'package.json' &&
      TEST_SCRIPT.test(text);
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
