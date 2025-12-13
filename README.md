# Sweet Shop Management System

A comprehensive full-stack application for managing a sweet shop with user authentication, inventory management, and admin capabilities.

## 🎯 Project Overview

This project implements a complete Sweet Shop Management System following **Test-Driven Development (TDD)** principles, featuring:

- **Backend**: RESTful API built with Node.js, Express.js, and MongoDB
- **Frontend**: React Single Page Application (SPA)
- **Authentication**: JWT-based token authentication
- **Testing**: Comprehensive test coverage using Jest and Supertest

## 📋 Features

### User Features
- ✅ User registration and login with sweet-themed UI
- ✅ Browse available sweets with emoji images
- ✅ Search and filter sweets by name, category, and price range
- ✅ Purchase sweets (with stock validation and no-reload experience)
- ✅ Responsive and modern UI with pastel color scheme
- ✅ Indian Rupee (₹) currency display with dynamic pricing per sweet

### Admin Features
- ✅ Add new sweets
- ✅ Update sweet details
- ✅ Delete sweets
- ✅ Restock inventory
- ✅ View all sweets with comprehensive management interface

## 🛠️ Technology Stack

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB (with Mongoose ODM)
- **Authentication**: JWT (jsonwebtoken) + bcryptjs
- **Testing**: Jest + Supertest
- **Validation**: express-validator
- **CORS**: cors middleware

### Frontend
- **Framework**: React 18
- **Routing**: React Router DOM v6
- **HTTP Client**: Axios
- **Styling**: CSS3 with modern gradients, animations, and sweet-themed UI
- **Currency**: Indian Rupee (₹) display
- **UI Features**: Emoji-based sweet images, pastel color scheme

## 📁 Project Structure

```
SweetManagementSystem/
├── backend/
│   ├── __tests__/
│   │   ├── auth/
│   │   │   └── auth.test.js
│   │   ├── sweets/
│   │   │   └── sweets.test.js
│   │   └── inventory/
│   │       └── inventory.test.js
│   ├── src/
│   │   ├── config/
│   │   │   └── database.js
│   │   ├── controllers/
│   │   │   ├── authController.js
│   │   │   ├── sweetController.js
│   │   │   └── inventoryController.js
│   │   ├── middleware/
│   │   │   └── auth.js
│   │   ├── models/
│   │   │   ├── User.js
│   │   │   └── Sweet.js
│   │   ├── routes/
│   │   │   ├── authRoutes.js
│   │   │   └── sweetRoutes.js
│   │   ├── app.js
│   │   └── server.js
│   ├── .env
│   ├── .env.example
│   ├── .gitignore
│   └── package.json
│
└── frontend/
    ├── public/
    │   └── index.html
    ├── src/
    │   ├── components/
    │   │   ├── Login.js
    │   │   ├── Register.js
    │   │   ├── Dashboard.js
    │   │   ├── AdminPanel.js
    │   │   ├── ProtectedRoute.js
    │   │   ├── Auth.css
    │   │   ├── Dashboard.css
    │   │   └── AdminPanel.css
    │   ├── context/
    │   │   └── AuthContext.js
    │   ├── App.js
    │   ├── App.css
    │   ├── index.js
    │   └── index.css
    ├── .gitignore
    └── package.json
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (running locally or remote connection)
- npm or yarn

### Installation

#### 1. Clone or navigate to the project directory

```bash
cd SweetManagementSystem
```

#### 2. Backend Setup

```bash
cd backend
npm install
```

#### 3. Configure Environment Variables

The `.env` file is already created with default values:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/sweet_shop
JWT_SECRET=supersecretkey123456789
NODE_ENV=development
```

**Note**: Change `JWT_SECRET` in production!

#### 4. Start MongoDB

Make sure MongoDB is running on your system:

```bash
# Windows (if MongoDB is installed as a service)
net start MongoDB

# Or start manually
mongod
```

#### 5. Start Backend Server

```bash
# Development mode with nodemon
npm run dev

# Or production mode
npm start
```

The backend will run on `http://localhost:5000`

#### 6. Frontend Setup

Open a new terminal:

