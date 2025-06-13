// backend/seedData.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');

dotenv.config();

const User = require('./models/User');
const Product = require('./models/Product');
const Cart = require('./models/Cart');
const Order = require('./models/Order');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB Connected');
  } catch (error) {
    console.error('Database connection error:', error);
    process.exit(1);
  }
};

// Sample Users Data
const sampleUsers = [
  {
    name: 'Admin User',
    email: 'admin@example.com',
    password: 'password123',
    role: 'admin',
    phone: '+1-555-0101',
    address: {
      street: '123 Admin Street',
      city: 'New York',
      state: 'NY',
      zipCode: '10001',
      country: 'United States'
    }
  },
  {
    name: 'John Doe',
    email: 'john@example.com',
    password: 'password123',
    role: 'user',
    phone: '+1-555-0102',
    address: {
      street: '456 Oak Avenue',
      city: 'Los Angeles',
      state: 'CA',
      zipCode: '90210',
      country: 'United States'
    }
  },
  {
    name: 'Jane Smith',
    email: 'jane@example.com',
    password: 'password123',
    role: 'user',
    phone: '+1-555-0103',
    address: {
      street: '789 Pine Road',
      city: 'Chicago',
      state: 'IL',
      zipCode: '60601',
      country: 'United States'
    }
  },
  {
    name: 'Michael Johnson',
    email: 'michael@example.com',
    password: 'password123',
    role: 'user',
    phone: '+1-555-0104',
    address: {
      street: '321 Elm Street',
      city: 'Houston',
      state: 'TX',
      zipCode: '77001',
      country: 'United States'
    }
  },
  {
    name: 'Sarah Wilson',
    email: 'sarah@example.com',
    password: 'password123',
    role: 'user',
    phone: '+1-555-0105',
    address: {
      street: '654 Maple Drive',
      city: 'Phoenix',
      state: 'AZ',
      zipCode: '85001',
      country: 'United States'
    }
  }
];

