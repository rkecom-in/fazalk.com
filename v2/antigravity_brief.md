# fazalk.com — Next.js Migration & AI Widget Implementation Brief

**Client:** Fazal Khan / Advisory  
**Current site:** fazalk.com (plain HTML, deployed on Vercel)  
**Brief prepared by:** Clau (AI Chief of Staff)  
**Scope:** Framework migration + 3 Phase 1 widgets + API proxy

---

## Part 1 — Framework Migration: HTML → Next.js

### Why Next.js

The site needs server-side API routes to securely proxy Anthropic API calls for the AI-powered Assessment + Triage widget. The API key must never be exposed client-side. Next.js API routes solve this cleanly, and the site is already on Vercel which deploys Next.js with zero configuration.

### Migration Principles

**Do not redesign anything.** The existing site has a deliberate dark/gold aesthetic — typography, spacing, animations, colour values, and overall visual quality must be preserved exactly. This is a lift-and-shift migration, not a redesign.

Specifically preserve:
- All CSS custom properties (`--gold`, `--bg`, `--border`, etc.)
- All scroll-trigger animations (sections revealed on scroll)
- All font choices: Cormorant Garamond + DM Sans
- All dark/gold colour palette
- All existing copy (hero, offerings, deliverables, pricing, footer)
- All pre-qualification form flows and their validation logic
- The `By Invitation Only` disabled state on the $3,000 card
- The `View Fazal's LinkedIn Profile →` footer link

### Migration Steps

**1. Project setup**

```bash
npx create-next-app@latest fazalk --typescript --tailwind=false --app=false --src-dir=false
```

Use the Pages Router (`pages/`), not the App Router. The site is a single page with no dynamic routing — Pages Router is simpler for this use case.

**2. Page structure**

```
pages/
  index.tsx          ← main page (all existing HTML content)
  api/
    anthropic.ts     ← API proxy route (see Part 3)
components/
  widgets/
    AssessmentTriage.tsx   ← merged assessment widget
    CostEstimator.tsx      ← cost estimator widget
    DecisionMap.tsx        ← architecture decision map widget
public/              ← any static assets
styles/
  globals.css        ← all existing CSS
```

**3. HTML → JSX conversion**

- Move all existing HTML into `pages/index.tsx`
- Convert HTML attributes to JSX (`class` → `className`, `for` → `htmlFor`, etc.)
- All inline `<style>` blocks move to `styles/globals.css`
- All `<script>` blocks move to component files or `useEffect` hooks
- Keep all existing CSS exactly as-is — do not convert to CSS modules or Tailwind

**4. Fonts**

Load fonts via `next/head` in `_app.tsx`:

```tsx
import Head from 'next/head'
<Head>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400;1,600&family=DM+Sans:wght@300;400;500&family=DM+Mono:wght@300;400&display=swap" rel="stylesheet" />
</Head>
```

**5. Scroll animations**

The existing site uses scroll-triggered reveal animations. These must be preserved. Port the existing IntersectionObserver logic into a `useEffect` hook in `pages/index.tsx`. The animations should behave identically to the current site.

**6. Form handling**

The existing forms use web3forms. Keep this integration exactly as-is. Do not change form endpoints, field names, or redirect behaviour.

---

## Part 2 — Page Layout: Where the Widgets Go

Insert the widgets into the existing page in this exact order. Do not reorder existing sections.

```
Hero
What We Solve
What This Is Not          ← copy-only section (see note below)
[WIDGET] Decision Map     ← passive visual, no API
Core Offerings (01–05)
[WIDGET] Assessment + Triage  ← AI-powered, needs API proxy
Sample Deliverables
[WIDGET] Cost Estimator   ← pure JS, no API
Pricing
Closing CTA
Footer
```

**"What This Is Not" section** — this is a new copy-only section to be added between "What We Solve" and the Decision Map. Use the same visual treatment as the "What We Solve" section. Content:

- Not open-ended consulting or ongoing advisory
- Not implementation or development services
- Not generic AI strategy discussions without a defined objective
- Not exploratory sessions without a defined objective

Match the section heading style (`section-label` eyebrow + content bullets) to the existing "What We Solve" block.

---

## Part 3 — API Proxy Route

Create `pages/api/anthropic.ts`. This is the only file that touches the Anthropic API key.

```typescript
import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end()

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': process.env.ANTHROPIC_API_KEY!,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify(req.body),
  })

  const data = await response.json()
  res.status(response.status).json(data)
}
```

