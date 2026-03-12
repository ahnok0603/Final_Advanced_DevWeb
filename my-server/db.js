const mongoose = require('mongoose');
const { Category, Product, Employee, Customer, Order, OrderDetails } = require('./models');

async function connectDB() {
  try {
    await mongoose.connect('mongodb://127.0.0.1:27017/mickey_store');
    console.log('Connected to MongoDB');
    
    // Seed Sample Data if collections are empty
    await seedData();
  } catch (error) {
    console.error('MongoDB connection error:', error);
  }
}

async function seedData() {
  const categoryCount = await Category.countDocuments();
  if (categoryCount === 0) {
    console.log('Seeding data...');
    const cat1 = await Category.create({ name: 'Electronics', description: 'Gadgets and devices' });
    const cat2 = await Category.create({ name: 'Clothing', description: 'Fashion items' });
    const cat3 = await Category.create({ name: 'Home', description: 'Home appliances' });
    const cat4 = await Category.create({ name: 'Toys', description: 'Kids toys' });
    const cat5 = await Category.create({ name: 'Books', description: 'Reading materials' });

    const p1 = await Product.create({ name: 'Laptop', price: 1000, model: 'X1', madeBy: 'Apple', categoryId: cat1._id, image: 'https://placehold.co/150x150' });
    const p2 = await Product.create({ name: 'T-Shirt', price: 20, model: 'M', madeBy: 'Nike', categoryId: cat2._id, image: 'https://placehold.co/150x150' });
    const p3 = await Product.create({ name: 'Coffee Maker', price: 50, model: 'CM500', madeBy: 'Philips', categoryId: cat3._id, image: 'https://placehold.co/150x150' });
    const p4 = await Product.create({ name: 'Lego Set', price: 80, model: 'Star Wars', madeBy: 'Lego', categoryId: cat4._id, image: 'https://placehold.co/150x150' });
    const p5 = await Product.create({ name: 'Novel', price: 15, model: 'Paperback', madeBy: 'Penguin', categoryId: cat5._id, image: 'https://placehold.co/150x150' });

    await Employee.create({ name: 'Alice Admin', email: 'alice@mickey.com', password: '123' });
    await Employee.create({ name: 'Bob HR', email: 'bob@mickey.com', password: '123' });
    await Employee.create({ name: 'Charlie Sales', email: 'charlie@mickey.com', password: '123' });
    await Employee.create({ name: 'Dave IT', email: 'dave@mickey.com', password: '123' });
    await Employee.create({ name: 'Eve Support', email: 'eve@mickey.com', password: '123' });

    const c1 = await Customer.create({ name: 'John Doe', email: 'john@gmail.com', password: 'abc' });
    const c2 = await Customer.create({ name: 'Jane Smith', email: 'jane@gmail.com', password: 'abc' });
    await Customer.create({ name: 'Sam Brown', email: 'sam@gmail.com', password: 'abc' });
    await Customer.create({ name: 'Lucy White', email: 'lucy@gmail.com', password: 'abc' });
    await Customer.create({ name: 'Tom Black', email: 'tom@gmail.com', password: 'abc' });

    const o1 = await Order.create({ customerId: c1._id, status: 'paid', total: 1020 });
    const o2 = await Order.create({ customerId: c2._id, status: 'paid', total: 50 });
    const o3 = await Order.create({ customerId: c1._id, status: 'pending', total: 80 });
    const o4 = await Order.create({ customerId: c2._id, status: 'pending', total: 15 });
    const o5 = await Order.create({ customerId: c1._id, status: 'paid', total: 1000 });
    
    // Optional order details creation
    await OrderDetails.create({ orderId: o1._id, productId: p1._id, quantity: 1, price: 1000 });
    await OrderDetails.create({ orderId: o1._id, productId: p2._id, quantity: 1, price: 20 });
    await OrderDetails.create({ orderId: o2._id, productId: p3._id, quantity: 1, price: 50 });
    await OrderDetails.create({ orderId: o3._id, productId: p4._id, quantity: 1, price: 80 });
    await OrderDetails.create({ orderId: o4._id, productId: p5._id, quantity: 1, price: 15 });
    await OrderDetails.create({ orderId: o5._id, productId: p1._id, quantity: 1, price: 1000 });
    
    console.log('Seeding complete.');
  }
}

module.exports = connectDB;
