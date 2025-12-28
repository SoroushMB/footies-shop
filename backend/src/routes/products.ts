import { Router } from 'express';
import {
  getProducts,
  getProductById,
  getFeaturedProducts,
  getPopularProducts,
} from '../controllers/products.js';
import { generalLimiter } from '../middleware/rateLimit.js';

const router = Router();

// Apply rate limiting to all product routes
router.use(generalLimiter);

// GET /api/products - Get all products
router.get('/', getProducts);

// GET /api/products/featured - Get featured products
router.get('/featured', getFeaturedProducts);

// GET /api/products/popular - Get popular products
router.get('/popular', getPopularProducts);

// GET /api/products/:id - Get product by ID or slug
router.get('/:id', getProductById);

export default router;

