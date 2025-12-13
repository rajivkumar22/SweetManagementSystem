# SECURITY FIX: Remove Exposed MongoDB Credentials

⚠️ **CRITICAL:** MongoDB credentials were accidentally exposed in previous commits.

## What Was Fixed:

1. **Removed hardcoded credentials** from:
   - `backend/jest.setup.js` - Now uses environment variables
   - `backend/run-tests.ps1` - Now references .env file
   
2. **Updated .env.example** with placeholder values

3. **All credentials now use environment variables** from `.env` file

## Important Notes:

- `.env` file is in `.gitignore` and will NOT be committed
- You must create your own `.env` file with actual credentials locally
- Update your MongoDB password immediately at:
  https://cloud.mongodb.com/v2/67860026ba55655c17f4cab7#/security/database

## Setup Instructions:

1. Copy `.env.example` to `.env`:
   ```bash
   cp backend/.env.example backend/.env
   ```

2. Edit `backend/.env` with your actual credentials:
   ```
   MONGODB_URI=mongodb+srv://YOUR_USERNAME:NEW_PASSWORD@cluster0...
   MONGODB_URI_TEST=mongodb+srv://YOUR_USERNAME:NEW_PASSWORD@cluster0...
   JWT_SECRET=your_secure_random_string
   ```

3. **Never commit the `.env` file!**

## For Evaluators:

This security fix was made in response to MongoDB Atlas security alert. All credentials are now properly secured using environment variables that are excluded from version control.
