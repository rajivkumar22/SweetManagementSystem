# Sweet Shop Management System - Installation Script

Write-Host "================================" -ForegroundColor Cyan
Write-Host "Sweet Shop Management System" -ForegroundColor Cyan
Write-Host "Installation Script" -ForegroundColor Cyan
Write-Host "================================" -ForegroundColor Cyan
Write-Host ""

# Check if Node.js is installed
Write-Host "Checking Node.js installation..." -ForegroundColor Yellow
try {
    $nodeVersion = node --version
    Write-Host "✓ Node.js is installed: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "✗ Node.js is not installed!" -ForegroundColor Red
    Write-Host "Please install Node.js from https://nodejs.org/" -ForegroundColor Red
    exit 1
}

# Check if MongoDB is running
Write-Host ""
Write-Host "Checking MongoDB..." -ForegroundColor Yellow
try {
    $mongoStatus = Get-Service -Name MongoDB -ErrorAction SilentlyContinue
    if ($mongoStatus.Status -eq 'Running') {
        Write-Host "✓ MongoDB is running" -ForegroundColor Green
    } else {
        Write-Host "⚠ MongoDB service found but not running" -ForegroundColor Yellow
        Write-Host "Attempting to start MongoDB..." -ForegroundColor Yellow
        Start-Service -Name MongoDB
        Write-Host "✓ MongoDB started" -ForegroundColor Green
    }
} catch {
    Write-Host "⚠ MongoDB service not found" -ForegroundColor Yellow
    Write-Host "Please ensure MongoDB is installed and running" -ForegroundColor Yellow
    Write-Host "You can start it manually with: mongod" -ForegroundColor Yellow
}

# Install Backend Dependencies
Write-Host ""
Write-Host "================================" -ForegroundColor Cyan
Write-Host "Installing Backend Dependencies" -ForegroundColor Cyan
Write-Host "================================" -ForegroundColor Cyan
Set-Location -Path "backend"

if (Test-Path "node_modules") {
    Write-Host "Backend dependencies already installed" -ForegroundColor Yellow
    $reinstall = Read-Host "Reinstall? (y/n)"
    if ($reinstall -eq "y") {
        npm install
    }
} else {
    npm install
}

Write-Host "✓ Backend dependencies installed" -ForegroundColor Green

# Install Frontend Dependencies
Write-Host ""
Write-Host "================================" -ForegroundColor Cyan
Write-Host "Installing Frontend Dependencies" -ForegroundColor Cyan
Write-Host "================================" -ForegroundColor Cyan
Set-Location -Path "../frontend"

if (Test-Path "node_modules") {
    Write-Host "Frontend dependencies already installed" -ForegroundColor Yellow
    $reinstall = Read-Host "Reinstall? (y/n)"
    if ($reinstall -eq "y") {
        npm install
    }
} else {
    npm install
}

Write-Host "✓ Frontend dependencies installed" -ForegroundColor Green

# Back to root
Set-Location -Path ".."

Write-Host ""
Write-Host "================================" -ForegroundColor Green
Write-Host "Installation Complete! ✓" -ForegroundColor Green
Write-Host "================================" -ForegroundColor Green
Write-Host ""
Write-Host "Next Steps:" -ForegroundColor Yellow
Write-Host "1. Ensure MongoDB is running" -ForegroundColor White
Write-Host "2. Open a terminal and run: cd backend && npm run dev" -ForegroundColor White
Write-Host "3. Open another terminal and run: cd frontend && npm start" -ForegroundColor White
Write-Host ""
Write-Host "The application will be available at:" -ForegroundColor Yellow
Write-Host "Frontend: http://localhost:3000" -ForegroundColor Cyan
Write-Host "Backend:  http://localhost:5000" -ForegroundColor Cyan
Write-Host ""
Write-Host "To run tests: cd backend && npm test" -ForegroundColor Yellow
Write-Host ""
Write-Host "Check QUICKSTART.md for more details!" -ForegroundColor Green
