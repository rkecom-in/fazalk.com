import type { NextApiRequest, NextApiResponse } from 'next'

const NOTION_API = 'https://api.notion.com/v1/pages'
const DB_ID = 'f551f7aedff44bc6a076211aeacfaf75'

const BUILD_STAGE_MAP = [
  'Idea / Deciding',
  'Designed / Pre-build',
  'Actively Building',
  'Live / Underperforming',
]
const LEADERSHIP_MAP = [
  'CTO / Senior Architect',
  'Senior Dev Learning',
  'Founder / Product Team',
  'Vendor / Agency Deciding',
]
const CLARITY_MAP = [
  'All Decisions Made',
  'Most Made / Some Gaps',
  'Rough Direction Only',
  'No Architecture Plan',
]
const EXPOSURE_MAP = ['Low', 'Moderate', 'High', 'Critical']
const CHALLENGE_MAP = [
  'AI Approach',
  'Cloud Infrastructure',
  'Broken System',
  'Need Second Opinion',
]

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end()

  const { answers, situation, result, contact } = req.body

  const timestamp = new Date().toLocaleString('en-GB', {
    timeZone: 'Asia/Kolkata',
    dateStyle: 'medium',
    timeStyle: 'short',
  })

  const leadName = `${result.riskLevel} Risk — ${result.recommendedEngagement} — ${timestamp}`

  const properties: Record<string, unknown> = {
    Name: { title: [{ text: { content: leadName } }] },
    Status: { select: { name: 'New' } },
    'Risk Level': { select: { name: result.riskLevel } },
    'Risk Score': { number: result.overallScore },
    'Recommended Engagement': { select: { name: result.recommendedEngagement } },
    'Build Stage': { select: { name: BUILD_STAGE_MAP[answers[0]] ?? 'Unknown' } },
    'Technical Leadership': { select: { name: LEADERSHIP_MAP[answers[1]] ?? 'Unknown' } },
    'Decision Clarity': { select: { name: CLARITY_MAP[answers[2]] ?? 'Unknown' } },
    'Risk Exposure': { select: { name: EXPOSURE_MAP[answers[3]] ?? 'Unknown' } },
    'Primary Challenge': { select: { name: CHALLENGE_MAP[answers[4]] ?? 'Unknown' } },
    Situation: { rich_text: [{ text: { content: situation || '' } }] },
    'AI Headline': { rich_text: [{ text: { content: result.headline || '' } }] },
    'AI Analysis': { rich_text: [{ text: { content: result.analysis || '' } }] },
    'Top Risk': { rich_text: [{ text: { content: result.topRisk || '' } }] },
    'Next Step': { rich_text: [{ text: { content: result.nextStep || '' } }] },
    Source: { select: { name: 'Assessment Widget' } },
  }

  // Contact info (Phase 4 capture)
  if (contact?.name) {
    properties['Contact Name'] = { rich_text: [{ text: { content: contact.name } }] }
  }
  if (contact?.email) {
    properties['Contact Email'] = { email: contact.email }
  }
  if (contact?.phone) {
    properties['Contact Phone'] = { phone_number: contact.phone }
  }

  const notionBody = {
    parent: { database_id: DB_ID },
    properties,
  }

  try {
    const notionResp = await fetch(NOTION_API, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.NOTION_API_KEY}`,
        'Content-Type': 'application/json',
        'Notion-Version': '2022-06-28',
      },
      body: JSON.stringify(notionBody),
    })
    const data = await notionResp.json()
    res.status(notionResp.status).json({ ok: notionResp.ok, id: data.id })
  } catch (err) {
    res.status(500).json({ ok: false, error: 'Notion write failed' })
  }
}
