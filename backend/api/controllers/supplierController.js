import User from '../models/User.js';
import Product from '../models/Product.js';
import Order from '../models/Order.js';

// Get supplier profile
export const getProfile = async (req, res) => {
  res.json(req.user);
};

// Add product
export const addProduct = async (req, res) => {
  const { name, unit, price, stock } = req.body;
  if (!name || !unit || !price || !stock) {
    return res.status(400).json({ message: 'All fields required' });
  }
  const product = await Product.create({
    name,
    unit,
    price,
    stock,
    supplier: req.user._id,
  });
  res.status(201).json(product);
};

// Update product
export const updateProduct = async (req, res) => {
  const { id } = req.params;
  const { price, stock } = req.body;
  const product = await Product.findOne({ _id: id, supplier: req.user._id });
  if (!product) return res.status(404).json({ message: 'Product not found' });
  if (price !== undefined) product.price = price;
  if (stock !== undefined) product.stock = stock;
  await product.save();
  res.json(product);
};

// View incoming orders
export const getOrders = async (req, res) => {
  const orders = await Order.find({ supplier: req.user._id }).populate('vendor', 'name');
  res.json(orders);
};

// Fulfill order
export const fulfillOrder = async (req, res) => {
  const { id } = req.params;
  const order = await Order.findOne({ _id: id, supplier: req.user._id });
  if (!order) return res.status(404).json({ message: 'Order not found' });
  order.status = 'delivered';
  await order.save();
  res.json(order);
}; 