import { Shield, Wrench, Cpu, Cloud, MessageSquare } from "lucide-react";
import { useGlobalUX } from "@/components/providers/GlobalUXProvider";

const icons = [Shield, Wrench, Cpu, Cloud, MessageSquare];

const CoreOfferings = () => {
  const { t } = useGlobalUX();
  const s = t.coreOfferings;

  return (
    <section className="py-24 bg-card/30">
      <div className="container mx-auto px-6 max-w-6xl">
        <p className="text-sm font-semibold text-gold tracking-widest uppercase mb-4 text-center">{s.badge}</p>
        <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4 text-center">{s.headline}</h2>
        <p className="text-lg text-muted-foreground text-center mb-16 max-w-2xl mx-auto">{s.subtext}</p>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {s.offerings.map((offering, i) => {
            const Icon = icons[i % icons.length];
            return (
              <div
                key={offering.title}
                className="group relative p-8 rounded-xl bg-card border border-border/50 hover:border-gold/30 transition-all duration-300 hover:shadow-[0_4px_30px_-4px_hsl(40_65%_55%/0.1)]"
              >
                <div className="flex items-center gap-3 mb-5">
                  <span className="text-xs font-bold text-gold/50 tracking-widest">{String(i + 1).padStart(2, '0')}</span>
                  <Icon className="w-5 h-5 text-gold" />
                </div>
                <h3 className="text-lg font-bold text-foreground mb-3 font-serif">{offering.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{offering.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default CoreOfferings;
