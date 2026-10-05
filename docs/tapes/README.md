# Demo recordings

The GIFs in `docs/assets/` are recorded with [VHS](https://github.com/charmbracelet/vhs)
from these tapes. Every run is real: the CLI, the git hook and the Claude Code
session in `hero.tape` all run for real; only the setup steps are hidden.

| Tape | GIF |
|---|---|
| `hero.tape` | Claude Code tries `it.skip`, test-guard blocks it, Claude fixes the bug |
| `install.tape` | `install --agent claude-code` and `install --pre-commit` |
| `check.tape` | `test-guard check` on a weakened test |
| `commit.tape` | a weakening commit blocked, then approved with a trailer |

## Re-record (Windows)

1. Install VHS **0.12.1 or later** (0.12.0 exits without writing the GIF,
   charmbracelet/vhs#787), plus ttyd and ffmpeg.
2. Create the demo at `C:\tgvhs\demo`: copy `examples/demo`, `git init`, install
   dependencies, and make one commit. `setup.ps1` resets it to that commit
   before each tape.
3. From the repository root: `vhs docs/tapes/<name>.tape`.

`hero.tape` runs `claude` with `--setting-sources project,local --model sonnet`,
so personal plugins and hooks stay out of the recording; it needs a logged-in
Claude Code. Model answers vary between runs.