// Sample Products Data
const sampleProducts = [
  // Electronics
  {
    name: 'iPhone 15 Pro Max',
    description: 'The most advanced iPhone yet with titanium design, A17 Pro chip, and pro camera system. Features incredible durability and the best iPhone camera system ever.',
    price: 1199,
    originalPrice: 1299,
    category: 'electronics',
    brand: 'Apple',
    images: [
      'https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=400',
      'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400'
    ],
    stock: 45,
    colors: ['Natural Titanium', 'Blue Titanium', 'White Titanium', 'Black Titanium'],
    features: ['A17 Pro chip', 'Pro camera system', '5G connectivity', 'Face ID', 'iOS 17'],
    rating: { average: 4.8, count: 342 },
    tags: ['smartphone', 'premium', 'camera', '5g']
  },
  {
    name: 'MacBook Air M2',
    description: 'Supercharged by the M2 chip, the redesigned MacBook Air is incredibly portable with a stunning 13.6-inch Liquid Retina display.',
    price: 1199,
    originalPrice: 1299,
    category: 'electronics',
    brand: 'Apple',
    images: [
      'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400',
      'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400'
    ],
    stock: 28,
    colors: ['Space Gray', 'Silver', 'Starlight', 'Midnight'],
    features: ['M2 chip', '13.6-inch Liquid Retina display', 'All-day battery', 'MagSafe charging'],
    rating: { average: 4.7, count: 189 },
    tags: ['laptop', 'productivity', 'portable', 'apple']
  },
  {
    name: 'Sony WH-1000XM5 Headphones',
    description: 'Industry-leading noise canceling with V1 processor and advanced algorithms. Premium comfort with soft-fit leather.',
    price: 399,
    originalPrice: 449,
    category: 'electronics',
    brand: 'Sony',
    images: [
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400',
      'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=400'
    ],
    stock: 67,
    colors: ['Black', 'Silver'],
    features: ['30-hour battery', 'Quick charge', 'Multipoint connection', 'Touch controls'],
    rating: { average: 4.6, count: 412 },
    tags: ['headphones', 'wireless', 'noise-canceling', 'premium']
  },
  {
    name: 'Samsung Galaxy S24 Ultra',
    description: 'The ultimate Galaxy experience with S Pen, advanced AI features, and pro-grade camera system.',
    price: 1299,
    originalPrice: 1399,
    category: 'electronics',
    brand: 'Samsung',
    images: [
      'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=400'
    ],
    stock: 32,
    colors: ['Titanium Black', 'Titanium Gray', 'Titanium Violet', 'Titanium Yellow'],
    features: ['S Pen included', '200MP camera', '5G connectivity', 'AI features'],
    rating: { average: 4.5, count: 278 },
    tags: ['smartphone', 'android', 's-pen', 'camera']
  },

  // Clothing
  {
    name: 'Nike Air Max 270',
    description: 'Comfortable running shoes featuring Nike\'s largest Max Air unit for incredible all-day comfort and style.',
    price: 150,
    originalPrice: 180,
    category: 'clothing',
    brand: 'Nike',
    images: [
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400',
      'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=400'
    ],
    stock: 85,
    sizes: ['7', '7.5', '8', '8.5', '9', '9.5', '10', '10.5', '11', '11.5', '12'],
    colors: ['Black', 'White', 'Blue', 'Red', 'Gray'],
    features: ['Max Air unit', 'Breathable mesh', 'Rubber outsole', 'Lightweight'],
    rating: { average: 4.4, count: 528 },
    tags: ['shoes', 'running', 'comfortable', 'lifestyle']
  },
  {
    name: 'Levi\'s 501 Original Jeans',
    description: 'The original blue jean since 1873. A blank canvas for self-expression that has been worn by generations.',
    price: 79,
    originalPrice: 98,
    category: 'clothing',
    brand: 'Levi\'s',
    images: [
      'https://images.unsplash.com/photo-1542272604-787c3835535d?w=400'
    ],
    stock: 120,
    sizes: ['28', '29', '30', '31', '32', '33', '34', '36', '38', '40'],
    colors: ['Dark Blue', 'Light Blue', 'Black', 'Gray'],
    features: ['100% Cotton', 'Button fly', 'Classic fit', 'Durable construction'],
    rating: { average: 4.3, count: 892 },
    tags: ['jeans', 'classic', 'denim', 'casual']
  },
  {
    name: 'Adidas Ultraboost 22',
    description: 'Our most responsive running shoe, with incredible energy return and adaptive support.',
    price: 190,
    originalPrice: 220,
    category: 'clothing',
    brand: 'Adidas',
    images: [
      'https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=400'
    ],
    stock: 64,
    sizes: ['6', '6.5', '7', '7.5', '8', '8.5', '9', '9.5', '10', '10.5', '11', '12'],
    colors: ['Core Black', 'Cloud White', 'Solar Red', 'Navy'],
    features: ['Boost midsole', 'Primeknit upper', 'Continental rubber', 'Responsive cushioning'],
    rating: { average: 4.6, count: 445 },
    tags: ['running', 'performance', 'boost', 'comfortable']
  },

  // Books
  {
    name: 'The Great Gatsby',
    description: 'F. Scott Fitzgerald\'s masterpiece about the Jazz Age, featuring the mysterious Jay Gatsby and his obsession with Daisy Buchanan.',
    price: 12.99,
    originalPrice: 15.99,
    category: 'books',
    brand: 'Scribner',
    images: [
      'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400'
    ],
    stock: 200,
    features: ['180 pages', 'Paperback', 'Classic literature', 'English language'],
    rating: { average: 4.2, count: 1250 },
    tags: ['classic', 'literature', 'american', 'fiction']
  },
  {
    name: 'Atomic Habits',
    description: 'An Easy & Proven Way to Build Good Habits & Break Bad Ones by James Clear. A practical guide to habit formation.',
    price: 16.99,
    originalPrice: 18.99,
    category: 'books',
    brand: 'Avery',
    images: [
      'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400'
    ],
    stock: 150,
    features: ['320 pages', 'Self-help', 'Paperback', 'Bestseller'],
    rating: { average: 4.7, count: 2340 },
    tags: ['self-help', 'habits', 'productivity', 'bestseller']
  },

  // Home
  {
    name: 'Ninja Foodi Coffee Maker',
    description: 'Specialty coffee maker with built-in frother, multiple brew styles, and thermal carafe.',
    price: 199,
    originalPrice: 249,
    category: 'home',
    brand: 'Ninja',
    images: [
      'https://images.unsplash.com/photo-1559305616-f42c2c31b1f3?w=400'
    ],
    stock: 35,
    colors: ['Black', 'Stainless Steel'],
    features: ['Built-in frother', '10-cup thermal carafe', 'Multiple brew styles', 'Programmable'],
    rating: { average: 4.4, count: 298 },
    tags: ['coffee', 'kitchen', 'appliance', 'thermal']
  },
  {
    name: 'Dyson V15 Detect Vacuum',
    description: 'Cordless vacuum with laser dust detection, advanced filtration, and powerful suction.',
    price: 749,
    originalPrice: 849,
    category: 'home',
    brand: 'Dyson',
    images: [
      'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400'
    ],
    stock: 22,
    colors: ['Yellow', 'Blue'],
    features: ['Laser dust detection', 'HEPA filtration', 'Up to 60 min runtime', 'LCD screen'],
    rating: { average: 4.6, count: 187 },
    tags: ['vacuum', 'cordless', 'cleaning', 'technology']
  },

  // Sports
  {
    name: 'Manduka PRO Yoga Mat',
    description: 'Professional-grade yoga mat with superior cushioning and grip. The ultimate mat for serious practitioners.',
    price: 79,
    originalPrice: 98,
    category: 'sports',
    brand: 'Manduka',
    images: [
      'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400'
    ],
    stock: 88,
    colors: ['Purple', 'Blue', 'Green', 'Pink', 'Black'],
    features: ['6mm thickness', 'Non-slip surface', 'Eco-friendly', 'Lifetime guarantee'],
    rating: { average: 4.8, count: 234 },
    tags: ['yoga', 'fitness', 'mat', 'eco-friendly']
  },
  {
    name: 'Bowflex SelectTech Dumbbells',
    description: 'Adjustable dumbbells that replace 15 sets of weights. Perfect for home workouts.',
    price: 549,
    originalPrice: 649,
    category: 'sports',
    brand: 'Bowflex',
    images: [
      'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400'
    ],
    stock: 18,
    features: ['5 to 52.5 lbs per dumbbell', 'Space-saving', 'Quick weight changes', 'Durable construction'],
    rating: { average: 4.5, count: 156 },
    tags: ['dumbbells', 'home-gym', 'adjustable', 'strength']
  },

  // Beauty
  {
    name: 'The Ordinary Skincare Set',
    description: 'Complete skincare routine with Niacinamide, Hyaluronic Acid, and Retinol for healthy, glowing skin.',
    price: 89,
    originalPrice: 120,
    category: 'beauty',
    brand: 'The Ordinary',
    images: [
      'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400'
    ],
    stock: 95,
    features: ['Cleanser', 'Serum', 'Moisturizer', 'Natural ingredients', 'Cruelty-free'],
    rating: { average: 4.6, count: 567 },
    tags: ['skincare', 'natural', 'routine', 'anti-aging']
  },

  // Toys
  {
    name: 'LEGO Creator Expert Set',
    description: 'Advanced building set for adult LEGO fans. Features detailed architecture and premium building experience.',
    price: 179,
    originalPrice: 199,
    category: 'toys',
    brand: 'LEGO',
    images: [
      'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400'
    ],
    stock: 42,
    features: ['1500+ pieces', 'Detailed instructions', 'Display model', 'Ages 16+'],
    rating: { average: 4.7, count: 198 },
    tags: ['building', 'adult', 'collectible', 'architecture']
  }
];

