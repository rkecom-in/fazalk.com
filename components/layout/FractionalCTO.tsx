import { Rocket, CheckCircle2, Clock } from "lucide-react";

const helps = [
  "Define what to build",
  "Design the system architecture",
  "Choose the right tech stack",
  "Create a build-ready roadmap",
  "Evaluate developers or vendors",
];

const FractionalCTO = () => {
  return (
    <section className="py-24 bg-card/30">
      <div className="container mx-auto px-6 max-w-4xl">
        <div className="rounded-xl border border-gold/20 bg-card p-10 md:p-14 glow-gold">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 rounded-lg bg-gold/10">
              <Rocket className="w-5 h-5 text-gold" />
            </div>
            <p className="text-sm font-semibold text-gold tracking-widest uppercase">For Founders</p>
          </div>

          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Startup Launch CTO
          </h2>
          <p className="text-muted-foreground mb-8 text-lg max-w-2xl">
            For founders without a technical co-founder who need to get their product and technology direction right before execution. A structured, short-term engagement — not an ongoing CTO role.
          </p>

          <div className="grid sm:grid-cols-2 gap-x-8 gap-y-3 mb-8">
            {helps.map((item) => (
              <div key={item} className="flex items-center gap-3">
                <CheckCircle2 className="w-4 h-4 text-gold flex-shrink-0" />
                <span className="text-sm text-foreground/90">{item}</span>
              </div>
            ))}
          </div>

          <div className="flex flex-wrap gap-6 pt-6 border-t border-border">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Clock className="w-4 h-4 text-gold" />
              <span>2–6 weeks or defined hours</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Rocket className="w-4 h-4 text-gold" />
              <span>Complete technical blueprint & execution-ready plan</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FractionalCTO;
