// Full SES send test — auth + recipient + delivery (what /api/contact does).
// Usage: node --env-file=.env.vercel scripts/test-smtp-send.mjs
import nodemailer from 'nodemailer'

const { SMTP_HOST, SMTP_PORT = '587', SMTP_USER, SMTP_PASS, CONTACT_FROM, CONTACT_TO } = process.env
const port = Number(SMTP_PORT)
const from = CONTACT_FROM || 'Fazal K. <fazal@rkecom.in>'
const to = CONTACT_TO || 'connect@fazalk.com'

const t = nodemailer.createTransport({
  host: SMTP_HOST, port, secure: port === 465,
  auth: { user: SMTP_USER, pass: SMTP_PASS },
})

console.log(`from=${from}  to=${to}  host=${SMTP_HOST}:${port}`)
try {
  const info = await t.sendMail({
    from, to, replyTo: 'ses-verify@example.com',
    subject: 'SES delivery test (ignore)',
    text: 'If you received this, SES send works end-to-end.',
  })
  console.log('✅ SENT — messageId:', info.messageId, '| response:', info.response)
} catch (e) {
  console.error('❌ SEND FAILED:', e.responseCode || e.code, '-', (e.response || e.message))
}
