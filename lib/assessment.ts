import { getStrings, type Language } from '@/lib/i18n'
import {
  DIM_LABELS,
  QUESTION_RISKS,
  SITUATION_MAX_LEN,
  computeScores,
  getRiskLevelFromScore,
} from '@/lib/assessment-shared'

export * from '@/lib/assessment-shared'

/* ─── PINNED MODEL CONFIG (server-owned, never client-supplied) ──────────── */
export const ASSESSMENT_MODEL = 'claude-haiku-4-5'
export const ASSESSMENT_MAX_TOKENS = 900

export const SYSTEM_PROMPT = `You are the advisory assessment AI for Fazal K.'s CTO-level architecture consulting practice (fazalk.com).

ABOUT FAZAL K.
Fazal K. is a CTO-level AI and cloud architecture consultant with 25+ years of production systems experience. He works with businesses that need senior technical clarity before they build, scale, or invest. He is not a freelance developer — he is a strategic advisor who operates at the architecture and decision-making level. Engagements are intentionally selective and outcome-driven.

WHAT IS OFFERED
Three core service types, delivered through focused sessions:

1. Architecture Design
   Full system architecture for AI products, cloud infrastructure, and data pipelines — built around the client's constraints, team, and strategic goals. Clients walk away with an end-to-end technical specification ready for their engineering team to execute.

2. Technical Review
   An independent assessment of an existing architecture to identify risks, inefficiencies, and missed opportunities before they become production problems. Delivered as a structured written report.

3. Technical Due Diligence
   Rigorous technical evaluation of AI systems, vendor proposals, or existing platforms — before signing a contract, making a hire, or committing to a roadmap. Designed for high-stakes decisions where an expert second opinion is critical.

SESSION OPTION
One outcome-driven advisory session, requested after the assessment:

Architecture Advisory Session
   A focused session scoped around the assessment result. It can be short and tactical when the problem is narrow, or deeper when the answers show interconnected architecture risk. Ideal for:
   - Evaluating AI feasibility for a product or workflow
   - Choosing between build vs. buy for an AI capability
   - Getting a second opinion on an existing architecture
   - Understanding LLM, RAG, fine-tuning, or agentic workflow fit
   - Designing a full AI system architecture end-to-end
   - Auditing an underperforming AI system (high cost, poor output, slow latency)
   - Planning an AWS/Azure migration or optimization
   - Building a technical roadmap for a new AI product
   Deliverable: Clear CTO-level recommendation, decision framework, architecture review, or execution-ready direction depending on the assessed risk.

WHO THE CLIENTS ARE
- GCC Software & IT Companies (primary market)
- SaaS & Platform Businesses building AI features
- Digital Transformation Firms at a critical architecture decision point
- Founders building AI products who lack a senior technical co-founder
- IT Resellers & System Integrators presenting AI proposals to enterprise clients
- SME Platform & Marketplace Businesses scaling into AI infrastructure

RISK SCORING
Total score out of 20 across 5 dimensions (each 1–4):
- Low risk: 5–9 — architecture is on solid footing, specific clarity needed
- Medium risk: 10–14 — meaningful gaps or fragile decisions requiring structured advisory
- High risk: 15–20 — significant exposure, wrong decisions already compounding

RULES FOR GENERATING THE REPORT
- Be specific. Reference exactly what the person said — their stage, their team composition, their primary challenge.
- Do not be generic. Name the exact risk pattern you see based on their combination of answers.
- If they provided a free-text situation description, use it to sharpen and personalise the analysis beyond what the answers alone reveal.
- Keep the report concise. The client should be able to scan it in under one minute.
- The analysis must be exactly two short paragraphs, 35-50 words each.
- The top risk and next step must each be one sentence.
- The analysis should feel like it was written by a senior technical advisor who has read the answers once and diagnosed a familiar pattern — not by a form processor.`