**Environment variable:** Add `ANTHROPIC_API_KEY` to the Vercel project environment variables. Never hardcode it. Never expose it client-side.

**Widget API calls:** The Assessment + Triage widget should call `/api/anthropic` (the local proxy), not `https://api.anthropic.com/v1/messages` directly. Update the fetch URL in the widget component accordingly.

The Cost Estimator and Decision Map make no API calls — they are pure client-side JS.

---

## Part 4 — Widget 1: Architecture Decision Map

**File:** `components/widgets/DecisionMap.tsx`  
**Source:** `fazalk_decision_map.html` (provided)  
**API dependency:** None — pure SVG and vanilla JS  
**Placement:** Between "What This Is Not" and "Core Offerings"

### Implementation Notes

- Port the SVG map and all interaction logic from the provided HTML file into a React component
- The SVG should be rendered inline (not as an `<img>`) so hover interactions work
- All node data (`NODES`, `EDGES`, `COLORS`) moves to the component file as TypeScript constants
- `drawEdges()`, `drawNodes()`, `addPulse()`, `onNodeEnter()`, `onNodeLeave()`, `highlightConnected()`, `positionTooltip()` all move into the component, called from `useEffect` after mount
- The tooltip must be rendered as a DOM element positioned absolutely within the map wrapper — preserve the existing tooltip positioning logic exactly
- The staggered entrance animation (nodes fading in with delay) must be preserved
- The pulse animation on root/L1 nodes must be preserved
- Scroll-into-view trigger: the map entrance animation should fire when the section scrolls into the viewport (use IntersectionObserver), not on page load

### Sizing

The SVG viewBox is `0 0 820 520`. It should be responsive — `width: 100%`, `height: auto`, with a minimum height of `400px` on mobile.

---

## Part 5 — Widget 2: Assessment + Triage (Merged)

**File:** `components/widgets/AssessmentTriage.tsx`  
**Source:** `fazalk_assessment_triage_merged.html` (provided)  
**API dependency:** Yes — calls `/api/anthropic` (the proxy route)  
**Placement:** Between "Core Offerings" and "Sample Deliverables"

### Flow Summary

The widget runs in three phases displayed as a progress bar at the top:

**Phase 1 — Risk Assessment (5 questions)**
- One question at a time, animated card transitions
- Auto-advances to next question 340ms after an option is selected
- Question categories: Build Stage, Technical Leadership, Decision Clarity, Risk Exposure, Primary Challenge
- Each answer carries a risk score (1–4)
- Back navigation available from question 2 onwards

**Phase 2 — Your Situation**
- Shows a mini risk profile bar (5 dimensions, animated fill)
- Optional free-text field (max 500 chars) for situation context
- User can skip the text and submit directly

**Phase 3 — Recommendation (AI-generated)**
- Loading state with staggered step reveals and spinner
- Result panel: risk badge, 5 dimension score bars, AI-generated headline + 3-paragraph analysis, recommended engagement box (gold-bordered), two summary blocks, CTA to the correct booking form

### API Call

- Calls `/api/anthropic` (local proxy, not Anthropic directly)
- Model: `claude-sonnet-4-20250514`
- Max tokens: 1200
- System prompt and user message construction: see source HTML file — port exactly
- Response is parsed as JSON (the model is instructed to return only JSON)

### State Management

Use `useState` and `useEffect` — no external state library needed. State variables needed:

```typescript
const [phase, setPhase] = useState<1|2|3>(1)
const [current, setCurrent] = useState(0)
const [answers, setAnswers] = useState<number[]>([])
const [situation, setSituation] = useState('')
const [loading, setLoading] = useState(false)
const [result, setResult] = useState<AssessmentResult|null>(null)
const [error, setError] = useState<string|null>(null)
```

### Important: Preserve All Animations

- Question card fade-in on transition (opacity 0→1, translateY 8px→0)
- Option selection highlight (border + background change)
- Risk summary bars animated fill in Phase 2
- Loading spinner + staggered step text reveals
- Result panel fade-in
- Score bar animated fill after result renders (use `setTimeout` + ref)

---

## Part 6 — Widget 3: Cost Estimator

**File:** `components/widgets/CostEstimator.tsx`  
**Source:** `fazalk_cost_estimator.html` (provided)  
**API dependency:** None — pure JS calculation  
**Placement:** Between "Sample Deliverables" and "Pricing"

### Implementation Notes

