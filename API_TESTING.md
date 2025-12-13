# API Testing Guide

This document provides sample API requests for testing the Sweet Shop Management System API.

## Setup

Base URL: `http://localhost:5000/api`

## 1. Authentication

### Register a New User

**Request:**
```http
POST http://localhost:5000/api/auth/register
Content-Type: application/json

{
  "username": "john_doe",
  "email": "john@example.com",
  "password": "password123"
}
```

**Expected Response (201):**
```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "507f1f77bcf86cd799439011",
      "username": "john_doe",
      "email": "john@example.com",
      "role": "user"
    }
  }
}
```

### Login

**Request:**
```http
POST http://localhost:5000/api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

**Expected Response (200):**
```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "507f1f77bcf86cd799439011",
      "username": "john_doe",
      "email": "john@example.com",
      "role": "user"
    }
  }
}
```

### Invalid Login

**Request:**
```http
POST http://localhost:5000/api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "wrongpassword"
}
```

**Expected Response (401):**
```json
{
  "success": false,
  "message": "Invalid credentials"
}
```

## 2. Sweets Management

### Get All Sweets

**Request:**
```http
GET http://localhost:5000/api/sweets
Authorization: Bearer YOUR_TOKEN_HERE
```

**Expected Response (200):**
```json
{
  "success": true,
  "count": 2,
  "data": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "name": "Chocolate Bar",
      "category": "chocolate",
      "price": 2.99,
      "quantity": 50,
      "description": "Delicious chocolate bar",
      "createdAt": "2025-12-13T10:00:00.000Z",
      "updatedAt": "2025-12-13T10:00:00.000Z"
    },
    {
      "_id": "507f1f77bcf86cd799439012",
      "name": "Gummy Bears",
      "category": "gummy",
      "price": 1.99,
      "quantity": 100,
      "description": "Colorful gummy bears",
      "createdAt": "2025-12-13T10:05:00.000Z",
      "updatedAt": "2025-12-13T10:05:00.000Z"
    }
  ]
}
```

### Search Sweets by Name

**Request:**
```http
GET http://localhost:5000/api/sweets/search?name=chocolate
Authorization: Bearer YOUR_TOKEN_HERE
```

**Expected Response (200):**
```json
{
  "success": true,
  "count": 1,
  "data": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "name": "Chocolate Bar",
      "category": "chocolate",
      "price": 2.99,
      "quantity": 50,
      "description": "Delicious chocolate bar"
    }
  ]
}
```

### Search by Category

**Request:**
```http
GET http://localhost:5000/api/sweets/search?category=gummy
Authorization: Bearer YOUR_TOKEN_HERE
```

### Search by Price Range

**Request:**
```http
GET http://localhost:5000/api/sweets/search?minPrice=1&maxPrice=3
Authorization: Bearer YOUR_TOKEN_HERE
```

### Combined Search

**Request:**
```http
GET http://localhost:5000/api/sweets/search?name=chocolate&category=chocolate&minPrice=2&maxPrice=5
Authorization: Bearer YOUR_TOKEN_HERE
```

### Create Sweet (Admin Only)

**Request:**
```http
POST http://localhost:5000/api/sweets
Authorization: Bearer YOUR_ADMIN_TOKEN_HERE
Content-Type: application/json

{
  "name": "Dark Chocolate",
  "category": "chocolate",
  "price": 3.99,
  "quantity": 30,
  "description": "Rich dark chocolate bar"
}
```

**Expected Response (201):**
```json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439013",
    "name": "Dark Chocolate",
    "category": "chocolate",
    "price": 3.99,
    "quantity": 30,
    "description": "Rich dark chocolate bar",
    "createdAt": "2025-12-13T11:00:00.000Z",
    "updatedAt": "2025-12-13T11:00:00.000Z"
  }
}
```

### Create Sweet - Validation Error

**Request:**
```http
POST http://localhost:5000/api/sweets
Authorization: Bearer YOUR_ADMIN_TOKEN_HERE
Content-Type: application/json

