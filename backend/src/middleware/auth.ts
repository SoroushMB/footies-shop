import { Request, Response, NextFunction } from 'express';
import { createClerkClient } from '@clerk/backend';
import { config } from '../config/index.js';

const clerk = createClerkClient({
  secretKey: config.clerk.secretKey,
});

// Extend Express Request type
declare global {
  namespace Express {
    interface Request {
      userId?: string;
      userEmail?: string;
      sessionId?: string;
    }
  }
}

/**
 * Middleware to verify Clerk authentication
 * Extracts user info from the session token
 */
export async function requireAuth(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader?.startsWith('Bearer ')) {
      res.status(401).json({
        success: false,
        message: 'Authorization header missing or invalid',
      });
      return;
    }

    const token = authHeader.split('Bearer ')[1];

    if (!token) {
      res.status(401).json({
        success: false,
        message: 'Token missing',
      });
      return;
    }

    // Verify the session token with Clerk
    if (!config.clerk.secretKey) {
      // Development mode - allow mock auth
      if (config.nodeEnv === 'development') {
        req.userId = 'dev-user-123';
        req.userEmail = 'dev@example.com';
        next();
        return;
      }

      res.status(500).json({
        success: false,
        message: 'Authentication not configured',
      });
      return;
    }

    try {
      const sessionClaims = await clerk.verifyToken(token);

      req.userId = sessionClaims.sub;
      req.sessionId = sessionClaims.sid;

      // Get user email if needed
      if (sessionClaims.sub) {
        const user = await clerk.users.getUser(sessionClaims.sub);
        req.userEmail = user.emailAddresses[0]?.emailAddress;
      }

      next();
    } catch (verifyError) {
      console.error('Token verification failed:', verifyError);
      res.status(401).json({
        success: false,
        message: 'Invalid or expired token',
      });
    }
  } catch (error) {
    console.error('Auth middleware error:', error);
    res.status(500).json({
      success: false,
      message: 'Authentication error',
    });
  }
}

/**
 * Optional auth middleware - doesn't require auth but extracts user if present
 */
export async function optionalAuth(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader?.startsWith('Bearer ')) {
      next();
      return;
    }

    const token = authHeader.split('Bearer ')[1];

    if (token && config.clerk.secretKey) {
      try {
        const sessionClaims = await clerk.verifyToken(token);
        req.userId = sessionClaims.sub;
        req.sessionId = sessionClaims.sid;
      } catch {
        // Ignore verification errors for optional auth
      }
    }

    next();
  } catch {
    next();
  }
}

