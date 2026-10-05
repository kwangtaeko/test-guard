# Puts the recording demo (C:\tgvhs\demo) into the state a tape needs.
# Usage (inside a tape, hidden): & docs\tapes\setup.ps1 <state>
#   base     : initial commit, no hooks
#   weakened : base + an agent-style weakening of src/math.test.js
#   skipped  : base + commit-msg hook + `it.skip` added
#   agent    : base + Claude Code hooks committed, project-only permissions
param([Parameter(Mandatory)][string]$State)
$ErrorActionPreference = 'Stop'
Set-Location C:\tgvhs\demo
$env:GIT_PAGER = 'cat'
Remove-Item Env:NO_COLOR -ErrorAction SilentlyContinue  # vhs sets it; keep colors
# Recorded from inside another Claude Code session: drop its markers.
Get-ChildItem Env: | Where-Object Name -like 'CLAUDE*' | ForEach-Object { Remove-Item "Env:$($_.Name)" }
git reset -q --hard (git rev-list --max-parents=0 HEAD)
git clean -fdq -e node_modules
Remove-Item .git\hooks\commit-msg -ErrorAction SilentlyContinue

$test = Join-Path $PWD 'src\math.test.js'
function Edit-Test([scriptblock]$Change) {
  $text = [IO.File]::ReadAllText($test)
  [IO.File]::WriteAllText($test, (& $Change $text))
}

switch ($State) {
  'base' {}
  'weakened' {
    Edit-Test {
      param($t)
      $t.Replace("it('subtracts'", "it.skip('subtracts'").
        Replace("    expect(sub(5, 5)).toBe(0);`n", '').
        Replace('toBe(3)', 'toBeDefined()')
    }
  }
  'skipped' {
    npx test-guard install --pre-commit | Out-Null
    Edit-Test { param($t) $t.Replace("it('subtracts'", "it.skip('subtracts'") }
  }
  'agent' {
    npx test-guard install --agent claude-code --yes | Out-Null
    New-Item -ItemType Directory -Force .claude | Out-Null
    # Recording only: let Claude edit and run `npm test` without prompts.
    '{ "permissions": { "defaultMode": "acceptEdits", "allow": ["Bash(npm test*)", "PowerShell(npm test*)"] } }' |
      Set-Content -Encoding ascii .claude\settings.local.json
    git add .claude/settings.json
    git commit -qm 'chore: test-guard hooks' | Out-Null
  }
  default { throw "unknown state: $State" }
}
Clear-Host