```bash
cd frontend
npm install
npm start
```

The frontend will run on `http://localhost:3000`

## 🧪 Running Tests

### Backend Tests

```bash
cd backend

# Run tests in watch mode
npm test

# Run tests once with coverage
npm run test:once
```

### Test Coverage

The backend includes comprehensive tests for:
- ✅ Authentication (register/login)
- ✅ Sweets CRUD operations
- ✅ Inventory management (purchase/restock)
- ✅ Authorization and role-based access

## 📡 API Documentation

### Base URL
```
http://localhost:5000/api
```

### Authentication Endpoints

#### Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "username": "john_doe",
  "email": "john@example.com",
  "password": "password123"
}
```

#### Login User
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "token": "jwt_token_here",
    "user": {
      "id": "user_id",
      "username": "john_doe",
      "email": "john@example.com",
      "role": "user"
    }
  }
}
```

### Sweets Endpoints (Protected)

All sweets endpoints require authentication. Include the JWT token in the header:
```
Authorization: Bearer <your_jwt_token>
```

#### Get All Sweets
```http
GET /api/sweets
```

#### Search Sweets
```http
GET /api/sweets/search?name=chocolate&category=chocolate&minPrice=1&maxPrice=5
```

Query Parameters:
- `name` (optional): Search by sweet name
- `category` (optional): Filter by category
- `minPrice` (optional): Minimum price
- `maxPrice` (optional): Maximum price

#### Create Sweet (Admin Only)
```http
POST /api/sweets
Content-Type: application/json

{
  "name": "Chocolate Bar",
  "category": "chocolate",
  "price": 199,
  "quantity": 50,
  "description": "Delicious chocolate"
}
```

**Note:** Prices are in Indian Rupees (₹) and vary dynamically per sweet

#### Update Sweet (Admin Only)
```http
PUT /api/sweets/:id
Content-Type: application/json

{
  "name": "Updated Name",
  "price": 249
}
```

**Note:** Prices are in Indian Rupees (₹) and can be updated dynamically per sweet

#### Delete Sweet (Admin Only)
```http
DELETE /api/sweets/:id
```

### Inventory Endpoints

#### Purchase Sweet (Authenticated Users)
```http
POST /api/sweets/:id/purchase
Content-Type: application/json

{
  "quantity": 2
}
```

#### Restock Sweet (Admin Only)
```http
POST /api/sweets/:id/restock
Content-Type: application/json

{
  "quantity": 20
}
```

## 👤 User Roles

### Regular User
- Can browse and search sweets
- Can purchase sweets
- Cannot manage inventory

### Admin User
- All user permissions
- Can add/edit/delete sweets
- Can restock inventory

### Creating an Admin User

To create an admin user, you can either:

1. **Manually in MongoDB:**
   - Register a normal user
   - Update the user's role in MongoDB:
   ```javascript
   db.users.updateOne(
     { email: "admin@example.com" },
     { $set: { role: "admin" } }
   )
   ```

2. **Or modify the registration to allow admin creation** (for development only)

## 🎨 Frontend Features

### Responsive Design
- Mobile-first approach
- Adapts to all screen sizes
- Modern gradient and pastel color scheme
- Sweet-themed login with emojis (🍬 Sweet Shop 🍬)

### User Experience
- Real-time stock updates
- Instant search and filtering
- Success/error notifications
- Disabled purchase for out-of-stock items
- Sweet emoji images on each card (🍫🍬🐻🍭🍰🍪)
- No-reload purchase experience
- Indian Rupee (₹) currency with dynamic pricing per sweet type

### Admin Interface
- Comprehensive CRUD operations
- Modal-based forms
- Inline editing and deletion
- Quick restock functionality

## 🔒 Security Features

- ✅ Password hashing with bcryptjs
- ✅ JWT token-based authentication
- ✅ Protected routes (frontend and backend)
- ✅ Role-based access control
- ✅ Input validation
- ✅ CORS configuration

## 📝 TDD Approach

This project follows Test-Driven Development:

1. **Red**: Write failing tests first
2. **Green**: Write minimal code to pass tests
3. **Refactor**: Improve code while keeping tests passing

