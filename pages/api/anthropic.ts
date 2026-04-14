import type { NextApiRequest, NextApiResponse } from 'next'

const rateLimitCache = new Map<string, { count: number; timestamp: number }>();

// 5 requests per 24 hours per IP
const MAX_REQUESTS = 5;
const WINDOW_MS = 24 * 60 * 60 * 1000;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end()

  const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress || 'unknown';
  const ipStr = Array.isArray(ip) ? ip[0] : ip;

  const now = Date.now();
  const rateData = rateLimitCache.get(ipStr) || { count: 0, timestamp: now };

  // Reset window if passed
  if (now - rateData.timestamp > WINDOW_MS) {
    rateData.count = 0;
    rateData.timestamp = now;
  }

  rateData.count++;
  rateLimitCache.set(ipStr, rateData);

  if (rateData.count > MAX_REQUESTS) {
    return res.status(429).json({ error: 'Rate limit exceeded. Please contact us directly.' });
  }

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY!,
        'anthropic-version': '2023-06-01',
        'anthropic-beta': 'prompt-caching-2024-07-31',
      },
      body: JSON.stringify(req.body),
    })
    const data = await response.json()
    res.status(response.status).json(data)
  } catch (err) {
    res.status(500).json({ error: 'Proxy error' })
  }
}
