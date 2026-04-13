import { CheckCircle } from "lucide-react";

const problems = [
  "You are about to spend on AI development and need to know if the architecture will hold \u2014 before you commit.",
  "Your AI system is live but not delivering \u2014 high cost, slow responses, or irrelevant outputs.",
  "You need a cloud architecture that will survive production \u2014 not one that works in demos.",
  "You want to automate business workflows with AI but do not know where to start or what to trust.",
  "You are building without a CTO and need someone to own the technical direction for a defined period.",
];

const WhatWeSolve = () => {
  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-6 max-w-4xl">
        <p className="text-sm font-semibold text-gold tracking-widest uppercase mb-4">What We Solve</p>
        <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
          You don't need more AI ideas.
        </h2>
        <p className="text-xl text-muted-foreground mb-12">
          You need the right decisions <span className="text-foreground font-medium">before</span> you build.
        </p>

        <p className="text-muted-foreground mb-8 text-lg">We get involved when:</p>

        <div className="space-y-5">
          {problems.map((problem) => (
            <div key={problem} className="flex items-start gap-4 p-4 rounded-lg bg-card/50 border border-border/50 hover:border-gold/20 transition-colors">
              <CheckCircle className="w-5 h-5 text-gold flex-shrink-0 mt-0.5" />
              <span className="text-foreground/90">{problem}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhatWeSolve;
