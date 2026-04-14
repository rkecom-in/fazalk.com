/**
 * In-memory rate limiter for serverless API routes.
 *
 * NOTE: On Vercel, each serverless function runs in its own process/instance.
 * This Map is per-process and resets on cold starts. It is best-effort protection
 * that works well against sustained bursts within a warm instance. The primary
 * security layer is the invite-gated middleware that sits in front of all routes.
 */

interface RateLimitEntry {
  count: number
  windowStart: number
}

const store = new Map<string, RateLimitEntry>()

export function checkRateLimit(
  key: string,
  maxRequests: number,
  windowMs: number
): { allowed: boolean; remaining: number } {
  const now = Date.now()
  const entry = store.get(key)

  if (!entry || now - entry.windowStart > windowMs) {
    // New window
    store.set(key, { count: 1, windowStart: now })
    return { allowed: true, remaining: maxRequests - 1 }
  }

  if (entry.count >= maxRequests) {
    return { allowed: false, remaining: 0 }
  }

  entry.count++
  return { allowed: true, remaining: maxRequests - entry.count }
}

/** Extract the best available identifier for a request */
export function getRequestKey(headers: Record<string, string | string[] | undefined>, suffix: string): string {
  const forwarded = headers['x-forwarded-for']
  const ip = Array.isArray(forwarded) ? forwarded[0] : (forwarded?.split(',')[0]?.trim() ?? 'unknown')
  return `${ip}:${suffix}`
}
