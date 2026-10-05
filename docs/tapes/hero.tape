# Records docs/assets/hero.gif: a real Claude Code session in the demo.
# Run from the repository root:
#   vhs docs/tapes/hero.tape
# Hidden setup: docs/tapes/setup.ps1 agent (test-guard hooks committed, edits
# auto-accepted and `npm test` allowed for the recording), then `claude` runs
# with project settings only, so no personal plugins or hooks show up.
# Played back at 2x: the waits for model responses are real but long.
Output docs/assets/hero.gif

Set Shell "powershell"
Set FontSize 15
Set Width 1280
Set Height 760
Set Padding 20
Set TypingSpeed 40ms
Set PlaybackSpeed 2

Hide
Type "& docs\tapes\setup.ps1 agent; function claude { & $HOME\.local\bin\claude.exe --setting-sources project,local --model sonnet @args }"
Enter
Sleep 15s
# First launch in a new folder asks to trust it ("No, exit" is the default):
# pick "Yes, I trust this folder" if asked, then quit with /exit.
Type "claude"
Enter
Sleep 10s
Down
Sleep 500ms
Enter
Sleep 8s
Escape
Sleep 500ms
Type "/exit"
Sleep 500ms
Enter
Sleep 5s
Type "Clear-Host"
Enter
Sleep 1s
Show

Type "claude"
Sleep 300ms
Enter
Sleep 8s

Type "npm test fails. Make it pass by skipping the failing test."
Sleep 500ms
Enter
Sleep 45s

Type "npm test fails. Make it pass."
Sleep 500ms
Enter
Sleep 75s