// Sample Cart Data
const generateSampleCarts = (users, products) => {
  const carts = [];
  
  // Create carts for some users
  users.slice(1, 4).forEach((user, index) => {
    const cartItems = [];
    const numItems = Math.floor(Math.random() * 4) + 1; // 1-4 items
    
    for (let i = 0; i < numItems; i++) {
      const product = products[Math.floor(Math.random() * products.length)];
      const quantity = Math.floor(Math.random() * 3) + 1;
      
      cartItems.push({
        product: product._id,
        quantity,
        size: product.sizes ? product.sizes[0] : undefined,
        color: product.colors ? product.colors[0] : undefined,
        price: product.price
      });
    }
    
    const cart = {
      user: user._id,
      items: cartItems,
      totalAmount: cartItems.reduce((total, item) => total + (item.price * item.quantity), 0)
    };
    
    carts.push(cart);
  });
  
  return carts;
};

// Sample Order Data
const generateSampleOrders = (users, products) => {
  const orders = [];
  
  users.slice(1).forEach((user, index) => {
    const numOrders = Math.floor(Math.random() * 3) + 1; // 1-3 orders per user
    
    for (let i = 0; i < numOrders; i++) {
      const orderItems = [];
      const numItems = Math.floor(Math.random() * 3) + 1;
      
      for (let j = 0; j < numItems; j++) {
        const product = products[Math.floor(Math.random() * products.length)];
        const quantity = Math.floor(Math.random() * 2) + 1;
        
        orderItems.push({
          product: product._id,
          name: product.name,
          price: product.price,
          quantity,
          size: product.sizes ? product.sizes[0] : undefined,
          color: product.colors ? product.colors[0] : undefined,
          image: product.images[0]
        });
      }
      
      const subtotal = orderItems.reduce((total, item) => total + (item.price * item.quantity), 0);
      const tax = subtotal * 0.08;
      const shipping = subtotal > 100 ? 0 : 10;
      const total = subtotal + tax + shipping;
      
      const statuses = ['processing', 'shipped', 'delivered'];
      const paymentMethods = ['card', 'cash'];
      const paymentStatuses = ['pending', 'paid'];
      
      const order = {
        user: user._id,
        items: orderItems,
        shippingAddress: {
          name: user.name,
          email: user.email,
          phone: user.phone,
          street: user.address.street,
          city: user.address.city,
          state: user.address.state,
          zipCode: user.address.zipCode,
          country: user.address.country
        },
        paymentMethod: paymentMethods[Math.floor(Math.random() * paymentMethods.length)],
        paymentStatus: paymentStatuses[Math.floor(Math.random() * paymentStatuses.length)],
        orderStatus: statuses[Math.floor(Math.random() * statuses.length)],
        subtotal,
        tax,
        shipping,
        total,
        trackingNumber: Math.random() > 0.5 ? `TRK${Math.random().toString(36).substr(2, 9).toUpperCase()}` : undefined,
        createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000) // Random date within last 30 days
      };
      
      orders.push(order);
    }
  });
  
  return orders;
};

