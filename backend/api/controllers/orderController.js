import Order from '../models/Order.js';

// Vendor orders
export const getVendorOrders = async (req, res) => {
  const { id } = req.params;
  const orders = await Order.find({ vendor: id }).populate('supplier', 'name');
  res.json(orders);
};

// Supplier orders
export const getSupplierOrders = async (req, res) => {
  const { id } = req.params;
  const orders = await Order.find({ supplier: id }).populate('vendor', 'name phone');
  res.json(orders);
};

// Update order status
export const updateOrderStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  const order = await Order.findById(id);
  if (!order) return res.status(404).json({ message: 'Order not found' });
  order.status = status;
  await order.save();
  res.json(order);
}; 