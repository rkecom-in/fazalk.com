import type { NextApiRequest, NextApiResponse } from 'next'
import { checkRateLimit, getRequestKey } from '@/lib/rate-limit'

// ── Rate limit: 5 AI assessment calls per IP per 24 hours ──
// NOTE: This in-memory Map is per serverless function instance. On Vercel, cold
// starts create a new process, so limits reset. This provides meaningful
// protection against sustained bursts within a warm instance. The invite gate
// in middleware.ts is the primary defence layer against unauthenticated abuse.
const MAX_REQUESTS = 5
const WINDOW_MS = 24 * 60 * 60 * 1000

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end()

  const key = getRequestKey(req.headers as Record<string, string | string[] | undefined>, 'anthropic')
  const { allowed } = checkRateLimit(key, MAX_REQUESTS, WINDOW_MS)
  if (!allowed) {
    return res.status(429).json({ error: 'Rate limit exceeded. Please contact us directly.' })
  }

  // Enforce a payload size cap: don't forward arbitrarily large bodies to Anthropic
  const bodyStr = JSON.stringify(req.body)
  if (bodyStr.length > 32_000) {
    return res.status(413).json({ error: 'Request payload too large.' })
  }

  if (!process.env.ANTHROPIC_API_KEY) {
    console.error('[anthropic] ANTHROPIC_API_KEY environment variable is not set.')
    return res.status(500).json({ error: 'Server configuration error.' })
  }

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
        'anthropic-beta': 'prompt-caching-2024-07-31',
      },
      body: JSON.stringify(req.body),
    })
    const data = await response.json()
    res.status(response.status).json(data)
  } catch (err) {
    console.error('[anthropic] Proxy error:', err)
    res.status(500).json({ error: 'Proxy error' })
  }
}
