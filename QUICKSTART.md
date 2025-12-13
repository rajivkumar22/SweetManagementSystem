# Quick Start Guide - Sweet Shop Management System

## 🚀 Quick Setup (5 Minutes)

### Step 1: Install Backend Dependencies
```bash
cd backend
npm install
```

### Step 2: Start MongoDB
```bash
# Make sure MongoDB is running
mongod
```

### Step 3: Start Backend Server
```bash
# In the backend directory
npm run dev
```
✅ Backend should be running on http://localhost:5000

### Step 4: Install Frontend Dependencies (New Terminal)
```bash
cd frontend
npm install
```

### Step 5: Start Frontend
```bash
# In the frontend directory
npm start
```
✅ Frontend should open automatically at http://localhost:3000

## 🎯 First Steps

### 1. Register an Account
- Click "Register here" on the login page
- Fill in your details
- You'll be automatically logged in

### 2. View the Dashboard
- See all available sweets
- Try the search and filter features

### 3. Purchase a Sweet
- Click "Purchase" button on any sweet
- Watch the quantity decrease

### 4. Create an Admin Account (Optional)
To test admin features:

1. Register a normal account first
2. Open MongoDB Compass or mongo shell
3. Find your user and update the role:

```javascript
// In MongoDB
use sweet_shop
db.users.updateOne(
  { email: "youremail@example.com" },
  { $set: { role: "admin" } }
)
```

4. Logout and login again
5. You'll see the "Manage Sweets" button

## 🧪 Run Tests

```bash
cd backend
npm test
```

## 📝 Default Test Accounts

After running tests, you can create these accounts:

**Regular User:**
- Email: user@example.com
- Password: password123

**Admin User:**
- Email: admin@example.com
- Password: password123
- Role: admin (manually set in database)

## 🎨 Features to Try

### As a Regular User:
1. Browse sweets catalog
2. Search by name: try "chocolate"
3. Filter by category: select "chocolate"
4. Filter by price: set min/max values
5. Purchase a sweet (quantity decreases)
6. Try to purchase when out of stock (button disabled)

### As an Admin:
1. Click "Manage Sweets" button
2. Add a new sweet
3. Edit existing sweet
4. Restock inventory
5. Delete a sweet

## 🐛 Common Issues

### "Cannot connect to MongoDB"
- Make sure MongoDB is installed and running
- Check if it's running on default port 27017

### "Port 3000 already in use"
- The app will offer to run on port 3001
- Or close the application using port 3000

### "Port 5000 already in use"
- Change PORT in backend/.env file
- Update proxy in frontend/package.json

## 📚 API Endpoints Quick Reference

### Authentication
- POST /api/auth/register - Register new user
- POST /api/auth/login - Login user

### Sweets (All require authentication)
- GET /api/sweets - Get all sweets
- GET /api/sweets/search - Search sweets
- POST /api/sweets - Create sweet (admin)
- PUT /api/sweets/:id - Update sweet (admin)
- DELETE /api/sweets/:id - Delete sweet (admin)

### Inventory
- POST /api/sweets/:id/purchase - Purchase sweet
- POST /api/sweets/:id/restock - Restock (admin)

## 🎓 Sample Data

Here's some sample data you can use to populate your database:

```javascript
// Sample sweets to add via Admin Panel
[
  {
    name: "Milk Chocolate Bar",
    category: "chocolate",
    price: 2.99,
    quantity: 50,
    description: "Smooth and creamy milk chocolate"
  },
  {
    name: "Sour Gummy Worms",
    category: "gummy",
    price: 1.99,
    quantity: 100,
    description: "Tangy and chewy gummy worms"
  },
  {
    name: "Rainbow Lollipop",
    category: "lollipop",
    price: 0.99,
    quantity: 75,
    description: "Colorful swirl lollipop"
  },
  {
    name: "Chocolate Chip Cookies",
    category: "cookie",
    price: 3.49,
    quantity: 30,
    description: "Freshly baked cookies"
  },
  {
    name: "Red Velvet Cake",
    category: "cake",
    price: 4.99,
    quantity: 10,
    description: "Rich red velvet cake slice"
  }
]
```

## ✅ Verification Checklist

After setup, verify:

- [ ] Backend server is running (http://localhost:5000/health should return OK)
- [ ] Frontend is accessible (http://localhost:3000)
- [ ] Can register a new user
- [ ] Can login successfully
- [ ] Can view sweets dashboard
- [ ] Can search and filter sweets
- [ ] Can purchase a sweet
- [ ] Tests pass (npm test in backend)

## 💡 Tips

1. **Keep both terminals open** - one for backend, one for frontend
2. **Check console logs** - they show useful debugging information
3. **Use MongoDB Compass** - for easier database visualization
4. **Test the API** - use the test suite to verify functionality

## 🆘 Need Help?

Check the main README.md for:
- Detailed API documentation
- Architecture overview
- Troubleshooting guide
- Deployment instructions

---

Happy Testing! 🎉
