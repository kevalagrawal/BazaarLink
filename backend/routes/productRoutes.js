import express from 'express';
import { getAllProducts, getProductsBySupplier, addProduct } from '../controllers/productController.js';
import { protect } from '../middlewares/auth.js';

const router = express.Router();

router.get('/', getAllProducts);
router.get('/:supplierId', getProductsBySupplier);
router.post('/', protect(['supplier']), addProduct);

export default router; 