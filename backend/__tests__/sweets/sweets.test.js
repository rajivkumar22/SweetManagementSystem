const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../../src/app');
const User = require('../../src/models/User');
const Sweet = require('../../src/models/Sweet');

describe('Sweets API', () => {
  let userToken;
  let adminToken;
  let testSweetId;

  beforeAll(async () => {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/sweet_shop_test');
  });

  afterAll(async () => {
    await User.deleteMany({});
    await Sweet.deleteMany({});
    await mongoose.connection.close();
  });

  beforeEach(async () => {
    // Clear database
    await User.deleteMany({});
    await Sweet.deleteMany({});

    // Create regular user
    const userResponse = await request(app)
      .post('/api/auth/register')
      .send({
        username: 'testuser',
        email: 'user@example.com',
        password: 'password123'
      });
    userToken = userResponse.body.data.token;

    // Create admin user
    const admin = await User.create({
      username: 'admin',
      email: 'admin@example.com',
      password: 'password123',
      role: 'admin'
    });
    const jwt = require('jsonwebtoken');
    adminToken = jwt.sign({ id: admin._id }, process.env.JWT_SECRET || 'supersecretkey123456789', {
      expiresIn: '7d'
    });

    // Create a test sweet
    const sweet = await Sweet.create({
      name: 'Chocolate Bar',
      category: 'chocolate',
      price: 2.99,
      quantity: 50,
      description: 'Delicious chocolate bar'
    });
    testSweetId = sweet._id;
  });

  describe('POST /api/sweets', () => {
    it('should create a new sweet with admin token', async () => {
      const sweetData = {
        name: 'Gummy Bears',
        category: 'gummy',
        price: 1.99,
        quantity: 100,
        description: 'Colorful gummy bears'
      };

      const response = await request(app)
        .post('/api/sweets')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(sweetData)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('name', 'Gummy Bears');
      expect(response.body.data).toHaveProperty('category', 'gummy');
      expect(response.body.data).toHaveProperty('price', 1.99);
    });

    it('should not create sweet without admin privileges', async () => {
      const sweetData = {
        name: 'Gummy Bears',
        category: 'gummy',
        price: 1.99,
        quantity: 100
      };

      const response = await request(app)
        .post('/api/sweets')
        .set('Authorization', `Bearer ${userToken}`)
        .send(sweetData)
        .expect(403);

      expect(response.body.success).toBe(false);
    });

    it('should not create sweet without authentication', async () => {
      const sweetData = {
        name: 'Gummy Bears',
        category: 'gummy',
        price: 1.99,
        quantity: 100
      };

      const response = await request(app)
        .post('/api/sweets')
        .send(sweetData)
        .expect(401);

      expect(response.body.success).toBe(false);
    });
  });

  describe('GET /api/sweets', () => {
    it('should retrieve all sweets', async () => {
      const response = await request(app)
        .get('/api/sweets')
        .set('Authorization', `Bearer ${userToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data)).toBe(true);
      expect(response.body.data.length).toBeGreaterThan(0);
    });

    it('should require authentication to get sweets', async () => {
      const response = await request(app)
        .get('/api/sweets')
        .expect(401);

      expect(response.body.success).toBe(false);
    });
  });

  describe('GET /api/sweets/search', () => {
    beforeEach(async () => {
      // Add more sweets for search testing
      await Sweet.create([
        { name: 'Milk Chocolate', category: 'chocolate', price: 3.99, quantity: 30 },
        { name: 'Dark Chocolate', category: 'chocolate', price: 4.99, quantity: 20 },
        { name: 'Sour Gummy', category: 'gummy', price: 2.49, quantity: 40 }
      ]);
    });

    it('should search sweets by name', async () => {
      const response = await request(app)
        .get('/api/sweets/search?name=chocolate')
        .set('Authorization', `Bearer ${userToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.length).toBeGreaterThan(0);
      expect(response.body.data.every(s => s.name.toLowerCase().includes('chocolate'))).toBe(true);
    });

    it('should search sweets by category', async () => {
      const response = await request(app)
        .get('/api/sweets/search?category=chocolate')
        .set('Authorization', `Bearer ${userToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.every(s => s.category === 'chocolate')).toBe(true);
    });

    it('should search sweets by price range', async () => {
      const response = await request(app)
        .get('/api/sweets/search?minPrice=2&maxPrice=4')
        .set('Authorization', `Bearer ${userToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.every(s => s.price >= 2 && s.price <= 4)).toBe(true);
    });
  });

  describe('PUT /api/sweets/:id', () => {
    it('should update sweet with admin token', async () => {
      const updateData = {
        name: 'Updated Chocolate',
        price: 3.49
      };

      const response = await request(app)
        .put(`/api/sweets/${testSweetId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send(updateData)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('name', 'Updated Chocolate');
      expect(response.body.data).toHaveProperty('price', 3.49);
    });

    it('should not update sweet without admin privileges', async () => {
      const response = await request(app)
        .put(`/api/sweets/${testSweetId}`)
        .set('Authorization', `Bearer ${userToken}`)
        .send({ name: 'Updated' })
        .expect(403);

      expect(response.body.success).toBe(false);
    });
  });

  describe('DELETE /api/sweets/:id', () => {
    it('should delete sweet with admin token', async () => {
      const response = await request(app)
        .delete(`/api/sweets/${testSweetId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);

      // Verify deletion
      const sweet = await Sweet.findById(testSweetId);
      expect(sweet).toBeNull();
    });

    it('should not delete sweet without admin privileges', async () => {
      const response = await request(app)
        .delete(`/api/sweets/${testSweetId}`)
        .set('Authorization', `Bearer ${userToken}`)
        .expect(403);

      expect(response.body.success).toBe(false);
    });
  });
});
