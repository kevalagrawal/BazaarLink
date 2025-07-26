import express from 'express';
import { getProfile, getNearbyProducts, placeOrder, joinGroupOrder, getOrders, leaveReview, getAllSuppliers } from '../controllers/vendorController.js';
import { protect } from '../middlewares/auth.js';

const router = express.Router();

router.get('/profile', protect(['vendor']), getProfile);
router.get('/products', protect(['vendor']), getNearbyProducts);
router.post('/order', protect(['vendor']), placeOrder);
router.post('/group-order', protect(['vendor']), joinGroupOrder);
router.get('/orders', protect(['vendor']), getOrders);
router.post('/review/:supplierId', protect(['vendor']), leaveReview);
router.get('/suppliers', protect(['vendor']), getAllSuppliers);

export default router; 