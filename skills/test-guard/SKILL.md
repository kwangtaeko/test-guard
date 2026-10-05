---
name: test-guard
description: Enforces test integrity while coding. Use whenever tests fail, before committing, or when the user asks to check whether tests were weakened, skipped or deleted. Never make tests pass by deleting, skipping or loosening them.
---

# test-guard

## Policy
- Never delete, skip, disable, focus (`.only`) or loosen assertions in tests to make them pass.
- Never change test runner configuration to exclude or ignore failing tests.
- Never bypass test-guard: no `--no-verify`, no edits to `.test-guard.json` or its hooks, no `Test-Guard-Approved:` trailers. Only humans approve.
- If a test seems wrong, stop and explain to the user why, with evidence. Wait for approval.

## Check
1. From the repository root, run `node "${CLAUDE_PLUGIN_ROOT}/dist/cli.js" check --json`. If that path does not exist, run `npx -y test-guard@latest check --json`.
2. If findings exist, revert those test changes and fix the implementation instead.
3. Report the final result to the user.