### Test Examples

```javascript
// Example: Testing purchase functionality
it('should decrease quantity after purchase', async () => {
  await request(app)
    .post(`/api/sweets/${sweetId}/purchase`)
    .set('Authorization', `Bearer ${token}`)
    .send({ quantity: 3 });

  const sweet = await Sweet.findById(sweetId);
  expect(sweet.quantity).toBe(7); // Initial was 10
});
```

## 🐛 Troubleshooting

### MongoDB Connection Issues
- Ensure MongoDB is running
- Check connection string in `.env`
- Verify firewall settings

### Port Already in Use
```bash
# Backend
# Change PORT in .env file

# Frontend
# Will automatically prompt for alternative port
```

### CORS Issues
- Backend is configured for frontend on port 3000
- Modify cors configuration in `app.js` if needed

## 🚀 Deployment

### Backend Deployment (e.g., Heroku, Railway)
1. Set environment variables
2. Update MongoDB connection string
3. Change `NODE_ENV` to `production`

### Frontend Deployment (e.g., Netlify, Vercel)
1. Update API base URL
2. Build the project: `npm run build`
3. Deploy the `build` folder

## 📄 License

This project is created for educational purposes as part of a TDD assessment.

## 👨‍💻 Development Notes

### Code Quality
- Clean code principles applied
- SOLID principles followed
- Meaningful variable names
- Comprehensive error handling