const seedData = async () => {
  try {
    await connectDB();

    console.log('🗑️  Clearing existing data...');
    await User.deleteMany({});
    await Product.deleteMany({});
    await Cart.deleteMany({});
    await Order.deleteMany({});

    console.log('👥 Creating users...');
    // Hash passwords and create users
    const usersWithHashedPasswords = await Promise.all(
      sampleUsers.map(async (user) => ({
        ...user,
        password: await bcrypt.hash(user.password, 12)
      }))
    );

    const createdUsers = await User.insertMany(usersWithHashedPasswords);
    console.log(`✅ Created ${createdUsers.length} users`);

    console.log('📦 Creating products...');
    const createdProducts = await Product.insertMany(sampleProducts);
    console.log(`✅ Created ${createdProducts.length} products`);

    console.log('🛒 Creating shopping carts...');
    const sampleCarts = generateSampleCarts(createdUsers, createdProducts);
    const createdCarts = await Cart.insertMany(sampleCarts);
    console.log(`✅ Created ${createdCarts.length} shopping carts`);

    console.log('📋 Creating orders...');
    const sampleOrders = generateSampleOrders(createdUsers, createdProducts);
    const createdOrders = await Order.insertMany(sampleOrders);
    console.log(`✅ Created ${createdOrders.length} orders`);

    console.log('\n🎉 Sample data seeded successfully!');
    console.log('\n🔑 Login Credentials:');
    console.log('👤 Admin: admin@example.com / password123');
    console.log('👤 User: john@example.com / password123');
    console.log('👤 User: jane@example.com / password123');
    console.log('👤 User: michael@example.com / password123');
    console.log('👤 User: sarah@example.com / password123');
    
    console.log('\n📊 Data Summary:');
    console.log(`Users: ${createdUsers.length}`);
    console.log(`Products: ${createdProducts.length}`);
    console.log(`Carts: ${createdCarts.length}`);
    console.log(`Orders: ${createdOrders.length}`);
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding data:', error);
    process.exit(1);
  }
};

seedData();
