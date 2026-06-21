import type { NextApiRequest, NextApiResponse } from 'next'
import { checkRateLimit, getClientIp, getRequestKey } from '@/lib/rate-limit'
import { isAllowedOrigin } from '@/lib/security'
import { verifyTurnstile } from '@/lib/turnstile'
import { getStrings, type Language } from '@/lib/i18n'
import { QUESTION_RISKS, computeScores, getRiskLevelFromScore } from '@/lib/assessment-shared'
import nodemailer from 'nodemailer'

export const config = { api: { bodyParser: { sizeLimit: '16kb' } } }

const MAIL_FROM = process.env.CONTACT_FROM || 'Fazal K. <fazal@rkecom.in>'
const MAIL_TO = process.env.CONTACT_TO || 'connect@fazalk.com'

// Field length caps — prevents oversized payload abuse.
const MAX_LENGTHS = {
  name:         100,
  email:        254,
  phone:         30,
  website:      200,
  situation:   2000,
  sourceDetail: 200,
  headline:     200,
  analysis:    2000,
  topRisk:      400,
  nextStep:     400,
}

/** HTML-entity-escape a value for safe interpolation into the email HTML. */
function esc(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

/** Trim, length-cap, then HTML-escape an untrusted string. */
function clean(value: unknown, maxLen: number): string {
  if (typeof value !== 'string') return ''
  return esc(value.trim().slice(0, maxLen))
}

/** Basic email format check (validates the raw value before escaping). */
function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

/** answers must be exactly 5 integers in [0,3]. */
function validAnswers(answers: unknown): answers is number[] {
  return (
    Array.isArray(answers) &&
    answers.length === QUESTION_RISKS.length &&
    answers.every(a => Number.isInteger(a) && a >= 0 && a <= 3)
  )
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end()

  if (!isAllowedOrigin(req)) {
    return res.status(403).json({ ok: false, error: 'Forbidden.' })
  }

  const headers = req.headers as Record<string, string | string[] | undefined>

  // ── Rate limit: 3 contact submissions per IP per hour ──
  const key = getRequestKey(headers, 'contact')
  const { allowed } = checkRateLimit(key, 3, 60 * 60 * 1000)
  if (!allowed) {
    return res.status(429).json({ ok: false, error: 'Too many requests. Please try again later.' })
  }

  const verified = await verifyTurnstile(req.body?.turnstileToken, getClientIp(headers))
  if (!verified) {
    return res.status(403).json({ ok: false, error: 'Verification failed. Please reload and try again.' })
  }

  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS } = process.env
  if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS) {
    console.error('[contact] SMTP_* environment variables are not set.')
    return res.status(503).json({ ok: false, error: 'Email service is not configured.' })
  }

  // ── Input validation & sanitisation ──
  const body = (req.body ?? {}) as Record<string, unknown>
  const rawContact = (body.contact ?? {}) as Record<string, unknown>
  const rawResult = (body.result ?? {}) as Record<string, unknown>
  const language: Language = body.language === 'ar' ? 'ar' : 'en'

  const situation    = clean(body.situation, MAX_LENGTHS.situation)
  const sourceDetail = clean(body.sourceDetail, MAX_LENGTHS.sourceDetail) || 'Architecture Advisory Session'

  const contact = {
    name:    clean(rawContact.name,    MAX_LENGTHS.name),
    email:   clean(rawContact.email,   MAX_LENGTHS.email),
    phone:   clean(rawContact.phone,   MAX_LENGTHS.phone),
    website: clean(rawContact.website, MAX_LENGTHS.website),
  }

  // Validate the raw (pre-escape) email so the regex sees the real value.
  const rawEmail = typeof rawContact.email === 'string' ? rawContact.email.trim() : ''
  if (!contact.name) {
    return res.status(400).json({ ok: false, error: 'Name is required.' })
  }
  if (!rawEmail || !isValidEmail(rawEmail)) {
    return res.status(400).json({ ok: false, error: 'A valid email address is required.' })
  }
  if (!validAnswers(body.answers)) {
    return res.status(400).json({ ok: false, error: 'Invalid assessment answers.' })
  }
  const answers = body.answers as number[]

  // ── Recompute risk server-side — never trust client-supplied scores ──
  const scores = computeScores(answers)
  const overallScore = scores.reduce((a, b) => a + b, 0)
  const riskLevel = getRiskLevelFromScore(overallScore)

  // Option labels come from the canonical i18n dictionary (no hand-duplicated maps).
  const questions = getStrings(language).assessmentWidget.questions
  const optionLabel = (i: number) => esc(questions[i]?.options[answers[i]] ?? 'N/A')

  // AI-generated narrative (escaped — model output is untrusted in an HTML context).
  const headline = clean(rawResult.headline, MAX_LENGTHS.headline)
  const analysis = clean(rawResult.analysis, MAX_LENGTHS.analysis).replace(/\n/g, '<br/>')
  const topRisk  = clean(rawResult.topRisk,  MAX_LENGTHS.topRisk)
  const nextStep = clean(rawResult.nextStep, MAX_LENGTHS.nextStep)

  const timestamp = new Date().toLocaleString('en-GB', {
    timeZone: 'Asia/Kolkata',
    dateStyle: 'medium',
    timeStyle: 'short',
  })

  const subject = `New AI Assessment: ${riskLevel} Risk (${contact.name})`

  const html = `
    <div style="font-family: sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; border: 1px solid #eee; padding: 20px; border-radius: 8px;">
      <h2 style="color: #c5a059; border-bottom: 2px solid #c5a059; padding-bottom: 10px;">AI Assessment Result</h2>
      <div style="margin-bottom: 20px; background: #f9f9f9; padding: 15px; border-radius: 5px;">
        <p><strong>Name:</strong> ${contact.name}</p>
        <p><strong>Email:</strong> ${contact.email}</p>
        <p><strong>Phone:</strong> ${contact.phone || 'N/A'}</p>
        <p><strong>Website:</strong> ${contact.website || 'N/A'}</p>
        <p><strong>Submitted:</strong> ${esc(timestamp)}</p>
      </div>
      <div style="background: #111; color: #fff; padding: 20px; border-radius: 5px; margin-bottom: 20px;">
        <h3 style="color: #c5a059; margin-top: 0;">Risk Profile: ${riskLevel} (${overallScore}/20)</h3>
        <p><strong>Requested Session:</strong> ${sourceDetail}</p>
      </div>
      ${headline ? `<h3 style="color: #666;">AI Analysis</h3><p><strong>${headline}</strong></p>` : ''}
      ${analysis ? `<div style="color: #555;">${analysis}</div>` : ''}
      ${topRisk ? `<h3 style="color: #666;">Top Risk</h3><p style="color: #d9534f;">${topRisk}</p>` : ''}
      ${nextStep ? `<h3 style="color: #666;">Next Step</h3><p>${nextStep}</p>` : ''}
      <h3 style="color: #666;">Assessment Breakdown</h3>
      <ul style="list-style: none; padding: 0;">
        <li style="margin-bottom: 8px;"><strong>Build Stage:</strong> ${optionLabel(0)} (${scores[0]}/4)</li>
        <li style="margin-bottom: 8px;"><strong>Technical Leadership:</strong> ${optionLabel(1)} (${scores[1]}/4)</li>
        <li style="margin-bottom: 8px;"><strong>Decision Clarity:</strong> ${optionLabel(2)} (${scores[2]}/4)</li>
        <li style="margin-bottom: 8px;"><strong>Risk Exposure:</strong> ${optionLabel(3)} (${scores[3]}/4)</li>
        <li style="margin-bottom: 8px;"><strong>Primary Challenge:</strong> ${optionLabel(4)} (${scores[4]}/4)</li>
      </ul>
      ${situation ? `<h3 style="color: #666;">Founder's Words</h3><div style="white-space: pre-wrap; background: #fff; padding: 15px; border: 1px solid #eee;">${situation}</div>` : ''}
      <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; font-size: 12px; color: #999; text-align: center;">
        Sent from fazalk.com lead engine
      </div>
    </div>
  `

  try {
    const port = Number(SMTP_PORT) || 587
    const transporter = nodemailer.createTransport({
      host: SMTP_HOST,
      port,
      secure: port === 465, // 465 = implicit TLS; 587 = STARTTLS
      auth: { user: SMTP_USER, pass: SMTP_PASS },
    })

    await transporter.sendMail({
      from: MAIL_FROM,
      to: MAIL_TO,
      replyTo: rawEmail, // replies go straight to the lead
      subject,
      html,
    })
    // Avoid leaking upstream ids/status — return a fixed shape.
    return res.status(200).json({ ok: true })
  } catch (err) {
    console.error('[contact] SMTP send error:', err)
    return res.status(502).json({ ok: false, error: 'Email sending failed' })
  }
}
