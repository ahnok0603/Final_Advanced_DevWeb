const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  name: String,
  description: String
});

const productSchema = new mongoose.Schema({
  name: String,
  price: Number,
  model: String,
  madeBy: String,
  categoryId: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
  image: String
});

const employeeSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String
});

const customerSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String
});

const orderSchema = new mongoose.Schema({
  customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer' },
  orderDate: { type: Date, default: Date.now },
  status: { type: String, enum: ['pending', 'paid'], default: 'pending' },
  total: Number
});

const orderDetailsSchema = new mongoose.Schema({
  orderId: { type: mongoose.Schema.Types.ObjectId, ref: 'Order' },
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
  quantity: Number,
  price: Number
});

const Category = mongoose.model('Category', categorySchema);
const Product = mongoose.model('Product', productSchema);
const Employee = mongoose.model('Employee', employeeSchema);
const Customer = mongoose.model('Customer', customerSchema);
const Order = mongoose.model('Order', orderSchema);
const OrderDetails = mongoose.model('OrderDetails', orderDetailsSchema);

module.exports = {
  Category,
  Product,
  Employee,
  Customer,
  Order,
  OrderDetails
};
