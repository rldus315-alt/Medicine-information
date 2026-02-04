# GitHub Pages 활성화 스크립트 (API 사용)
# 사용법: $env:GITHUB_TOKEN="ghp_xxxx"; .\scripts\enable-github-pages.ps1
# 토큰: https://github.com/settings/tokens (repo 권한)
# 또는: .\scripts\enable-pages.bat 으로 설정 페이지 열기

$owner = "rldus315-alt"
$repo = "Medicine-information"
$token = $env:GITHUB_TOKEN

if (-not $token) {
    Write-Host "GITHUB_TOKEN 환경변수를 설정하세요."
    Write-Host "예: `$env:GITHUB_TOKEN='ghp_xxxx'; .\scripts\enable-github-pages.ps1"
    exit 1
}

$headers = @{
    "Accept" = "application/vnd.github+json"
    "Authorization" = "Bearer $token"
    "X-GitHub-Api-Version" = "2022-11-28"
}

# 1) GitHub Actions로 Pages 설정 시도
$body = '{"build_type":"workflow"}' | ConvertFrom-Json
try {
    $response = Invoke-RestMethod -Uri "https://api.github.com/repos/$owner/$repo/pages" `
        -Method POST -Headers $headers -Body ($body | ConvertTo-Json) -ContentType "application/json"
    Write-Host "Pages 활성화 완료 (GitHub Actions)"
} catch {
    if ($_.Exception.Response.StatusCode -eq 409) {
        # 이미 존재 - PATCH로 workflow로 변경
        $updateBody = '{"build_type":"workflow"}' | ConvertFrom-Json
        Invoke-RestMethod -Uri "https://api.github.com/repos/$owner/$repo/pages" `
            -Method PUT -Headers $headers -Body ($updateBody | ConvertTo-Json) -ContentType "application/json"
        Write-Host "Pages 설정을 GitHub Actions로 변경 완료"
    } else {
        # 2) legacy (branch) 방식 시도
        $legacyBody = '{"source":{"branch":"main","path":"/"}}' | ConvertFrom-Json
        try {
            Invoke-RestMethod -Uri "https://api.github.com/repos/$owner/$repo/pages" `
                -Method POST -Headers $headers -Body ($legacyBody | ConvertTo-Json) -ContentType "application/json"
            Write-Host "Pages 활성화 완료 (Deploy from branch)"
        } catch {
            Write-Host "오류: $_"
            exit 1
        }
    }
}

Write-Host "배포 후 접속: https://rldus315-alt.github.io/Medicine-information/"
