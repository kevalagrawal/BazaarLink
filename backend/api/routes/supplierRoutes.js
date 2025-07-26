import express from 'express';
import { getProfile, addProduct, updateProduct, getOrders, fulfillOrder } from '../controllers/supplierController.js';
import { protect } from '../middlewares/auth.js';

const router = express.Router();

router.get('/profile', protect(['supplier']), getProfile);
router.post('/product', protect(['supplier']), addProduct);
router.patch('/product/:id', protect(['supplier']), updateProduct);
router.get('/orders', protect(['supplier']), getOrders);
router.patch('/order/:id', protect(['supplier']), fulfillOrder);

export default router; 