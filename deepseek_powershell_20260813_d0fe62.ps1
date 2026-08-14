# Сохраните как `diagnose.ps1`
Write-Host "=== Dependency Diagnosis ===" -ForegroundColor Cyan

# 1. Проверка Node.js и npm
Write-Host "`n1. Node.js and npm versions:" -ForegroundColor Yellow
node --version
npm --version

# 2. Проверка package.json
Write-Host "`n2. react-scripts in package.json:" -ForegroundColor Yellow
Get-Content package.json | Select-String "react-scripts"

# 3. Проверка установленных пакетов
Write-Host "`n3. Installed packages:" -ForegroundColor Yellow
npm ls --depth=0

# 4. Проверка react-scripts
Write-Host "`n4. Checking react-scripts:" -ForegroundColor Yellow
if (Test-Path "node_modules/react-scripts") {
    Write-Host "react-scripts directory exists" -ForegroundColor Green
    Get-Content node_modules/react-scripts/package.json | Select-String "version"
} else {
    Write-Host "react-scripts directory NOT found!" -ForegroundColor Red
}

# 5. Проверка .bin
Write-Host "`n5. Checking .bin directory:" -ForegroundColor Yellow
if (Test-Path "node_modules/.bin/react-scripts") {
    Write-Host "react-scripts found in .bin" -ForegroundColor Green
    Get-ChildItem node_modules/.bin/react-scripts*
} else {
    Write-Host "react-scripts NOT found in .bin!" -ForegroundColor Red
}

# 6. Проверка npm cache
Write-Host "`n6. npm cache:" -ForegroundColor Yellow
npm cache verify

# 7. Проверка на поврежденные пакеты
Write-Host "`n7. Checking for corrupted packages:" -ForegroundColor Yellow
npm doctor