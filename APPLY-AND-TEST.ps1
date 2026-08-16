$ErrorActionPreference = "Stop"

Write-Host "Kampvuur quality patch applied to: $((Get-Location).Path)" -ForegroundColor Cyan

Write-Host "Running JavaScript syntax check..." -ForegroundColor Cyan
node --check .\assets\site.js
if ($LASTEXITCODE -ne 0) { throw "site.js syntax validation failed" }

Write-Host "Running Lighthouse CI..." -ForegroundColor Cyan
npx --yes @lhci/cli@latest autorun --config=.\lighthouserc.json
if ($LASTEXITCODE -ne 0) { throw "Lighthouse CI thresholds failed" }

Write-Host "Running responsive/UI browser tests..." -ForegroundColor Cyan
python -m pip install playwright
python -m playwright install chromium
$server = Start-Process node -ArgumentList ".\tests\static_server.mjs" -PassThru -WindowStyle Hidden
try {
    Start-Sleep -Seconds 2
    python .\tests\ui_test.py
    if ($LASTEXITCODE -ne 0) { throw "UI tests failed" }
}
finally {
    Stop-Process -Id $server.Id -Force -ErrorAction SilentlyContinue
}

Write-Host "All configured quality checks passed." -ForegroundColor Green
