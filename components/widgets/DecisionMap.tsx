import { useEffect, useRef } from 'react'

/* ─── TYPES ─────────────────────────────────────────────────────────────── */
type NodeType = 'root' | 'l1' | 'l2' | 'l3' | 'leaf'
type CatType = 'ai' | 'cloud' | 'data' | 'risk'

interface NodeDef {
  id: string; x: number; y: number; r: number
  type: NodeType; cat: CatType; label: string; short: string
  category: string; title: string; body: string; principle: string
}

interface EdgeDef { from: string; to: string; w: number }

/* ─── DATA ──────────────────────────────────────────────────────────────── */
const COLORS: Record<CatType, { fill:string; stroke:string; glow:string; dot:string; hover:string }> = {
  ai:    { fill:'rgba(200,168,75,0.10)',  stroke:'rgba(200,168,75,0.45)',  glow:'rgba(200,168,75,0.6)',  dot:'rgba(200,168,75,0.8)',  hover:'rgba(200,168,75,0.18)' },
  cloud: { fill:'rgba(74,130,158,0.10)', stroke:'rgba(74,130,158,0.45)', glow:'rgba(74,130,158,0.6)', dot:'rgba(74,130,158,0.8)', hover:'rgba(74,130,158,0.18)' },
  data:  { fill:'rgba(107,158,74,0.10)', stroke:'rgba(107,158,74,0.45)', glow:'rgba(107,158,74,0.6)', dot:'rgba(107,158,74,0.8)', hover:'rgba(107,158,74,0.18)' },
  risk:  { fill:'rgba(200,100,75,0.10)', stroke:'rgba(200,100,75,0.45)', glow:'rgba(200,100,75,0.6)', dot:'rgba(200,100,75,0.8)', hover:'rgba(200,100,75,0.18)' },
}

