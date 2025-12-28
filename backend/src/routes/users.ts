import { Router } from 'express';
import { getMe, updateMe } from '../controllers/users.js';
import { requireAuth } from '../middleware/auth.js';
import { authLimiter } from '../middleware/rateLimit.js';

const router = Router();

// All user routes require authentication
router.use(requireAuth);
router.use(authLimiter);

// GET /api/users/me - Get current user profile
router.get('/me', getMe);

// PUT /api/users/me - Update current user profile
router.put('/me', updateMe);

export default router;

