# Fix Node.js version and dependencies script

Write-Host "Checking Node.js version..." -ForegroundColor Yellow
$nodeVersion = node --version
Write-Host "Current version: $nodeVersion" -ForegroundColor Red

if ($nodeVersion -match "v24") {
    Write-Host "Detected unsupported Node.js 24" -ForegroundColor Red
    Write-Host "Installing Node.js 18..." -ForegroundColor Yellow
    
    # Try to use nvm if available
    try {
        nvm install 18.20.4
        nvm use 18.20.4
        Write-Host "New Node.js version:" -ForegroundColor Green
        node --version
    } catch {
        Write-Host "nvm not found. Please install Node.js 18 manually:" -ForegroundColor Red
        Write-Host "1. Download from: https://nodejs.org/download/release/v18.20.4/" -ForegroundColor Yellow
        Write-Host "2. Or use: nvm install 18.20.4 (if nvm is installed)" -ForegroundColor Yellow
        exit 1
    }
}

Write-Host "Cleaning dependencies..." -ForegroundColor Yellow
if (Test-Path node_modules) {
    Remove-Item -Recurse -Force node_modules -ErrorAction SilentlyContinue
}
if (Test-Path package-lock.json) {
    Remove-Item -Force package-lock.json -ErrorAction SilentlyContinue
}

Write-Host "Installing dependencies..." -ForegroundColor Yellow
npm install --legacy-peer-deps

if ($LASTEXITCODE -ne 0) {
    Write-Host "Installation failed!" -ForegroundColor Red
    exit 1
}

Write-Host "Building project..." -ForegroundColor Yellow
npm run build

if ($LASTEXITCODE -eq 0) {
    Write-Host "Done!" -ForegroundColor Green
} else {
    Write-Host "Build failed!" -ForegroundColor Red
    exit 1
}