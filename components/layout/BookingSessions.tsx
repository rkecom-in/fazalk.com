import { Button } from "@/components/ui/button";
import { ArrowRight, Clock, Target, Zap, FileText, CheckCircle2 } from "lucide-react";

const sessions = [
  {
    id: "strategic-1hr",
    title: "Strategic AI & Architecture Session",
    duration: "1 Hour",
    calendlyUrl: "https://calendly.com/fazalk1980/strategic-ai-architecture-session-1-hour",
    icon: Target,
    description:
      "A focused, high-impact session for leaders who need fast clarity on a specific AI or cloud architecture decision.",
    idealFor: [
      "Evaluating AI feasibility for a product or workflow",
      "Choosing between build vs. buy for an AI capability",
      "Getting a second opinion on an existing architecture",
      "Understanding LLM, RAG, or agentic workflow fit",
    ],
    outcome:
      "Walk away with a clear recommendation, decision framework, or validated direction — documented in a follow-up summary.",
    price: "$350",
    accent: "from-gold/20 to-transparent",
  },
  {
    id: "deep-dive-3hr",
    title: "Deep Dive Session",
    duration: "3 Hours",
    calendlyUrl: "https://calendly.com/fazalk1980/deep-dive-session-3-hour",
    icon: Zap,
    description:
      "An intensive working session to go deep on your AI system design, cloud architecture, or technical strategy.",
    idealFor: [
      "Designing a full AI system architecture end-to-end",
      "Auditing and troubleshooting an underperforming AI system",
      "Planning an AWS/Azure migration or optimization",
      "Building a technical roadmap for a new AI product",
    ],
    outcome:
      "You receive a detailed written brief with architecture recommendations, risk assessment, and prioritized next steps.",
    price: "$1,200",
    accent: "from-primary/20 to-transparent",
  },
  {
    id: "blueprint-1day",
    title: "AI Architecture Blueprint",
    duration: "1 Full Day",
    calendlyUrl: "https://calendly.com/fazalk1980/ai-architecture-blueprint",
    icon: FileText,
    description:
      "A comprehensive engagement to produce a complete, production-ready AI or cloud architecture blueprint for your business.",
    idealFor: [
      "Launching a new AI-powered product or platform",
      "Re-architecting an existing system for scale",
      "Creating a technical blueprint before hiring developers",
      "Building investor-ready technical documentation",
    ],
    outcome:
      "A full architecture document covering system design, tech stack, data flow, cloud infrastructure, cost estimates, and an execution-ready build plan.",
    price: "$3,000",
    accent: "from-gold-dark/20 to-transparent",
  },
];

const baseUrl = window.location.origin;

const BookingSessions = () => {
  return (
    <section id="book" className="py-20 md:py-28 bg-card/30">
      <div className="container mx-auto px-6 max-w-6xl">
        <p className="text-sm font-semibold text-gold tracking-widest uppercase mb-4 text-center">
          Book a Session
        </p>
        <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4 text-center font-serif">
          Choose the Right Engagement
        </h2>
        <p className="text-lg text-muted-foreground mb-16 text-center max-w-2xl mx-auto">
          Every session is outcome-driven with clear, written deliverables.
          Pick the depth that matches your decision.
        </p>

        <div className="grid lg:grid-cols-3 gap-8">
          {sessions.map((session) => (
            <div
              key={session.id}
              className="relative flex flex-col rounded-2xl bg-card border border-border/50 hover:border-gold/30 transition-all duration-300 overflow-hidden group"
            >
              <div
                className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${session.accent}`}
              />

              <div className="p-8 flex flex-col flex-1">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-gold" />
                    <span className="text-sm font-bold text-gold tracking-wide uppercase">
                      {session.duration}
                    </span>
                  </div>
                  <span className="text-2xl font-bold text-foreground font-serif">
                    {session.price}
                    <span className="text-xs text-muted-foreground font-sans font-normal ml-1">USD</span>
                  </span>
                </div>

                <div className="flex items-start gap-3 mb-4">
                  <session.icon className="w-6 h-6 text-gold flex-shrink-0 mt-1" />
                  <h3 className="text-xl font-bold text-foreground font-serif">
                    {session.title}
                  </h3>
                </div>

                <p className="text-sm text-muted-foreground leading-relaxed mb-6">
                  {session.description}
                </p>

                <div className="mb-6">
                  <p className="text-xs font-semibold text-foreground/70 uppercase tracking-wider mb-3">
                    Ideal For
                  </p>
                  <ul className="space-y-2">
                    {session.idealFor.map((item) => (
                      <li
                        key={item}
                        className="flex items-start gap-2 text-sm text-muted-foreground"
                      >
                        <CheckCircle2 className="w-4 h-4 text-gold/70 flex-shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mb-8 p-4 rounded-lg bg-secondary/50 border border-border/30">
                  <p className="text-xs font-semibold text-gold uppercase tracking-wider mb-2">
                    What You Get
                  </p>
                  <p className="text-sm text-foreground/80 leading-relaxed">
                    {session.outcome}
                  </p>
                </div>

                <div className="mt-auto">
                  <a
                    href={`${session.calendlyUrl}?redirect_url=${encodeURIComponent(`${baseUrl}/booking/confirmation?session=${session.id}`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Button variant="hero" size="lg" className="w-full">
                      Book {session.duration} Session
                      <ArrowRight className="ml-1" />
                    </Button>
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BookingSessions;
