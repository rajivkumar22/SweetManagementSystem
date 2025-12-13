require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./src/models/User');
const Sweet = require('./src/models/Sweet');

const seedData = async () => {
  try {
    // Connect to database
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await Sweet.deleteMany({});
    console.log('Cleared existing data');

    // Create admin user
    const admin = await User.create({
      username: 'admin',
      email: 'admin@sweetshop.com',
      password: 'admin123',
      role: 'admin'
    });
    console.log('✓ Admin user created');
    console.log('  Email: admin@sweetshop.com');
    console.log('  Password: admin123');

    // Create regular user
    const user = await User.create({
      username: 'Rky1',
      email: 'rky1@example.com',
      password: 'password123',
      role: 'user'
    });
    console.log('✓ Regular user created');
    console.log('  Email: rky1@example.com');
    console.log('  Password: password123');

    // Create sample sweets
    const sweets = await Sweet.create([
      {
        name: 'Milk Chocolate Bar',
        category: 'chocolate',
        price: 199,
        quantity: 50,
        description: 'Smooth and creamy milk chocolate'
      },
      {
        name: 'Dark Chocolate Premium',
        category: 'chocolate',
        price: 299,
        quantity: 30,
        description: 'Rich 70% dark chocolate bar'
      },
      {
        name: 'Sour Gummy Worms',
        category: 'gummy',
        price: 149,
        quantity: 100,
        description: 'Tangy and chewy gummy worms'
      },
      {
        name: 'Rainbow Lollipop',
        category: 'lollipop',
        price: 49,
        quantity: 75,
        description: 'Colorful swirl lollipop'
      },
      {
        name: 'Chocolate Chip Cookies',
        category: 'cookie',
        price: 249,
        quantity: 25,
        description: 'Freshly baked cookies with chocolate chips'
      },
      {
        name: 'Red Velvet Cake Slice',
        category: 'cake',
        price: 399,
        quantity: 10,
        description: 'Rich red velvet cake with cream cheese frosting'
      },
      {
        name: 'Strawberry Candy',
        category: 'candy',
        price: 99,
        quantity: 80,
        description: 'Sweet strawberry flavored hard candy'
      },
      {
        name: 'Caramel Delight',
        category: 'other',
        price: 179,
        quantity: 40,
        description: 'Soft caramel squares'
      },
      {
        name: 'Out of Stock Item',
        category: 'chocolate',
        price: 449,
        quantity: 0,
        description: 'This item is out of stock to test purchase validation'
      }
    ]);

    console.log(`✓ ${sweets.length} sweets created`);

    console.log('\n================================');
    console.log('Seed Data Complete!');
    console.log('================================');
    console.log('\nYou can now:');
    console.log('1. Login as regular user: rky1@example.com / password123');
    console.log('2. Login as admin: admin@sweetshop.com / admin123');
    console.log('3. View sweets in dashboard');
    console.log('4. Test purchase functionality');
    console.log('5. Test admin features (add, edit, delete, restock)');
    
    process.exit(0);
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
};

seedData();
