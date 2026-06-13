/**
 * Cloudflare Turnstile server-side verification.
 *
 * Activation is opt-in via env: if TURNSTILE_SECRET_KEY is unset the check is a
 * no-op (returns true) so local/dev and un-provisioned deploys keep working.
 * Set TURNSTILE_SECRET_KEY (server) + NEXT_PUBLIC_TURNSTILE_SITE_KEY (client)
 * to enforce. Get keys at https://dash.cloudflare.com → Turnstile.
 */
const VERIFY_URL = 'https://challenges.cloudflare.com/turnstile/v0/siteverify'

export function turnstileEnabled(): boolean {
  return Boolean(process.env.TURNSTILE_SECRET_KEY)
}

export async function verifyTurnstile(token: unknown, remoteIp?: string): Promise<boolean> {
  const secret = process.env.TURNSTILE_SECRET_KEY
  if (!secret) return true // disabled until configured
  if (typeof token !== 'string' || !token) return false

  try {
    const form = new URLSearchParams()
    form.append('secret', secret)
    form.append('response', token)
    if (remoteIp && remoteIp !== 'unknown') form.append('remoteip', remoteIp)

    const resp = await fetch(VERIFY_URL, { method: 'POST', body: form })
    const data = (await resp.json()) as { success?: boolean }
    return data.success === true
  } catch (err) {
    console.error('[turnstile] verification error:', err)
    return false
  }
}
