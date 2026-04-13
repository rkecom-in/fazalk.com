import { Button } from "@/components/ui/button";
import { ArrowRight, MessageSquare, Globe, Clock, Target, FileText, Award, Server, Zap, Building2, Rocket, Cpu, Users } from "lucide-react";

const howWeWork = [
  { icon: Globe, text: "Fully remote" },
  { icon: Clock, text: "1 hour to 3 days (core engagements)" },
  { icon: Target, text: "Short-term, sharply scoped" },
  { icon: FileText, text: "Outcome-driven with written deliverables" },
];

import { Settings, Crosshair, Network, ShoppingCart, User } from "lucide-react";

const whyUs = [
  { icon: FileText, text: "Every engagement produces a written deliverable you can act on without needing to re-engage." },
  { icon: Crosshair, text: "Engagements are scoped tightly \u2014 no open-ended retainers, no dependency." },
  { icon: Settings, text: "Recommendations are specific to your system, your constraints, and your team \u2014 not generic frameworks." },
  { icon: User, text: "You deal with the same person throughout \u2014 the one who does the thinking, not a team that delegates it." },
];

const whoWeWorkWith = [
  { icon: Building2, label: "GCC Software & IT Companies" },
  { icon: Rocket, label: "SaaS & Platform Businesses" },
  { icon: Cpu, label: "Digital Transformation Firms" },
  { icon: Users, label: "Founders Building AI Products" },
  { icon: Network, label: "IT Resellers & System Integrators" },
  { icon: ShoppingCart, label: "SME Platform & Marketplace Businesses" },
];

const engagements = [
  { duration: "1 Hour", label: "Strategic Session" },
  { duration: "3 Hours", label: "Focused Consulting" },
  { duration: "1 Day", label: "Architecture Blueprint" },
  { duration: "2–3 Days", label: "Deep-Dive Engagement" },
];

const BottomSections = () => {
  return (
    <>
      {/* How We Work */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-6 max-w-4xl">
          <p className="text-sm font-semibold text-gold tracking-widest uppercase mb-4 text-center">Process</p>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-12 text-center">How We Work</h2>
          <div className="grid sm:grid-cols-2 gap-5">
            {howWeWork.map((item) => (
              <div key={item.text} className="flex items-center gap-4 p-5 rounded-xl bg-card border border-border/50">
                <item.icon className="w-5 h-5 text-gold flex-shrink-0" />
                <span className="text-foreground/90">{item.text}</span>
              </div>
            ))}
          </div>
          <p className="text-center text-muted-foreground mt-8 text-sm italic">
            Every engagement produces clear, written outputs you can act on immediately.
          </p>
        </div>
      </section>

      {/* Why Us */}
      <section className="py-20 bg-card/30">
        <div className="container mx-auto px-6 max-w-4xl">
          <p className="text-sm font-semibold text-gold tracking-widest uppercase mb-4 text-center">Why Us</p>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-12 text-center">The Difference</h2>
          <div className="grid sm:grid-cols-2 gap-5">
            {whyUs.map((item) => (
              <div key={item.text} className="flex items-start gap-4 p-5 rounded-xl bg-card border border-border/50">
                <item.icon className="w-5 h-5 text-gold flex-shrink-0 mt-0.5" />
                <span className="text-foreground/90">{item.text}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Who We Work With + Engagement Model */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-6 max-w-5xl">
          <div className="grid md:grid-cols-2 gap-16">
            <div>
              <p className="text-sm font-semibold text-gold tracking-widest uppercase mb-4">Clients</p>
              <h2 className="text-2xl font-bold text-foreground mb-8">Who We Work With</h2>
              <div className="space-y-4">
                {whoWeWorkWith.map((client) => (
                  <div key={client.label} className="flex items-center gap-4">
                    <client.icon className="w-5 h-5 text-gold flex-shrink-0" />
                    <span className="text-foreground/90">{client.label}</span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <p className="text-sm font-semibold text-gold tracking-widest uppercase mb-4">Engagements</p>
              <h2 className="text-2xl font-bold text-foreground mb-8">Engagement Model</h2>
              <div className="space-y-4">
                {engagements.map((eng) => (
                  <div key={eng.label} className="flex items-center gap-4 p-4 rounded-xl bg-card border border-border/50">
                    <span className="text-sm font-bold text-gold min-w-[80px]">{eng.duration}</span>
                    <span className="text-foreground/90">{eng.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 bg-card/30 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-gold/[0.02] to-transparent" />
        <div className="relative container mx-auto px-6 max-w-3xl text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
            Ready to Make the Right Decision?
          </h2>
          <p className="text-lg text-muted-foreground mb-10 max-w-xl mx-auto">
            If you are planning, fixing, or accelerating an AI or cloud initiative, we determine the optimal architectural direction and mitigate build risks fast.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
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

      {/* Footer */}
      <footer className="py-12 border-t border-border bg-background">
        <div className="container mx-auto px-6 text-center">
          <p className="text-sm text-muted-foreground max-w-lg mx-auto">
            CTO-level AI and cloud architecture consulting for businesses that need clarity before execution.
          </p>
          <p className="text-xs text-muted-foreground/50 mt-4">
            © {new Date().getFullYear()} All rights reserved.
          </p>
        </div>
      </footer>
    </>
  );
};

export default BottomSections;