const NODES: NodeDef[] = [
  { id:'root', x:410, y:58, r:32, type:'root', cat:'ai',
    label:'Architecture\nDecision', short:'Start', category:'Foundation',
    title:'The Architecture Decision',
    body:'Before any code is written, a set of fundamental decisions determines whether the system will survive production — or collapse under real load, real cost, and real edge cases.',
    principle:'Getting the architecture right is not a phase. It is the phase.' },

  { id:'ai_layer', x:180, y:160, r:26, type:'l1', cat:'ai',
    label:'AI Layer', short:'AI', category:'AI Layer',
    title:'AI System Design',
    body:'The AI layer is where most systems fail first. LLM selection, retrieval strategy, context management, and output validation are interconnected decisions — changing one forces changes in all others.',
    principle:'The model is the least important part of an AI system. The architecture around it is everything.' },

  { id:'cloud', x:410, y:160, r:26, type:'l1', cat:'cloud',
    label:'Cloud\nInfra', short:'Cloud', category:'Cloud',
    title:'Cloud Infrastructure',
    body:'Cloud decisions made early become load-bearing walls. Provider choice, service topology, networking, and cost architecture lock in at the design stage — not at deployment.',
    principle:'A cloud architecture that works in staging and collapses under production load was never a real architecture.' },

  { id:'data', x:640, y:160, r:26, type:'l1', cat:'data',
    label:'Data\nLayer', short:'Data', category:'Data',
    title:'Data Architecture',
    body:'Data pipelines, storage design, and indexing strategy determine query performance, cost, and the quality of everything the AI layer produces. Weak data architecture produces correct-looking but wrong answers.',
    principle:'Garbage in, confident garbage out.' },

  { id:'llm', x:70, y:275, r:21, type:'l2', cat:'ai',
    label:'LLM\nSelect', short:'LLM', category:'AI · Model Selection',
    title:'LLM Selection',
    body:'GPT, Claude, Gemini, Mistral, or open-source — the choice is not about capability benchmarks. It is about latency requirements, cost per token at scale, context window size, and data residency constraints.',
    principle:'Pick the smallest model that meets your production requirements, not the best one on a leaderboard.' },

  { id:'rag', x:175, y:275, r:21, type:'l2', cat:'ai',
    label:'RAG vs\nFine-tune', short:'RAG', category:'AI · Retrieval Strategy',
    title:'RAG vs Fine-tuning',
    body:'RAG is the correct default for most enterprise use cases: it is updatable, auditable, and does not bake stale knowledge into weights. Fine-tuning is for style and format adaptation — not for injecting facts.',
    principle:'If you are fine-tuning to inject knowledge, you are solving the wrong problem.' },

  { id:'context', x:280, y:275, r:21, type:'l2', cat:'ai',
    label:'Context\nMgmt', short:'Ctx', category:'AI · Context Management',
    title:'Context Window Management',
    body:'Token budgeting, context compression, and retrieval filtering determine both output quality and infrastructure cost. A system with no context strategy degrades and becomes expensive as usage grows.',
    principle:'Context is a finite resource. Treat it like memory, not an infinite scroll.' },

  { id:'provider', x:370, y:275, r:21, type:'l2', cat:'cloud',
    label:'Provider\nChoice', short:'Provider', category:'Cloud · Provider',
    title:'Provider Architecture',
    body:'AWS, Azure, and GCP are not interchangeable. AI service availability, data residency, existing enterprise agreements, and specific managed service quality differ significantly across providers for AI workloads.',
    principle:'Pick the provider whose managed services match your stack, not the one with the best marketing.' },

  { id:'scale', x:450, y:275, r:21, type:'l2', cat:'cloud',
    label:'Scale\nStrategy', short:'Scale', category:'Cloud · Scaling',
    title:'Scaling Architecture',
    body:'Horizontal vs vertical scaling, auto-scaling triggers, and cold start management for AI inference are non-trivial. Most AI systems underestimate GPU/CPU burst requirements and design for average load, not peak.',
    principle:'Design for your worst traffic day. You will have one sooner than you expect.' },

  { id:'pipeline', x:570, y:275, r:21, type:'l2', cat:'data',
    label:'Pipeline\nDesign', short:'Pipe', category:'Data · Pipeline',
    title:'Data Pipeline Architecture',
    body:'Ingestion, transformation, and indexing pipelines determine how fresh and how accurate the AI layer inputs are. Real-time vs batch vs hybrid decisions here affect both cost and output quality.',
    principle:'A pipeline that breaks quietly is more dangerous than one that breaks loudly.' },

  { id:'vector', x:660, y:275, r:21, type:'l2', cat:'data',
    label:'Vector\nStore', short:'Vec', category:'Data · Storage',
    title:'Vector Database Selection',
    body:'Pinecone, Weaviate, Qdrant, pgvector — the choice depends on query volume, embedding dimensions, metadata filtering requirements, and whether you need multi-tenancy. Most teams over-engineer this choice.',
    principle:'pgvector solves 80% of use cases. Do not buy a specialised database until you have a problem it uniquely solves.' },

  { id:'entity', x:750, y:275, r:21, type:'l2', cat:'data',
    label:'Entity\nModel', short:'Entity', category:'Data · Modelling',
    title:'Entity & Schema Design',
    body:'How you model your domain entities — products, users, documents, transactions — directly affects retrieval accuracy, join performance, and the ability to attribute AI outputs to source data.',
    principle:'A weak data model produces confident but structurally incorrect answers at scale.' },

  { id:'cost', x:100, y:390, r:19, type:'l3', cat:'risk',
    label:'Cost\nTrap', short:'Cost', category:'Risk · Cost',
    title:'Runaway Infrastructure Cost',
    body:'The most common AI system failure is not technical — it is financial. Over-provisioned models, unfiltered context, unnecessary re-embeddings, and no token budgets turn a working system into an unviable one.',
    principle:'Cost at scale is an architecture problem, not a billing problem.' },

  { id:'latency', x:200, y:390, r:19, type:'l3', cat:'risk',
    label:'Latency\nRisk', short:'Lat', category:'Risk · Performance',
    title:'Latency Under Production Load',
    body:'3–6 second LLM response times are acceptable in a prototype. They destroy user experience in a product. Streaming, caching, pre-computation, and retrieval filtering are architectural choices that must be made early.',
    principle:'If streaming is not in the design from day one, it is a retrofit — and retrofits are expensive.' },

  { id:'halluc', x:310, y:390, r:19, type:'l3', cat:'risk',
    label:'Hallucin-\nation', short:'Hall', category:'Risk · Output Quality',
    title:'Hallucination Risk',
    body:'Hallucination is not a model problem — it is an architecture problem. Systems without a proper retrieval layer, source grounding, and output validation will hallucinate under any model.',
    principle:'If your system cannot point to the source of its answer, it does not have a source.' },

  { id:'lockin', x:420, y:390, r:19, type:'l3', cat:'risk',
    label:'Vendor\nLock-in', short:'Lock', category:'Risk · Architecture',
    title:'Vendor Lock-in',
    body:"Deep integration with a single cloud provider's proprietary AI services, embedding APIs, or orchestration frameworks creates lock-in that increases cost and reduces negotiating power at renewal.",
    principle:'Abstract your AI provider. It should be replaceable in a day, not a quarter.' },

  { id:'observe', x:520, y:390, r:19, type:'l3', cat:'risk',
    label:'Observ-\nability', short:'Obs', category:'Risk · Operations',
    title:'Observability Gap',
    body:'AI systems without tracing, token cost monitoring, latency percentile tracking, and output quality scoring are flying blind. Production AI systems degrade silently without proper instrumentation.',
    principle:'You cannot fix what you cannot measure. Instrument from day one.' },

  { id:'security', x:620, y:390, r:19, type:'l3', cat:'risk',
    label:'Security\nSurface', short:'Sec', category:'Risk · Security',
    title:'Security Architecture',
    body:'Prompt injection, data exfiltration via context, PII leakage in embeddings, and API key exposure in client-side code are AI-specific security vectors that traditional AppSec frameworks do not cover.',
    principle:'Every LLM call is a potential injection surface. Treat it like user input.' },

  { id:'multitenant', x:720, y:390, r:19, type:'l3', cat:'risk',
    label:'Multi-\ntenant', short:'MT', category:'Risk · Architecture',
    title:'Multi-tenancy Isolation',
    body:"SaaS platforms using a shared LLM and shared vector store must implement strict tenant isolation at the retrieval layer. A retrieval boundary failure exposes one tenant's data to another.",
    principle:'Tenant isolation is not a feature. It is a foundational architecture constraint.' },

  { id:'outcome_good', x:210, y:475, r:13, type:'leaf', cat:'ai',
    label:'Sound\nArch', short:'', category:'Outcome · Architecture',
    title:'Sound Architecture',
    body:'A system designed with explicit decisions at each layer: predictable cost, maintainable codebase, clear failure modes, and the ability to evolve without a full rebuild.',
    principle:'A sound architecture is not one that never breaks. It is one that breaks predictably.' },

  { id:'outcome_bad', x:610, y:475, r:13, type:'leaf', cat:'risk',
    label:'Costly\nRebuild', short:'', category:'Outcome · Risk',
    title:'Costly Rebuild',
    body:'Systems built without explicit architecture decisions tend to reach a point where accumulated technical debt and wrong foundational choices force a partial or full rebuild — at 3–5× the original build cost.',
    principle:'Every deferred architecture decision becomes a future rebuild ticket.' },
]

