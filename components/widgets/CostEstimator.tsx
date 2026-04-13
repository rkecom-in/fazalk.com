import { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'

/* ─── DATA ──────────────────────────────────────────────────────────────── */
const ENGAGEMENTS = [
  { name: 'Strategic Clarity Session',       fee: 350,  hours: '1 hour',     threshold: 40000    },
  { name: 'Architecture Decision Intensive', fee: 1200, hours: '3 hours',    threshold: 150000   },
  { name: 'AI Architecture Blueprint',       fee: 3000, hours: '1 full day', threshold: Infinity },
]

/* ─── HELPERS ────────────────────────────────────────────────────────────── */
function fmt(n: number): string {
  if (n >= 1_000_000) return '$' + (n / 1_000_000).toFixed(1) + 'M'
  if (n >= 1_000)     return '$' + Math.round(n / 1_000) + 'K'
  return '$' + Math.round(n).toLocaleString()
}
function fmtFull(n: number): string { return '$' + Math.round(n).toLocaleString() }

function getReworkMultiplier(c: number): number {
  if (c >= 90) return 1.1
  if (c >= 75) return 1.2
  if (c >= 60) return 1.4
  if (c >= 45) return 1.7
  if (c >= 30) return 2.1
  return 2.5
}
function getEngagement(risk: number) {
  return ENGAGEMENTS.find(e => risk <= e.threshold) ?? ENGAGEMENTS[2]
}
function getRiskLabel(c: number): string {
  if (c >= 85) return 'Low risk — you likely have solid foundations'
  if (c >= 65) return 'Moderate risk — some key decisions still open'
  if (c >= 45) return 'Significant risk — architecture gaps present'
  if (c >= 25) return 'High risk — major decisions unresolved'
  return 'Critical risk — architecture largely undefined'
}
function getMultiplierLabel(m: number): string {
  if (m <= 1.2) return `${m}× (low rework risk — high confidence build)`
  if (m <= 1.5) return `${m}× (moderate rework — some gaps present)`
  if (m <= 2.0) return `${m}× (significant rework expected)`
  return `${m}× (high rework risk — major gaps)`
}

/* ─── COMPONENT ─────────────────────────────────────────────────────────── */
export default function CostEstimator() {
  const [team,       setTeam]       = useState(5)
  const [rate,       setRate]       = useState(400)
  const [months,     setMonths]     = useState(4)
  const [confidence, setConfidence] = useState(50)
  const [open,       setOpen]       = useState(false)

  const teamFillRef   = useRef<HTMLDivElement>(null)
  const rateFillRef   = useRef<HTMLDivElement>(null)
  const monthsFillRef = useRef<HTMLDivElement>(null)
  const riskFillRef   = useRef<HTMLDivElement>(null)

  // Derived calculations
  const workingDays      = Math.round(months * 21)
  const totalBuild       = team * rate * workingDays
  const reworkMultiplier = getReworkMultiplier(confidence)
  const riskExposure     = totalBuild * (1 - confidence / 100) * reworkMultiplier
  const engagement       = getEngagement(riskExposure)
  const fee              = engagement.fee
  const ratioPct         = riskExposure > 0 ? (fee / riskExposure) * 100 : 0
  const saving           = riskExposure - fee

  // Update slider fill positions
  function updateFill(ref: React.RefObject<HTMLDivElement | null>, min: number, max: number, val: number) {
    if (ref.current) ref.current.style.width = `${((val - min) / (max - min)) * 100}%`
  }

  useEffect(() => {
    updateFill(teamFillRef,   1,  20,  team)
    updateFill(rateFillRef,   100, 1200, rate)
    updateFill(monthsFillRef, 1,  18,  months)
    updateFill(riskFillRef,   10, 95,  confidence)
  }, [team, rate, months, confidence])

  // Required for custom slider thumb styles not supported out of the box by basic Tailwind utility without writing components
  const sliderStyle: React.CSSProperties = {
    WebkitAppearance: 'none',
    appearance: 'none',
    width: '100%',
    height: '4px',
    background: 'transparent',
    outline: 'none',
    cursor: 'pointer',
    position: 'relative',
    zIndex: 1,
  }

  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-6 max-w-3xl">

        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-block mb-6 px-4 py-1.5 rounded-full border border-gold/20 bg-gold/5 animate-fade-in">
            <span className="text-sm font-medium text-gold tracking-widest uppercase">
              Architecture Risk Cost Estimator
            </span>
          </div>
          <h2 className="text-3xl md:text-5xl font-bold font-serif mb-4 text-foreground leading-tight">
            What does a wrong<br /><span className="text-gradient-gold italic">architecture decision</span> cost?
          </h2>
          <p className="text-base text-muted-foreground max-w-[480px] mx-auto">
            Adjust the sliders to match your team. See the real cost of an architecture mistake at your scale — then compare it to the cost of getting it right before you build.
          </p>
        </div>

        {/* Calculator body */}
        <div className="bg-card border border-border rounded-xl overflow-hidden mb-6 shadow-xl shadow-black/20 animate-fade-in-up">
          {/* Toolbar */}
          <div className="bg-muted/30 border-b border-border px-6 py-4 flex items-center justify-between">
            <span className="text-[10px] tracking-widest text-gold uppercase">Cost Estimator</span>
            <span className="text-[10px] tracking-widest text-muted-foreground">Based on industry data</span>
          </div>

          {/* Sliders */}
          <div className="p-6 md:p-8">
            {[
              {
                label: 'Engineering team size', desc: 'Developers actively working on the AI or cloud system',
                id: 'team', min: 1, max: 20, step: 1, value: team,
                display: String(team), unit: 'engineers',
                ticks: ['1','5','10','15','20'],
                fillRef: teamFillRef,
                onChange: (v: number) => setTeam(v),
              },
              {
                label: 'Average all-in daily cost per engineer', desc: 'Salary, benefits, tools, and overhead (USD).',
                id: 'rate', min: 100, max: 1200, step: 50, value: rate,
                display: '$' + rate.toLocaleString(), unit: 'per day',
                ticks: ['$100','$400','$700','$1,000','$1,200'],
                fillRef: rateFillRef,
                onChange: (v: number) => setRate(v),
              },
              {
                label: 'Planned build duration', desc: 'How many months of active development before the system is expected to be live',
                id: 'months', min: 1, max: 18, step: 1, value: months,
                display: String(months), unit: 'months',
                ticks: ['1mo','3mo','6mo','12mo','18mo'],
                fillRef: monthsFillRef,
                onChange: (v: number) => setMonths(v),
              },
              {
                label: 'Architecture decision certainty', desc: 'How confident are you in your core architecture decisions right now?',
                id: 'confidence', min: 10, max: 95, step: 5, value: confidence,
                display: confidence + '%', unit: 'confident',
                ticks: ['Guessing','Uncertain','Fairly sure','Confident','Certain'],
                fillRef: riskFillRef,
                onChange: (v: number) => setConfidence(v),
              },
            ].map((s, i, arr) => (
              <div key={s.id} className={i < arr.length - 1 ? "mb-8 pb-8 border-b border-border/50" : ""}>
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div className="flex-1">
                    <div className="text-sm font-semibold text-foreground mb-1">{s.label}</div>
                    <div className="text-xs text-muted-foreground leading-relaxed">{s.desc}</div>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="font-serif text-3xl font-medium text-gold leading-none block mb-1">{s.display}</span>
                    <span className="text-[10px] tracking-widest text-muted-foreground uppercase">{s.unit}</span>
                  </div>
                </div>
                <div className="relative h-1.5 bg-border rounded-full">
                  <div ref={s.fillRef} className="absolute top-0 left-0 h-full bg-gold rounded-full pointer-events-none transition-all duration-150" style={{ width: '0%', opacity: 0.8 }} />
                  <input type="range" min={s.min} max={s.max} step={s.step} value={s.value}
                    onChange={e => s.onChange(Number(e.target.value))}
                    style={sliderStyle}
                    className="slider-thumb"
                  />
                </div>
                <div className="flex justify-between mt-2">
                  {s.ticks.map(t => <span key={t} className="text-[10px] text-muted-foreground/70">{t}</span>)}
                </div>
              </div>
            ))}
          </div>

          {/* Results */}
          <div className="bg-muted/30 border-t border-border p-6 md:p-8">
            {/* 3-card grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8 text-center sm:text-left">
              {[
                { label: 'Total build investment',    value: fmt(totalBuild),   sub: 'Team cost over build',     danger: false, gold: false },
                { label: 'Architecture risk exposure', value: fmt(riskExposure), sub: getRiskLabel(confidence),  danger: true,  gold: false },
                { label: 'Advisory fee', value: '$' + fee.toLocaleString(), sub: `${engagement.hours}`, danger: false, gold: true  },
              ].map(c => (
                <div key={c.label} className={`border rounded-xl p-5 ${c.gold ? 'border-gold/30 bg-gold/5' : 'border-border bg-card'}`}>
                  <div className="text-[9px] tracking-widest uppercase text-muted-foreground mb-2">{c.label}</div>
                  <div className={`font-serif text-3xl font-bold leading-none mb-2 ${c.danger ? 'text-[#c86b4b]' : c.gold ? 'text-gold' : 'text-foreground'}`}>{c.value}</div>
                  <div className="text-xs text-muted-foreground">{c.sub}</div>
                </div>
              ))}
            </div>

            {/* Ratio bar */}
            <div className="mb-8 p-6 bg-card border border-border/50 rounded-xl">
              <div className="flex justify-between mb-3 text-sm">
                <span className="text-muted-foreground">Advisory fee as a % of risk exposure</span>
                <span className="text-gold font-medium tracking-wide">{ratioPct.toFixed(1)}%</span>
              </div>
              <div className="h-2 bg-border rounded-full overflow-hidden relative">
                <div className="absolute top-0 left-0 h-full w-full bg-[#c86b4b]/60 rounded-full transition-all duration-500" />
                <div className="absolute top-0 left-0 h-full bg-gold rounded-full transition-all duration-500 shadow-[0_0_10px_rgba(200,168,75,0.8)]" style={{ width: `${Math.min(ratioPct, 100)}%` }} />
              </div>
            </div>

            {/* Insight */}
            <div className="bg-card border-l-2 border-l-gold rounded-r-xl p-5 mb-8 text-sm text-muted-foreground leading-relaxed shadow-sm">
              <div className="text-[10px] tracking-widest text-gold uppercase mb-2">The calculation</div>
              With <strong className="text-foreground font-semibold">{team} engineer{team > 1 ? 's' : ''}</strong> building over <strong className="text-foreground font-semibold">{months} month{months > 1 ? 's' : ''}</strong> at your confidence level, an architecture mistake could cost <strong className="text-foreground font-semibold">{fmt(riskExposure)} in rework</strong>. The {engagement.name} costs <strong className="text-foreground font-semibold">${fee.toLocaleString()}</strong> — that is <strong className="text-foreground font-semibold">{ratioPct.toFixed(1)}%</strong> of your exposure, and saves you an estimated <strong className="text-foreground font-semibold">{fmt(saving)}</strong> if it prevents a rebuild.
            </div>

            {/* CTA */}
            <div className="flex flex-col sm:flex-row gap-4">
              <a href="#assessment" className="flex-1">
                <Button variant="hero" className="w-full h-12 uppercase tracking-widest text-xs">
                  Book the {engagement.name} {'\u2192'}
                </Button>
              </a>
              <Button onClick={() => setOpen(o => !o)} variant="outline" className="flex-1 h-12 uppercase tracking-widest text-xs">
                {open ? 'Hide breakdown \u2191' : 'See full breakdown \u2193'}
              </Button>
            </div>
          </div>
        </div>

        {/* Breakdown */}
        {open && (
          <div className="bg-card border border-border rounded-xl overflow-hidden animate-fade-in-up">
            <div className="bg-muted/30 border-b border-border px-6 py-4">
              <span className="text-[10px] tracking-widest text-gold uppercase">Cost breakdown methodology</span>
            </div>
            <div className="p-6 md:p-8">
              {[
                { label: 'Team size',                   val: `${team} engineer${team > 1 ? 's' : ''}` },
                { label: 'Daily cost per engineer',      val: `$${rate.toLocaleString()}/day` },
                { label: 'Build duration',               val: `${months} month${months > 1 ? 's' : ''} (${workingDays} working days)` },
                { label: 'Total team cost',              val: fmtFull(totalBuild) },
                { sep: true },
                { label: 'Architecture confidence',      val: `${confidence}%` },
                { label: 'Rework multiplier applied',    val: getMultiplierLabel(reworkMultiplier) },
                { label: 'Estimated rework cost',        val: fmtFull(riskExposure), danger: true },
                { sep: true },
                { label: 'Recommended engagement',       val: engagement.name, gold: true },
                { label: 'Advisory fee',                 val: `$${fee.toLocaleString()}`, gold: true },
                { label: 'Fee as % of rework risk',      val: ratioPct.toFixed(1) + '%', gold: true },
              ].map((row: any, i) => row.sep ? (
                <div key={i} className="h-px bg-border my-3" />
              ) : (
                <div key={i} className="flex justify-between items-baseline py-2.5 border-b border-border/30 text-sm">
                  <span className="text-muted-foreground">{row.label}</span>
                  <span className={`font-mono text-xs ${row.danger ? 'text-[#c86b4b]' : row.gold ? 'text-gold' : 'text-foreground'}`}>{row.val}</span>
                </div>
              ))}
              <div className="pt-4">
                <p className="text-xs text-muted-foreground/70 italic leading-relaxed">
                  Rework cost is estimated as: (team cost) &times; (1 &minus; confidence%) &times; rework multiplier. Rework multiplier ranges from 1.2&times; (high confidence) to 2.5&times; (low confidence), based on software engineering project recovery benchmarks. This is a directional model, not a precise prediction.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      <style>{`
        .slider-thumb::-webkit-slider-thumb {
          -webkit-appearance:none; appearance:none;
          width:20px; height:20px; border-radius:50%;
          background:hsl(var(--gold)); border:2px solid hsl(var(--card));
          cursor:pointer; transition:transform 0.15s ease, box-shadow 0.15s ease;
          box-shadow: 0 0 10px rgba(200,168,75,0.4);
        }
        .slider-thumb::-webkit-slider-thumb:hover {
          transform:scale(1.2); box-shadow:0 0 0 6px rgba(200,168,75,0.1);
        }
        .slider-thumb::-moz-range-thumb {
          width:20px; height:20px; border-radius:50%;
          background:hsl(var(--gold)); border:2px solid hsl(var(--card)); cursor:pointer;
        }
      `}</style>
    </section>
  )
}
