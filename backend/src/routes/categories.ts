import { Router } from 'express';
import { getCategories, getCategoryBySlug } from '../controllers/categories.js';
import { generalLimiter } from '../middleware/rateLimit.js';

const router = Router();

// Apply rate limiting
router.use(generalLimiter);

// GET /api/categories - Get all categories
router.get('/', getCategories);

// GET /api/categories/:slug - Get category by slug
router.get('/:slug', getCategoryBySlug);

export default router;

