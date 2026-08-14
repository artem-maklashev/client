# Сохраните как `fix_all.ps1`
Write-Host "=== Fixing Node.js and npm versions ===" -ForegroundColor Cyan

# 1. Switch to Node.js 20
Write-Host "`n1. Switching to Node.js 20.18.0..." -ForegroundColor Yellow
nvm use 20.18.0

# 2. Downgrade npm
Write-Host "`n2. Downgrading npm to 10.8.2..." -ForegroundColor Yellow
npm install -g npm@10.8.2

# 3. Verify versions
Write-Host "`n3. Current versions:" -ForegroundColor Yellow
$nodeVer = node --version
$npmVer = npm --version
Write-Host "Node.js: $nodeVer" -ForegroundColor Green
Write-Host "NPM: $npmVer" -ForegroundColor Green

# 4. Clean
Write-Host "`n4. Cleaning old dependencies..." -ForegroundColor Yellow
if (Test-Path node_modules) {
    Remove-Item -Recurse -Force node_modules -ErrorAction SilentlyContinue
    Write-Host "Removed node_modules" -ForegroundColor Green
}
if (Test-Path package-lock.json) {
    Remove-Item -Force package-lock.json -ErrorAction SilentlyContinue
    Write-Host "Removed package-lock.json" -ForegroundColor Green
}

# 5. Clear npm cache
Write-Host "`n5. Clearing npm cache..." -ForegroundColor Yellow
npm cache clean --force

# 6. Install dependencies
Write-Host "`n6. Installing dependencies..." -ForegroundColor Yellow
npm install --legacy-peer-deps

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Installation failed!" -ForegroundColor Red
    exit 1
}
Write-Host "✅ Dependencies installed" -ForegroundColor Green

# 7. Check react-scripts
Write-Host "`n7. Checking react-scripts..." -ForegroundColor Yellow
npm ls react-scripts --depth=0

# 8. Build
Write-Host "`n8. Building project..." -ForegroundColor Yellow
npm run build

if ($LASTEXITCODE -eq 0) {
    Write-Host "`n✅ SUCCESS: Build completed!" -ForegroundColor Green
} else {
    Write-Host "`n❌ ERROR: Build failed!" -ForegroundColor Red
}