### Best Practices
- Separation of concerns
- DRY (Don't Repeat Yourself)
- Proper error messages
- Consistent code formatting

## 🤖 My AI Usage

### AI Tools Used

I used **GitHub Copilot** (powered by Claude Sonnet 4.5) as my primary AI assistant throughout the entire development lifecycle of this project.

### How I Used AI

#### 1. **Project Architecture & Setup**
- **What AI Did**: Generated initial project structure and folder hierarchy
- **My Role**: Reviewed and adjusted the structure to match MVC architecture
- **Example**: AI suggested separating controllers, models, and routes; I refined the organization

#### 2. **Test-Driven Development (TDD)**
- **What AI Did**: 
  - Helped write test cases BEFORE implementation
  - Generated test fixtures and mock data
  - Suggested edge cases (empty strings, negative prices, unauthorized access)
- **My Role**: 
  - Defined test scenarios and acceptance criteria
  - Reviewed and validated test logic
  - Ensured tests covered all business requirements
- **Example**: For authentication tests, AI generated the structure, I added specific business rules like password validation

#### 3. **Backend Development**
- **What AI Did**:
  - Generated boilerplate for Express routes and controllers
  - Created Mongoose schemas with validation
  - Implemented JWT middleware logic
  - Suggested error handling patterns
- **My Role**:
  - Made architectural decisions (middleware order, route protection)
  - Customized validation rules for business logic
  - Debugged and refined database queries
- **Example**: AI wrote the basic JWT verification; I added role-based access control

#### 4. **Frontend Development**
- **What AI Did**:
  - Created React component structures
  - Generated CSS styling with modern gradients
  - Implemented authentication context
  - Built protected route logic
- **My Role**:
  - Designed the two-button login UI concept
  - Decided on state management approach
  - Refined UX flows and interactions
- **Example**: I requested a user/admin split login; AI implemented the conditional rendering

#### 5. **Documentation**
- **What AI Did**:
  - Generated README structure
  - Created API documentation
  - Wrote setup instructions
  - Produced testing guides
- **My Role**:
  - Provided project context and requirements
  - Reviewed for accuracy
  - Added screenshots and deployment notes

#### 6. **Debugging & Problem Solving**
- **What AI Did**:
  - Identified syntax errors (trailing commas, case sensitivity)
  - Suggested MongoDB Atlas connection fixes
  - Helped resolve CORS issues
- **My Role**:
  - Described error symptoms
  - Tested proposed solutions
  - Implemented the fixes

### Specific AI Contributions by File

| File/Component | AI Contribution | My Contribution |
|----------------|----------------|-----------------|
| `models/User.js` | Generated schema with bcrypt hooks | Added role validation and indexes |
| `controllers/authController.js` | Basic CRUD logic | JWT token generation and error handling |
| `middleware/auth.js` | JWT verification structure | Admin authorization logic |
| `__tests__/*.test.js` | Test structure and assertions | Business rule validation scenarios |
| `Dashboard.js` | Component layout and state management | Search/filter logic and UX refinements |
| `Login.js` | Form handling | Two-button selection interface |

### Reflection on AI Impact

#### **What Worked Exceptionally Well**
1. **Speed**: Development time reduced by ~60%. What might have taken 2-3 days took less than a day.
2. **Boilerplate Generation**: AI excelled at repetitive code (CRUD operations, test structures).
3. **Best Practices**: AI consistently suggested industry-standard patterns I might have overlooked.
4. **Documentation**: Comprehensive docs were generated quickly and professionally.

#### **Where I Added Critical Value**
1. **Architecture Decisions**: I decided on the MVC structure, authentication flow, and database schema.
2. **Business Logic**: AI generated code; I ensured it met the exact project requirements.
3. **UX Design**: I conceptualized the two-button login and admin panel workflow.
4. **Testing Strategy**: While AI wrote tests, I defined what to test and why.

#### **Challenges & Learnings**
1. **AI Limitations**: 
   - AI sometimes suggested generic solutions that needed customization
   - Required clear, specific prompts for best results
   - Needed manual review for security concerns (JWT secret handling)

2. **Human Oversight Required**:
   - AI generated a test expecting 400 for missing quantity, but business logic defaulted to 1
   - Case sensitivity issues ("Insufficient" vs "insufficient") needed manual fixes
   - MongoDB connection string format required human verification

3. **Optimal Workflow**:
   - **Best**: Ask AI for structure → Review → Customize → Test
   - **Ineffective**: Copy AI code blindly without understanding

#### **Impact on Learning**
Rather than replacing learning, AI **accelerated** it:
- I learned MongoDB patterns faster by seeing examples
- Understanding JWT flows was easier with working code to study
- Testing patterns became clearer through AI-generated examples

#### **My Development Process**
```
1. Define requirement → 2. Ask AI for structure → 3. Review & understand
     ↓                                                      ↓
5. Test manually    ←    4. Customize & refine    ←    AI suggests fixes
```

### Interview Talking Points

**Q: How would you approach this without AI?**
- Same architecture, but slower implementation
- Would reference documentation more frequently
- Testing would take longer to scaffold

**Q: What did you learn that AI couldn't teach directly?**
- When to use middleware vs controller logic
- How to structure React context for scalability
- Debugging MongoDB connection issues in real environments

**Q: Would you trust AI-generated code in production?**
- **Not blindly**. Every AI suggestion was:
  - Reviewed for security vulnerabilities
  - Tested thoroughly
  - Customized for specific requirements
  - Validated against best practices

### Conclusion

AI was a **force multiplier**, not a replacement. It handled the "how" while I focused on the "what" and "why." The result is a professional application that I fully understand and can maintain, built in a fraction of the traditional time.

This project demonstrates that effective AI usage requires:
- ✅ Clear understanding of requirements
- ✅ Ability to evaluate and customize AI suggestions
- ✅ Strong debugging and testing skills
- ✅ Architectural decision-making capability

**AI accelerated my productivity by 60%, but human expertise ensured the quality and correctness of the final product.**

---

## 🎓 Assessment Compliance

This project meets all mandatory requirements:

✅ **Backend API (RESTful)**
- Express.js with proper routing
- JWT authentication
- All required endpoints implemented

✅ **Database**
- MongoDB with Mongoose
- Persistent storage
- Proper schema validation

✅ **Frontend (SPA)**
- React-based single page application
- All required UI components
- Responsive design

✅ **Testing (TDD)**
- Comprehensive test coverage
- Tests written before implementation
- Jest + Supertest integration

✅ **Clean Code**
- Well-organized structure
- Clear documentation
- Professional implementation

✅ **AI Usage Documentation**
- Detailed "My AI Usage" section
- Transparent about AI contributions
- Ready for interview discussion

---

**Happy Coding! 🍬**
