import type { NextApiRequest, NextApiResponse } from 'next'
import { checkRateLimit, getClientIp, getRequestKey } from '@/lib/rate-limit'
import { isAllowedOrigin } from '@/lib/security'
import { verifyTurnstile } from '@/lib/turnstile'
import { buildAssessmentRequest, parseAssessmentInput } from '@/lib/assessment'

// Cap the parsed body well below Next's 1mb default — this route accepts only a
// tiny structured payload (5 answer indexes + a short situation string).
export const config = { api: { bodyParser: { sizeLimit: '8kb' } } }

// ── Rate limit: 5 AI assessment calls per IP per 24 hours ──
const MAX_REQUESTS = 5
const WINDOW_MS = 24 * 60 * 60 * 1000

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end()

  if (!isAllowedOrigin(req)) {
    return res.status(403).json({ error: 'Forbidden.' })
  }

  const headers = req.headers as Record<string, string | string[] | undefined>
  const verified = await verifyTurnstile(req.body?.turnstileToken, getClientIp(headers))
  if (!verified) {
    return res.status(403).json({ error: 'Verification failed. Please reload and try again.' })
  }

  const key = getRequestKey(headers, 'anthropic')
  const { allowed } = checkRateLimit(key, MAX_REQUESTS, WINDOW_MS)
  if (!allowed) {
    return res.status(429).json({ error: 'Rate limit exceeded. Please contact us directly.' })
  }

  // Validate and normalise the untrusted payload. The client may ONLY supply the
  // 5 answer indexes, a short situation string, and a language flag. Model,
  // max_tokens, system prompt, and tools are all built server-side.
  const input = parseAssessmentInput(req.body)
  if (!input) {
    return res.status(400).json({ error: 'Invalid assessment payload.' })
  }

  if (!process.env.ANTHROPIC_API_KEY) {
    console.error('[anthropic] ANTHROPIC_API_KEY environment variable is not set.')
    return res.status(503).json({ error: 'AI assessment service is not configured.' })
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
      body: JSON.stringify(buildAssessmentRequest(input)),
    })

    if (!response.ok) {
      // Log upstream detail server-side only; never relay it to the client.
      const detail = await response.text().catch(() => '')
      console.error(`[anthropic] Upstream ${response.status}:`, detail.slice(0, 1000))
      return res.status(502).json({ error: 'AI assessment service is unavailable.' })
    }

    const data = await response.json()
    const toolBlock = (data.content as Array<{ type: string; input?: unknown }> | undefined)?.find(
      b => b.type === 'tool_use',
    )
    if (!toolBlock?.input) {
      console.error('[anthropic] No tool_use block in upstream response.')
      return res.status(502).json({ error: 'AI assessment service returned an unexpected response.' })
    }

    // Return only the structured assessment fields — not the raw upstream body.
    return res.status(200).json({ result: toolBlock.input })
  } catch (err) {
    console.error('[anthropic] Proxy error:', err)
    return res.status(500).json({ error: 'Proxy error' })
  }
}
