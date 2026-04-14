import { CheckCircle } from "lucide-react";
import { useGlobalUX } from "@/components/providers/GlobalUXProvider";

const WhatWeSolve = () => {
  const { t } = useGlobalUX();
  const s = t.whatWeSolve;

  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-6 max-w-4xl">
        <p className="text-sm font-semibold text-gold tracking-widest uppercase mb-4">{s.badge}</p>
        <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">{s.headline}</h2>
        <p className="text-xl text-muted-foreground mb-12">{s.subtext}</p>

        <div className="space-y-5">
          {s.problems.map((problem) => (
            <div key={problem.title} className="flex items-start gap-4 p-5 rounded-lg bg-card/50 border border-border/50 hover:border-gold/20 transition-colors">
              <CheckCircle className="w-5 h-5 text-gold flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-foreground mb-1">{problem.title}</p>
                <p className="text-sm text-muted-foreground leading-relaxed">{problem.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhatWeSolve;
