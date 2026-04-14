import { NextApiRequest, NextApiResponse } from 'next';
import crypto from 'crypto';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end();

  const { code } = req.body;
  if (!code || typeof code !== 'string') return res.status(400).json({ error: 'Missing code' });

  const validCodes = (process.env.INVITE_CODES || '').split(',').map(c => c.trim().toLowerCase());
  if (!validCodes.includes(code.toLowerCase())) {
    return res.status(401).json({ error: 'Invalid invite code' });
  }

  const secret = process.env.INVITE_SECRET || 'fallback-secret-for-dev';
  const signature = crypto.createHmac('sha256', secret).update(code.toLowerCase()).digest('hex');
  const token = `${code.toLowerCase()}.${signature}`;

  const isProd = process.env.NODE_ENV === 'production';
  res.setHeader(
    'Set-Cookie',
    `fazalk-access-token=${token}; Path=/; HttpOnly; SameSite=Strict; ${isProd ? 'Secure;' : ''} Max-Age=31536000`
  );

  return res.status(200).json({ success: true });
}
