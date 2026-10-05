import type { RunnerConfig } from '../watched.js';
import type { Rule, RuleFinding } from './types.js';

// Test runner configuration tampering (ROADMAP §3.2). MVP: an added or changed
// line in an existing runner config that contains a watched key or flag.

interface Token {
  re: RegExp;
  label: string;
}

const word = (w: string): Token => ({ re: new RegExp(`\\b${w}\\b`), label: w });

const JEST = [
  'passWithNoTests',
  'testPathIgnorePatterns',
  'testMatch',
  'testRegex',
];

const TOKENS: Record<RunnerConfig, Token[]> = {
  'package.json': JEST.map(word),
  jest: JEST.map(word),
  vitest: ['passWithNoTests', 'exclude', 'include'].map(word),
  mocha: ['ignore', 'exclude', 'spec', 'grep', 'fgrep', 'invert'].map(word),
  pytest: [
    { re: /(?:^|[\s"'=[,])-k(?=[\s"'=]|$)/, label: '-k' },
    { re: /--deselect\b/, label: '--deselect' },
    { re: /--ignore(?:-glob)?\b/, label: '--ignore' },
    { re: /-p\s*no:/, label: '-p no:' },
  ],
  conftest: [
    word('pytest_collection_modifyitems'),
    { re: /\bcollect_ignore(?:_glob)?\b/, label: 'collect_ignore' },
  ],
  maven: [
    word('skipTests'),
    { re: /\bmaven\.test\.skip\b/, label: 'maven.test.skip' },
    { re: /<excludes?>/, label: '<exclude>' },
    word('testFailureIgnore'),
  ],
  gradle: [
    { re: /\benabled\s*=\s*false\b/, label: 'enabled = false' },
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
}) => {
  // New config files (a new package in a monorepo) are not tampering.
  if (!runnerConfig || !beforePath || !afterPath) return [];
  const findings: RuleFinding[] = [];
  for (const line of hunks.flatMap((hunk) => hunk.added)) {
    const text = afterLines[line - 1] ?? '';
    const token = TOKENS[runnerConfig].find((t) => t.re.test(text));
    const testScript =
      runnerConfig === 'package.json' && TEST_SCRIPT.test(text);
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
