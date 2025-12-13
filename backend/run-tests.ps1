# Test Runner Script
Write-Host "================================" -ForegroundColor Cyan
Write-Host "Running Sweet Shop Tests" -ForegroundColor Cyan
Write-Host "================================" -ForegroundColor Cyan

# Set environment variables
$env:NODE_ENV = "test"
$env:JWT_SECRET = "testsecret123456789"
$env:MONGODB_URI = "mongodb+srv://Rajivkumar:Rajivkumar@cluster0.5aesp.mongodb.net/sweet_shop_test?retryWrites=true&w=majority"

Write-Host "Environment: $env:NODE_ENV" -ForegroundColor Yellow
Write-Host "Running tests..." -ForegroundColor Yellow
Write-Host ""

# Run tests
npm test -- --runInBand --forceExit --detectOpenHandles

Write-Host ""
Write-Host "================================" -ForegroundColor Cyan
Write-Host "Tests Complete" -ForegroundColor Cyan
Write-Host "================================" -ForegroundColor Cyan
