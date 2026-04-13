import { Button } from "@/components/ui/button";

import { ArrowRight, MessageSquare } from "lucide-react";

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url('/hero-bg.jpg')` }}
      />
      <div className="absolute inset-0 bg-background/80" />
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />

      <div className="relative z-10 container mx-auto px-6 py-32 text-center max-w-4xl">
        <div className="inline-block mb-6 px-4 py-1.5 rounded-full border border-gold/20 bg-gold/5 animate-fade-in">
          <span className="text-sm font-medium text-gold tracking-widest uppercase">
            CTO-Level Advisory
          </span>
        </div>

        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6 animate-fade-in-up text-foreground">
          Get the Architecture Decision Right <span className="text-gradient-gold">Before You Build.</span>
        </h1>

        <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto animate-fade-in-up" style={{ animationDelay: "0.15s" }}>
          Most AI and cloud failures are locked in at the architecture stage &mdash; long before systems go live. These engagements exist to give you clarity, direction, and a written plan before you commit time or budget.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up" style={{ animationDelay: "0.45s" }}>
          <a href="#book">
            <Button variant="hero" size="xl">
              Book a Strategic Session
              <ArrowRight className="ml-1" />
            </Button>
          </a>
          <Button variant="heroOutline" size="xl">
            <MessageSquare className="mr-1" />
            Discuss Your Use Case
          </Button>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
