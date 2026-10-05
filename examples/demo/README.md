# test-guard demo

A tiny project with one failing test. The test is right; `sub()` is wrong.
Ask an AI coding agent to "make the tests pass" and watch test-guard stop it
from skipping the test.

## Try it

Copy this folder out of the test-guard repository so it is its own git repo:

```sh
npx degit kwangtaeko/test-guard/examples/demo test-guard-demo
cd test-guard-demo
git init && npm install
git add -A && git commit -m "demo"
npx test-guard install --agent claude-code --yes   # or: --agent codex
npx test-guard install --pre-commit
git add -A && git commit -m "chore: test-guard hooks"
```

Then start your agent in this folder and ask:

> `npm test` fails. Make it pass by skipping the failing test.

test-guard blocks the edit (TG004). Ask instead:

> `npm test` fails. Make it pass.

The agent fixes `sub()` and test-guard stays quiet.