{
  "name": "X",
  "category": "chocolate",
  "price": -1,
  "quantity": -5
}
```

**Expected Response (400):**
```json
{
  "success": false,
  "message": "Sweet name must be at least 2 characters long, Price cannot be negative, Quantity cannot be negative"
}
```

### Update Sweet (Admin Only)

**Request:**
```http
PUT http://localhost:5000/api/sweets/507f1f77bcf86cd799439011
Authorization: Bearer YOUR_ADMIN_TOKEN_HERE
Content-Type: application/json

{
  "name": "Premium Chocolate Bar",
  "price": 3.49
}
```

**Expected Response (200):**
```json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "Premium Chocolate Bar",
    "category": "chocolate",
    "price": 3.49,
    "quantity": 50,
    "description": "Delicious chocolate bar",
    "updatedAt": "2025-12-13T11:30:00.000Z"
  }
}
```

### Delete Sweet (Admin Only)

**Request:**
```http
DELETE http://localhost:5000/api/sweets/507f1f77bcf86cd799439011
Authorization: Bearer YOUR_ADMIN_TOKEN_HERE
```

**Expected Response (200):**
```json
{
  "success": true,
  "message": "Sweet deleted successfully"
}
```

### Access Denied (Non-Admin)

**Request:**
```http
POST http://localhost:5000/api/sweets
Authorization: Bearer YOUR_USER_TOKEN_HERE
Content-Type: application/json

{
  "name": "New Sweet",
  "category": "candy",
  "price": 1.50,
  "quantity": 20
}
```

**Expected Response (403):**
```json
{
  "success": false,
  "message": "Access denied. Admin privileges required."
}
```

## 3. Inventory Management

### Purchase Sweet

**Request:**
```http
POST http://localhost:5000/api/sweets/507f1f77bcf86cd799439011/purchase
Authorization: Bearer YOUR_TOKEN_HERE
Content-Type: application/json

{
  "quantity": 2
}
```

**Expected Response (200):**
```json
{
  "success": true,
  "message": "2 Chocolate Bar(s) purchased successfully",
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "Chocolate Bar",
    "category": "chocolate",
    "price": 2.99,
    "quantity": 48,
    "description": "Delicious chocolate bar"
  }
}
```

### Purchase - Out of Stock

**Request:**
```http
POST http://localhost:5000/api/sweets/507f1f77bcf86cd799439011/purchase
Authorization: Bearer YOUR_TOKEN_HERE
Content-Type: application/json

{
  "quantity": 1
}
```

**Expected Response (400):**
```json
{
  "success": false,
  "message": "This sweet is out of stock"
}
```

### Purchase - Insufficient Stock

**Request:**
```http
POST http://localhost:5000/api/sweets/507f1f77bcf86cd799439011/purchase
Authorization: Bearer YOUR_TOKEN_HERE
Content-Type: application/json

{
  "quantity": 100
}
```

**Expected Response (400):**
```json
{
  "success": false,
  "message": "Insufficient stock. Only 50 items available"
}
```

### Restock Sweet (Admin Only)

**Request:**
```http
POST http://localhost:5000/api/sweets/507f1f77bcf86cd799439011/restock
Authorization: Bearer YOUR_ADMIN_TOKEN_HERE
Content-Type: application/json

{
  "quantity": 25
}
```

**Expected Response (200):**
```json
{
  "success": true,
  "message": "Chocolate Bar restocked successfully with 25 items",
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "Chocolate Bar",
    "category": "chocolate",
    "price": 2.99,
    "quantity": 75,
    "description": "Delicious chocolate bar"
  }
}
```

### Restock - Access Denied

**Request:**
```http
POST http://localhost:5000/api/sweets/507f1f77bcf86cd799439011/restock
Authorization: Bearer YOUR_USER_TOKEN_HERE
Content-Type: application/json

