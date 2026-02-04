# Git hooks 설치 (post-commit: 커밋 후 자동 push)
$hookSrc = Join-Path $PSScriptRoot "git-hooks\post-commit"
$hookDst = Join-Path (git rev-parse --show-toplevel) ".git\hooks\post-commit"
if (Test-Path $hookSrc) {
  Copy-Item $hookSrc $hookDst -Force
  Write-Host "Installed: post-commit (auto push after commit)"
} else {
  Write-Host "Source not found: $hookSrc"
}
