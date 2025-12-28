import { Router } from 'express';
import { createIntent, getIntentStatus } from '../controllers/payments.js';
import { requireAuth } from '../middleware/auth.js';
import { checkoutLimiter } from '../middleware/rateLimit.js';

const router = Router();

// All payment routes require authentication
router.use(requireAuth);

// POST /api/payments/create-intent - Create payment intent
router.post('/create-intent', checkoutLimiter, createIntent);

// GET /api/payments/intent/:id - Get payment intent status
router.get('/intent/:id', getIntentStatus);

export default router;

