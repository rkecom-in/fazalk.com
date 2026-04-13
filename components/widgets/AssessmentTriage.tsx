import { useState, useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button'

/* ─── TYPES ─────────────────────────────────────────────────────────────── */
interface Question { category: string; text: string; options: { label: string; risk: number }[] }

interface AssessmentResult {
  riskLevel: 'Low' | 'Medium' | 'High'
  overallScore: number
  dimensionScores: Record<string, number>
  headline: string
  analysis: string
  topRisk: string
  recommendedEngagement: string
  engagementFee: string
  engagementReason: string
  nextStep: string
}

/* ─── DATA ──────────────────────────────────────────────────────────────── */
const DIM_LABELS = ['Stage', 'Leadership', 'Clarity', 'Exposure', 'Challenge']

const QUESTIONS: Question[] = [
  { category: 'Build Stage', text: 'Where are you in the build process right now?',
    options: [
      { label: 'We have an idea and are deciding what to build', risk: 1 },
      { label: 'We have a rough design but development has not started', risk: 2 },
      { label: 'We are actively building — some components are live', risk: 3 },
      { label: 'We have a live system that is underperforming or expensive', risk: 4 },
    ]},
  { category: 'Technical Leadership', text: 'Who is making the core architecture decisions on your team?',
    options: [
      { label: 'A CTO or senior architect with AI/cloud production experience', risk: 1 },
      { label: 'A senior developer who is learning as we build', risk: 2 },
      { label: 'Decisions are made by the founder or product team', risk: 3 },
      { label: 'We are relying on a vendor or agency to decide for us', risk: 4 },
    ]},
  { category: 'Decision Clarity', text: 'How clearly defined are your core architecture decisions right now?',
    options: [
      { label: 'All major decisions are documented and agreed', risk: 1 },
      { label: 'Most decisions are made but a few key gaps remain', risk: 2 },
      { label: 'Rough direction only — significant unknowns still open', risk: 3 },
      { label: 'We are building without a clear architecture plan', risk: 4 },
    ]},
  { category: 'Risk Exposure', text: 'What is the cost of getting the architecture wrong at this stage?',
    options: [
      { label: 'Low — we can pivot quickly, limited investment committed', risk: 1 },
      { label: 'Moderate — a few months of work and some budget at stake', risk: 2 },
      { label: 'High — significant engineering time and budget committed', risk: 3 },
      { label: 'Critical — a wrong call would set us back 6+ months', risk: 4 },
    ]},
  { category: 'Primary Challenge', text: 'What is your single biggest architecture concern right now?',
    options: [
      { label: 'Choosing the right AI approach — LLM, RAG, fine-tuning, or agentic', risk: 2 },
      { label: 'Cloud infrastructure — scalability, cost, and reliability at production', risk: 2 },
      { label: 'Existing system is broken — high cost, latency, or poor output quality', risk: 4 },
      { label: 'We do not know what we do not know — need an expert second opinion', risk: 3 },
    ]},
]

const SYSTEM_PROMPT = `You are the advisory assessment AI for Fazal Khan's CTO-level architecture practice (fazalk.com).

You receive structured data from a 5-question risk assessment plus an optional free-text situation description. Generate a personalised advisory report.

ENGAGEMENTS:
1. Strategic Clarity Session — 1 hour, $350. For one specific decision that needs a clear answer fast.
2. Architecture Decision Intensive — 3 hours, $1,200. For interconnected decisions, system audits, or technical roadmaps. This is the most common entry point.
3. AI Architecture Blueprint — 1 full day, $3,000. By invitation only. Only recommend for clearly major new platform launches or serious architectural overhauls.
4. Discuss Your Case — free. For genuine ambiguity where the scope is unclear.

RISK LEVELS: Low = total 5–9, Medium = 10–14, High = 15–20.

RULES:
- Be specific. Reference what the person actually said — their stage, their team, their challenge.
- Do not be generic. Name the exact risk pattern you see.
- Lean toward the 1-hour when uncertain between 1h and 3h.
- Only recommend the Blueprint for unmistakably major situations.
- If they gave a situation description, use it to make the analysis sharper and more specific.

Respond ONLY with valid JSON, no markdown, no preamble:
{
  "riskLevel": "Low"|"Medium"|"High",
  "overallScore": number,
  "dimensionScores": { "Stage": n, "Leadership": n, "Clarity": n, "Exposure": n, "Challenge": n },
  "headline": "One sharp sentence naming their specific situation (max 14 words)",
  "analysis": "Three focused paragraphs. Para 1: the specific risk pattern in their answers. Para 2: what is at stake if not addressed. Para 3: what resolving it looks like. Be direct and specific. No padding.",
  "topRisk": "The single most critical risk in one sentence",
  "recommendedEngagement": "Strategic Clarity Session"|"Architecture Decision Intensive"|"AI Architecture Blueprint"|"Discuss Your Case",
  "engagementFee": "$350 · 1 hour"|"$1,200 · 3 hours"|"$3,000 · 1 full day"|"Free",
  "engagementReason": "One sentence — why this specific engagement fits their specific answers",
  "nextStep": "One clear action the person should take right now (besides booking)"
}`

/* ─── COMPONENT ─────────────────────────────────────────────────────────── */
export default function AssessmentTriage() {
  const [phase, setPhase]           = useState<1|2|3|4>(1)
  const [current, setCurrent]       = useState(0)
  const [answers, setAnswers]       = useState<number[]>([])
  const [situation, setSituation]   = useState('')
  const [loading, setLoading]       = useState(false)
  const [result, setResult]         = useState<AssessmentResult|null>(null)
  const [error, setError]           = useState<string|null>(null)
  const [cardVisible, setCardVisible] = useState(false)
  const [contact, setContact]       = useState({ name:'', email:'', phone:'' })
  const [contactSent, setContactSent]       = useState(false)
  const [contactError, setContactError]     = useState<string|null>(null)
  const [contactLoading, setContactLoading] = useState(false)
  const [contactSkipped, setContactSkipped] = useState(false)

  const scoreRowRef = useRef<HTMLDivElement>(null)
  const riskSummaryRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setCardVisible(false)
    const t = setTimeout(() => setCardVisible(true), 50)
    return () => clearTimeout(t)
  }, [current, phase])

  useEffect(() => {
    if (phase === 2 && riskSummaryRef.current) {
      const fills = riskSummaryRef.current.querySelectorAll<HTMLElement>('.rs-fill')
      setTimeout(() => {
        fills.forEach(el => {
          const pct = el.dataset.pct || '0'
          el.style.width = pct + '%'
        })
      }, 50)
    }
  }, [phase])

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
    if (current < QUESTIONS.length - 1) setTimeout(() => goNext(next), 340)
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
    const userMsg = `Assessment answers:\n${QUESTIONS.map((q,i) =>
      `Q${i+1} [${q.category}]: "${q.text}"\nAnswer: "${q.options[answers[i]]?.label}" (risk: ${scores[i]}/4)`
    ).join('\n\n')}\n\nTotal risk score: ${totalRisk}/20\n${situation ? `\nFounder's situation (their words):\n"${situation}"` : '\nNo situation description provided.'}`

    ;[0,550,1150,1800,2500].forEach((d,i) => {
      setTimeout(() => {
        const el = document.getElementById(`ls${i}`)
        if (el) el.classList.add('opacity-100')
      }, d)
    })

    try {
      const resp = await fetch('/api/anthropic', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 1200,
          system: SYSTEM_PROMPT,
          messages: [{ role: 'user', content: userMsg }],
        }),
      })
      if (!resp.ok) { const e = await resp.json(); throw new Error(e.error?.message || `API ${resp.status}`) }
      const data = await resp.json()
      const json: AssessmentResult = JSON.parse(data.content[0].text.trim())
      await new Promise(r => setTimeout(r, 600))
      setLoading(false)
      setResult(json)
    } catch (err: unknown) {
      setLoading(false)
      setPhase(2)
      const msg = err instanceof Error ? err.message : 'Unknown error'
      setError(msg.includes('401')
        ? 'API key required. The assessment service is not yet configured.'
        : `Something went wrong: ${msg}. Please try again.`)
    }
  }

  async function submitContact() {
    if (!contact.name.trim() || !contact.email.trim()) return
    setContactLoading(true); setContactError(null)
    try {
      const scores = QUESTIONS.map((q,i) => q.options[answers[i]]?.risk || 0)
      await fetch('/api/notion-lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ answers, situation, result, contact }),
      })
      setContactSent(true)
    } catch {
      setContactError('Something went wrong. Please try again.')
    } finally {
      setContactLoading(false)
    }
  }

  function restart() {
    setCurrent(0); setAnswers([]); setSituation(''); setPhase(1)
    setResult(null); setError(null); setCardVisible(false)
    setContact({ name:'', email:'', phone:'' })
    setContactSent(false); setContactError(null); setContactSkipped(false)
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

  return (
    <section id="assessment" className="py-24 bg-background">
      <div className="container mx-auto px-6 max-w-3xl">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-block mb-6 px-4 py-1.5 rounded-full border border-gold/20 bg-gold/5 animate-fade-in">
            <span className="text-sm font-medium text-gold tracking-widest uppercase">Fazal K. / Advisory</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-bold font-serif mb-4 text-foreground">
            Assess your architecture.<br /><span className="text-gradient-gold italic">Get the right engagement.</span>
          </h2>
          <p className="text-base text-muted-foreground max-w-[460px] mx-auto">
            5 questions to identify your risk profile. Then a single AI-powered recommendation — the exact engagement, the exact reason, specific to your situation.
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
              <div className="h-0.5 bg-border rounded-full overflow-hidden mb-2">
                <div className="h-full bg-gold transition-all duration-500" style={{ width: `${Math.round((current/QUESTIONS.length)*100)}%` }}/>
              </div>
              <div className="flex gap-1.5">
                {QUESTIONS.map((_,i) => (
                  <div key={i} className={`flex-1 h-0.5 rounded-full max-w-[80px] transition-colors duration-300 ${i < current ? 'bg-gold/50' : i === current ? 'bg-gold' : 'bg-border'}`}/>
                ))}
              </div>
            </div>

            {/* Question card */}
            <div className={`bg-card border border-border rounded-xl overflow-hidden mb-6 transition-all duration-300 ${cardVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}`}>
              <div className="bg-muted/50 border-b border-border px-6 py-4 flex items-center gap-3">
                <span className="text-[10px] tracking-widest text-gold uppercase">Question {String(current+1).padStart(2,'0')}</span>
                <span className="text-[10px] tracking-widest text-muted-foreground uppercase">{QUESTIONS[current].category}</span>
              </div>
              <div className="p-6 md:p-8">
                <div className="font-serif text-2xl font-medium text-foreground leading-snug mb-8">
                  {QUESTIONS[current].text}
                </div>
                <div className="flex flex-col gap-3">
                  {QUESTIONS[current].options.map((o,i) => (
                    <button key={i} onClick={() => selectOpt(i)} className={`flex items-start gap-4 p-4 rounded-lg text-left transition-all duration-200 border ${answers[current]===i ? 'bg-gold/10 border-gold/50 text-foreground' : 'bg-transparent border-border text-muted-foreground hover:border-gold/30 hover:bg-gold/5'}`}>
                      <span className="text-xs text-muted-foreground min-w-[16px] pt-0.5">{String.fromCharCode(65+i)}</span>
                      <span className="text-sm">{o.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Nav */}
            <div className="flex gap-3">
              {current > 0 && (
                <Button variant="outline" onClick={goBack} className="uppercase tracking-widest text-xs px-6">
                  &larr; Back
                </Button>
              )}
              <Button onClick={() => goNext()} disabled={answers[current]===undefined} variant="hero" className="flex-1 uppercase tracking-widest text-xs py-6">
                {current === QUESTIONS.length-1 ? 'Continue to Step 2 ' + '\u2192' : 'Continue ' + '\u2192'}
              </Button>
            </div>
          </div>
        )}

        {/* ── PHASE 2: SITUATION ──────────────────────────────────────────── */}
        {phase === 2 && (
          <div className="animate-fade-in">
            <div className={`bg-card border border-border rounded-xl p-6 md:p-8 mb-6 transition-all duration-300 ${cardVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}`}>
              <span className="text-[10px] tracking-widest text-gold uppercase block mb-2">Phase 2 of 3 &mdash; Your situation</span>
              <div className="font-serif text-xl font-medium text-foreground leading-snug mb-6">
                Your risk profile is ready. Add context to sharpen the recommendation.
              </div>

              {/* Risk summary bars */}
              <div ref={riskSummaryRef} className="grid grid-cols-5 gap-2 mb-8">
                {DIM_LABELS.map((l,i) => {
                  const pct = Math.round((scores[i]/4)*100)
                  return (
                    <div key={l} className="text-center">
                      <div className="text-[9px] text-muted-foreground tracking-widest uppercase mb-1.5">{l}</div>
                      <div className="h-1 bg-border rounded-full overflow-hidden mb-1.5">
                        <div className="rs-fill h-full rounded-full bg-gold transition-all duration-700 ease-out" data-pct={pct} style={{ width:'0%' }}/>
                      </div>
                      <div className="text-[10px] text-muted-foreground">{scores[i]}/4</div>
                    </div>
                  )
                })}
              </div>

              <div className="text-xs text-muted-foreground mb-3 italic">Optional &mdash; describe your specific situation for a more tailored recommendation</div>
              <textarea
                value={situation}
                onChange={e => setSituation(e.target.value)}
                maxLength={500}
                placeholder="e.g. We are building an AI-powered search product for an enterprise client. 4 engineers, 3 months budget..."
                className="w-full bg-muted/30 border border-border outline-none text-foreground text-sm rounded-lg p-4 resize-none min-h-[120px] focus:border-gold/50 focus:ring-1 focus:ring-gold/30 transition-all placeholder:text-muted-foreground/50"
              />
              <div className="text-[10px] text-muted-foreground mt-2 text-right">{situation.length} / 500</div>

              {error && (
                <div className="bg-destructive/10 border border-destructive/20 text-destructive p-4 text-sm rounded-lg mt-4">
                  {error}
                </div>
              )}
            </div>

            <div className="flex gap-3">
              <Button variant="outline" onClick={backToPhase1} className="uppercase tracking-widest text-xs px-6">
                &larr; Back
              </Button>
              <Button onClick={submitAssessment} variant="hero" className="flex-1 py-6 uppercase tracking-widest text-xs">
                Generate my recommendation {'\u2192'}
              </Button>
            </div>
          </div>
        )}

        {/* ── PHASE 3: LOADING + RESULT ────────────────────────────────────── */}
        {phase === 3 && (
          <div className="animate-fade-in">
            {loading && (
              <div className="text-center py-16 px-6 bg-card border border-border rounded-xl">
                <div className="text-[10px] tracking-widest text-muted-foreground uppercase mb-8">Generating your assessment</div>
                <div className="w-12 h-12 border-2 border-gold/20 border-t-gold rounded-full mx-auto mb-8 animate-spin"/>
                <div className="max-w-[280px] mx-auto text-left space-y-3">
                  {['Analysing your risk profile','Scoring five architecture dimensions','Reading your situation context','Matching to the right engagement','Preparing your report'].map((s,i) => (
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
                {/* Result header */}
                <div className="bg-card border border-border rounded-t-xl px-6 py-5 flex items-center justify-between border-b-0">
                  <span className="text-[10px] tracking-widest text-gold uppercase">Architecture risk assessment</span>
                  <span className={`text-[10px] font-semibold px-3 py-1 rounded-full tracking-widest uppercase border ${getRiskClass(result.riskLevel)}`}>
                    {result.riskLevel} Risk &middot; {result.overallScore}/20
                  </span>
                </div>

                {/* Score bars */}
                <div className="bg-muted/30 border border-border px-6 py-5 border-y-0">
                  <div ref={scoreRowRef} className="grid grid-cols-5 gap-3">
                    {DIM_LABELS.map(l => {
                      const v = result.dimensionScores[l] || 0
                      const pct = Math.round((v/4)*100)
                      return (
                        <div key={l} className="text-center">
                          <div className="text-[9px] text-muted-foreground tracking-widest uppercase mb-2">{l}</div>
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

                  {/* Engagement box */}
                  <div className="bg-gold/5 border border-gold/20 rounded-xl p-6 mb-8">
                    <div className="text-[10px] tracking-widest text-gold uppercase mb-3">Recommended engagement</div>
                    <div className="font-serif text-xl font-medium text-foreground mb-1">{result.recommendedEngagement}</div>
                    <div className="text-sm text-gold/80 mb-3">{result.engagementFee}</div>
                    <div className="text-sm text-muted-foreground leading-relaxed">{result.engagementReason}</div>
                  </div>

                  {/* Summary blocks */}
                  <div className="grid md:grid-cols-2 gap-4 mb-8">
                    {[{ label:'Primary risk', value:result.topRisk }, { label:'Immediate next step', value:result.nextStep }].map(b => (
                      <div key={b.label} className="bg-muted/30 border border-border p-5 rounded-lg">
                        <div className="text-[9px] tracking-widest text-muted-foreground uppercase mb-2">{b.label}</div>
                        <div className="text-sm text-foreground leading-relaxed">{b.value}</div>
                      </div>
                    ))}
                  </div>

                  <div className="flex">
                    <Button variant="outline" onClick={restart} className="w-full uppercase tracking-widest text-xs py-6">
                      Retake assessment
                    </Button>
                  </div>
                </div>

                {/* ── PHASE 4: CONTACT CAPTURE ──────────────────────────── */}
                {!contactSkipped && (
                  <div className="mt-6 bg-card border border-border rounded-xl p-6 md:p-8 animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
                    {!contactSent ? (
                      <>
                        <span className="text-[10px] tracking-widest text-gold uppercase block mb-2">Send your results to Fazal</span>
                        <div className="font-serif text-lg font-medium text-foreground leading-snug mb-6">
                          Leave your details and Fazal will review your assessment and be in touch.
                        </div>
                        <div className="space-y-4 mb-6">
                          {[
                            { key:'name' as const, label:'Name', type:'text', placeholder:'Your name', required:true },
                            { key:'email' as const, label:'Email', type:'email', placeholder:'your@email.com', required:true },
                            { key:'phone' as const, label:'Phone', type:'tel', placeholder:'+91 98765 43210 (optional)', required:false },
                          ].map(f => (
                            <div key={f.key}>
                              <label className="text-[10px] tracking-widest text-muted-foreground uppercase block mb-1.5">
                                {f.label}{f.required && <span className="text-gold"> *</span>}
                              </label>
                              <input
                                type={f.type}
                                value={contact[f.key]}
                                onChange={e => setContact(p => ({ ...p, [f.key]: e.target.value }))}
                                placeholder={f.placeholder}
                                className="w-full bg-muted/30 border border-border outline-none text-foreground text-sm rounded-lg p-3.5 focus:border-gold/50 focus:ring-1 focus:ring-gold/30 transition-all placeholder:text-muted-foreground/50"
                              />
                            </div>
                          ))}
                        </div>

                        {contactError && (
                          <div className="bg-destructive/10 border border-destructive/20 text-destructive p-4 text-sm rounded-lg mb-4">
                            {contactError}
                          </div>
                        )}

                        <div className="flex flex-col sm:flex-row gap-4 items-center">
                          <Button 
                            onClick={submitContact}
                            disabled={contactLoading || !contact.name.trim() || !contact.email.trim()}
                            variant="hero"
                            className="w-full sm:flex-1 py-6 uppercase tracking-widest text-xs"
                          >
                            {contactLoading ? 'Sending…' : 'Send my results to Fazal ' + '\u2192'}
                          </Button>
                          <button onClick={() => setContactSkipped(true)} className="text-xs text-muted-foreground underline decoration-muted-foreground hover:text-foreground transition-colors">
                            Skip &mdash; just show me the recommendation
                          </button>
                        </div>
                      </>
                    ) : (
                      <div className="text-center py-6">
                        <div className="text-2xl mb-3 text-[#4a9e6b]">&check;</div>
                        <div className="font-serif text-xl font-medium text-foreground mb-2">Sent.</div>
                        <div className="text-sm text-muted-foreground">Fazal will review your assessment and be in touch.</div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  )
}
