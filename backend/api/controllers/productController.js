import Product from '../models/Product.js';

// List all available products
export const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find({ isAvailable: true }).populate('supplier', 'name');
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get available products by supplier
export const getProductsBySupplier = async (req, res) => {
  try {
    const { supplierId } = req.params;
    const products = await Product.find({ 
      supplier: supplierId, 
      isAvailable: true 
    }).populate('supplier', 'name');
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Add product (supplier only)
export const addProduct = async (req, res) => {
  try {
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
      isAvailable: stock > 0
    });
    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}; 