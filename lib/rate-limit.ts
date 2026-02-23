import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

// Share a single Redis client instance across both rate limiters
const redis = Redis.fromEnv();

// General traffic: 100 requests per 10 seconds (sliding window)
export const rateLimiter = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(100, '10 s'),
  analytics: true,
  prefix: '@upstash/ratelimit',
});

// Auth routes: stricter — 5 requests per minute
export const authRateLimiter = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(5, '1 m'),
  analytics: true,
  prefix: '@upstash/ratelimit/auth',
});

export type RateLimitResult =
  | { limited: false; limit: number; remaining: number; reset: number }
  | { limited: true; limit: number; reset: number };

/**
 * Wraps a rate limiter call so a Redis outage fails open (allows the request)
 * rather than crashing the middleware.
 */
export async function checkRateLimit(
  limiter: Ratelimit,
  identifier: string,
): Promise<RateLimitResult> {
  try {
    const { success, limit, remaining, reset } = await limiter.limit(identifier);
    if (!success) {
      return { limited: true, limit, reset };
    }
    return { limited: false, limit, remaining, reset };
  } catch (err) {
    // If Redis is unreachable, fail open to avoid blocking all traffic
    console.error('[rate-limit] Redis error — failing open:', err);
    return { limited: false, limit: 0, remaining: 0, reset: 0 };
  }
}
