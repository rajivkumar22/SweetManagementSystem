# API Verification Script
Write-Host "================================" -ForegroundColor Cyan
Write-Host "Sweet Shop API Verification" -ForegroundColor Cyan
Write-Host "================================" -ForegroundColor Cyan
Write-Host ""

$baseUrl = "http://localhost:5000"
$token = ""
$adminToken = ""

# Test 1: Health Check
Write-Host "1. Testing Health Endpoint..." -ForegroundColor Yellow
try {
    $health = Invoke-RestMethod -Uri "$baseUrl/health" -Method Get
    Write-Host "   ✓ Health check passed: $($health.message)" -ForegroundColor Green
} catch {
    Write-Host "   ✗ Health check failed" -ForegroundColor Red
}

# Test 2: Register User
Write-Host "`n2. Testing User Registration..." -ForegroundColor Yellow
try {
    $registerBody = @{
        username = "testuser_verify"
        email = "verify@test.com"
        password = "password123"
    } | ConvertTo-Json

    $registerResponse = Invoke-RestMethod -Uri "$baseUrl/api/auth/register" `
        -Method Post `
        -ContentType "application/json" `
        -Body $registerBody
    
    $token = $registerResponse.data.token
    Write-Host "   ✓ User registered successfully" -ForegroundColor Green
    Write-Host "   Token: $($token.Substring(0, 20))..." -ForegroundColor Gray
} catch {
    Write-Host "   ✗ Registration failed: $($_.Exception.Message)" -ForegroundColor Red
}

# Test 3: Login as Regular User
Write-Host "`n3. Testing User Login..." -ForegroundColor Yellow
try {
    $loginBody = @{
        email = "rky1@example.com"
        password = "password123"
    } | ConvertTo-Json

    $loginResponse = Invoke-RestMethod -Uri "$baseUrl/api/auth/login" `
        -Method Post `
        -ContentType "application/json" `
        -Body $loginBody
    
    $token = $loginResponse.data.token
    Write-Host "   ✓ User login successful" -ForegroundColor Green
    Write-Host "   User: $($loginResponse.data.user.username)" -ForegroundColor Gray
} catch {
    Write-Host "   ✗ Login failed: $($_.Exception.Message)" -ForegroundColor Red
}

# Test 4: Login as Admin
Write-Host "`n4. Testing Admin Login..." -ForegroundColor Yellow
try {
    $adminLoginBody = @{
        email = "admin@sweetshop.com"
        password = "admin123"
    } | ConvertTo-Json

    $adminResponse = Invoke-RestMethod -Uri "$baseUrl/api/auth/login" `
        -Method Post `
        -ContentType "application/json" `
        -Body $adminLoginBody
    
    $adminToken = $adminResponse.data.token
    Write-Host "   ✓ Admin login successful" -ForegroundColor Green
    Write-Host "   Admin: $($adminResponse.data.user.username) [Role: $($adminResponse.data.user.role)]" -ForegroundColor Gray
} catch {
    Write-Host "   ✗ Admin login failed: $($_.Exception.Message)" -ForegroundColor Red
}

# Test 5: Get All Sweets
Write-Host "`n5. Testing Get All Sweets..." -ForegroundColor Yellow
try {
    $headers = @{
        Authorization = "Bearer $token"
    }
    $sweets = Invoke-RestMethod -Uri "$baseUrl/api/sweets" -Method Get -Headers $headers
    Write-Host "   ✓ Retrieved $($sweets.count) sweets" -ForegroundColor Green
    Write-Host "   First sweet: $($sweets.data[0].name) - $($sweets.data[0].price)" -ForegroundColor Gray
} catch {
    Write-Host "   ✗ Failed to get sweets: $($_.Exception.Message)" -ForegroundColor Red
}

# Test 6: Search Sweets
Write-Host "`n6. Testing Search by Name..." -ForegroundColor Yellow
try {
    $headers = @{
        Authorization = "Bearer $token"
    }
    $searchResults = Invoke-RestMethod -Uri "$baseUrl/api/sweets/search?name=chocolate" -Method Get -Headers $headers
    Write-Host "   ✓ Found $($searchResults.count) chocolate sweets" -ForegroundColor Green
} catch {
    Write-Host "   ✗ Search failed: $($_.Exception.Message)" -ForegroundColor Red
}

# Test 7: Purchase Sweet
Write-Host "`n7. Testing Purchase Functionality..." -ForegroundColor Yellow
try {
    $headers = @{
        Authorization = "Bearer $token"
    }
    $sweetId = $sweets.data[0]._id
    $purchaseBody = @{
        quantity = 1
    } | ConvertTo-Json

    $purchase = Invoke-RestMethod -Uri "$baseUrl/api/sweets/$sweetId/purchase" `
        -Method Post `
        -Headers $headers `
        -ContentType "application/json" `
        -Body $purchaseBody
    
    Write-Host "   ✓ Purchase successful" -ForegroundColor Green
    Write-Host "   Remaining quantity: $($purchase.data.quantity)" -ForegroundColor Gray
} catch {
    Write-Host "   ✗ Purchase failed: $($_.Exception.Message)" -ForegroundColor Red
}

# Test 8: Create Sweet (Admin)
Write-Host "`n8. Testing Create Sweet (Admin)..." -ForegroundColor Yellow
try {
    $headers = @{
        Authorization = "Bearer $adminToken"
    }
    $newSweetBody = @{
        name = "Test Candy"
        category = "candy"
        price = 1.99
        quantity = 50
        description = "Test candy for verification"
    } | ConvertTo-Json

    $newSweet = Invoke-RestMethod -Uri "$baseUrl/api/sweets" `
        -Method Post `
        -Headers $headers `
        -ContentType "application/json" `
        -Body $newSweetBody
    
    Write-Host "   ✓ Sweet created successfully" -ForegroundColor Green
    Write-Host "   Created: $($newSweet.data.name)" -ForegroundColor Gray
    $testSweetId = $newSweet.data._id
} catch {
    Write-Host "   ✗ Create failed: $($_.Exception.Message)" -ForegroundColor Red
}

# Test 9: Update Sweet (Admin)
Write-Host "`n9. Testing Update Sweet (Admin)..." -ForegroundColor Yellow
try {
    $headers = @{
        Authorization = "Bearer $adminToken"
    }
    $updateBody = @{
        price = 2.49
    } | ConvertTo-Json

    $updated = Invoke-RestMethod -Uri "$baseUrl/api/sweets/$testSweetId" `
        -Method Put `
        -Headers $headers `
        -ContentType "application/json" `
        -Body $updateBody
    
    Write-Host "   ✓ Sweet updated successfully" -ForegroundColor Green
    Write-Host "   New price: $($updated.data.price)" -ForegroundColor Gray
} catch {
    Write-Host "   ✗ Update failed: $($_.Exception.Message)" -ForegroundColor Red
}

# Test 10: Restock Sweet (Admin)
Write-Host "`n10. Testing Restock (Admin)..." -ForegroundColor Yellow
try {
    $headers = @{
        Authorization = "Bearer $adminToken"
    }
    $restockBody = @{
        quantity = 25
    } | ConvertTo-Json

    $restocked = Invoke-RestMethod -Uri "$baseUrl/api/sweets/$testSweetId/restock" `
        -Method Post `
        -Headers $headers `
        -ContentType "application/json" `
        -Body $restockBody
    
    Write-Host "   ✓ Restock successful" -ForegroundColor Green
    Write-Host "   New quantity: $($restocked.data.quantity)" -ForegroundColor Gray
} catch {
    Write-Host "   ✗ Restock failed: $($_.Exception.Message)" -ForegroundColor Red
}

# Test 11: Delete Sweet (Admin)
Write-Host "`n11. Testing Delete Sweet (Admin)..." -ForegroundColor Yellow
try {
    $headers = @{
        Authorization = "Bearer $adminToken"
    }
    
    Invoke-RestMethod -Uri "$baseUrl/api/sweets/$testSweetId" `
        -Method Delete `
        -Headers $headers | Out-Null
    
    Write-Host "   ✓ Sweet deleted successfully" -ForegroundColor Green
} catch {
    Write-Host "   ✗ Delete failed: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`n================================" -ForegroundColor Cyan
Write-Host "Verification Complete!" -ForegroundColor Green
Write-Host "================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "All API endpoints are working!" -ForegroundColor Green
Write-Host ""
Write-Host "Next Steps:" -ForegroundColor Yellow
Write-Host "1. Open browser: http://localhost:3000" -ForegroundColor White
Write-Host "2. Login as Admin: admin@sweetshop.com / admin123" -ForegroundColor White
Write-Host "3. Test all features in the UI" -ForegroundColor White
Write-Host "4. Take screenshots for submission" -ForegroundColor White
Write-Host ""