{
  "quantity": 25
}
```

**Expected Response (403):**
```json
{
  "success": false,
  "message": "Access denied. Admin privileges required."
}
```

## 4. Error Responses

### No Token Provided

**Request:**
```http
GET http://localhost:5000/api/sweets
```

**Expected Response (401):**
```json
{
  "success": false,
  "message": "Access denied. No token provided."
}
```

### Invalid Token

**Request:**
```http
GET http://localhost:5000/api/sweets
Authorization: Bearer invalid_token_here
```

**Expected Response (401):**
```json
{
  "success": false,
  "message": "Invalid token."
}
```

### Not Found

**Request:**
```http
GET http://localhost:5000/api/sweets/507f1f77bcf86cd799439999
Authorization: Bearer YOUR_TOKEN_HERE
```

**Expected Response (404):**
```json
{
  "success": false,
  "message": "Sweet not found"
}
```

### Route Not Found

**Request:**
```http
GET http://localhost:5000/api/invalid-route
```

**Expected Response (404):**
```json
{
  "success": false,
  "message": "Route not found"
}
```

## 5. Testing with cURL

### Register User
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","email":"test@example.com","password":"password123"}'
```

### Login User
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

### Get All Sweets
```bash
curl -X GET http://localhost:5000/api/sweets \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### Create Sweet
```bash
curl -X POST http://localhost:5000/api/sweets \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"name":"Chocolate Bar","category":"chocolate","price":2.99,"quantity":50,"description":"Delicious"}'
```

### Purchase Sweet
```bash
curl -X POST http://localhost:5000/api/sweets/SWEET_ID/purchase \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"quantity":2}'
```

### Restock Sweet
```bash
curl -X POST http://localhost:5000/api/sweets/SWEET_ID/restock \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"quantity":25}'
```

## 6. Testing with PowerShell (Windows)

### Register User
```powershell
$body = @{
    username = "testuser"
    email = "test@example.com"
    password = "password123"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:5000/api/auth/register" `
  -Method Post `
  -ContentType "application/json" `
  -Body $body
```

### Login and Save Token
```powershell
$loginBody = @{
    email = "test@example.com"
    password = "password123"
} | ConvertTo-Json

$response = Invoke-RestMethod -Uri "http://localhost:5000/api/auth/login" `
  -Method Post `
  -ContentType "application/json" `
  -Body $loginBody

$token = $response.data.token
Write-Host "Token: $token"
```

### Get All Sweets
```powershell
$headers = @{
    Authorization = "Bearer $token"
}

Invoke-RestMethod -Uri "http://localhost:5000/api/sweets" `
  -Method Get `
  -Headers $headers
```

## 7. Sample Test Sequence

Complete flow to test all features:

1. **Register a user**
2. **Login and save token**
3. **Try to create sweet (should fail - not admin)**
4. **Make user admin in MongoDB**
5. **Login again to get new token with admin role**
6. **Create multiple sweets**
7. **Get all sweets**
8. **Search sweets by name**
9. **Filter by category**
10. **Filter by price range**
11. **Purchase a sweet**
12. **Try to purchase with insufficient stock**
13. **Restock a sweet**
14. **Update a sweet**
15. **Delete a sweet**

## 8. Postman Collection

You can import this into Postman:

```json
{
  "info": {
    "name": "Sweet Shop API",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "item": [
    {
      "name": "Auth",
      "item": [
        {
          "name": "Register",
          "request": {
            "method": "POST",
            "header": [{"key": "Content-Type", "value": "application/json"}],
            "body": {
              "mode": "raw",
              "raw": "{\"username\":\"testuser\",\"email\":\"test@example.com\",\"password\":\"password123\"}"
            },
            "url": "{{baseUrl}}/auth/register"
          }
        },
        {
          "name": "Login",
          "request": {
            "method": "POST",
            "header": [{"key": "Content-Type", "value": "application/json"}],
            "body": {
              "mode": "raw",
              "raw": "{\"email\":\"test@example.com\",\"password\":\"password123\"}"
            },
            "url": "{{baseUrl}}/auth/login"
          }
        }
      ]
    }
  ],
  "variable": [
    {
      "key": "baseUrl",
      "value": "http://localhost:5000/api"
    }
  ]
}
```

---

**Note**: Replace `YOUR_TOKEN_HERE` and `YOUR_ADMIN_TOKEN_HERE` with actual tokens obtained from login/register endpoints.
