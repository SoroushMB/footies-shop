import { Router } from 'express';
import { processCheckout, getOrders, getOrderById } from '../controllers/checkout.js';
import { requireAuth } from '../middleware/auth.js';
import { checkoutLimiter } from '../middleware/rateLimit.js';

const router = Router();

// All checkout routes require authentication
router.use(requireAuth);

// POST /api/checkout - Process checkout
router.post('/', checkoutLimiter, processCheckout);

// GET /api/orders - Get user's orders
router.get('/orders', getOrders);

// GET /api/orders/:id - Get order by ID
router.get('/orders/:id', getOrderById);

export default router;