const EDGES: EdgeDef[] = [
  { from:'root', to:'ai_layer', w:1.5 }, { from:'root', to:'cloud', w:1.5 }, { from:'root', to:'data', w:1.5 },
  { from:'ai_layer', to:'llm', w:1 }, { from:'ai_layer', to:'rag', w:1 }, { from:'ai_layer', to:'context', w:1 },
  { from:'cloud', to:'provider', w:1 }, { from:'cloud', to:'scale', w:1 },
  { from:'data', to:'pipeline', w:1 }, { from:'data', to:'vector', w:1 }, { from:'data', to:'entity', w:1 },
  { from:'llm', to:'cost', w:0.8 }, { from:'context', to:'latency', w:0.8 }, { from:'rag', to:'halluc', w:0.8 },
  { from:'provider', to:'lockin', w:0.8 }, { from:'scale', to:'observe', w:0.8 },
  { from:'pipeline', to:'security', w:0.8 }, { from:'vector', to:'multitenant', w:0.8 },
  { from:'cost', to:'outcome_bad', w:0.6 }, { from:'multitenant', to:'outcome_bad', w:0.6 },
  { from:'rag', to:'outcome_good', w:0.6 }, { from:'context', to:'outcome_good', w:0.6 },
]

const nodeMap: Record<string, NodeDef> = {}
NODES.forEach(n => { nodeMap[n.id] = n })

