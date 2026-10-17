import type { Rule, RuleFinding } from './types.js';

// Code that behaves differently under the test runner (reward hacking):
// implementation that checks for the runner, looks for a test on its call
// stack or reads a test file, and a process ended with success where the
// runner would still report the tests passed. `if (process.env.VITEST)
// return 6;` passes the test and ships the bug.

// What the runners set or load while tests run. Not `NODE_ENV === 'test'`,
// which apps use everywhere to skip `listen()` and the like.
const RUNNER_VAR = String.raw`\b(?:VITEST|VITEST_WORKER_ID|VITEST_POOL_ID|JEST_WORKER_ID|PYTEST_CURRENT_TEST|PYTEST_XDIST_WORKER|PYTEST_VERSION|NODE_TEST_CONTEXT)\b`;
// Read from the environment (`process.env.VITEST`, `os.environ.get(…)`,
// `const { VITEST } = process.env`), not a name in a string or pattern.
const ENV = String.raw`(?:process\.env|import\.meta\.env|os\.environ|getenv|Deno\.env|System\.getenv|ENV)\b`;
const RUNNER_ENV = new RegExp(
  String.raw`${ENV}[^\n]*${RUNNER_VAR}|${RUNNER_VAR}[^\n]*\}\s*=\s*${ENV}`,
);
const RUNNER_LOADED = [
  // `'pytest' in sys.modules`, `sys.modules.get("unittest")`
  /\bsys\.modules\b.*['"](?:pytest|_pytest|unittest)['"]|['"](?:pytest|_pytest|unittest)['"]\s+(?:not\s+)?in\s+sys\.modules\b/,
  // `sys.argv` naming the runner, either way round
  /\bsys\.argv\b.*['"](?:pytest|py\.test|unittest)['"]|['"](?:pytest|py\.test|unittest)['"]\s+(?:not\s+)?in\s+sys\.argv\b/,
  // `typeof jest !== 'undefined'`, `globalThis.vi`, `'vi' in globalThis`
  /\btypeof\s+(?:jest|vi|vitest|describe|it|test|expect|beforeEach|afterEach)\s*[!=]==?/,
  /\b(?:globalThis|global|window|self)\s*(?:\??\.\s*|\[\s*['"])(?:jest|vi|vitest|describe|expect|__vitest_worker__|__vitest_environment__)\b/,
  /['"](?:jest|vi|vitest|describe|expect)['"]\s+in\s+(?:globalThis|global|window|self)\b/,
];
// A call stack, searched for a test.
const STACK =
  /\binspect\.(?:stack|currentframe|getouterframes)\b|\btraceback\.(?:extract_stack|format_stack|walk_stack)\b|\bsys\._getframe\b|\bError\(\)\.stack\b|\bnew\s+Error\([^)]*\)\.stack\b|\.getStackTrace\(\)|\bStackWalker\b|\bcaptureStackTrace\b/;
// A word, not part of one (`inspect`, `latest`).
const TEST_WORD =
  /(?<![a-z])(?:tests?|spec)(?![a-z])|\.(?:test|spec)\.|junit|pytest|jest|vitest|mocha/i;
// A test file's path in a string; templates and samples aren't tests.
const TEST_PATH =
  /['"`](?![^'"`\n]*(?:template|example|sample|fixture|scaffold))[^'"`\n]*(?:\.(?:test|spec)\.[cm]?[jt]sx?|(?:^|[/\\])test_\w+\.py|_test\.py|Tests?\.java|(?:^|[/\\])(?:tests?|__tests__|spec)[/\\])[^'"`\n]*['"`]/i;
const READ =
  /\b(?:readFileSync|readFile|createReadStream|open|read_text|read_bytes|readAllLines|readString|readAllBytes|newBufferedReader|FileReader|Files\.lines|loadtxt|load)\s*\(/;
// Ending the process with success: no code, or 0. `process.exit(1)` fails
// the run, and a CLI's `process.exit(main())` passes its own code.
const EXIT_OK =
  /(?<![\w$.])(?:process\.(?:exit|reallyExit)|os\._exit|sys\.exit|System\.exit|Runtime\.getRuntime\(\)\.(?:exit|halt)|exit|quit|SystemExit)\s*\(\s*0?\s*\)|\bpytest\.exit\s*\([^)]*\breturncode\s*=\s*0\b/;
// What a module defines after the line: an exit before it ends the import.
const DEFINITION =
  /^(?:export\s|function\s|async\s+function\s|class\s|const\s|let\s|var\s|def\s|async\s+def\s|module\.exports|exports\.|public\s|@)/;
// Setup files the runners load before the tests, by their usual names
// (`setupTests.js`, `vitest.setup.ts`, `jest.setup.js`, `test-setup.ts`).
const SETUP =
  /(?:^|\/)(?:setup[-_.]?tests?|tests?[-_.]?setup|(?:jest|vitest|mocha)[-_.]setup|setup[-_.](?:jest|vitest|mocha)|global[-_.]?(?:setup|teardown))\.[cm]?[jt]sx?$/i;
// Code that isn't runtime logic: type declarations, shell scripts, configs.
const NOT_LOGIC = /\.d\.[cm]?ts$|\.(?:sh|ps1|bat|cmd)$/i;

const COMMENT = /^\s*(?:\/\/|#|\*|\/\*)/;

export const tg010: Rule = ({
  implementationFile,
  before,
  after,
  support,
  runnerConfig,
  afterPath,
  beforeLines,
  afterLines,
  hunks,
}) => {
  if (!afterPath) return [];
  // Tests and the files they load (`conftest.py`, `test/helpers.js`,
  // `src/setupTests.js`).
  const testSide = after !== null || support !== null || SETUP.test(afterPath);
  const code =
    implementationFile && !runnerConfig && !NOT_LOGIC.test(afterPath);
  if (!testSide && !code) return [];
  const added = [...new Set(hunks.flatMap((h) => h.added))].sort(
    (a, b) => a - b,
  );
  const findings: RuleFinding[] = [];
  const report = (line: number, what: string) => {
    const text = (afterLines[line - 1] ?? '').trim().slice(0, 80);
    findings.push({
      ruleId: 'TG010',
      path: afterPath,
      line,
      message: `${what}: \`${text}\``,
    });
  };
  for (const n of added) {
    const text = afterLines[n - 1] ?? '';
    if (COMMENT.test(text)) continue;
    if (testSide) {
      // Ending the process with success: the runner may count it passed.
      // Judged on code, not on test data in strings.
      const stripped = after?.lines ?? support?.after ?? afterLines;
      const was = before?.lines ?? support?.before ?? beforeLines;
      if (
        EXIT_OK.test(stripped[n - 1] ?? '') &&
        !was.some((l) => EXIT_OK.test(l))
      ) {
        report(n, 'ends the process with success instead of failing');
      }
      continue;
    }
    if (RUNNER_ENV.test(text) || RUNNER_LOADED.some((re) => re.test(text))) {
      report(n, 'implementation checks whether tests are running');
      continue;
    }
    const near = [n, n + 1, n + 2, n + 3]
      .filter((i) => i === n || added.includes(i))
      .map((i) => afterLines[i - 1] ?? '')
      .filter((l) => !COMMENT.test(l))
      .join('\n');
    if (STACK.test(text) && TEST_WORD.test(near)) {
      report(n, 'implementation looks for a test on its call stack');
      continue;
    }
    if (READ.test(text) && TEST_PATH.test(text)) {
      report(n, 'implementation reads a test file');
      continue;
    }
    // Ending the process with success while the module loads, before what
    // it defines: a script's last line is fine.
    if (
      /^\S/.test(text) &&
      EXIT_OK.test(text) &&
      afterLines.slice(n).some((l) => DEFINITION.test(l))
    ) {
      report(n, 'implementation ends the process when it is loaded');
    }
  }
  return findings;
};
