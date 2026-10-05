# test-guard

**Stop AI coding agents from deleting, skipping or weakening tests to make them pass.**

[한국어](README.ko.md)

<!-- Demo GIF: the agent tries to add `it.skip`, test-guard blocks it, the agent fixes the code instead. -->

Coding agents sometimes "fix" a failing test by deleting it, adding `.skip`,
removing assertions or excluding it from the test run. The suite goes green and
the bug stays. test-guard catches this with the same rules in three places:

| Where | When | What happens |
|---|---|---|
| **Agent hook** (Claude Code, Codex) | before each edit or shell command | the edit is blocked and the agent is told to fix the implementation |
| **git commit-msg hook** | on every commit | the commit fails unless a human approves it |
| **GitHub Action** | on every pull request | the check fails unless a human adds an approval label |

No LLM, no network, no telemetry. Same input, same result.

## Quick start

```sh
npm install --save-dev test-guard
npx test-guard install --pre-commit            # git commit-msg hook
npx test-guard install --agent claude-code     # or: --agent codex
npx test-guard check                           # check the working tree now
```

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

## Rules

| ID | Detects |
|---|---|
| TG001 | A test file deleted, or moved to a path that is not a test |
| TG002 | Fewer test cases in a file |
| TG003 | Fewer assertions in a file |
| TG004 | Added skip / disable / focus: `it.skip`, `xit`, `.only`, `.todo`, `@pytest.mark.skip`, `xfail`, `@Disabled`, `@Ignore`, … |
| TG005 | Test runner config tampering: `passWithNoTests`, `testPathIgnorePatterns`, pytest `addopts` with `-k`/`--deselect`/`--ignore`, `collect_ignore`, Maven `skipTests`/`testFailureIgnore`, Gradle `enabled = false`/`ignoreFailures`, … |
| TG006 | Getting around test-guard: changing `.test-guard.json`, removing it from hook/CI files, `git commit --no-verify`, `core.hooksPath` changes, `Test-Guard-Approved` trailers or `TEST_GUARD_*` variables from an agent |
| TG007 | Weaker assertions: `toBe(3)` → `toBeDefined()`, `assertEqual` → `assertTrue`, `toThrow(X)` → `toThrow()`, `pytest.raises(ValueError)` → `pytest.raises(Exception)`, and meaningless ones like `expect(true).toBe(true)` |

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
  run; they are caught at Stop, at commit and in CI.
- **Not yet**: C#, Go, Rust, node:test option-style skips (`{ skip: true }`),
  other agents.

## License

MIT
