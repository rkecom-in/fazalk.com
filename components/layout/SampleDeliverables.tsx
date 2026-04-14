import { FileText, AlertTriangle, TrendingDown, Clock, Database, ArrowRight, CheckCircle2, Layers } from "lucide-react";
import { useGlobalUX } from "@/components/providers/GlobalUXProvider";

const stackIcons = [Layers, Database, ArrowRight];

const SampleDeliverables = () => {
  const { t } = useGlobalUX();
  const s = t.sampleDeliverables;
  const bp = s.blueprintCard;
  const au = s.auditCard;
  const wf = s.workflowCard;

  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-6 max-w-6xl">
        <p className="text-sm font-semibold text-gold tracking-widest uppercase mb-4 text-center">{s.badge}</p>
        <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4 text-center">{s.headline}</h2>
        <p className="text-muted-foreground text-center mb-16 max-w-2xl mx-auto">{s.subtext}</p>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Blueprint Card */}
          <div className="rounded-xl border border-border bg-card p-8 hover:border-gold/20 transition-colors">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 rounded-lg bg-gold/10">
                <FileText className="w-5 h-5 text-gold" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-foreground font-serif">{bp.title}</h3>
                <p className="text-xs text-muted-foreground">{bp.extract}</p>
              </div>
            </div>

            <p className="text-sm text-muted-foreground mb-6">
              <span className="text-foreground font-medium">{bp.useCaseLabel}</span>{" "}{bp.useCase}
            </p>

            <div className="space-y-3 mb-6">
              {bp.stackItems.map((text, i) => {
                const Icon = stackIcons[i % stackIcons.length];
                return (
                  <div key={i} className="flex items-start gap-3 text-sm">
                    <Icon className="w-4 h-4 text-gold flex-shrink-0 mt-0.5" />
                    <span className="text-secondary-foreground">{text}</span>
                  </div>
                );
              })}
            </div>

            <div className="border-t border-border pt-5">
              <p className="text-xs font-semibold text-gold uppercase tracking-wider mb-3">{bp.decisionsLabel}</p>
              <ul className="space-y-2 text-sm text-muted-foreground">
                {bp.decisions.map((d) => (
                  <li key={d} className="flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-gold flex-shrink-0 mt-0.5" />
                    {d}
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-5 p-3 rounded-lg bg-gold/5 border border-gold/10">
              <p className="text-sm text-gold font-medium">{bp.outcome}</p>
            </div>
          </div>

          {/* Audit Card */}
          <div className="rounded-xl border border-border bg-card p-8 hover:border-gold/20 transition-colors">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 rounded-lg bg-gold/10">
                <AlertTriangle className="w-5 h-5 text-gold" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-foreground font-serif">{au.title}</h3>
                <p className="text-xs text-muted-foreground">{au.extract}</p>
              </div>
            </div>

            <p className="text-sm text-muted-foreground mb-6">
              <span className="text-foreground font-medium">{au.systemLabel}</span>{" "}{au.system}
            </p>

            <div className="space-y-4 mb-6">
              {au.findings.map((finding, i) => {
                const icons = [AlertTriangle, TrendingDown, Clock, Database];
                const Icon = icons[i % icons.length];
                return (
                  <div key={finding.title} className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                    <Icon className="w-4 h-4 text-gold flex-shrink-0 mt-0.5" />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-foreground">{finding.title}</span>
                        <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold uppercase tracking-wider ${
                          i === 0 ? "bg-destructive/20 text-destructive" :
                          i <= 2 ? "bg-gold/15 text-gold" :
                          "bg-muted text-muted-foreground"
                        }`}>{finding.severity}</span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">{finding.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="border-t border-border pt-5">
              <p className="text-xs font-semibold text-gold uppercase tracking-wider mb-3">{au.outcomeLabel}</p>
              <div className="grid grid-cols-3 gap-3">
                {au.stats.map((stat) => (
                  <div key={stat.label} className="text-center p-3 rounded-lg bg-gold/5 border border-gold/10">
                    <p className="text-lg font-bold text-gold">{stat.metric}</p>
                    <p className="text-[10px] text-muted-foreground uppercase tracking-wider">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Workflow Card */}
        <div className="mt-8 rounded-xl border border-border bg-card p-8 hover:border-gold/20 transition-colors">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 rounded-lg bg-gold/10">
              <Layers className="w-5 h-5 text-gold" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-foreground font-serif">{wf.title}</h3>
              <p className="text-xs text-muted-foreground">{wf.extract}</p>
            </div>
          </div>

          <p className="text-sm text-muted-foreground mb-6">
            <span className="text-foreground font-medium">{wf.useCaseLabel}</span>{" "}{wf.useCase}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            {wf.steps.map((step, i) => {
              const StepIcons = [Database, CheckCircle2, AlertTriangle];
              const Icon = StepIcons[i % StepIcons.length];
              return (
                <div key={step.label} className="p-4 rounded-lg bg-muted/50 border border-border/50">
                  <p className="text-xs font-semibold text-gold uppercase tracking-wider mb-2">{step.label}</p>
                  <div className="flex items-center gap-2 mb-2">
                    <Icon className="w-3.5 h-3.5 text-gold flex-shrink-0" />
                    <span className="text-sm font-medium text-foreground">{step.action}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">{step.output}</p>
                </div>
              );
            })}
          </div>

          <div className="p-3 rounded-lg bg-gold/5 border border-gold/10">
            <p className="text-sm text-gold font-medium">{wf.outcome}</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SampleDeliverables;
