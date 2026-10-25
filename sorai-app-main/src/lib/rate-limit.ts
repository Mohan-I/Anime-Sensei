/**
 * Simple in-memory rate limiter for API routes.
 * Limits requests per key (e.g., user ID or IP) within a time window.
 *
 * Note: This is a per-instance limiter. For multi-instance deployments,
 * consider using Redis or an external store.
 */

const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

export function rateLimit(
    key: string,
    limit: number = 5,
    windowMs: number = 60 * 1000
): { success: boolean; remaining: number } {
    const now = Date.now();
    const entry = rateLimitMap.get(key);

    if (!entry || now > entry.resetTime) {
        rateLimitMap.set(key, { count: 1, resetTime: now + windowMs });
        return { success: true, remaining: limit - 1 };
    }

    if (entry.count >= limit) {
        return { success: false, remaining: 0 };
    }

    entry.count++;
    return { success: true, remaining: limit - entry.count };
}

// Periodic cleanup to prevent memory leaks
if (typeof globalThis !== "undefined") {
    const CLEANUP_INTERVAL = 60 * 1000;
    setInterval(() => {
        const now = Date.now();
        rateLimitMap.forEach((entry, key) => {
            if (now > entry.resetTime) rateLimitMap.delete(key);
        });
    }, CLEANUP_INTERVAL).unref?.();
}
