import { useState, useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { useGlobalUX } from '@/components/providers/GlobalUXProvider'
import { CheckCircle2 } from 'lucide-react'
import DirectConnectForm from '@/components/widgets/DirectConnectForm'

/* ─── TYPES ─────────────────────────────────────────────────────────────── */
interface Question { category: string; text: string; options: { label: string; risk: number }[] }

interface AssessmentResult {
  riskLevel: 'Low' | 'Medium' | 'High'
  overallScore: number
  dimensionScores: Record<string, number>
  headline: string
  analysis: string
  topRisk: string
  nextStep: string
}

/* ─── DATA ──────────────────────────────────────────────────────────────── */
const DIM_LABELS = ['Stage', 'Leadership', 'Clarity', 'Exposure', 'Challenge']
const DIM_LABELS_AR = ['المرحلة', 'القيادة', 'الوضوح', 'التعرض', 'التحدي']

// Questions are supplied at runtime from the i18n dictionary.
// The risk values must stay fixed — only the display strings are translated.
const QUESTION_RISKS = [
  [1, 2, 3, 4],
  [1, 2, 3, 4],
  [1, 2, 3, 4],
  [1, 2, 3, 4],
  [2, 2, 3, 4],
]

const SYSTEM_PROMPT = `You are the advisory assessment AI for Fazal K.'s CTO-level architecture consulting practice (fazalk.com).

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

const ASSESSMENT_TOOL = {
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
}

async function readAssessmentApiError(resp: Response) {
  try {
    return await resp.json()
  } catch {
    try {
      return await resp.text()
    } catch {
      return null
    }
  }
}

function logAssessmentFailure(reason: unknown) {
  let message = typeof reason === 'string' ? reason : ''
  if (!message) {
    try {
      message = JSON.stringify(reason, null, 2)
    } catch {
      message = 'Unknown assessment failure.'
    }
  }

  console.error(`[Assessment] AI call failed: ${message}`)
}

function getRiskLevelFromScore(score: number): AssessmentResult['riskLevel'] {
  if (score <= 9) return 'Low'
  if (score <= 14) return 'Medium'
  return 'High'
}

function buildLocalAssessmentResult({
  language,
  questions,
  answers,
  scores,
  situation,
}: {
  language: 'en' | 'ar'
  questions: Question[]
  answers: number[]
  scores: number[]
  situation: string
}): AssessmentResult {
  const totalRisk = scores.reduce((a, b) => a + b, 0)
  const riskLevel = getRiskLevelFromScore(totalRisk)
  const dimensionScores = Object.fromEntries(DIM_LABELS.map((label, i) => [label, scores[i] || 0]))
  const stage = questions[0]?.options[answers[0]]?.label || ''
  const leadership = questions[1]?.options[answers[1]]?.label || ''
  const clarity = questions[2]?.options[answers[2]]?.label || ''
  const exposure = questions[3]?.options[answers[3]]?.label || ''
  const challenge = questions[4]?.options[answers[4]]?.label || ''
  const context = situation.trim()

  if (language === 'ar') {
    const headline = riskLevel === 'High'
      ? 'تعرض معماري عالٍ يحتاج قراراً تقنياً قبل الاستمرار.'
      : riskLevel === 'Medium'
        ? 'قرارات معمارية مهمة تحتاج وضوحاً قبل البناء.'
        : 'أساس جيد يحتاج تحققاً مركزاً قبل التنفيذ.'

    return {
      riskLevel,
      overallScore: totalRisk,
      dimensionScores,
      headline,
      analysis: `يشير نمط الإجابات إلى أن المرحلة الحالية هي: ${stage}. القرار التقني يتأثر بواقع القيادة: ${leadership}. أكبر نقطة يجب ضبطها الآن هي ${challenge}، خصوصاً مع مستوى تعرض للمخاطر يعكس: ${exposure}.${context ? ` السياق الإضافي الذي ذكرته هو: ${context}.` : ''}\n\nالتركيز العملي الآن هو تحويل الاتجاه العام إلى قرار معماري مكتوب: ما النمط المناسب، ما القيود، ما الافتراضات التي تحتاج اختباراً، وما الذي لا ينبغي بناؤه بعد. جلسة استشارية مركزة ستقلل احتمال اختيار مسار مكلف أو صعب التصحيح لاحقاً.`,
      topRisk: `المخاطرة الرئيسية هي اتخاذ قرار حول ${challenge} قبل توثيق القيود والافتراضات المعمارية.`,
      nextStep: 'اجمع قيود البيانات والمستخدمين وزمن الاستجابة والتكلفة، ثم راجعها في جلسة معمارية قبل أي التزام هندسي إضافي.',
    }
  }

  const headline = riskLevel === 'High'
    ? 'High architecture exposure needs a technical decision before continuing.'
    : riskLevel === 'Medium'
      ? 'Important architecture decisions need clarity before build.'
      : 'Solid footing, with focused validation needed before execution.'

  return {
    riskLevel,
    overallScore: totalRisk,
    dimensionScores,
    headline,
    analysis: `Your answers show this current stage: ${stage}. The architecture decision is shaped by your technical leadership model: ${leadership}. The main item to resolve is ${challenge}, especially with risk exposure described as: ${exposure}.${context ? ` Your added context was: ${context}.` : ''}\n\nThe practical focus now is turning a broad direction into a written architecture decision: the right pattern, key constraints, assumptions to test, and what should not be built yet. A focused advisory session should reduce the chance of choosing a costly path that is hard to correct later.`,
    topRisk: `The primary risk is deciding ${challenge} before documenting the architecture constraints and assumptions.`,
    nextStep: 'Gather data, user workflow, latency, and cost constraints, then review them in an architecture session before further engineering commitment.',
  }
}


/* ─── COMPONENT ─────────────────────────────────────────────────────────── */
export default function AssessmentTriage() {
  const { t, language } = useGlobalUX()
  const aw = t.assessmentWidget

  // Build questions from i18n strings, preserving hardcoded risk values
  const QUESTIONS: Question[] = aw.questions.map((q, qi) => ({
    category: q.category,
    text: q.text,
    options: q.options.map((label, oi) => ({ label, risk: QUESTION_RISKS[qi][oi] })),
  }))
  const [phase, setPhase]           = useState<1|2|3|4>(1)
  const [current, setCurrent]       = useState(0)
  const [answers, setAnswers]       = useState<number[]>([])
  const [situation, setSituation]   = useState('')
  const [loading, setLoading]       = useState(false)
  const [result, setResult]         = useState<AssessmentResult|null>(null)
  const [error, setError]           = useState<string|null>(null)
  const [cardVisible, setCardVisible] = useState(false)
  const [contact, setContact] = useState({ name: '', email: '', phone: '', website: '' })
  const [contactSent, setContactSent]       = useState(false)
  const [contactError, setContactError]     = useState<string|null>(null)
  const [contactLoading, setContactLoading] = useState(false)

  const scoreRowRef = useRef<HTMLDivElement>(null)
  const riskSummaryRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setCardVisible(false)
    const t = setTimeout(() => setCardVisible(true), 50)
    return () => clearTimeout(t)
  }, [current, phase])

  useEffect(() => {
    if (phase === 2 && cardVisible && riskSummaryRef.current) {
      const fills = riskSummaryRef.current.querySelectorAll<HTMLElement>('.rs-fill')
      // Give the CSS transition a tick to register, then animate
      requestAnimationFrame(() => {
        fills.forEach(el => {
          const pct = el.dataset.pct || '0'
          el.style.width = pct + '%'
        })
      })
    } else if (phase === 2 && !cardVisible && riskSummaryRef.current) {
      // Reset bars when card hides so they animate in again on show
      const fills = riskSummaryRef.current.querySelectorAll<HTMLElement>('.rs-fill')
      fills.forEach(el => { el.style.width = '0%' })
    }
  }, [phase, cardVisible])

  useEffect(() => {
    if (phase === 3 && result && scoreRowRef.current) {
      const fills = scoreRowRef.current.querySelectorAll<HTMLElement>('.sc-fill')
      setTimeout(() => {
        fills.forEach(el => { el.style.width = (el.dataset.pct || '0') + '%' })
      }, 200)
    }
  }, [phase, result])

  function selectOpt(i: number) {
    const next = [...answers]; next[current] = i; setAnswers(next)
    setTimeout(() => goNext(next), 340)
  }

  function goNext(ans = answers) {
    if (ans[current] === undefined) return
    if (current === QUESTIONS.length - 1) { goToPhase2(); return }
    setCurrent(c => c + 1)
  }

  function goBack() {
    if (current === 0) return
    setCurrent(c => c - 1)
  }

  function goToPhase2() { setPhase(2) }
  function backToPhase1() { setPhase(1) }

  async function submitAssessment() {
    setPhase(3); setLoading(true); setError(null)
    const scores = QUESTIONS.map((q,i) => q.options[answers[i]]?.risk || 0)
    const totalRisk = scores.reduce((a,b) => a+b, 0)
    const localResult = buildLocalAssessmentResult({
      language,
      questions: QUESTIONS,
      answers,
      scores,
      situation,
    })
    const deterministicResult = {
      riskLevel: getRiskLevelFromScore(totalRisk),
      overallScore: totalRisk,
      dimensionScores: Object.fromEntries(DIM_LABELS.map((label, i) => [label, scores[i] || 0])),
    } satisfies Pick<AssessmentResult, 'riskLevel' | 'overallScore' | 'dimensionScores'>
    const userMsg = `Assessment answers:\n${QUESTIONS.map((q,i) =>
      `Q${i+1} [${q.category}]: "${q.text}"\nAnswer: "${q.options[answers[i]]?.label}" (risk: ${scores[i]}/4)`
    ).join('\n\n')}\n\nUse these exact calculated scores. Do not convert them to percentages:\nRisk level: ${deterministicResult.riskLevel}\nTotal risk score: ${totalRisk}/20\nDimension scores: ${DIM_LABELS.map((label, i) => `${label}: ${scores[i]}/4`).join(', ')}\n${situation ? `\nFounder's situation (their words):\n"${situation}"` : '\nNo situation description provided.'}`

    ;[0,550,1150,1800,2500].forEach((d,i) => {
      setTimeout(() => {
        const el = document.getElementById(`ls${i}`)
        if (el) el.classList.add('opacity-100')
      }, d)
    })

    const langInstruction = language === 'ar'
      ? '\n\nIMPORTANT: Write all text field values (headline, analysis, topRisk, nextStep) in Arabic (Modern Standard Arabic). Keep all property names and enum values in English exactly as defined in the tool schema.'
      : ''
    try {
      const resp = await fetch('/api/anthropic', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'claude-haiku-4-5',
          max_tokens: 900,
          system: [
            {
              type: 'text',
              text: SYSTEM_PROMPT + langInstruction,
              cache_control: { type: 'ephemeral' }
            }
          ],
          tools: [ASSESSMENT_TOOL],
          tool_choice: { type: 'tool', name: 'generate_assessment' },
          messages: [{ role: 'user', content: userMsg }],
        }),
      })
      if (!resp.ok) {
        const detail = await readAssessmentApiError(resp)
        logAssessmentFailure({ status: resp.status, detail })
        await new Promise(r => setTimeout(r, 600))
        setLoading(false)
        setResult(localResult)
        return
      }
      const data = await resp.json()

      // With tool_use, Claude always returns a tool_use block with a pre-parsed input object.
      // No JSON.parse, no regex — the API enforces the schema.
      const toolBlock = data.content?.find((b: { type: string }) => b.type === 'tool_use')
      if (!toolBlock?.input) {
        logAssessmentFailure('No structured response received from AI.')
        await new Promise(r => setTimeout(r, 600))
        setLoading(false)
        setResult(localResult)
        return
      }
      const aiInput = toolBlock.input as Partial<AssessmentResult>
      const json: AssessmentResult = {
        ...localResult,
        headline: typeof aiInput.headline === 'string' && aiInput.headline.trim() ? aiInput.headline : localResult.headline,
        analysis: typeof aiInput.analysis === 'string' && aiInput.analysis.trim() ? aiInput.analysis : localResult.analysis,
        topRisk: typeof aiInput.topRisk === 'string' && aiInput.topRisk.trim() ? aiInput.topRisk : localResult.topRisk,
        nextStep: typeof aiInput.nextStep === 'string' && aiInput.nextStep.trim() ? aiInput.nextStep : localResult.nextStep,
        ...deterministicResult,
      }

      await new Promise(r => setTimeout(r, 600))
      setLoading(false)
      setResult(json)
    } catch (err: unknown) {
      // Log internally, but avoid throwing Error objects into the Next dev overlay.
      logAssessmentFailure(err instanceof Error ? err.message : err)
      await new Promise(r => setTimeout(r, 600))
      setLoading(false)
      setResult(localResult)
    }
  }

  async function submitContact() {
    if (!contact.name.trim() || !contact.email.trim()) return
    setContactLoading(true); setContactError(null)
    try {
      const scores = QUESTIONS.map((q,i) => q.options[answers[i]]?.risk || 0)
      const resp = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          answers,
          situation,
          result,
          contact,
          source: 'Assessment',
          sourceDetail: 'Architecture Advisory Session',
        }),
      })
      if (!resp.ok) throw new Error(`Contact API ${resp.status}`)
      setContactSent(true)
    } catch (err) {
      // Log internally, show a calm reassurance — never expose network errors to clients
      console.error('[Assessment] Contact submission failed:', err)
      setContactError('We could not send your details right now. Please try again, or connect with Fazal directly on LinkedIn.')
    } finally {
      setContactLoading(false)
    }
  }

  function restart() {
    setCurrent(0); setAnswers([]); setSituation(''); setPhase(1)
    setResult(null); setError(null); setCardVisible(false)
    setContact({ name:'', email:'', phone:'', website:'' })
    setContactSent(false); setContactError(null)
    document.querySelectorAll('[id^="ls"]').forEach(el => el.classList.remove('opacity-100'))
  }

  const scores = QUESTIONS.map((q,i) => q.options[answers[i]]?.risk || 0)

  const getRiskClass = (level: string) => {
    switch(level) {
      case 'Low': return 'bg-[#4a9e6b]/10 border-[#4a9e6b]/30 text-[#4a9e6b]'
      case 'High': return 'bg-[#c86b4b]/10 border-[#c86b4b]/30 text-[#c86b4b]'
      default: return 'bg-gold/10 border-gold/30 text-gold'
    }
  }

  const getRiskFillClass = (level: string) => {
    switch(level) {
      case 'Low': return 'bg-[#4a9e6b]/70'
      case 'High': return 'bg-[#c86b4b]/70'
      default: return 'bg-gold'
    }
  }

  const getRiskDisplay = (level: AssessmentResult['riskLevel']) => {
    if (language !== 'ar') return `${level} Risk`
    return `${level === 'Low' ? 'مخاطر منخفضة' : level === 'High' ? 'مخاطر عالية' : 'مخاطر متوسطة'}`
  }

  const contactFields = language === 'ar'
    ? [
        { key:'name' as const, label:'الاسم', type:'text', placeholder:'اسمك', required:true },
        { key:'email' as const, label:'البريد الإلكتروني', type:'email', placeholder:'your@email.com', required:true },
        { key:'phone' as const, label:'الهاتف', type:'tel', placeholder:'+91 98765 43210 (اختياري)', required:false },
        { key:'website' as const, label:'موقع الشركة', type:'url', placeholder:'https://yourcompany.com (اختياري)', required:false },
      ]
    : [
        { key:'name' as const, label:'Name', type:'text', placeholder:'Your name', required:true },
        { key:'email' as const, label:'Email', type:'email', placeholder:'your@email.com', required:true },
        { key:'phone' as const, label:'Phone', type:'tel', placeholder:'+91 98765 43210 (optional)', required:false },
        { key:'website' as const, label:'Corporate Website', type:'url', placeholder:'https://yourcompany.com (optional)', required:false },
      ]

  return (
    <section id="assessment" className="py-20 bg-background mb-10">
      <div className="container mx-auto px-6 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-16">
          <p className="text-sm font-semibold text-gold tracking-widest uppercase mb-4 text-center">{t.assessment.badge}</p>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4 text-center font-serif">
            {t.assessment.headline1}<br /><span className="text-gradient-gold italic">{t.assessment.headline2}</span>
          </h2>
          <p className="text-lg text-muted-foreground text-center max-w-2xl mx-auto">
            {t.assessment.subtext}
          </p>
        </div>

        {/* Phase bar */}
        <div className="flex mb-8 bg-card border border-border rounded-lg overflow-hidden shrink-0">
          {[
            { n:1, label:'01 — Risk Assessment' },
            { n:2, label:'02 — Your Situation' },
            { n:3, label:'03 — Recommendation' },
          ].map(({ n, label }) => (
            <div key={n} className={`flex-1 py-3 px-4 text-[10px] tracking-widest uppercase text-center border-r last:border-r-0 border-border transition-colors duration-300 ${phase === n ? 'text-gold bg-gold/5' : phase > n ? 'text-gold/60 bg-transparent' : 'text-muted-foreground bg-transparent'}`}>
              {label}
            </div>
          ))}
        </div>

        {/* ── PHASE 1: QUESTIONS ──────────────────────────────────────────── */}
        {phase === 1 && (
          <div className="animate-fade-in">
            {/* Progress */}
            <div className="mb-8">
              <div className="flex justify-between mb-2">
                <span className="text-[10px] tracking-widest text-muted-foreground uppercase">Assessment progress</span>
                <span className="text-[10px] text-gold/80">Question {current+1} of {QUESTIONS.length}</span>
              </div>
              <div className="h-0.5 bg-border rounded-full overflow-hidden">
                <div className="h-full bg-gold transition-all duration-500" style={{ width: `${Math.round((current / (QUESTIONS.length - 1)) * 100)}%` }}/>
              </div>
            </div>

            {/* Question card */}
            <div className={`bg-card border border-border rounded-xl overflow-hidden mb-6 transition-all duration-300 ${cardVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}`}>
              <div className="bg-muted/50 border-b border-border px-6 py-4 flex items-center gap-3">
                <span className="text-[10px] tracking-widest text-gold uppercase">Question {String(current+1).padStart(2,'0')}</span>
                <span className="text-[10px] tracking-widest text-muted-foreground uppercase">{QUESTIONS[current].category}</span>
              </div>
              <div className="p-6 md:p-8">
                <div className="font-serif text-xl md:text-2xl font-medium text-foreground leading-snug mb-8">
                  {QUESTIONS[current].text}
                </div>
                <div className="flex flex-col gap-3">
                  {QUESTIONS[current].options.map((o,i) => (
                    <button key={i} onClick={() => selectOpt(i)} className={`flex items-start gap-4 p-4 rounded-lg text-left transition-all duration-200 border ${answers[current]===i ? 'bg-gold/10 border-gold/50 text-foreground' : 'bg-transparent border-border text-foreground/80 hover:text-foreground hover:border-gold/30 hover:bg-gold/5'}`}>
                      <span className="text-xs text-gold/70 min-w-[16px] pt-0.5 font-medium">{String.fromCharCode(65+i)}</span>
                      <span className="text-sm md:text-base leading-relaxed">{o.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Nav */}
            <div className="flex gap-3">
              {current > 0 && (
                <Button variant="outline" onClick={goBack} className="uppercase tracking-widest text-xs px-4 sm:px-6 shrink-0">
                  {language === 'ar' ? '→' : '←'} {language === 'ar' ? 'رجوع' : 'Back'}
                </Button>
              )}
              <Button onClick={() => goNext()} disabled={answers[current]===undefined} variant="hero" className="flex-1 uppercase tracking-widest text-xs py-6 text-center leading-tight">
                {current === QUESTIONS.length-1
                  ? (language === 'ar' ? 'احصل على توصيتي ←' : 'Get My Recommendation →')
                  : (language === 'ar' ? 'متابعة ←' : 'Continue →')}
              </Button>
            </div>
          </div>
        )}

        {phase === 2 && (
          <div className="animate-fade-in">
            <div className={`bg-card border border-border rounded-xl p-6 md:p-8 mb-6 transition-all duration-300 ${cardVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}`}>
              <span className="text-[10px] tracking-widest text-gold uppercase block mb-2">{aw.phase2.heading}</span>
              <div className="font-serif text-xl font-medium text-foreground leading-snug mb-6">
                {aw.phase2.subheading}
              </div>

              {/* Risk summary bars */}
              <div ref={riskSummaryRef} className="grid grid-cols-5 gap-2 mb-8">
                {DIM_LABELS.map((l,i) => {
                  const pct = Math.round((scores[i]/4)*100)
                  return (
                    <div key={l} className="text-center">
                      <div className="text-[9px] text-muted-foreground tracking-widest uppercase mb-1.5">{language === 'ar' ? DIM_LABELS_AR[i] : l}</div>
                      <div className="h-1 bg-border rounded-full overflow-hidden mb-1.5">
                        <div className="rs-fill h-full rounded-full bg-gold transition-all duration-700 ease-out" data-pct={pct} style={{ width:'0%' }}/>
                      </div>
                      <div className="text-[10px] text-muted-foreground">{scores[i]}/4</div>
                    </div>
                  )
                })}
              </div>

              <div className="text-xs text-muted-foreground mb-3 italic">{aw.phase2.label}</div>
              <textarea
                value={situation}
                onChange={e => setSituation(e.target.value)}
                maxLength={280}
                placeholder={aw.phase2.placeholder}
                className="w-full bg-muted/30 border border-border outline-none text-foreground text-sm rounded-lg p-4 resize-none min-h-[92px] focus:border-gold/50 focus:ring-1 focus:ring-gold/30 transition-all placeholder:text-muted-foreground/50"
              />
              <div className="text-[10px] text-muted-foreground mt-2 text-right">{situation.length} / 280</div>

              {error && (
                <div className="bg-destructive/10 border border-destructive/20 text-destructive p-4 text-sm rounded-lg mt-4">
                  {error}
                </div>
              )}
            </div>

            <div className="flex gap-3">
              <Button variant="outline" onClick={backToPhase1} className="uppercase tracking-widest text-xs px-6">
                &larr; {language === 'ar' ? 'رجوع' : 'Back'}
              </Button>
              <Button onClick={submitAssessment} variant="hero" className="flex-1 py-6 uppercase tracking-widest text-xs">
                {aw.phase2.generate} {'\u2192'}
              </Button>
            </div>
          </div>
        )}

        {/* ── PHASE 3: LOADING + RESULT ────────────────────────────────────── */}
        {phase === 3 && (
          <div className="animate-fade-in">
            {loading && (
              <div className="text-center py-16 px-6 bg-card border border-border rounded-xl">
                <div className="text-[10px] tracking-widest text-muted-foreground uppercase mb-8">{aw.phase3.heading}</div>
                <div className="w-12 h-12 border-2 border-gold/20 border-t-gold rounded-full mx-auto mb-8 animate-spin"/>
                <div className="max-w-[280px] mx-auto text-left space-y-3">
                  {[aw.phase3.subheading,
                    language === 'ar' ? 'تقييم خمسة أبعاد' : 'Scoring five architecture dimensions',
                    language === 'ar' ? 'قراءة سياقك' : 'Reading your situation context',
                    language === 'ar' ? 'مطابقة الانخراط المناسب' : 'Matching to the right engagement',
                    language === 'ar' ? 'إعداد تقريرك' : 'Preparing your report'
                  ].map((s,i) => (
                    <div key={i} id={`ls${i}`} className="text-xs text-muted-foreground flex items-center gap-3 opacity-0 transition-opacity duration-500">
                      <span className="w-1.5 h-1.5 bg-gold/50 rounded-full shrink-0"/>
                      {s}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {!loading && !result && error && (
              <div className="animate-fade-in-up">
                <div className="bg-card border border-border rounded-xl p-8 mb-6 text-center">
                  <div className="w-14 h-14 rounded-full bg-gold/10 border border-gold/20 flex items-center justify-center mx-auto mb-5">
                    <span className="text-2xl">&#128203;</span>
                  </div>
                  <div className="text-[10px] tracking-widest text-gold uppercase mb-3">{aw.result.fallbackHeading}</div>
                  <div className="font-serif text-xl font-medium text-foreground mb-3">
                    {aw.result.fallbackSubheading}
                  </div>
                  <p className="text-sm text-muted-foreground max-w-md mx-auto leading-relaxed">
                    {aw.result.fallbackText}
                  </p>
                </div>

                <DirectConnectForm
                  sessionContext={`${aw.result.fallbackContext} (${answers.map((_,i) => i+1).join('/')} answered)`}
                  onComplete={restart}
                />

                <div className="mt-6 flex justify-center">
                  <Button variant="outline" onClick={restart} className="uppercase tracking-widest text-xs px-6">
                      {language === 'ar' ? '→' : '←'} {aw.result.restart}
                  </Button>
                </div>
              </div>
            )}

            {!loading && result && (
              <div className="animate-fade-in-up">
                {/* Result header */}
                <div className="bg-card border border-border rounded-t-xl px-6 py-5 flex items-center justify-between border-b-0">
                  <span className="text-[10px] tracking-widest text-gold uppercase">
                    {language === 'ar' ? 'تقييم المخاطر المعمارية' : 'Architecture risk assessment'}
                  </span>
                  <span className={`text-[10px] font-semibold px-3 py-1 rounded-full tracking-widest uppercase border ${getRiskClass(result.riskLevel)}`}>
                    {getRiskDisplay(result.riskLevel)} &middot; {result.overallScore}/20
                  </span>
                </div>

                {/* Score bars */}
                <div className="bg-muted/30 border border-border px-6 py-5 border-y-0">
                  <div ref={scoreRowRef} className="grid grid-cols-5 gap-3">
                    {DIM_LABELS.map(l => {
                      const labelIndex = DIM_LABELS.indexOf(l)
                      const v = result.dimensionScores[l] || 0
                      const pct = Math.round((v/4)*100)
                      return (
                        <div key={l} className="text-center">
                          <div className="text-[9px] text-muted-foreground tracking-widest uppercase mb-2">
                            {language === 'ar' ? DIM_LABELS_AR[labelIndex] : l}
                          </div>
                          <div className="h-1.5 bg-border rounded-full overflow-hidden mb-1.5">
                            <div className={`sc-fill h-full rounded-full transition-all duration-1000 ease-out ${getRiskFillClass(result.riskLevel)}`} data-pct={pct} style={{ width:'0%' }}/>
                          </div>
                          <div className="text-[10px] text-muted-foreground">{v}/4</div>
                        </div>
                      )
                    })}
                  </div>
                </div>

                {/* Result body */}
                <div className="bg-card border border-border rounded-b-xl p-6 md:p-8">
                  <div className="font-serif text-2xl md:text-3xl font-medium text-foreground leading-snug mb-6">
                    {result.headline}
                  </div>
                  <div className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap mb-8">
                    {result.analysis}
                  </div>

                  {/* Summary blocks */}
                  <div className="grid md:grid-cols-2 gap-4 mb-8">
                    {[{ label: aw.result.topRiskLabel, value: result.topRisk }, { label: aw.result.nextStepLabel, value: result.nextStep }].map(b => (
                      <div key={b.label} className="bg-muted/30 border border-border p-5 rounded-lg">
                        <div className="text-[9px] tracking-widest text-muted-foreground uppercase mb-2">{b.label}</div>
                        <div className="text-sm text-foreground leading-relaxed">{b.value}</div>
                      </div>
                    ))}
                  </div>

                  {/* ── PHASE 4: CONTACT CAPTURE ──────────────────────────── */}
                  <div className="mt-8 border-t border-border pt-7">
                    {!contactSent ? (
                      <>
                        <div className="mb-5">
                          <span className="text-[10px] tracking-widest text-gold uppercase block mb-2">
                            {language === 'ar' ? 'طلب جلسة استشارية معمارية' : 'Request an Architecture Advisory Session'}
                          </span>
                          <div className="font-serif text-lg font-medium text-foreground leading-snug">
                            {language === 'ar'
                              ? 'اترك بياناتك وسيراجع Fazal هذا التقييم قبل الجلسة.'
                              : 'Leave your details and Fazal will review this assessment before the session.'}
                          </div>
                        </div>

                        <div className="grid md:grid-cols-2 gap-4 mb-6">
                          {contactFields.map(f => (
                            <div key={f.key}>
                              <label className="text-[10px] tracking-widest text-muted-foreground uppercase block mb-1.5">
                                {f.label}{f.required && <span className="text-gold"> *</span>}
                              </label>
                              <input
                                type={f.type}
                                value={contact[f.key]}
                                onChange={e => setContact(p => ({ ...p, [f.key]: e.target.value }))}
                                placeholder={f.placeholder}
                                className="w-full bg-muted/30 border border-border outline-none text-foreground text-sm rounded-lg px-3.5 py-3 focus:border-gold/50 focus:ring-1 focus:ring-gold/30 transition-all placeholder:text-muted-foreground/50"
                              />
                            </div>
                          ))}
                        </div>

                        {contactError && (
                          <div className="bg-destructive/10 border border-destructive/20 text-destructive p-4 text-sm rounded-lg mb-4">
                            {contactError}
                          </div>
                        )}

                        <div className="flex flex-col sm:flex-row gap-3 items-stretch">
                          <Button
                            onClick={submitContact}
                            disabled={contactLoading || !contact.name.trim() || !contact.email.trim()}
                            variant="hero"
                            className="flex-1 py-5 uppercase tracking-widest text-xs"
                          >
                            {contactLoading
                              ? (language === 'ar' ? 'جارٍ الإرسال…' : 'Sending…')
                              : (language === 'ar' ? 'طلب الجلسة ←' : 'Request session ' + '\u2192')}
                          </Button>
                          <Button variant="outline" onClick={restart} className="sm:w-auto px-6 py-5 uppercase tracking-widest text-xs">
                            {aw.result.restart}
                          </Button>
                        </div>
                      </>
                    ) : (
                      <div className="text-center py-6">
                        <div className="flex justify-center mb-4">
                          <div className="w-12 h-12 rounded-full bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
                            <CheckCircle2 className="w-6 h-6 text-emerald-500" />
                          </div>
                        </div>
                        <div className="font-serif text-xl font-medium text-foreground mb-2">
                          {language === 'ar' ? 'تم إرسال الطلب.' : 'Request sent.'}
                        </div>
                        <div className="text-sm text-muted-foreground mb-5">
                          {language === 'ar'
                            ? 'سيراجع Fazal تقييمك ويتواصل معك بخصوص الجلسة.'
                            : 'Fazal will review your assessment and be in touch about the session.'}
                        </div>
                        <Button variant="outline" onClick={restart} className="px-6 py-5 uppercase tracking-widest text-xs">
                          {aw.result.restart}
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  )
}