- Port all slider logic, calculation functions, and display update logic into the component
- All calculations run client-side on every slider change — no debouncing needed
- The engagement recommendation auto-selects based on `riskExposure` value (thresholds in source file)
- The "See the full breakdown" toggle uses `useState<boolean>` for open/closed state
- The CTA button label updates dynamically to match the recommended tier
- Slider fill bars are updated via `useRef` on each calculation — not CSS-only

### Calculation Logic (preserve exactly)

```
workingDays = months × 21
totalBuild = team × rate × workingDays
reworkMultiplier = getReworkMultiplier(confidence)  // 1.1–2.5 scale
riskExposure = totalBuild × (1 − confidence/100) × reworkMultiplier
```

Engagement selection thresholds:
- riskExposure ≤ $40,000 → Strategic Clarity Session ($350)
- riskExposure ≤ $150,000 → Architecture Decision Intensive ($1,200)
- riskExposure > $150,000 → AI Architecture Blueprint ($3,000)

---

## Part 7 — Notion Leads Integration

### Overview

When a visitor completes the Assessment + Triage widget, the result is automatically saved as a structured lead record in Notion. No forms, no email submissions — the lead lands pre-qualified with full context directly in the pipeline.

**Notion Database:** fazalk.com — Leads
**Database ID:** `f551f7aedff44bc6a076211aeacfaf75`
**Views:** Pipeline Board (grouped by Status), New Leads (filtered + sorted by risk score)

### New API Route: `pages/api/notion-lead.ts`

```typescript
import type { NextApiRequest, NextApiResponse } from 'next'

const NOTION_API = 'https://api.notion.com/v1/pages'
const DB_ID = 'f551f7aedff44bc6a076211aeacfaf75'

const BUILD_STAGE_MAP = ['Idea / Deciding','Designed / Pre-build','Actively Building','Live / Underperforming']
const LEADERSHIP_MAP = ['CTO / Senior Architect','Senior Dev Learning','Founder / Product Team','Vendor / Agency Deciding']
const CLARITY_MAP = ['All Decisions Made','Most Made / Some Gaps','Rough Direction Only','No Architecture Plan']
const EXPOSURE_MAP = ['Low','Moderate','High','Critical']
const CHALLENGE_MAP = ['AI Approach','Cloud Infrastructure','Broken System','Need Second Opinion']

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end()

  const { answers, situation, result } = req.body

  const timestamp = new Date().toLocaleString('en-GB', {
    timeZone: 'Asia/Kolkata', dateStyle: 'medium', timeStyle: 'short'
  })
  const leadName = `${result.riskLevel} Risk — ${result.recommendedEngagement} — ${timestamp}`

  const notionBody = {
    parent: { database_id: DB_ID },
    properties: {
      Name: { title: [{ text: { content: leadName } }] },
      Status: { select: { name: 'New' } },
      'Risk Level': { select: { name: result.riskLevel } },
      'Risk Score': { number: result.overallScore },
      'Recommended Engagement': { select: { name: result.recommendedEngagement } },
      'Build Stage': { select: { name: BUILD_STAGE_MAP[answers[0]] } },
      'Technical Leadership': { select: { name: LEADERSHIP_MAP[answers[1]] } },
      'Decision Clarity': { select: { name: CLARITY_MAP[answers[2]] } },
      'Risk Exposure': { select: { name: EXPOSURE_MAP[answers[3]] } },
      'Primary Challenge': { select: { name: CHALLENGE_MAP[answers[4]] } },
      Situation: { rich_text: [{ text: { content: situation || '' } }] },
      'AI Headline': { rich_text: [{ text: { content: result.headline || '' } }] },
      'AI Analysis': { rich_text: [{ text: { content: result.analysis || '' } }] },
      'Top Risk': { rich_text: [{ text: { content: result.topRisk || '' } }] },
      'Next Step': { rich_text: [{ text: { content: result.nextStep || '' } }] },
      Source: { select: { name: 'Assessment Widget' } },
    }
  }

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
}
```

### Widget Integration

In `AssessmentTriage.tsx`, after `renderResult(json)` fires, call this function silently in the background. It must never block the UI or show any state to the visitor.

```typescript
async function saveLeadToNotion(answers: number[], situation: string, result: AssessmentResult) {
  try {
    await fetch('/api/notion-lead', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ answers, situation, result })
    })
  } catch {
    // Silent fail — never surface CRM errors to the visitor
  }
}

// Call immediately after renderResult(json):
saveLeadToNotion(answers, situation, json)
```

### What Each Lead Record Contains

