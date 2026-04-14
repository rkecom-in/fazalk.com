import type { NextApiRequest, NextApiResponse } from 'next'

const RESEND_API_URL = 'https://api.resend.com/emails'

const BUILD_STAGE_MAP = ['Idea / Deciding', 'Designed / Pre-build', 'Actively Building', 'Live / Underperforming']
const LEADERSHIP_MAP = ['CTO / Senior Architect', 'Senior Dev Learning', 'Founder / Product Team', 'Vendor / Agency Deciding']
const CLARITY_MAP = ['All Decisions Made', 'Most Made / Some Gaps', 'Rough Direction Only', 'No Architecture Plan']
const EXPOSURE_MAP = ['Low', 'Moderate', 'High', 'Critical']
const CHALLENGE_MAP = ['AI Approach', 'Cloud Infrastructure', 'Broken System', 'Need Second Opinion']

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end()

  const { answers, situation, result, contact, source, sourceDetail } = req.body
  const isDirectConnect = source === 'Direct Connect'
  
  const timestamp = new Date().toLocaleString('en-GB', {
    timeZone: 'Asia/Kolkata',
    dateStyle: 'medium',
    timeStyle: 'short',
  })

  const subject = isDirectConnect 
    ? `New Session Request: ${contact?.name || 'Unknown'}` 
    : `New AI Assessment: ${result?.riskLevel || 'Unknown'} Risk (${contact?.name || 'Unknown'})`

  // Build the email body
  let html = `
    <div style="font-family: sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; border: 1px solid #eee; padding: 20px; border-radius: 8px;">
      <h2 style="color: #c5a059; border-bottom: 2px solid #c5a059; padding-bottom: 10px;">${isDirectConnect ? 'Session Request' : 'AI Assessment Result'}</h2>
      
      <div style="margin-bottom: 20px; background: #f9f9f9; padding: 15px; border-radius: 5px;">
        <p><strong>Name:</strong> ${contact?.name || 'N/A'}</p>
        <p><strong>Email:</strong> ${contact?.email || 'N/A'}</p>
        <p><strong>Phone:</strong> ${contact?.phone || 'N/A'}</p>
        <p><strong>Website:</strong> ${contact?.website || 'N/A'}</p>
        <p><strong>Submitted:</strong> ${timestamp}</p>
      </div>
  `

  if (isDirectConnect) {
    html += `
      <h3 style="color: #666;">Requested Session</h3>
      <p style="background: #fffbe6; padding: 10px; border-left: 4px solid #c5a059;">${sourceDetail || 'General Inquiry'}</p>
      
      <h3 style="color: #666;">Client Situation</h3>
      <div style="white-space: pre-wrap; background: #fff; padding: 15px; border: 1px solid #eee;">${situation || 'No detail provided.'}</div>
    `
  } else if (answers && result) {
    html += `
      <div style="background: #111; color: #fff; padding: 20px; border-radius: 5px; margin-bottom: 20px;">
        <h3 style="color: #c5a059; margin-top: 0;">Risk Profile: ${result.riskLevel} (${result.overallScore}/20)</h3>
        <p><strong>Recommendation:</strong> ${result.recommendedEngagement} - ${result.engagementFee}</p>
      </div>

      <h3 style="color: #666;">AI Analysis</h3>
      <p><strong>${result.headline}</strong></p>
      <div style="color: #555;">${result.analysis?.replace(/\n/g, '<br/>')}</div>
      
      <h3 style="color: #666;">Top Risk</h3>
      <p style="color: #d9534f;">${result.topRisk}</p>

      <h3 style="color: #666;">Assessment Breakdown</h3>
      <ul style="list-style: none; padding: 0;">
        <li style="margin-bottom: 8px;"><strong>Build Stage:</strong> ${BUILD_STAGE_MAP[answers[0]] || 'N/A'}</li>
        <li style="margin-bottom: 8px;"><strong>Technical Leadership:</strong> ${LEADERSHIP_MAP[answers[1]] || 'N/A'}</li>
        <li style="margin-bottom: 8px;"><strong>Decision Clarity:</strong> ${CLARITY_MAP[answers[2]] || 'N/A'}</li>
        <li style="margin-bottom: 8px;"><strong>Risk Exposure:</strong> ${EXPOSURE_MAP[answers[3]] || 'N/A'}</li>
        <li style="margin-bottom: 8px;"><strong>Primary Challenge:</strong> ${CHALLENGE_MAP[answers[4]] || 'N/A'}</li>
      </ul>

      <h3 style="color: #666;">Founder's Words</h3>
      <div style="white-space: pre-wrap; background: #fff; padding: 15px; border: 1px solid #eee;">${situation || 'No situation description provided.'}</div>
    `
  }

  html += `
      <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; font-size: 12px; color: #999; text-align: center;">
        Sent from fazalk.com lead engine
      </div>
    </div>
  `

  try {
    const resendResp = await fetch(RESEND_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from: 'connect@viabe.ai',
        to: 'connect@fazalk.com',
        subject: subject,
        html: html
      })
    })

    const data = await resendResp.json()
    
    if (!resendResp.ok) {
        console.error('Resend Error:', data)
    }
    
    res.status(resendResp.status).json({ ok: resendResp.ok, id: data.id })
  } catch (err) {
    console.error('Fetch Error:', err)
    res.status(500).json({ ok: false, error: 'Email sending failed' })
  }
}