export const ASSESSMENT_TOOL = {
  name: 'generate_assessment',
  description: 'Generate a structured advisory assessment report based on the 5-question risk profile.',
  input_schema: {
    type: 'object' as const,
    properties: {
      riskLevel:             { type: 'string', enum: ['Low', 'Medium', 'High'], description: 'Overall risk level based on total score.' },
      overallScore:          { type: 'number', minimum: 5, maximum: 20, description: 'Total risk score out of 20. Use the exact total supplied by the application.' },
      dimensionScores: {
        type: 'object',
        properties: {
          Stage:      { type: 'number', minimum: 1, maximum: 4, description: 'Use the exact 1-4 score supplied by the application.' },
          Leadership: { type: 'number', minimum: 1, maximum: 4, description: 'Use the exact 1-4 score supplied by the application.' },
          Clarity:    { type: 'number', minimum: 1, maximum: 4, description: 'Use the exact 1-4 score supplied by the application.' },
          Exposure:   { type: 'number', minimum: 1, maximum: 4, description: 'Use the exact 1-4 score supplied by the application.' },
          Challenge:  { type: 'number', minimum: 1, maximum: 4, description: 'Use the exact 1-4 score supplied by the application.' },
        },
        required: ['Stage', 'Leadership', 'Clarity', 'Exposure', 'Challenge'],
      },
      headline:              { type: 'string', description: 'One sharp sentence naming their specific situation and risk. Maximum 12 words.' },
      analysis:              { type: 'string', description: 'Exactly two short paragraphs separated by double newlines. Each paragraph must be 35-50 words. Para 1: the specific risk pattern. Para 2: what resolving it should focus on. Be direct and specific.' },
      topRisk:               { type: 'string', description: 'The single most critical risk in one sentence, maximum 22 words.' },
      nextStep:              { type: 'string', description: 'One clear action the person should take now, maximum 28 words.' },
    },
    required: ['riskLevel', 'overallScore', 'dimensionScores', 'headline', 'analysis', 'topRisk', 'nextStep'],
  },
} as const

export interface AssessmentInput {
  answers: number[]
  situation: string
  language: Language
}

/**
 * Validate and normalise the untrusted client payload.
 * Returns null if the shape is invalid — the only fields the client may supply.
 */
export function parseAssessmentInput(body: unknown): AssessmentInput | null {
  if (typeof body !== 'object' || body === null) return null
  const b = body as Record<string, unknown>

  const answers = b.answers
  if (!Array.isArray(answers) || answers.length !== QUESTION_RISKS.length) return null
  if (!answers.every(a => Number.isInteger(a) && (a as number) >= 0 && (a as number) <= 3)) return null

  const language: Language = b.language === 'ar' ? 'ar' : 'en'
  const situation = typeof b.situation === 'string' ? b.situation.slice(0, SITUATION_MAX_LEN) : ''

  return { answers: answers as number[], situation, language }
}

/**
 * Build the Anthropic Messages request entirely server-side from the validated
 * input. The client never supplies model, max_tokens, system, or tools.
 */
export function buildAssessmentRequest({ answers, situation, language }: AssessmentInput) {
  const t = getStrings(language)
  const questions = t.assessmentWidget.questions
  const scores = computeScores(answers)
  const totalRisk = scores.reduce((a, b) => a + b, 0)
  const riskLevel = getRiskLevelFromScore(totalRisk)

  const userMsg =
    `Assessment answers:\n${questions
      .map((q, i) => `Q${i + 1} [${q.category}]: "${q.text}"\nAnswer: "${q.options[answers[i]]}" (risk: ${scores[i]}/4)`)
      .join('\n\n')}` +
    `\n\nUse these exact calculated scores. Do not convert them to percentages:\n` +
    `Risk level: ${riskLevel}\nTotal risk score: ${totalRisk}/20\n` +
    `Dimension scores: ${DIM_LABELS.map((label, i) => `${label}: ${scores[i]}/4`).join(', ')}\n` +
    `${situation ? `\nFounder's situation (their words):\n"${situation}"` : '\nNo situation description provided.'}`

  const langInstruction =
    language === 'ar'
      ? '\n\nIMPORTANT: Write all text field values (headline, analysis, topRisk, nextStep) in Arabic (Modern Standard Arabic). Keep all property names and enum values in English exactly as defined in the tool schema.'
      : ''

  return {
    model: ASSESSMENT_MODEL,
    max_tokens: ASSESSMENT_MAX_TOKENS,
    system: [
      {
        type: 'text',
        text: SYSTEM_PROMPT + langInstruction,
        cache_control: { type: 'ephemeral' },
      },
    ],
    tools: [ASSESSMENT_TOOL],
    tool_choice: { type: 'tool', name: 'generate_assessment' },
    messages: [{ role: 'user', content: userMsg }],
  }
}
