/**
 * In-memory rate limiter for serverless API routes.
 *
 * NOTE: On Vercel, each serverless function runs in its own process/instance.
 * This Map is per-process and resets on cold starts. It is best-effort protection
 * that works well against sustained bursts within a warm instance. For durable,
 * cross-instance limiting, back this with Vercel KV / Upstash.
 */

interface RateLimitEntry {
  count: number
  windowStart: number
  windowMs: number
}

const store = new Map<string, RateLimitEntry>()

// Bound memory: cap distinct keys and periodically drop expired entries so a
// flood of distinct keys cannot grow the Map without limit.
const MAX_KEYS = 10_000
const SWEEP_INTERVAL_MS = 60_000
let lastSweep = 0

function sweep(now: number) {
  if (now - lastSweep < SWEEP_INTERVAL_MS) return
  lastSweep = now
  for (const [key, entry] of store) {
    if (now - entry.windowStart > entry.windowMs) store.delete(key)
  }
  // Hard cap fallback: if still oversized, evict oldest entries.
  if (store.size > MAX_KEYS) {
    const sorted = [...store.entries()].sort((a, b) => a[1].windowStart - b[1].windowStart)
    for (let i = 0; i < sorted.length - MAX_KEYS; i++) store.delete(sorted[i][0])
  }
}

export function checkRateLimit(
  key: string,
  maxRequests: number,
  windowMs: number
): { allowed: boolean; remaining: number } {
  const now = Date.now()
  sweep(now)
  const entry = store.get(key)

  if (!entry || now - entry.windowStart > entry.windowMs) {
    // New window
    store.set(key, { count: 1, windowStart: now, windowMs })
    return { allowed: true, remaining: maxRequests - 1 }
  }

  if (entry.count >= maxRequests) {
    return { allowed: false, remaining: 0 }
  }

  entry.count++
  return { allowed: true, remaining: maxRequests - entry.count }
}

/**
 * Best-effort client IP from a TRUSTED source.
 *
 * `x-forwarded-for` is client-prependable, so the left-most value is spoofable.
 * On Vercel, `x-real-ip` is set to the true client IP by the platform edge; we
 * prefer it, then the platform-specific forwarded header, and only fall back to
 * the LAST hop of `x-forwarded-for` (the entry appended by the trusted proxy).
 */
export function getClientIp(headers: Record<string, string | string[] | undefined>): string {
  const first = (v: string | string[] | undefined): string =>
    (Array.isArray(v) ? v[0] : v)?.trim() ?? ''

  const realIp = first(headers['x-real-ip'])
  if (realIp) return realIp

  const vercel = first(headers['x-vercel-forwarded-for'])
  if (vercel) return vercel.split(',')[0]?.trim() || 'unknown'

  const xff = first(headers['x-forwarded-for'])
  if (xff) {
    const parts = xff.split(',').map(s => s.trim()).filter(Boolean)
    if (parts.length) return parts[parts.length - 1] // trusted last hop, not spoofable left-most
  }

  return 'unknown'
}

/** Build a rate-limit key from the trusted client IP plus a route suffix. */
export function getRequestKey(headers: Record<string, string | string[] | undefined>, suffix: string): string {
  return `${getClientIp(headers)}:${suffix}`
}
