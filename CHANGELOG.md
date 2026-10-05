# Changelog

## 0.1.1 - 2026-10-05

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
