# Changelog

## 0.1.1 - 2026-10-06

Hardening after a red-team review: each of these got past 0.1.0.

- TG006: blocks `disableAllHooks` (Claude Code settings, also outside the
  repository and from the shell), abbreviated `--no-veri…`, `core.hooksPath`
  through `GIT_CONFIG_*` variables, `--no-verify` hidden in a variable,
  `git commit -F` with a `Test-Guard-Approved` trailer in the file, and agent
  writes of these into non-Markdown files (scripts, commit messages).
- TG004: Vitest `skipIf` / `runIf` / `fails`, pytest `importorskip`,
  `SkipTest`, `expectedFailure`, JUnit `@Enabled*` conditions.
- TG005: a new runner config next to existing files (`vitest.config.*`,
  `pytest.ini`, `conftest.py`, …); Maven `<skip>`, `skipITs`,
  `maven.test.failure.ignore`; Gradle `onlyIf`; pytest collection settings;
  `testNamePattern`, `allowOnly`.
- TG007: a strong matcher removed in one place and a weak one added in another
  in the same file.

Round 2 of the red-team review:

- Stop compares with HEAD as it was when the agent session started, so test
  changes the agent commits itself are still reported; edits hidden with
  `assume-unchanged` / `skip-worktree` are seen too.
- TG001: Python tests moved into folders pytest skips by default (`build`,
  `dist`, `.*`, `venv`, `node_modules`, `*.egg`, …).
- TG002: Python counts only tests pytest/unittest collect (methods of a class
  that is neither `Test*` nor a TestCase subclass don't count; a name defined
  twice counts once); Java counts tests in an inner class only while it is
  `@Nested` (or static).
- TG004: pytest/unittest skips under import aliases (`@skip`, `@mark.skip`,
  `pt.skip()`), `__test__ = False`; node:test `{ skip: true }` / `{ todo: … }`,
  `this.skip()` / `t.skip()` / `ctx.skip()`, Jest `test.failing`;
  `Assumptions.abort()`, TestNG `@Test(enabled = false)`; test or assertion
  functions replaced in the file (`const expect = …`, `function it`,
  `expect.extend` over a built-in matcher, a local `assertEqual` /
  `assertEquals`, a `Test` annotation or assertion imported from outside
  JUnit/TestNG).
- TG005: Gradle `excludeTags` / `includeTags` (and categories,
  `includeTestsMatching`), Maven `groups` / `excludedGroups` / `includes`,
  any `pytest_*` hook in `conftest.py`, `setupFiles` / `setupFilesAfterEnv` /
  `globalSetup`.
- TG006: any change to a line that runs test-guard in hook/CI files (such as
  `|| true`), a narrower agent hook matcher, `continue-on-error` on the step or
  job that runs test-guard.
- TG007: a strong matcher turned into its negation or a range (`not.toBe`,
  `toBeGreaterThan`, `!=`, `<`, `assertNotEqual(s)`, `assertGreater`, …).
- Comment/string stripping: nested template literals in `${…}`, and Java
  `\uXXXX` escapes (javac decodes them before parsing).
- Agent hooks, shell: redirections without spaces (`echo x>file`), `cd` before
  the write, a target folder plus the copied file's name, `-Path:x`, protected
  paths inside `bash -c` / `node -e` / `python -c` strings, links to protected
  folders, `find -delete` / `-exec rm`, `… | xargs rm`, `Get-ChildItem … |
  Remove-Item`.
- Agent hooks, blocked: `claude plugin disable|uninstall` of test-guard,
  `npm|pnpm|yarn|bun remove test-guard`, `enabledPlugins` set to false,
  `--trailer key=value` approvals, `GIT_CONFIG_GLOBAL` and friends,
  `include.path`, `commit.template` (and `git commit -t` with a trailer),
  git alias definitions; any write to `.git/`, `.claude/settings.local.json`,
  `node_modules/test-guard` or the installed plugin.
- Agent hooks, file writes: paths are resolved to where the write lands
  (links, letter case, `::$DATA`); written content is checked for INI-style
  `hooksPath`, git includes/aliases, and approval trailers anywhere in a line.

From re-checking round 2 with another red-team pass:

- Blocked: `HUSKY=0`, `LEFTHOOK=0`, `SKIP=` on a commit (also in written
  scripts, with `git commit -n`); `GIT_DIR` / `--git-dir`; shell writes to a
  hook or CI file that runs test-guard (`sed -i`, `>`); deleting or moving
  `.claude`, `.claude/plugins` or the plugin registry; `npx claude plugin …`;
  `node_modules/.bin/test-guard`; settings edits that take test-guard out of
  `enabledPlugins`.
- TG006: an `exit`/`if`/`trap` added above the line that runs test-guard in a
  hook script; `if:` / lefthook `skip:` / pre-commit `stages:` on its step or
  job; a hook file renamed away; agent settings compared as data (hook type
  or timeout changes count, reformatting and wider matchers don't);
  test-guard version bumps no longer count.
- TG005: pytest `-m`, `--collect-only`, `pytest_plugins`; Gradle
  `test.enabled false`, `includeEngines`; Maven `<test>`,
  `testSourceDirectory`; `vitest.workspace.*`. No longer reported: Vitest
  `coverage` include/exclude, Maven resource includes, `pytest_configure` /
  `pytest_addoption`.
- TG001: JS tests moved under `node_modules`.
- TG004: `c.skip()` on the test callback's parameter under any name.
- Second re-check: `exec`, `source`, `eval`, `kill` and wrapping
  `while`/`case` blocks above test-guard in a hook script; lefthook `glob:` /
  `exclude_tags:` / `piped:` and pre-commit `types:` filters; `git rm`,
  `git mv`, `git checkout|restore -- <file>`, `find -delete` and folder deletes
  (`rm -rf .husky`, `.github`) of hook files that run test-guard; hook files
  written from `node -e` / `python -c`; installing test-guard from
  `file:`/`link:`/git, `npm pkg set|delete` on it, `claude plugin marketplace
  remove`; Vitest `projects` / `dir`, `vite.config.*` `test` blocks, Gradle
  `excludedTaskNames`. No longer reported: `git rev-parse --git-dir`,
  `chmod +x` on a hook, an `if … fi` above test-guard that doesn't wrap it,
  `-p no:<plugin>` other than collection plugins, a new `test:*` script.
- Fewer false positives: Black-style multi-line `assert (`, quoted commit
  messages that mention these words, `--no-verify-signatures`, `mkdir` then
  `mv` into the new folder, Truth/Spring assertion imports, custom AssertJ
  `assertThat` factories; `expect.soft` counts as an assertion.
- README: demo GIFs, install per package manager, how to protect the CI gate,
  and the known limits.

## 0.1.0 - 2026-10-05

First release.

- `test-guard check` compares the working tree, the index or a pull request
  with git (`--staged`, `--base`), with text, JSON and Markdown output.
- Rules TG001–TG007: deleted or moved tests, fewer tests, fewer assertions,
  added skip/only, runner config tampering, bypassing test-guard, weaker
  assertions.
- TypeScript/JavaScript (Jest, Vitest, Mocha), Python (pytest, unittest),
  Java (JUnit 4/5).
- `.test-guard.json` (`languages`, `include`, `exclude`, `rules`), read from
  the committed side.
- `install --pre-commit`: commit-msg hook with `Test-Guard-Approved` trailers.
- GitHub Action with Job Summary and `test-guard:approved` label approval.
- Agent hooks: Claude Code (`install --agent claude-code`, plugin) and Codex
  (`install --agent codex`).
- Single-file bundle with no runtime dependencies.
