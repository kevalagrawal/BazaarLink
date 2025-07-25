import Product from '../models/Product.js';

// List all products
export const getAllProducts = async (req, res) => {
  const products = await Product.find().populate('supplier', 'name');
  res.json(products);
};

// Get products by supplier
export const getProductsBySupplier = async (req, res) => {
  const { supplierId } = req.params;
  const products = await Product.find({ supplier: supplierId }).populate('supplier', 'name');
  res.json(products);
};

// Add product (supplier only)
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