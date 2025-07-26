import express from 'express';
import { 
  getProfile, 
  addProduct, 
  updateProduct, 
  getOrders, 
  fulfillOrder,
  restockProduct,
  getLowStockProducts,
  getStockHistory
} from '../controllers/supplierController.js';
import { protect } from '../middlewares/auth.js';

const router = express.Router();

router.get('/profile', protect(['supplier']), getProfile);
router.post('/product', protect(['supplier']), addProduct);
router.patch('/product/:id', protect(['supplier']), updateProduct);
router.get('/orders', protect(['supplier']), getOrders);
router.patch('/order/:id', protect(['supplier']), fulfillOrder);

// Inventory management routes
router.post('/product/:id/restock', protect(['supplier']), restockProduct);
router.get('/products/low-stock', protect(['supplier']), getLowStockProducts);
router.get('/product/:id/stock-history', protect(['supplier']), getStockHistory);

export default router; 