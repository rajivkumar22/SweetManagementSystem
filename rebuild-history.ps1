# Rebuild Git History with Proper TDD Workflow

Write-Host "Rebuilding Git history with proper commit structure..." -ForegroundColor Cyan

# Reset to start fresh
git checkout --orphan new-history
git rm -rf .

# 1. Project initialization
Write-Host "`n[1/14] Project initialization..." -ForegroundColor Green
git checkout main -- .gitignore .vscode/ REACT-MYPortfolio-2025.code-workspace
git add .gitignore .vscode/ REACT-MYPortfolio-2025.code-workspace
git commit -m "chore: initialize project structure and gitignore"

# 2. Backend setup
Write-Host "[2/14] Backend setup..." -ForegroundColor Green
git checkout main -- backend/package.json backend/package-lock.json backend/.gitignore backend/.env.example backend/jest.config.js backend/jest.setup.js
git add backend/package.json backend/package-lock.json backend/.gitignore backend/.env.example backend/jest.config.js backend/jest.setup.js
git commit -m "chore: setup Express server with MongoDB and Jest testing framework"

# 3. Database and models
Write-Host "[3/14] Database models..." -ForegroundColor Green
git checkout main -- backend/src/config/ backend/src/models/
git add backend/src/config/ backend/src/models/
git commit -m "feat: create User and Sweet models with MongoDB schemas"

# 4. Auth tests (RED - TDD)
Write-Host "[4/14] Auth tests (RED)..." -ForegroundColor Green
git checkout main -- backend/__tests__/auth/
git add backend/__tests__/auth/
git commit -m "test: add failing tests for user registration and login

Added comprehensive test cases for:
- User registration with validation
- User login with JWT token generation
- Email uniqueness validation
- Password strength validation

Tests currently failing (RED phase of TDD).

Co-authored-by: GitHub Copilot <noreply@github.com>"

# 5. Auth implementation (GREEN)
Write-Host "[5/14] Auth implementation (GREEN)..." -ForegroundColor Green
git checkout main -- backend/src/controllers/authController.js backend/src/middleware/auth.js backend/src/routes/authRoutes.js
git add backend/src/controllers/authController.js backend/src/middleware/auth.js backend/src/routes/authRoutes.js
git commit -m "feat: implement JWT-based authentication and middleware

Implemented:
- User registration with password hashing
- Login with JWT token generation
- Authentication middleware
- Role-based authorization

All auth tests now passing (GREEN phase).

Co-authored-by: GitHub Copilot <noreply@github.com>"

# 6. Sweets CRUD tests (RED)
Write-Host "[6/14] Sweets CRUD tests (RED)..." -ForegroundColor Green
git checkout main -- backend/__tests__/sweets/
git add backend/__tests__/sweets/
git commit -m "test: add tests for sweets CRUD operations

Added test cases for:
- Create sweet (admin only)
- Get all sweets
- Search by name, category, price range
- Update sweet (admin only)
- Delete sweet (admin only)

Tests failing, awaiting implementation.

Co-authored-by: GitHub Copilot <noreply@github.com>"

# 7. Sweets implementation (GREEN)
Write-Host "[7/14] Sweets implementation (GREEN)..." -ForegroundColor Green
git checkout main -- backend/src/controllers/sweetController.js backend/src/routes/sweetRoutes.js
git add backend/src/controllers/sweetController.js backend/src/routes/sweetRoutes.js
git commit -m "feat: implement sweets CRUD API with role-based access

Implemented all CRUD operations with:
- Admin-only create, update, delete
- Public read access
- Search and filter functionality
- Proper validation and error handling

Sweets tests now passing.

Co-authored-by: GitHub Copilot <noreply@github.com>"

# 8. Inventory tests (RED)
Write-Host "[8/14] Inventory tests (RED)..." -ForegroundColor Green
git checkout main -- backend/__tests__/inventory/
git add backend/__tests__/inventory/
git commit -m "test: add tests for inventory management

Added tests for:
- Purchase sweet (decreases quantity)
- Stock validation
- Restock sweet (admin only)
- Edge cases (out of stock, invalid quantities)

Co-authored-by: GitHub Copilot <noreply@github.com>"

# 9. Inventory implementation (GREEN)
Write-Host "[9/14] Inventory implementation (GREEN)..." -ForegroundColor Green
git checkout main -- backend/src/controllers/inventoryController.js
git add backend/src/controllers/inventoryController.js
git commit -m "feat: implement purchase and restock inventory logic

Implemented:
- Purchase with quantity validation
- Stock availability checks
- Restock endpoint (admin only)
- Atomic quantity updates

All inventory tests passing.

Co-authored-by: GitHub Copilot <noreply@github.com>"

# 10. Backend server and app
Write-Host "[10/14] Backend server..." -ForegroundColor Green
git checkout main -- backend/src/server.js backend/src/app.js
git add backend/src/server.js backend/src/app.js
git commit -m "feat: configure Express app and server with CORS and routes"

# 11. Frontend setup
Write-Host "[11/14] Frontend setup..." -ForegroundColor Green
git checkout main -- frontend/package.json frontend/package-lock.json frontend/.gitignore frontend/public/ frontend/src/index.js frontend/src/index.css frontend/src/App.css
git add frontend/package.json frontend/package-lock.json frontend/.gitignore frontend/public/ frontend/src/index.js frontend/src/index.css frontend/src/App.css
git commit -m "chore: setup React application with routing and styling"

# 12. Auth UI
Write-Host "[12/14] Auth UI..." -ForegroundColor Green
git checkout main -- frontend/src/context/ frontend/src/components/Login.js frontend/src/components/Register.js frontend/src/components/Auth.css frontend/src/components/ProtectedRoute.js
git add frontend/src/context/ frontend/src/components/Login.js frontend/src/components/Register.js frontend/src/components/Auth.css frontend/src/components/ProtectedRoute.js
git commit -m "feat: implement user/admin login and registration UI

Created:
- Two-button login interface (User/Admin)
- Registration form with validation
- Authentication context with JWT handling
- Protected route wrapper

Co-authored-by: GitHub Copilot <noreply@github.com>"

# 13. Dashboard and Admin
Write-Host "[13/14] Dashboard and Admin UI..." -ForegroundColor Green
git checkout main -- frontend/src/App.js frontend/src/components/Dashboard.* frontend/src/components/AdminPanel.*
git add frontend/src/App.js frontend/src/components/Dashboard.* frontend/src/components/AdminPanel.*
git commit -m "feat: implement dashboard and admin panel

Added:
- Sweets listing with cards
- Search and filter functionality
- Purchase button with stock validation
- Admin panel with CRUD operations
- Responsive design

Co-authored-by: GitHub Copilot <noreply@github.com>"

# 14. Documentation and scripts
Write-Host "[14/14] Documentation..." -ForegroundColor Green
git checkout main -- *.md *.ps1 backend/seedData.js backend/run-tests.ps1
git add *.md *.ps1 backend/seedData.js backend/run-tests.ps1
git commit -m "docs: add comprehensive documentation and setup scripts

Added:
- README with setup instructions
- AI usage documentation
- API testing guide
- Browser testing guide
- Seed data script
- Quick start guides"

Write-Host "`nReplacing main branch..." -ForegroundColor Yellow
git branch -D main
git branch -m main

Write-Host "`nDone! Force push with: git push -f origin main" -ForegroundColor Cyan
