import User from '../models/User.js';
import Product from '../models/Product.js';
import Order from '../models/Order.js';

// Get supplier profile
export const getProfile = async (req, res) => {
  res.json(req.user);
};

// Add product
export const addProduct = async (req, res) => {
  try {
    const { name, unit, price, stock, lowStockThreshold } = req.body;
    if (!name || !unit || !price || !stock) {
      return res.status(400).json({ message: 'All fields required' });
    }
    
    const product = await Product.create({
      name,
      unit,
      price,
      stock,
      supplier: req.user._id,
      isAvailable: stock > 0,
      lowStockThreshold: lowStockThreshold || 10
    });
    
    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update product
export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { price, stock, lowStockThreshold } = req.body;
    
    const product = await Product.findOne({ _id: id, supplier: req.user._id });
    if (!product) return res.status(404).json({ message: 'Product not found' });
    
    if (price !== undefined) product.price = price;
    if (stock !== undefined) {
      const previousStock = product.stock;
      product.stock = stock;
      product.isAvailable = stock > 0;
      
      // Add to stock history if stock changed
      if (previousStock !== stock) {
        product.stockHistory.push({
          action: 'adjusted',
          quantity: stock - previousStock,
          previousStock: previousStock,
          newStock: stock
        });
      }
    }
    if (lowStockThreshold !== undefined) product.lowStockThreshold = lowStockThreshold;
    
    await product.save();
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// View incoming orders
export const getOrders = async (req, res) => {
  const orders = await Order.find({ supplier: req.user._id })
    .populate('vendor', 'name')
    .populate('items.product', 'name price');
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

// Restock product
export const restockProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { quantity } = req.body;
    
    if (!quantity || quantity <= 0) {
      return res.status(400).json({ message: 'Valid quantity required' });
    }
    
    const product = await Product.findOne({ _id: id, supplier: req.user._id });
    if (!product) return res.status(404).json({ message: 'Product not found' });
    
    await product.addStock(quantity);
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get low stock products
export const getLowStockProducts = async (req, res) => {
  try {
    const products = await Product.find({ 
      supplier: req.user._id,
      stock: { $lte: '$lowStockThreshold' }
    });
    
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get stock history for a product
export const getStockHistory = async (req, res) => {
  try {
    const { id } = req.params;
    
    const product = await Product.findOne({ _id: id, supplier: req.user._id });
    if (!product) return res.status(404).json({ message: 'Product not found' });
    
    res.json(product.stockHistory);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}; 