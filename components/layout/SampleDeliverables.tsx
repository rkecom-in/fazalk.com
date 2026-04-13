import { FileText, AlertTriangle, TrendingDown, Clock, Database, ArrowRight, CheckCircle2, Layers } from "lucide-react";

const SampleDeliverables = () => {
  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-6 max-w-6xl">
        <p className="text-sm font-semibold text-gold tracking-widest uppercase mb-4 text-center">Proof of Work</p>
        <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4 text-center">
          Sample Deliverables
        </h2>
        <p className="text-muted-foreground text-center mb-16 max-w-2xl mx-auto">
          Every engagement produces clear, written outputs. Here's what that looks like.
        </p>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Blueprint Card */}
          <div className="rounded-xl border border-border bg-card p-8 hover:border-gold/20 transition-colors">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 rounded-lg bg-gold/10">
                <FileText className="w-5 h-5 text-gold" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-foreground font-serif">AI Architecture Blueprint</h3>
                <p className="text-xs text-muted-foreground">Sample Extract</p>
              </div>
            </div>

            <p className="text-sm text-muted-foreground mb-6">
              <span className="text-foreground font-medium">Use Case:</span> AI-powered document intelligence system for enterprise workflows
            </p>

            <div className="space-y-3 mb-6">
              {[
                { icon: Layers, text: "Frontend + API Gateway → Orchestration → AI Layer (LLM + RAG + Vector DB)" },
                { icon: Database, text: "PostgreSQL + S3 for structured/unstructured storage" },
                { icon: ArrowRight, text: "Query → Vector search → Context injection → Grounded LLM response" },
              ].map((item) => (
                <div key={item.text} className="flex items-start gap-3 text-sm">
                  <item.icon className="w-4 h-4 text-gold flex-shrink-0 mt-0.5" />
                  <span className="text-secondary-foreground">{item.text}</span>
                </div>
              ))}
            </div>

            <div className="border-t border-border pt-5">
              <p className="text-xs font-semibold text-gold uppercase tracking-wider mb-3">Key Decisions</p>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-gold flex-shrink-0 mt-0.5" />
                  Use RAG over fine-tuning for early-stage flexibility
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-gold flex-shrink-0 mt-0.5" />
                  Separate retrieval and generation layers for scalability
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-gold flex-shrink-0 mt-0.5" />
                  Control cost via retrieval filtering and token optimization
                </li>
              </ul>
            </div>

            <div className="mt-5 p-3 rounded-lg bg-gold/5 border border-gold/10">
              <p className="text-sm text-gold font-medium">
                Outcome: Production-ready, scalable AI system with controlled cost and improved accuracy
              </p>
            </div>
          </div>

          {/* Audit Card */}
          <div className="rounded-xl border border-border bg-card p-8 hover:border-gold/20 transition-colors">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 rounded-lg bg-gold/10">
                <AlertTriangle className="w-5 h-5 text-gold" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-foreground font-serif">AI System Audit Report</h3>
                <p className="text-xs text-muted-foreground">Sample Extract</p>
              </div>
            </div>

            <p className="text-sm text-muted-foreground mb-6">
              <span className="text-foreground font-medium">System:</span> AI-powered search + recommendation engine
            </p>

            <div className="space-y-4 mb-6">
              {[
                { icon: AlertTriangle, title: "Incorrect Architecture", desc: "No retrieval layer → high hallucination risk", severity: "Critical" },
                { icon: TrendingDown, title: "Cost Inefficiency", desc: "2–4x higher infra cost than necessary", severity: "High" },
                { icon: Clock, title: "Latency Bottleneck", desc: "3–6 second response time, no streaming", severity: "High" },
                { icon: Database, title: "Weak Data Pipeline", desc: "No structured indexing, reliance on raw prompts", severity: "Medium" },
              ].map((finding) => (
                <div key={finding.title} className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                  <finding.icon className="w-4 h-4 text-gold flex-shrink-0 mt-0.5" />
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-foreground">{finding.title}</span>
                      <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold uppercase tracking-wider ${
                        finding.severity === "Critical" ? "bg-destructive/20 text-destructive" :
                        finding.severity === "High" ? "bg-gold/15 text-gold" :
                        "bg-muted text-muted-foreground"
                      }`}>{finding.severity}</span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">{finding.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t border-border pt-5">
              <p className="text-xs font-semibold text-gold uppercase tracking-wider mb-3">Expected Outcome After Fix</p>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { metric: "40–60%", label: "Cost Reduction" },
                  { metric: "2–3x", label: "Faster Response" },
                  { metric: "↑↑", label: "Output Relevance" },
                ].map((stat) => (
                  <div key={stat.label} className="text-center p-3 rounded-lg bg-gold/5 border border-gold/10">
                    <p className="text-lg font-bold text-gold">{stat.metric}</p>
                    <p className="text-[10px] text-muted-foreground uppercase tracking-wider">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
          </div>

          {/* Workflow Design Card */}
          <div className="rounded-xl border border-border bg-card p-8 hover:border-gold/20 transition-colors lg:col-span-2">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 rounded-lg bg-gold/10">
                <Layers className="w-5 h-5 text-gold" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-foreground font-serif">AI Workflow Design &mdash; Business Process Automation</h3>
                <p className="text-xs text-muted-foreground">Sample Extract</p>
              </div>
            </div>

            <p className="text-sm text-muted-foreground mb-6">
              <span className="text-foreground font-medium">Use Case:</span> Automating a multi-step seller onboarding and verification workflow
            </p>

            <div className="space-y-3 mb-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 rounded-lg bg-muted/50 border border-border/50">
                  <p className="text-xs font-semibold text-gold uppercase tracking-wider mb-2">1. Document Intake</p>
                  <div className="flex items-center gap-2 mb-2">
                    <Database className="w-3.5 h-3.5 text-gold flex-shrink-0" />
                    <span className="text-sm font-medium text-foreground">LLM extraction + classification</span>
                  </div>
                  <p className="text-xs text-muted-foreground">Output: Structured entity record</p>
                </div>
                <div className="p-4 rounded-lg bg-muted/50 border border-border/50">
                  <p className="text-xs font-semibold text-gold uppercase tracking-wider mb-2">2. Validation</p>
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-gold flex-shrink-0" />
                    <span className="text-sm font-medium text-foreground">Rule engine + confidence scoring</span>
                  </div>
                  <p className="text-xs text-muted-foreground">Output: Pass / flag / reject with reason</p>
                </div>
                <div className="p-4 rounded-lg bg-muted/50 border border-border/50">
                  <p className="text-xs font-semibold text-gold uppercase tracking-wider mb-2">3. Escalation</p>
                  <div className="flex items-center gap-2 mb-2">
                    <AlertTriangle className="w-3.5 h-3.5 text-gold flex-shrink-0" />
                    <span className="text-sm font-medium text-foreground">Human-in-the-loop trigger</span>
                  </div>
                  <p className="text-xs text-muted-foreground">Output: Routed review task</p>
                </div>
              </div>
            </div>

            <div className="mt-5 p-3 rounded-lg bg-gold/5 border border-gold/10">
              <p className="text-sm text-gold font-medium">
                Outcome: 70% reduction in manual review load with full audit trail
              </p>
            </div>
          </div>
        </div>
    </section>
  );
};

export default SampleDeliverables;
