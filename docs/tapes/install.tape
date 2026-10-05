# Records docs/assets/install.gif. Run from the repository root:
#   vhs docs/tapes/install.tape
# The demo lives at C:\tgvhs\demo; docs/tapes/setup.ps1 prepares it (hidden).
# Fixed sleeps instead of Wait: vhs 0.12.1 missed matches on scrolled output.
Output docs/assets/install.gif

Set Shell "powershell"
Set FontSize 16
Set Width 1200
Set Height 560
Set Padding 24
Set TypingSpeed 45ms

Hide
Type "& docs\tapes\setup.ps1 base; npx test-guard --version | Out-Null; Clear-Host"
Enter
Sleep 12s
Show

Type "npx test-guard install --agent claude-code"
Sleep 400ms
Enter
Sleep 8s
Type "y"
Sleep 300ms
Enter
Sleep 5s

Type "npx test-guard install --pre-commit"
Sleep 400ms
Enter
Sleep 7s
