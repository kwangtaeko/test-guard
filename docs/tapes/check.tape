# Records docs/assets/check.gif. Run from the repository root:
#   vhs docs/tapes/check.tape
# The demo lives at C:\tgvhs\demo; docs/tapes/setup.ps1 prepares it (hidden).
# The hidden step weakens the test the way an agent might; the visible part is
# a real `test-guard check` run.
Output docs/assets/check.gif

Set Shell "powershell"
Set FontSize 18
Set Width 1200
Set Height 420
Set Padding 24
Set TypingSpeed 45ms

Hide
Type "& docs\tapes\setup.ps1 weakened"
Enter
Sleep 6s
Show

Type "git diff --stat"
Sleep 400ms
Enter
Sleep 2s
Type "npx test-guard check"
Sleep 400ms
Enter
Wait+Screen@60s /violations/
Sleep 5s
