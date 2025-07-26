import Product from '../models/Product.js';

// Middleware to validate stock availability before order placement
export const validateStock = async (req, res, next) => {
  try {
    const { items } = req.body;
    
    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: 'Items array is required' });
    }
    
    // Check stock for each item
    for (const item of items) {
      if (!item.productId || !item.quantity) {
        return res.status(400).json({ 
          message: 'Each item must have productId and quantity' 
        });
      }
      
      const product = await Product.findById(item.productId);
      if (!product) {
        return res.status(404).json({ 
          message: `Product ${item.productId} not found` 
        });
      }
      
      if (!product.isAvailable) {
        return res.status(400).json({ 
          message: `Product ${product.name} is currently unavailable` 
        });
      }
      
      if (product.stock < item.quantity) {
        return res.status(400).json({ 
          message: `Insufficient stock for ${product.name}. Available: ${product.stock}, Requested: ${item.quantity}` 
        });
      }
    }
    
    next();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Middleware to check if product exists and belongs to supplier
export const validateProductOwnership = async (req, res, next) => {
  try {
    const { id } = req.params;
    const product = await Product.findOne({ _id: id, supplier: req.user._id });
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    req.product = product;
    next();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}; 