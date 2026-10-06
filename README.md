# test-guard

<p>
  <a href="https://www.npmjs.com/package/test-guard"><img src="https://img.shields.io/npm/v/test-guard.svg" alt="npm"></a>
  <a href="https://github.com/kwangtaeko/test-guard/actions/workflows/ci.yml"><img src="https://github.com/kwangtaeko/test-guard/actions/workflows/ci.yml/badge.svg" alt="CI"></a>
  <a href="LICENSE"><img src="https://img.shields.io/npm/l/test-guard.svg" alt="MIT"></a>
</p>

**Stop AI coding agents from deleting, skipping or weakening tests to make them pass.**

<img alt="Claude Code tries to add it.skip, test-guard blocks the edit, and Claude fixes the bug instead" src="https://raw.githubusercontent.com/kwangtaeko/test-guard/main/docs/assets/hero.gif" width="800" />

<sub>A real Claude Code session on the [demo project](examples/demo), played at 2× speed.
Recorded with <a href="https://github.com/charmbracelet/vhs">VHS</a> from <a href="docs/tapes">these tapes</a>.</sub>

[한국어](README.ko.md)

Coding agents sometimes "fix" a failing test by deleting it, adding `.skip`,
removing assertions or excluding it from the test run. The suite goes green and
the bug stays. test-guard catches this with the same rules in three places:

| Where | When | What happens |
|---|---|---|
| **Agent hook** (Claude Code, Codex) | before each edit or shell command | the edit is blocked and the agent is told to fix the implementation |
| **git commit-msg hook** | on every commit | the commit fails unless a human approves it |
| **GitHub Action** | on every pull request | the check fails unless a human adds an approval label |

No LLM, no network, no telemetry. Same input, same result.

## Installation

```sh
# npm
npm install --save-dev test-guard

# pnpm
pnpm add --save-dev test-guard

# yarn
yarn add --dev test-guard
```

Requires Node.js 20 or later and git. The package is a single file with no
runtime dependencies.

## Set it up

```sh
npx test-guard install --agent claude-code     # or: --agent codex
npx test-guard install --pre-commit            # git commit-msg hook
```

`install --agent` shows what it will add to the agent's settings and asks
before writing (`--yes` skips the question).

<img alt="test-guard install --agent claude-code shows a diff, asks, and writes .claude/settings.json; install --pre-commit adds the commit-msg hook" src="https://raw.githubusercontent.com/kwangtaeko/test-guard/main/docs/assets/install.gif" width="800" />

Try it on the [demo project](examples/demo): one failing test, one bug.

### Claude Code plugin

Instead of `install --agent claude-code`, you can install the plugin. It adds
the hooks and a `test-guard` skill for every repository you open:

```
/plugin marketplace add kwangtaeko/test-guard
/plugin install test-guard@test-guard
```

The plugin acts in any git repository; outside git it does nothing.

### GitHub Action

```yaml
name: test-guard
on:
  pull_request:
    types: [opened, synchronize, reopened, labeled, unlabeled]
jobs:
  test-guard:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 0
      - uses: kwangtaeko/test-guard@v0
```

Violations fail the job and are listed in the job summary. A human can approve
intentional changes with the `test-guard:approved` label (`approve-label`
input). **Only give label permissions to people, never to an agent's token.**

