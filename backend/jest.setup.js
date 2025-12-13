// Set test environment variables
require('dotenv').config();
process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = process.env.JWT_SECRET || 'testsecret123456789';
process.env.MONGODB_URI = process.env.MONGODB_URI_TEST || process.env.MONGODB_URI;
