import type { NextApiRequest } from 'next'
import { SITE_URL } from '@/lib/seo-services'

/**
 * Same-origin guard for state-changing API routes (anti-CSRF).
 *
 * Browsers always send an Origin header on cross-origin POST fetches, so a
 * present-but-foreign Origin is rejected. A missing Origin (server-to-server,
 * curl) is allowed here — scripted abuse is gated separately by the Turnstile
 * check and the rate limiter.
 */
export function isAllowedOrigin(req: NextApiRequest): boolean {
  const origin = req.headers.origin
  if (!origin) return true // non-browser caller; other layers gate abuse

  let host: string
  try {
    host = new URL(origin).host
  } catch {
    return false // malformed Origin
  }

  const allowed = new Set<string>()
  try {
    allowed.add(new URL(SITE_URL).host)
  } catch {
    /* SITE_URL is a constant; ignore */
  }
  if (process.env.NODE_ENV !== 'production') {
    allowed.add('localhost:3000')
    allowed.add('127.0.0.1:3000')
  }
  // Allow the request's own host (covers preview deployments behind the proxy).
  const reqHost = req.headers.host
  if (reqHost) allowed.add(reqHost)

  return allowed.has(host)
}
