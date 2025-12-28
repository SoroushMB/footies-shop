/**
 * Simple in-memory rate limiter for API routes
 * For production, consider using Redis or a dedicated service
 */

interface RateLimitStore {
  [key: string]: {
    count: number;
    resetTime: number;
  };
}

const store: RateLimitStore = {};

interface RateLimitOptions {
  interval: number; // Time window in milliseconds
  uniqueTokenPerInterval: number; // Max requests per interval
}

export function rateLimit(options: RateLimitOptions) {
  const { interval, uniqueTokenPerInterval } = options;

  return {
    check: (identifier: string): { limit: number; remaining: number; reset: number } => {
      const now = Date.now();
      const record = store[identifier];

      if (!record || now > record.resetTime) {
        // Create new record or reset expired one
        store[identifier] = {
          count: 1,
          resetTime: now + interval,
        };
        return {
          limit: uniqueTokenPerInterval,
          remaining: uniqueTokenPerInterval - 1,
          reset: now + interval,
        };
      }

      if (record.count >= uniqueTokenPerInterval) {
        // Rate limit exceeded
        return {
          limit: uniqueTokenPerInterval,
          remaining: 0,
          reset: record.resetTime,
        };
      }

      // Increment count
      record.count += 1;
      return {
        limit: uniqueTokenPerInterval,
        remaining: uniqueTokenPerInterval - record.count,
        reset: record.resetTime,
      };
    },
  };
}

// Clean up expired entries periodically
if (typeof setInterval !== 'undefined') {
  setInterval(() => {
    const now = Date.now();
    Object.keys(store).forEach((key) => {
      if (store[key].resetTime < now) {
        delete store[key];
      }
    });
  }, 60000); // Clean up every minute
}

