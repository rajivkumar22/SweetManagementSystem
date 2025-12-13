# Installation and Testing Guide

## Prerequisites Check

Before starting, ensure you have:

- [ ] Node.js installed (v14 or higher)
- [ ] MongoDB installed and running
- [ ] npm or yarn package manager
- [ ] Terminal/Command Prompt access

## Installation Steps

### Option 1: Automated Installation (Windows)

Run the PowerShell installation script:

```powershell
# In the project root directory
.\setup.ps1
```

This will:
- Check Node.js installation
- Check MongoDB status
- Install backend dependencies
- Install frontend dependencies

### Option 2: Manual Installation

#### Step 1: Install Backend Dependencies

```bash
cd backend
npm install
```

Expected packages:
- express
- mongoose
- bcryptjs
- jsonwebtoken
- dotenv
- cors
- express-validator
- jest (dev)
- supertest (dev)
- nodemon (dev)

#### Step 2: Install Frontend Dependencies

```bash
cd frontend
npm install
```

Expected packages:
- react
- react-dom
- react-router-dom
- axios
- react-scripts

## Starting the Application

### Terminal 1: Start Backend

```bash
cd backend
npm run dev
```

Expected output:
```
[nodemon] starting `node src/server.js`
Server is running on port 5000
Environment: development
MongoDB Connected: localhost
```

### Terminal 2: Start Frontend

```bash
cd frontend
npm start
```

Expected output:
```
Compiled successfully!

You can now view sweet-shop-frontend in the browser.

  Local:            http://localhost:3000
  On Your Network:  http://192.168.x.x:3000
```

## Running Tests

### Backend Tests

```bash
cd backend
npm test
```

Expected output:
```
PASS  __tests__/auth/auth.test.js
PASS  __tests__/sweets/sweets.test.js
PASS  __tests__/inventory/inventory.test.js

Test Suites: 3 passed, 3 total
Tests:       25 passed, 25 total
Snapshots:   0 total
Time:        5.432s
```

### Run Tests Once with Coverage

```bash
cd backend
npm run test:once
```

This will generate a coverage report.

## Verification Checklist

After installation and startup, verify:

### Backend Verification

1. **Health Check**
   ```bash
   # Open browser or use curl
   http://localhost:5000/health
   ```
   Expected: `{"status":"OK","message":"Server is running"}`

2. **MongoDB Connection**
   Check terminal output for: `MongoDB Connected: localhost`

3. **API Endpoints Available**
   - POST /api/auth/register
   - POST /api/auth/login
   - GET /api/sweets
   - GET /api/sweets/search
   - POST /api/sweets
   - PUT /api/sweets/:id
   - DELETE /api/sweets/:id
   - POST /api/sweets/:id/purchase
   - POST /api/sweets/:id/restock

### Frontend Verification

1. **Application Loads**
   - Navigate to http://localhost:3000
   - Should see login page

2. **Routes Available**
   - / (redirects to /login)
   - /login
   - /register
   - /dashboard (protected)
   - /admin (protected, admin only)

3. **Visual Check**
   - Modern gradient design visible
   - Forms are properly styled
   - No console errors

## Testing the Application

### Step 1: Register a User

1. Go to http://localhost:3000
2. Click "Register here"
3. Fill in:
   - Username: testuser
   - Email: test@example.com
   - Password: password123
   - Confirm Password: password123
4. Click "Register"
5. Should be redirected to dashboard

### Step 2: View Dashboard

1. Should see:
   - Navigation bar with username
   - Search filters
   - Sweets grid (empty initially)
   - Logout button

### Step 3: Create Admin User

1. Open MongoDB Compass or mongo shell
2. Connect to: mongodb://localhost:27017
3. Select database: sweet_shop
4. Select collection: users
5. Find your user and click Edit
6. Change role from "user" to "admin"
7. Logout and login again

### Step 4: Test Admin Features

1. After logging in as admin, you should see:
   - "Manage Sweets" button in navigation
2. Click "Manage Sweets"
3. Click "+ Add New Sweet"
4. Fill in sweet details:
   - Name: Chocolate Bar
   - Category: chocolate
   - Price: 2.99
   - Quantity: 50
   - Description: Delicious chocolate
5. Click "Add Sweet"
6. Sweet should appear in the table

### Step 5: Test Purchase

1. Go back to Dashboard
2. Find the sweet you added
3. Click "Purchase" button
4. Quantity should decrease
5. If you purchase until quantity is 0, button should be disabled

