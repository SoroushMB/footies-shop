import { Router } from 'express';
import {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
} from '../controllers/cart.js';
import { requireAuth } from '../middleware/auth.js';
import { cartLimiter } from '../middleware/rateLimit.js';

const router = Router();

// All cart routes require authentication
router.use(requireAuth);
router.use(cartLimiter);

// GET /api/cart - Get user's cart
router.get('/', getCart);

// POST /api/cart - Add item to cart
router.post('/', addToCart);

// PUT /api/cart/:itemId - Update cart item
router.put('/:itemId', updateCartItem);

// DELETE /api/cart/:itemId - Remove item from cart
router.delete('/:itemId', removeFromCart);

export default router;

