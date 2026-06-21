import { useState, useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { useGlobalUX } from '@/components/providers/GlobalUXProvider'
import { useTurnstile } from '@/components/widgets/useTurnstile'
import { CheckCircle2 } from 'lucide-react'
import {
  type AssessmentResult,
  DIM_LABELS,
  QUESTION_RISKS,
  getRiskLevelFromScore,
} from '@/lib/assessment-shared'
import { trackEvent, trackConversion, ADS_ENQUIRY_LABEL } from '@/lib/analytics'

/* ─── TYPES ─────────────────────────────────────────────────────────────── */
interface Question { category: string; text: string; options: { label: string; risk: number }[] }

/* ─── DATA ──────────────────────────────────────────────────────────────── */
const DIM_LABELS_AR = ['المرحلة', 'القيادة', 'الوضوح', 'التعرض', 'التحدي']

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
  const { getToken } = useTurnstile()
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
  const [usedFallback, setUsedFallback] = useState(false)
  const [cardVisible, setCardVisible] = useState(false)
  const [contact, setContact] = useState({ name: '', email: '', phone: '', website: '' })
  const [contactSent, setContactSent]       = useState(false)
  const [contactError, setContactError]     = useState<string|null>(null)
  const [contactLoading, setContactLoading] = useState(false)

  const scoreRowRef = useRef<HTMLDivElement>(null)
  const riskSummaryRef = useRef<HTMLDivElement>(null)
  const timers = useRef<ReturnType<typeof setTimeout>[]>([])
  const mounted = useRef(true)
  const advanceGuard = useRef(false)
  const startedRef = useRef(false) // fire assessment_start once per run

  // Track a timeout so it can be cleared on unmount/restart.
  const track = (id: ReturnType<typeof setTimeout>) => { timers.current.push(id); return id }
  const clearTimers = () => { timers.current.forEach(clearTimeout); timers.current = [] }

  useEffect(() => {
    mounted.current = true
    return () => { mounted.current = false; clearTimers() }
  }, [])

  useEffect(() => {
    advanceGuard.current = false // allow one advance per question/phase
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
      const id = setTimeout(() => {
        fills.forEach(el => { el.style.width = (el.dataset.pct || '0') + '%' })
      }, 200)
      return () => clearTimeout(id)
    }
  }, [phase, result])

  // Fire once when a result first appears (covers both AI and fallback paths).
  useEffect(() => {
    if (result) {
      trackEvent('assessment_complete', {
        risk_level: result.riskLevel,
        score: result.overallScore,
        used_fallback: usedFallback,
        language,
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [result])

  function selectOpt(i: number) {
    if (!startedRef.current) { startedRef.current = true; trackEvent('assessment_start', { language }) }
    const next = [...answers]; next[current] = i; setAnswers(next)
    track(setTimeout(() => goNext(next), 340))
  }

  function goNext(ans = answers) {
    if (ans[current] === undefined) return
    if (advanceGuard.current) return // one advance per question — block timer/click race
    advanceGuard.current = true
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
    setPhase(3); setLoading(true); setUsedFallback(false)
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

    ;[0,550,1150,1800,2500].forEach((d,i) => {
      track(setTimeout(() => {
        const el = document.getElementById(`ls${i}`)
        if (el) el.classList.add('opacity-100')
      }, d))
    })

    // Use the deterministic local analysis when the AI is unavailable.
    const fallback = async () => {
      await new Promise(r => setTimeout(r, 600))
      if (!mounted.current) return
      setUsedFallback(true)
      setLoading(false)
      setResult(localResult)
    }

    // Keep AI text within sane display bounds before storing/forwarding.
    const clampText = (value: unknown, max: number, fallbackValue: string): string =>
      typeof value === 'string' && value.trim() ? value.trim().slice(0, max) : fallbackValue

    try {
      // The server owns model/max_tokens/system/tools — send only the inputs.
      const turnstileToken = await getToken()
      const resp = await fetch('/api/anthropic', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ answers, situation, language, turnstileToken }),
      })
      if (!resp.ok) {
        logAssessmentFailure({ status: resp.status })
        await fallback()
        return
      }
      const data = await resp.json()
      const aiInput = data?.result as Partial<AssessmentResult> | undefined
      if (!aiInput) {
        logAssessmentFailure('No structured response received from AI.')
        await fallback()
        return
      }
      const json: AssessmentResult = {
        ...localResult,
        headline: clampText(aiInput.headline, 160, localResult.headline),
        analysis: clampText(aiInput.analysis, 1200, localResult.analysis),
        topRisk: clampText(aiInput.topRisk, 300, localResult.topRisk),
        nextStep: clampText(aiInput.nextStep, 300, localResult.nextStep),
        ...deterministicResult,
      }

      await new Promise(r => setTimeout(r, 600))
      if (!mounted.current) return
      setLoading(false)
      setResult(json)
    } catch (err: unknown) {
      // Log internally, but avoid throwing Error objects into the Next dev overlay.
      logAssessmentFailure(err instanceof Error ? err.message : err)
      await fallback()
    }
  }

  async function submitContact() {
    if (!contact.name.trim() || !contact.email.trim()) return
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact.email.trim())) {
      setContactError(language === 'ar' ? 'يرجى إدخال بريد إلكتروني صحيح.' : 'Please enter a valid email address.')
      return
    }
    setContactLoading(true); setContactError(null)
    try {
      const turnstileToken = await getToken()
      const resp = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          answers,
          situation,
          result,
          contact,
          language,
          sourceDetail: 'Architecture Advisory Session',
          turnstileToken,
        }),
      })
      if (!resp.ok) throw new Error(`Contact API ${resp.status}`)
      setContactSent(true)
      // Primary conversion: enquiry submitted. GA4 event + Google Ads conversion.
      trackEvent('generate_lead', {
        risk_level: result?.riskLevel,
        score: result?.overallScore,
        language,
        source_detail: 'Architecture Advisory Session',
      })
      trackConversion(ADS_ENQUIRY_LABEL)
    } catch (err) {
      // Log internally, show a calm reassurance — never expose network errors to clients
      console.error('[Assessment] Contact submission failed:', err)
      setContactError('Couldn\'t send your details right now. Please try again, or reach Fazal directly on LinkedIn.')
    } finally {
      setContactLoading(false)
    }
  }

  function restart() {
    clearTimers()
    advanceGuard.current = false
    startedRef.current = false
    setCurrent(0); setAnswers([]); setSituation(''); setPhase(1)
    setResult(null); setUsedFallback(false); setCardVisible(false)
    setContact({ name:'', email:'', phone:'', website:'' })
    setContactSent(false); setContactError(null)
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

              <label htmlFor="assessment-situation" className="text-xs text-muted-foreground mb-3 italic block">{aw.phase2.label}</label>
              <textarea
                id="assessment-situation"
                value={situation}
                onChange={e => setSituation(e.target.value)}
                maxLength={280}
                placeholder={aw.phase2.placeholder}
                className="w-full bg-muted/30 border border-border outline-none text-foreground text-sm rounded-lg p-4 resize-none min-h-[92px] focus:border-gold/50 focus:ring-1 focus:ring-gold/30 transition-all placeholder:text-muted-foreground/50"
              />
              <div className="text-[10px] text-muted-foreground mt-2 text-right">{situation.length} / 280</div>
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

            {!loading && result && (
              <div className="animate-fade-in-up">
                {usedFallback && (
                  <div className="bg-gold/5 border border-gold/20 text-muted-foreground text-xs rounded-lg px-4 py-3 mb-4 text-center">
                    {language === 'ar'
                      ? 'تعذّر الوصول إلى التحليل الذكي الآن — هذه نتيجة أساسية مبنية على إجاباتك. سيراجع Fazal التفاصيل عند تواصلك.'
                      : 'AI analysis is unavailable right now — showing a baseline result from your answers. Fazal will review the details when you connect.'}
                  </div>
                )}
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
                              <label htmlFor={`assessment-contact-${f.key}`} className="text-[10px] tracking-widest text-muted-foreground uppercase block mb-1.5">
                                {f.label}{f.required && <span className="text-gold"> *</span>}
                              </label>
                              <input
                                id={`assessment-contact-${f.key}`}
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