**Protect the gate.** A pull request runs its own copy of the workflow, so it
could delete the test-guard step or add `continue-on-error`. In your branch
protection rules, make `test-guard` a **required status check**, and protect
`.github/workflows/` with [CODEOWNERS](https://docs.github.com/repositories/managing-your-repositorys-settings-and-features/customizing-your-repository/about-code-owners).

## Usage

### Check the working tree

`test-guard check` compares your changes with HEAD and lists every weakened
test. Use it after an agent session, or before you push.

```sh
npx test-guard check
```

<img alt="test-guard check reports a removed assertion (TG003), a weaker matcher (TG007) and an added it.skip (TG004)" src="https://raw.githubusercontent.com/kwangtaeko/test-guard/main/docs/assets/check.gif" width="800" />

### Block weakening commits

With the commit-msg hook installed, a commit that weakens tests fails. If the
change is intentional, a human adds a `Test-Guard-Approved:` trailer with the
reason, and the commit goes through.

```sh
git commit -m "test: skip flaky subtraction" -m "Test-Guard-Approved: tracked in #42"
```

<img alt="A commit adding it.skip is blocked; the same commit with a Test-Guard-Approved trailer goes through" src="https://raw.githubusercontent.com/kwangtaeko/test-guard/main/docs/assets/commit.gif" width="800" />

## Rules

| ID | Detects |
|---|---|
| TG001 | A test file deleted, or moved to a path that is not a test (including folders pytest skips, such as `build/`, `dist/`, `.*`, `venv/`) |
| TG002 | Fewer test cases in a file (Python: only tests pytest/unittest collect, a name defined twice counts once; Java: tests in an inner class that lost `@Nested`) |
| TG003 | Fewer assertions in a file (assertions inside a `try` whose `catch`/`except` ignores failures don't count) |
| TG004 | Added skip / disable / focus: `it.skip`, `xit`, `.only`, `.todo`, `test.failing`, `{ skip: true }`, `this.skip()`, `@pytest.mark.skip` (also under import aliases), `xfail`, `__test__ = False`, `@Disabled`, `@Ignore`, `Assumptions.abort()`, TestNG `enabled = false`, … — and test or assertion functions replaced in the file (`const expect = …`, `expect.extend` over a built-in matcher, a local `assertEquals`, a `Test` annotation that isn't JUnit's) |
| TG005 | Test runner config tampering: `passWithNoTests`, `testPathIgnorePatterns`, `setupFiles`/`globalSetup`, pytest `addopts` with `-k`/`--deselect`/`--ignore`, `collect_ignore`, `pytest_*` hooks in `conftest.py`, Maven `skipTests`/`testFailureIgnore`/`groups`/`includes`, Gradle `enabled = false`/`ignoreFailures`/`excludeTags`; a GitHub Actions test step given `\|\| true`, `set +e`, `continue-on-error`, `if:`, `-u` or a test filter, or a test command removed from CI, … |
| TG006 | Getting around test-guard: changing `.test-guard.json`; removing or changing the line that runs it in hook/CI files (`\|\| true`, a narrower hook matcher, `continue-on-error`); from an agent: `git commit --no-verify`, `core.hooksPath`, git aliases/includes/`GIT_CONFIG_GLOBAL`, `Test-Guard-Approved` trailers, `TEST_GUARD_*` variables, disabling or uninstalling the plugin, and writing `.git/`, `.claude/settings.local.json` or `node_modules/test-guard` |
| TG007 | Weaker assertions: `toBe(3)` → `toBeDefined()` / `not.toBe(…)` / `toBeGreaterThan(…)`, `assertEqual` → `assertTrue` / `assertNotEqual`, `assert x == y` → `assert x != y`, `toThrow(X)` → `toThrow()`, `pytest.raises(ValueError)` → `pytest.raises(Exception)`, and meaningless ones like `expect(true).toBe(true)` |

Languages: TypeScript/JavaScript (Jest, Vitest, Mocha), Python (pytest,
unittest) and Java (JUnit 4/5).

| Language | Test files (default) |
|---|---|
| JS/TS | `*.test.*`, `*.spec.*`, `__tests__/**` (JS/TS extensions) |
| Python | `test_*.py`, `*_test.py` |
| Java | `src/test/**/*Test.java`, `*Tests.java`, `*IT.java` |

## CLI

```
test-guard check                 working tree ↔ HEAD
test-guard check --staged        index ↔ HEAD
test-guard check --base <ref>    HEAD ↔ merge-base(<ref>, HEAD)
  --json                         JSON output
  --rules TG001,TG004            run only these rules
  --message-file <path>          read a Test-Guard-Approved trailer (commit-msg hook)
  --summary <file>               append a Markdown report (GitHub job summary)

test-guard install --pre-commit                 commit-msg hook
test-guard install --agent <claude-code|codex>  agent hooks (shows a diff, asks first; --yes to skip)
```

Exit codes: `0` no violations, `1` violations, `2` execution error.

```
test-guard 0.1.0 · compare: working tree ↔ HEAD · 37 test files

  ERROR   TG004  src/user.test.ts:42   added `it.skip`
  ERROR   TG003  src/order.test.ts     assertions 18 → 15

2 violations · Fix the implementation instead of weakening tests.
```

## Configuration

Optional `.test-guard.json` at the repository root:

```json
{
  "languages": ["js", "python", "java"],
  "include": ["e2e/**/*.ts"],
  "exclude": ["**/fixtures/**"],
  "rules": { "TG003": "warn", "TG007": "off" }
}
```

- `include` adds test file patterns; the language comes from the extension.
- `rules` sets each rule to `error`, `warn` or `off`. Only errors fail.
- The config is read from the **committed** side (HEAD, or the merge-base in
  CI), so a change can't loosen its own check. Commit config changes first.

## Approving intentional changes

Sometimes a test really should go. Only humans can approve:

- **Commit**: add a trailer to the commit message. The commit-msg hook then
  reports the findings but lets the commit through.
  ```
  Test-Guard-Approved: replaced by the new contract tests in api.test.ts
  ```
- **Pull request**: add the `test-guard:approved` label. CI ignores trailers,
  since an agent can write them.

## Agents

### Claude Code

`install --agent claude-code` adds hooks to `.claude/settings.json`:

- **PreToolUse** on `Edit`, `Write`, `Bash` and `PowerShell`: the edit is
  applied in memory and judged before it happens; shell commands that delete
  or move test files or bypass test-guard are blocked.
- **Stop**: the working tree is compared with HEAD before Claude finishes. It
  blocks once; if Claude still stops, you get a message instead, so your own
  intentional changes can't trap a session.

With a local install the hook runs `node` directly (about 0.15–0.2 s per call
on Windows); without one it falls back to `npx`, which adds about a second.

### Codex

`install --agent codex` adds the same hooks to `.codex/hooks.json`, for shell
commands and `apply_patch` edits. Codex runs project hooks only after you
trust them: open Codex and run `/hooks`.

On Windows the Codex hooks run through `npx` (about 0.7–0.9 s per call): a
faster lookup didn't run reliably inside Codex. macOS and Linux run `node`
directly.

Other agents: use the commit-msg hook and the GitHub Action.

## Other git hook managers

test-guard runs in the **commit-msg** stage, not pre-commit: git stops at a
failing pre-commit hook before the message exists, so an approval trailer
could never be read.

**husky** (`.husky/commit-msg`):

```sh
npx --no-install test-guard check --staged --message-file "$1"
```

**lefthook** (`lefthook.yml`):

```yaml
commit-msg:
  commands:
    test-guard:
      run: npx --no-install test-guard check --staged --message-file {1}
```

**pre-commit** (`.pre-commit-config.yaml`, then
`pre-commit install --hook-type commit-msg`):

```yaml
repos:
  - repo: local
    hooks:
      - id: test-guard
        name: test-guard
        entry: npx --no-install test-guard check --staged --message-file
        language: system
        stages: [commit-msg]
        always_run: true
```

## What it can't do

- **It is a guardrail, not a sandbox.** Hooks stop the obvious shortcuts. An
  agent with shell access that deliberately works around them can't be fully
  stopped locally. That is why CI, where only humans can approve, has the
  final say.
- **Regex, not AST.** Comments and string contents are ignored, but unusual
  syntax can be miscounted. Moving tests between files counts as a decrease in
  one file.
- **In-shell edits** (`sed -i`, `node -e`, scripts) aren't visible before they
  run; they are caught at Stop, at commit and in CI. Shell analysis follows
  `cd`, `bash -c "…"` and links that already exist, but doesn't expand
  variables, read script files, or guess what an unknown list piped into
  `xargs rm` holds.
- **Any change to a line that runs test-guard** in hook or CI files needs
  human approval (version bumps aside). Workflow trigger changes (`on:`,
  `paths-ignore`) and reusing a human's approval trailer with
  `git commit --amend` aren't caught before the commit; Stop and CI still
  see the result.
- **Guesses by name**: a Python class whose base has `Test` in its name is
  taken as a TestCase subclass; custom `norecursedirs` aren't read. JS test
  functions imported from somewhere else (`import { it } from './fake'`) and
  unicode escapes in JS identifiers aren't detected.
- **Tests that still look intact but no longer check anything** keep their
  counts, so they aren't detected yet: an early `return`, a test inside
  `if (false)`, an empty `it.each([])`,
  mocking the module under test, or changing expected values to match a bug.
  These need syntax-aware analysis (planned).
- **Assertions swallowed indirectly** aren't seen yet: a promise
  `.catch(() => {})`, or an assertion in a helper function called inside the
  `try`. Moving a test step from one workflow file to another is reported as
  a removed test command (approve it once).
- **Not yet**: C#, Go, Rust, other agents.

## License

MIT
