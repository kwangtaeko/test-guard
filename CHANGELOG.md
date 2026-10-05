# Changelog

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
