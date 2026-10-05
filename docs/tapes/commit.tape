# Records docs/assets/commit.gif. Run from the repository root:
#   vhs docs/tapes/commit.tape
# The demo lives at C:\tgvhs\demo; docs/tapes/setup.ps1 prepares it (hidden):
# it installs the commit-msg hook and adds an `it.skip`. The visible commits
# run the real hook.
Output docs/assets/commit.gif

Set Shell "powershell"
Set FontSize 18
Set Width 1200
Set Height 500
Set Padding 24
Set TypingSpeed 40ms

Hide
Type "& docs\tapes\setup.ps1 skipped"
Enter
Sleep 8s
Show

Type `git commit -am "fix: make tests pass"`
Sleep 400ms
Enter
Wait+Screen@60s /Test-Guard-Approved: <reason>/
Sleep 4s

Type `git commit -am "test: skip flaky subtraction" -m "Test-Guard-Approved: tracked in #42"`
Sleep 400ms
Enter
Wait+Screen@60s /Approved by commit trailer/
Sleep 4s
