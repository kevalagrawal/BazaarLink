import User from '../models/User.js';
import Product from '../models/Product.js';
import Order from '../models/Order.js';
import Review from '../models/Review.js';

// Get vendor profile
export const getProfile = async (req, res) => {
  res.json(req.user);
};

// Get nearby products (simple location match)
export const getNearbyProducts = async (req, res) => {
  const { location } = req.user;
  const suppliers = await User.find({ role: 'supplier', location });
  const supplierIds = suppliers.map(s => s._id);
  const products = await Product.find({ supplier: { $in: supplierIds } }).populate('supplier', 'name location');
  res.json(products);
};

// Place order
export const placeOrder = async (req, res) => {
  const { supplier, items, type } = req.body;
  if (!supplier || !items || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ message: 'Supplier and items required' });
  }
  const order = await Order.create({
    vendor: req.user._id,
    supplier,
    items,
    type: type || 'individual',
  });
  res.status(201).json(order);
};

// Join group order (simplified: just creates a group order)
export const joinGroupOrder = async (req, res) => {
  const { supplier, items } = req.body;
  if (!supplier || !items || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ message: 'Supplier and items required' });
  }
  const order = await Order.create({
    vendor: req.user._id,
    supplier,
    items,
    type: 'group',
  });
  res.status(201).json(order);
};

// View order history
export const getOrders = async (req, res) => {
  const orders = await Order.find({ vendor: req.user._id }).populate('supplier', 'name');
  res.json(orders);
};

// Leave a review
export const leaveReview = async (req, res) => {
  const { supplierId } = req.params;
  const { rating, comment } = req.body;
  if (!rating) return res.status(400).json({ message: 'Rating required' });
  const review = await Review.create({
    vendor: req.user._id,
    supplier: supplierId,
    rating,
    comment,
  });
  res.status(201).json(review);
}; 