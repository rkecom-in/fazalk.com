import { Shield, Wrench, Cpu, Cloud, MessageSquare } from "lucide-react";

const offerings = [
  {
    icon: Shield,
    number: "01",
    title: "Before You Spend on AI \u2014 Get the Architecture Right",
    description: "You receive a clear architectural blueprint \u2014 LLM selection, retrieval strategy, data pipeline, infrastructure \u2014 before a single developer is hired or a line of code is written. Built for platforms and products where getting it wrong is expensive.",
  },
  {
    icon: Wrench,
    number: "02",
    title: "Your AI System Isn't Working \u2014 We Diagnose and Fix It",
    description: "You receive a written audit report: what is broken, why, and exactly what to fix \u2014 in priority order. Common issues covered: hallucination, latency, irrelevant outputs, runaway infrastructure cost, weak retrieval.",
  },
  {
    icon: Cpu,
    number: "03",
    title: "Design AI Automation That Actually Works",
    description: "You receive a workflow design document that maps your business process to an implementable AI automation \u2014 with clear handoffs, failure handling, and system integration points. Relevant for onboarding, document processing, matching, and operations workflows.",
  },
  {
    icon: Cloud,
    number: "04",
    title: "AWS / Azure Architecture That Scales",
    description: "You receive a production cloud architecture \u2014 designed for your actual workload, not a generic template. Covers infrastructure topology, cost controls, failure modes, and a build sequence your engineering team can execute against.",
  },
  {
    icon: MessageSquare,
    number: "05",
    title: "Strategic AI Decision Session",
    description: "You bring your specific decision \u2014 build vs. buy, LLM selection, stack choice, feasibility question. You leave with a clear recommendation and the reasoning behind it, documented in a written summary.",
  },
];

const CoreOfferings = () => {
  return (
    <section className="py-24 bg-card/30">
      <div className="container mx-auto px-6 max-w-6xl">
        <p className="text-sm font-semibold text-gold tracking-widest uppercase mb-4 text-center">Core Offerings</p>
        <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-16 text-center">
          How We Help
        </h2>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {offerings.map((offering) => (
            <div
              key={offering.number}
              className="group relative p-8 rounded-xl bg-card border border-border/50 hover:border-gold/30 transition-all duration-300 hover:shadow-[0_4px_30px_-4px_hsl(40_65%_55%/0.1)]"
            >
              <div className="flex items-center gap-3 mb-5">
                <span className="text-xs font-bold text-gold/50 tracking-widest">{offering.number}</span>
                <offering.icon className="w-5 h-5 text-gold" />
              </div>
              <h3 className="text-lg font-bold text-foreground mb-3 font-serif">{offering.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{offering.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CoreOfferings;
