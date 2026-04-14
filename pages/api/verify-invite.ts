import type { NextApiRequest, NextApiResponse } from 'next'
import { checkRateLimit, getRequestKey } from '@/lib/rate-limit'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end()

  // ── Rate limit: 10 invite attempts per IP per hour ──
  // Prevents brute-force guessing of invite codes.
  const key = getRequestKey(req.headers as Record<string, string | string[] | undefined>, 'verify-invite')
  const { allowed } = checkRateLimit(key, 10, 60 * 60 * 1000)
  if (!allowed) {
    return res.status(429).json({ error: 'Too many attempts. Please try again later.' })
  }

  const { code } = req.body
  if (!code || typeof code !== 'string' || code.trim().length === 0) {
    return res.status(400).json({ error: 'Missing code' })
  }

  // Enforce reasonable code length to prevent oversized input
  if (code.length > 64) {
    return res.status(400).json({ error: 'Invalid invite code' })
  }

  const validCodes = (process.env.INVITE_CODES || '').split(',').map(c => c.trim().toLowerCase())
  if (!validCodes.includes(code.toLowerCase())) {
    return res.status(401).json({ error: 'Invalid invite code' })
  }

  // ── INVITE_SECRET must be set — no fallback in production ──
  const secret = process.env.INVITE_SECRET
  if (!secret) {
    console.error('[verify-invite] INVITE_SECRET environment variable is not set.')
    return res.status(500).json({ error: 'Server configuration error.' })
  }

  const crypto = await import('crypto')
  const signature = crypto.createHmac('sha256', secret).update(code.toLowerCase()).digest('hex')
  const token = `${code.toLowerCase()}.${signature}`

  const isProd = process.env.NODE_ENV === 'production'
  res.setHeader(
    'Set-Cookie',
    `fazalk-access-token=${token}; Path=/; HttpOnly; SameSite=Strict; ${isProd ? 'Secure;' : ''}`
  )

  return res.status(200).json({ success: true })
}
