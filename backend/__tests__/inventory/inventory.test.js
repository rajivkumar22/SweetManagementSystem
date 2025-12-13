const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../../src/app');
const User = require('../../src/models/User');
const Sweet = require('../../src/models/Sweet');

describe('Inventory Management API', () => {
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

    // Create a test sweet with stock
    const sweet = await Sweet.create({
      name: 'Chocolate Bar',
      category: 'chocolate',
      price: 2.99,
      quantity: 10
    });
    testSweetId = sweet._id;
  });

  describe('POST /api/sweets/:id/purchase', () => {
    it('should allow user to purchase a sweet', async () => {
      const response = await request(app)
        .post(`/api/sweets/${testSweetId}/purchase`)
        .set('Authorization', `Bearer ${userToken}`)
        .send({ quantity: 2 })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('quantity', 8);
      expect(response.body.message).toContain('purchased successfully');
    });

    it('should decrease quantity after purchase', async () => {
      await request(app)
        .post(`/api/sweets/${testSweetId}/purchase`)
        .set('Authorization', `Bearer ${userToken}`)
        .send({ quantity: 3 });

      const sweet = await Sweet.findById(testSweetId);
      expect(sweet.quantity).toBe(7);
    });

    it('should not allow purchase when quantity is zero', async () => {
      // Update sweet to have 0 quantity
      await Sweet.findByIdAndUpdate(testSweetId, { quantity: 0 });

      const response = await request(app)
        .post(`/api/sweets/${testSweetId}/purchase`)
        .set('Authorization', `Bearer ${userToken}`)
        .send({ quantity: 1 })
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('out of stock');
    });

    it('should not allow purchase of more than available quantity', async () => {
      const response = await request(app)
        .post(`/api/sweets/${testSweetId}/purchase`)
        .set('Authorization', `Bearer ${userToken}`)
        .send({ quantity: 15 })
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('insufficient stock');
    });

    it('should allow purchase without quantity (defaults to 1)', async () => {
      const response = await request(app)
        .post(`/api/sweets/${testSweetId}/purchase`)
        .set('Authorization', `Bearer ${userToken}`)
        .send({})
        .expect(200);

      expect(response.body.success).toBe(true);
    });

    it('should not allow purchase without authentication', async () => {
      const response = await request(app)
        .post(`/api/sweets/${testSweetId}/purchase`)
        .send({ quantity: 1 })
        .expect(401);

      expect(response.body.success).toBe(false);
    });

    it('should default to quantity 1 if not specified', async () => {
      const response = await request(app)
        .post(`/api/sweets/${testSweetId}/purchase`)
        .set('Authorization', `Bearer ${userToken}`)
        .send({ quantity: 1 })
        .expect(200);

      expect(response.body.success).toBe(true);
      const sweet = await Sweet.findById(testSweetId);
      expect(sweet.quantity).toBe(9);
    });
  });

  describe('POST /api/sweets/:id/restock', () => {
    it('should allow admin to restock sweet', async () => {
      const response = await request(app)
        .post(`/api/sweets/${testSweetId}/restock`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ quantity: 20 })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('quantity', 30);
      expect(response.body.message).toContain('restocked successfully');
    });

    it('should increase quantity after restock', async () => {
      await request(app)
        .post(`/api/sweets/${testSweetId}/restock`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ quantity: 15 });

      const sweet = await Sweet.findById(testSweetId);
      expect(sweet.quantity).toBe(25);
    });

    it('should not allow restock without admin privileges', async () => {
      const response = await request(app)
        .post(`/api/sweets/${testSweetId}/restock`)
        .set('Authorization', `Bearer ${userToken}`)
        .send({ quantity: 10 })
        .expect(403);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('Admin privileges required');
    });

    it('should not allow restock without quantity', async () => {
      const response = await request(app)
        .post(`/api/sweets/${testSweetId}/restock`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({})
        .expect(400);

      expect(response.body.success).toBe(false);
    });

    it('should not allow restock with negative quantity', async () => {
      const response = await request(app)
        .post(`/api/sweets/${testSweetId}/restock`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ quantity: -5 })
        .expect(400);

      expect(response.body.success).toBe(false);
    });

    it('should not allow restock without authentication', async () => {
      const response = await request(app)
        .post(`/api/sweets/${testSweetId}/restock`)
        .send({ quantity: 10 })
        .expect(401);

      expect(response.body.success).toBe(false);
    });
  });
});
