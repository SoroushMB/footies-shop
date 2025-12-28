import { Router } from 'express';
import { getSuggestions, chat } from '../controllers/ai.js';
import { optionalAuth } from '../middleware/auth.js';
import { aiLimiter } from '../middleware/rateLimit.js';

const router = Router();

// Apply rate limiting
router.use(aiLimiter);

// POST /api/ai/suggestions - Get AI product suggestions (optional auth)
router.post('/suggestions', optionalAuth, getSuggestions);

// POST /api/ai/chat - Customer support chat (no auth required)
router.post('/chat', chat);

export default router;

