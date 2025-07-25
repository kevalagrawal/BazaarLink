import express from 'express';
import { getVendorOrders, getSupplierOrders, updateOrderStatus } from '../controllers/orderController.js';

const router = express.Router();

router.get('/vendor/:id', getVendorOrders);
router.get('/supplier/:id', getSupplierOrders);
router.patch('/:id/status', updateOrderStatus);

export default router; 