### Step 6: Test Search

1. Add multiple sweets with different categories
2. Try searching by name
3. Try filtering by category
4. Try filtering by price range
5. Try combining filters

### Step 7: Test Restock

1. As admin, go to "Manage Sweets"
2. Click the 📦 (restock) button on any sweet
3. Enter quantity to add
4. Verify quantity increases

## Troubleshooting

### "Cannot connect to MongoDB"

**Problem**: MongoDB is not running

**Solutions**:
```bash
# Windows (if installed as service)
net start MongoDB

# Or start manually
mongod

# Check if MongoDB is running
mongo --eval "db.version()"
```

### "Port 5000 already in use"

**Problem**: Another application is using port 5000

**Solutions**:
1. Change PORT in backend/.env:
   ```
   PORT=5001
   ```
2. Or stop the application using port 5000

### "Port 3000 already in use"

**Problem**: Another application is using port 3000

**Solution**: React will automatically prompt:
```
? Something is already running on port 3000.
Would you like to run the app on another port instead? (Y/n)
```
Type `Y` and press Enter.

### Tests Failing

**Problem**: Tests not passing

**Check**:
1. MongoDB is running
2. No other instance of the app is running
3. Database is clean (or tests handle cleanup)

**Solution**:
```bash
# Clear test database
mongo sweet_shop_test --eval "db.dropDatabase()"

# Run tests again
npm test
```

### Cannot login after registration

**Problem**: Token not being saved

**Check**:
1. Backend is running
2. Check browser console for errors
3. Check Network tab in DevTools
4. Verify .env file has JWT_SECRET

### Sweets not displaying

**Problem**: API call failing

**Check**:
1. Backend is running on port 5000
2. Frontend proxy is configured correctly
3. Check browser console for errors
4. Verify you're logged in (token exists)

## Performance Testing

### Test API Response Times

```bash
# Test registration endpoint
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"perftest","email":"perf@test.com","password":"test123"}'

# Test get sweets endpoint (requires token)
curl -X GET http://localhost:5000/api/sweets \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### Load Testing (Optional)

If you want to test with multiple requests:

```bash
# Install apache bench (optional)
# Windows: Download from Apache website
# Mac: Pre-installed
# Linux: apt-get install apache2-utils

# Run load test
ab -n 100 -c 10 http://localhost:5000/health
```

## Database Verification

### Check Collections

```javascript
// In mongo shell
use sweet_shop

// Check users
db.users.find().pretty()

// Check sweets
db.sweets.find().pretty()

// Count documents
db.users.countDocuments()
db.sweets.countDocuments()
```

### Sample Data Query

```javascript
// Find all admin users
db.users.find({ role: "admin" }).pretty()

// Find sweets out of stock
db.sweets.find({ quantity: 0 }).pretty()

// Find sweets by category
db.sweets.find({ category: "chocolate" }).pretty()

// Find sweets in price range
db.sweets.find({ price: { $gte: 2, $lte: 5 } }).pretty()
```

## Success Criteria

✅ All tests pass
✅ Backend server starts without errors
✅ Frontend loads successfully
✅ Can register and login
✅ Can view sweets dashboard
✅ Can search and filter sweets
✅ Can purchase sweets (as user)
✅ Can add/edit/delete sweets (as admin)
✅ Can restock inventory (as admin)
✅ MongoDB connection is stable
✅ No console errors in browser
✅ Responsive design works on different screen sizes

## Next Steps

Once everything is verified:

1. Read the complete documentation in README.md
2. Explore the code structure
3. Review the TDD_REPORT.md to understand the testing approach
4. Try adding new features using TDD
5. Deploy to production (see README.md deployment section)

## Getting Help

If you encounter issues not covered here:

1. Check the README.md for detailed documentation
2. Review the error messages carefully
3. Check MongoDB and Node.js logs
4. Verify all environment variables are set correctly
5. Ensure all dependencies are installed

## Clean Installation

If you need to start fresh:

```bash
# Backend
cd backend
rm -rf node_modules
rm package-lock.json
npm install

# Frontend
cd frontend
rm -rf node_modules
rm package-lock.json
npm install

# Clear MongoDB database
mongo sweet_shop --eval "db.dropDatabase()"
```

---

**Installation Complete!** 🎉

You're now ready to use the Sweet Shop Management System.