/* ─── COMPONENT ─────────────────────────────────────────────────────────── */
export default function DecisionMap() {
  const wrapRef    = useRef<HTMLDivElement>(null)
  const svgRef     = useRef<SVGSVGElement>(null)
  const edgesGRef  = useRef<SVGGElement>(null)
  const nodesGRef  = useRef<SVGGElement>(null)
  const pulsesGRef = useRef<SVGGElement>(null)
  const tooltipRef = useRef<HTMLDivElement>(null)
  const infoRef    = useRef<HTMLDivElement>(null)
  const initialised = useRef(false)

  useEffect(() => {
    const wrap = wrapRef.current
    if (!wrap) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !initialised.current) {
          initialised.current = true
          initMap()
          observer.disconnect()
        }
      },
      { threshold: 0.15 }
    )
    observer.observe(wrap)
    return () => observer.disconnect()
  }, [])

  function buildPath(fromN: NodeDef, toN: NodeDef): string {
    const dx = toN.x - fromN.x, dy = toN.y - fromN.y
    const len = Math.sqrt(dx*dx + dy*dy)
    const sx = fromN.x + (dx/len)*fromN.r
    const sy = fromN.y + (dy/len)*fromN.r
    const ex = toN.x - (dx/len)*(toN.r+5)
    const ey = toN.y - (dy/len)*(toN.r+5)
    const mx = (sx+ex)/2, my = (sy+ey)/2
    const nx = -dy/len, ny = dx/len
    const cx = mx + nx*len*0.12, cy = my + ny*len*0.12
    return `M${sx},${sy} Q${cx},${cy} ${ex},${ey}`
  }

  function drawEdges() {
    if(!edgesGRef.current) return
    const g = edgesGRef.current!
    EDGES.forEach(e => {
      const f = nodeMap[e.from], t = nodeMap[e.to]
      const path = document.createElementNS('http://www.w3.org/2000/svg','path')
      path.setAttribute('d', buildPath(f,t))
      path.setAttribute('fill','none')
      path.setAttribute('stroke', e.w > 1 ? 'rgba(200,168,75,0.20)' : 'rgba(255,255,255,0.06)')
      path.setAttribute('stroke-width', String(e.w))
      path.setAttribute('marker-end', e.w > 1 ? 'url(#arr-gold)' : 'url(#arr-dim)')
      path.setAttribute('data-from', e.from)
      path.setAttribute('data-to', e.to)
      path.setAttribute('class','edge-path')
      path.style.strokeDasharray = '200'
      path.style.strokeDashoffset = '200'
      path.style.transition = 'none'
      g.appendChild(path)
      const delay = 100 + NODES.findIndex(n => n.id === e.from) * 60
      setTimeout(() => {
        path.style.transition = 'stroke-dashoffset 0.8s ease'
        path.style.strokeDashoffset = '0'
      }, delay)
    })
  }

  function addPulse(id: string, delay: number) {
    if(!pulsesGRef.current) return
    const n = nodeMap[id], c = COLORS[n.cat]
    const circle = document.createElementNS('http://www.w3.org/2000/svg','circle')
    circle.setAttribute('cx', String(n.x)); circle.setAttribute('cy', String(n.y))
    circle.setAttribute('r', String(n.r)); circle.setAttribute('fill','none')
    circle.setAttribute('stroke', c.glow); circle.setAttribute('stroke-width','1')
    circle.setAttribute('opacity','0')
    pulsesGRef.current!.appendChild(circle)

    function doPulse() {
      let start: number | null = null
      const dur = 1800
      function step(ts: number) {
        if (!start) start = ts
        const t = (ts - start) / dur
        if (t > 1) {
          circle.setAttribute('opacity','0')
          setTimeout(doPulse, 2200 + Math.random()*2000)
          return
        }
        circle.setAttribute('r', String(n.r + t * 22))
        circle.setAttribute('opacity', String((1-t) * 0.55))
        requestAnimationFrame(step)
      }
      requestAnimationFrame(step)
    }
    setTimeout(doPulse, delay)
  }

  function positionTooltip(n: NodeDef) {
    const wrap = wrapRef.current!, tt = tooltipRef.current!
    if(!wrap || !tt || !svgRef.current) return
    const rect = wrap.getBoundingClientRect()
    const svgRect = svgRef.current!.getBoundingClientRect()
    const scaleX = svgRect.width / 820, scaleY = svgRect.height / 520
    const px = svgRect.left - rect.left + n.x * scaleX
    const py = svgRect.top  - rect.top  + n.y * scaleY
    const tw = 240, th = 160
    let left = px + 16, top = py - 20
    if (left + tw > rect.width - 10) left = px - tw - 16
    if (top + th > rect.height - 10) top = py - th
    if (top < 5) top = 5
    tt.style.left = left + 'px'
    tt.style.top  = top  + 'px'
  }

  function highlightConnected(id: string, on: boolean) {
    const svgEl = svgRef.current!
    if(!svgEl) return
    svgEl.querySelectorAll('.edge-path').forEach((path) => {
      const el = path as SVGPathElement
      const f = el.getAttribute('data-from'), t = el.getAttribute('data-to')
      if (f === id || t === id) {
        el.setAttribute('stroke', on ? 'rgba(200,168,75,0.55)' : (parseFloat(el.getAttribute('stroke-width')!) > 1 ? 'rgba(200,168,75,0.20)' : 'rgba(255,255,255,0.06)'))
        el.setAttribute('stroke-width', on ? '1.8' : el.getAttribute('stroke-width')!)
      } else {
        (el as SVGElement).style.opacity = on ? '0.3' : '1'
      }
    })
    svgEl.querySelectorAll('.node-group').forEach((g) => {
      const el = g as SVGGElement
      if (el.getAttribute('data-id') !== id) {
        const connected = EDGES.some(e => (e.from===id && e.to===el.getAttribute('data-id')) || (e.to===id && e.from===el.getAttribute('data-id')))
        el.style.opacity = on ? (connected ? '1' : '0.35') : '1'
      }
    })
  }

  function drawNodes() {
    if(!nodesGRef.current) return
    const g = nodesGRef.current!
    NODES.forEach((n, idx) => {
      const c = COLORS[n.cat]
      const grp = document.createElementNS('http://www.w3.org/2000/svg','g')
      grp.setAttribute('class','node-group')
      grp.setAttribute('data-id', n.id)
      grp.style.cursor = 'pointer'
      grp.style.opacity = '0'
      grp.style.transition = 'opacity 0.4s ease'

      const circle = document.createElementNS('http://www.w3.org/2000/svg','circle')
      circle.setAttribute('cx', String(n.x)); circle.setAttribute('cy', String(n.y)); circle.setAttribute('r', String(n.r))
      circle.setAttribute('fill', c.fill); circle.setAttribute('stroke', c.stroke)
      circle.setAttribute('stroke-width', n.type==='root' ? '1.5' : '1')
      circle.setAttribute('class','node-circle')

      const lines = n.label.split('\n')
      const textG = document.createElementNS('http://www.w3.org/2000/svg','g')
      lines.forEach((line, i) => {
        const txt = document.createElementNS('http://www.w3.org/2000/svg','text')
        txt.setAttribute('x', String(n.x))
        const offset = lines.length===1 ? 0 : (i===0 ? -6 : 6)
        txt.setAttribute('y', String(n.y + offset + 3))
        txt.setAttribute('text-anchor','middle')
        txt.setAttribute('dominant-baseline','middle')
        txt.setAttribute('fill', n.type==='root' ? '#ffffff' : '#a1a1aa')
        const fs = n.type==='root' ? 9 : n.type==='l1' ? 8.5 : n.type==='l2' ? 7.5 : n.type==='l3' ? 7 : 6.5
        txt.setAttribute('font-size', String(fs))
        txt.setAttribute('font-family','Inter, sans-serif')
        txt.setAttribute('pointer-events','none')
        txt.textContent = line
        textG.appendChild(txt)
      })

      grp.appendChild(circle); grp.appendChild(textG); g.appendChild(grp)
      setTimeout(() => { grp.style.opacity = '1' }, 200 + idx * 55)

      grp.addEventListener('mouseenter', () => {
        const tt = tooltipRef.current!
        if(!tt) return
        circle.setAttribute('fill', c.hover)
        circle.setAttribute('stroke', c.glow)
        circle.setAttribute('stroke-width','1.5')
        grp.querySelectorAll('text').forEach(t => t.setAttribute('fill','#ffffff'))
        highlightConnected(n.id, true)
        ;(tt.querySelector('#ttCat') as HTMLElement).textContent = n.category
        ;(tt.querySelector('#ttTitle') as HTMLElement).textContent = n.title
        ;(tt.querySelector('#ttBody') as HTMLElement).textContent = n.body
        ;(tt.querySelector('#ttPrinc') as HTMLElement).textContent = `"${n.principle}"`
        positionTooltip(n)
        tt.classList.add('tt-visible')
        if (infoRef.current) infoRef.current.innerHTML = `<strong class="text-foreground">${n.title}</strong> — ${n.body.substring(0,110)}...`
      })

      grp.addEventListener('mouseleave', () => {
        const tt = tooltipRef.current!
        if(!tt) return
        circle.setAttribute('fill', c.fill)
        circle.setAttribute('stroke', c.stroke)
        circle.setAttribute('stroke-width', n.type==='root' ? '1.5' : '1')
        grp.querySelectorAll('text').forEach(t => t.setAttribute('fill', n.type==='root' ? '#ffffff' : '#a1a1aa'))
        highlightConnected(n.id, false)
        tt.classList.remove('tt-visible')
        if (infoRef.current) infoRef.current.innerHTML = `<strong>20+ decisions</strong> shape every AI or cloud system before a line of code is written. Hover any node to see the principle behind the decision.`
      })

      grp.addEventListener('click', () => {
        if (infoRef.current) infoRef.current.innerHTML = `<strong class="text-foreground">${n.title}:</strong> ${n.body} <em class="text-gold/80 italic"> — "${n.principle}"</em>`
      })
    })

    addPulse('root', 0); addPulse('ai_layer', 1200); addPulse('cloud', 1800); addPulse('data', 2400)
  }

  function initMap() { drawEdges(); drawNodes() }

  /* ── RENDER ──────────────────────────────────────────────────────────── */
  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-block mb-6 px-4 py-1.5 rounded-full border border-gold/20 bg-gold/5 animate-fade-in">
            <span className="text-sm font-medium text-gold tracking-widest uppercase">Architecture Decision Map</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-bold font-serif mb-4 text-foreground leading-tight">
            The architecture<br /><span className="text-gradient-gold italic">decision space.</span>
          </h2>
          <p className="text-base text-muted-foreground max-w-[480px] mx-auto">
            Every AI and cloud system navigates the same decision tree. Hover any node to see the principle behind it.
          </p>
        </div>

        {/* Map */}
        <div ref={wrapRef} className="bg-card border border-border rounded-t-xl overflow-hidden relative mb-px shadow-xl shadow-black/20">
          {/* Toolbar */}
          <div className="bg-muted/30 border-b border-border px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <span className="text-[10px] tracking-widest text-gold uppercase opacity-80 hidden sm:block">Architecture decision map</span>
              <div className="flex gap-4">
                {(['ai','cloud','data','risk'] as CatType[]).map(c => (
                  <div key={c} className="flex items-center gap-1.5 text-[10px] sm:text-xs text-muted-foreground">
                    <span className="w-2 h-2 rounded-full block" style={{ background:COLORS[c].dot }}/>
                    {c.charAt(0).toUpperCase()+c.slice(1) === 'Ai' ? 'AI Layer' : c.charAt(0).toUpperCase()+c.slice(1)}
                  </div>
                ))}
              </div>
            </div>
            <span className="text-[10px] text-muted-foreground tracking-widest uppercase hidden md:block">Hover nodes to explore</span>
          </div>

          {/* SVG */}
          <svg ref={svgRef} viewBox="0 0 820 520" preserveAspectRatio="xMidYMid meet"
            className="w-full h-[520px] block cursor-default">
            <defs>
              <marker id="arr-gold" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
                <path d="M0,0 L6,3 L0,6 Z" fill="rgba(200,168,75,0.4)"/>
              </marker>
              <marker id="arr-dim" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
                <path d="M0,0 L6,3 L0,6 Z" fill="rgba(255,255,255,0.1)"/>
              </marker>
            </defs>
            <g ref={edgesGRef}/>
            <g ref={nodesGRef}/>
            <g ref={pulsesGRef}/>
          </svg>

          {/* Tooltip */}
          <div ref={tooltipRef} className="map-tooltip absolute bg-muted border border-gold/40 rounded-lg p-5 max-w-[260px] pointer-events-none opacity-0 translate-y-1 transition-all duration-200 z-10 shadow-2xl">
            <div id="ttCat" className="text-[9px] tracking-widest uppercase text-gold/80 mb-2"/>
            <div id="ttTitle" className="font-serif text-lg font-semibold text-foreground leading-snug mb-3"/>
            <div id="ttBody" className="text-xs text-muted-foreground leading-relaxed"/>
            <div id="ttPrinc" className="mt-4 pt-3 border-t border-border text-[11px] text-gold/80 italic leading-relaxed"/>
          </div>
        </div>

        {/* Info panel */}
        <div className="bg-card border border-border border-t-0 rounded-b-xl px-6 py-5 flex items-center justify-between gap-6 flex-wrap shadow-xl shadow-black/20">
          <div ref={infoRef} className="text-sm text-muted-foreground leading-relaxed flex-1 min-w-[200px]">
            <strong className="text-foreground">20+ decisions</strong> shape every AI or cloud system before a line of code is written. Hover any node to see the principle behind the decision.
          </div>
          <a href="#assessment" className="bg-transparent border border-gold/30 text-gold/80 hover:bg-gold/10 hover:border-gold hover:text-gold text-xs tracking-widest uppercase px-6 py-3 rounded-lg transition-all whitespace-nowrap hidden sm:inline-flex">
            Assess your situation &rarr;
          </a>
        </div>

        {/* Category cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-8">
          {[
            { cat:'ai' as CatType,    name:'AI Layer',   desc:'LLM selection, retrieval, orchestration, and output quality' },
            { cat:'cloud' as CatType, name:'Cloud',      desc:'Infrastructure topology, cost, reliability, and scaling' },
            { cat:'data' as CatType,  name:'Data',       desc:'Pipelines, indexing, storage, and entity modeling' },
            { cat:'risk' as CatType,  name:'Risk',       desc:'Failure modes, cost traps, latency, and lock-in' },
          ].map(({ cat, name, desc }) => (
            <div key={cat} className="bg-card border border-border rounded-lg p-4">
              <div className="w-2.5 h-2.5 rounded-full mb-3" style={{ background:COLORS[cat].dot }}/>
              <div className="text-sm font-medium text-foreground mb-1.5">{name}</div>
              <div className="text-xs text-muted-foreground leading-relaxed">{desc}</div>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        .map-tooltip.tt-visible { opacity:1 !important; transform:translateY(0) !important; }
        .node-group { transition: opacity 0.2s; }
        @media(max-width:580px){ .map-tooltip { display:none; } }
      `}</style>
    </section>
  )
}
