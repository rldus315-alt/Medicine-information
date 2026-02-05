# 약국정보서비스 CSV 변환 실행 스크립트
$csvPath = "c:\Users\rldus\Desktop\2.약국정보서비스(2025.12.)의 복사본.csv"
$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$projectDir = Split-Path -Parent $scriptDir

if (Test-Path -LiteralPath $csvPath) {
    Set-Location $projectDir
    node scripts/convert-pharmacy-egis-csv.js $csvPath
} else {
    Write-Host "CSV 파일을 찾을 수 없습니다: $csvPath"
    Write-Host "다른 경로인 경우 convert-pharmacy-egis-csv.js 에 경로를 직접 전달하세요."
}