| Field | Source |
|---|---|
| Name | Auto-generated: `{Risk} Risk — {Engagement} — {timestamp IST}` |
| Status | Always starts as "New" |
| Risk Level | Low / Medium / High from AI |
| Risk Score | Numeric 5–20 |
| Recommended Engagement | AI recommendation |
| Build Stage → Primary Challenge | 5 structured answers |
| Situation | Visitor's free-text description |
| AI Headline | One-line AI summary |
| AI Analysis | Full 3-paragraph AI analysis |
| Top Risk | Single critical risk |
| Next Step | AI-recommended immediate action |
| Source | "Assessment Widget" |

### No Personal Data by Design

The widget collects zero PII — no name, no email, no phone. The lead record captures intent and context only. When Fazal reviews a lead and decides to follow up, the visitor has already been directed to the booking form which captures contact details at the point of commitment. This is DPDP Act 2023 aligned and removes all friction from the assessment experience.

---

## Part 8 — Environment & Deployment

### Environment Variables (Vercel)

| Variable | Value | Visibility |
|---|---|---|
| `ANTHROPIC_API_KEY` | sk-ant-... | Server only — never expose to client |
| `NOTION_API_KEY` | secret_... | Server only — never expose to client |

### Vercel Configuration

No changes needed to the existing Vercel project settings. The site is already on Vercel. After the Next.js migration, the deploy process is unchanged — push to main, Vercel builds automatically.

### Build Check

Before delivery, confirm:

```bash
npm run build   # must complete with zero errors
npm run start   # must serve correctly on localhost:3000
```

---

## Part 9 — Quality Checklist

Before handoff, verify each item:

**Migration**
- [ ] All existing copy is present and identical to the current live site
- [ ] All existing section order is preserved
- [ ] All existing animations work (scroll reveals, form transitions)
- [ ] Font rendering matches current site (Cormorant Garamond, DM Sans)
- [ ] Dark background and gold accent colours match exactly
- [ ] The $3,000 "By Invitation Only" button is disabled and non-clickable
- [ ] The LinkedIn footer link is present: "View Fazal's LinkedIn Profile →"
- [ ] All pre-qualification forms submit correctly via web3forms
- [ ] Mobile responsive behaviour preserved

**Widgets**
- [ ] Decision Map renders and animates on scroll-into-view
- [ ] Decision Map node hover shows tooltip with correct content
- [ ] Decision Map edge highlighting on hover works
- [ ] Assessment advances automatically after option selection
- [ ] Assessment Phase 2 risk bars animate on entry
- [ ] Assessment API call goes to `/api/anthropic` (not Anthropic directly)
- [ ] Assessment result renders with animated score bars
- [ ] Assessment restart works cleanly
- [ ] Cost Estimator all four sliders update output live
- [ ] Cost Estimator engagement recommendation updates based on risk exposure
- [ ] Cost Estimator breakdown toggle opens and closes
- [ ] Cost Estimator CTA label matches recommended tier

**API Security**
- [ ] `ANTHROPIC_API_KEY` is set in Vercel environment variables
- [ ] No API key is present anywhere in client-side code or build output
- [ ] `/api/anthropic` returns 405 for non-POST requests

---

## Part 10 — Deliverables Provided to Antigravity

The following HTML prototype files are provided as reference implementations. They contain the complete widget logic, styling, and interaction code. Port these into React components as described above.

| File | Widget | API? |
|---|---|---|
| `fazalk_decision_map.html` | Architecture Decision Map | No |
| `fazalk_assessment_triage_merged.html` | Assessment + Triage (merged) | Yes |
| `fazalk_cost_estimator.html` | Cost Estimator | No |
| `fazalk_ask_widget.html` | Ask a Question (Phase 2 — do not implement yet) | Yes |

The `fazalk_ask_widget.html` file is provided for reference only. Do not implement it in this phase. A placeholder section can be left in the page structure for future insertion.

---

**Notion Integration**
- [ ] `NOTION_API_KEY` is set in Vercel environment variables
- [ ] `pages/api/notion-lead.ts` returns 405 for non-POST requests
- [ ] Completing the assessment creates a new record in the `fazalk.com — Leads` database
- [ ] All 5 assessment answers map to correct select option labels
- [ ] AI Headline, Analysis, Top Risk, Next Step fields populate correctly
- [ ] Lead name includes risk level, engagement, and IST timestamp
- [ ] Status is always "New" on creation
- [ ] Notion write fails silently — visitor never sees an error if it fails

## Part 11 — Questions

Direct all questions and clarifications to Fazal Khan via the existing project communication channel.
