// Offline SES SMTP auth check — verifies credentials + region without sending.
// Usage: node --env-file=.env.local scripts/test-smtp.mjs
import nodemailer from 'nodemailer'

const { SMTP_HOST, SMTP_PORT = '587', SMTP_USER, SMTP_PASS } = process.env
if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS) {
  console.error('Missing SMTP_HOST / SMTP_USER / SMTP_PASS')
  process.exit(1)
}
const port = Number(SMTP_PORT)
console.log(`Host: ${SMTP_HOST}:${port}`)
console.log(`User: ${SMTP_USER.slice(0, 8)}… (len ${SMTP_USER.length})`)
console.log(`Pass: len ${SMTP_PASS.length}, endsWith "=" : ${SMTP_PASS.endsWith('=')}`)
if (SMTP_USER !== SMTP_USER.trim() || SMTP_PASS !== SMTP_PASS.trim()) {
  console.warn('⚠️  WHITESPACE detected in user/pass — trim it.')
}

const t = nodemailer.createTransport({
  host: SMTP_HOST,
  port,
  secure: port === 465,
  auth: { user: SMTP_USER, pass: SMTP_PASS },
})

try {
  await t.verify()
  console.log('✅ AUTH OK — credentials + region are valid. Issue is Vercel env/redeploy, not the creds.')
} catch (e) {
  console.error('❌ AUTH FAILED:', e.responseCode || e.code, '-', e.response || e.message)
  console.error('   535 here = these exact creds do not match this host/region. Fix region or regenerate SMTP creds.')
}
