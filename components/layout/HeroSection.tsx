import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useGlobalUX } from "@/components/providers/GlobalUXProvider";

const HeroSection = () => {
  const { t } = useGlobalUX();
  const s = t.hero;

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
            {s.badge}
          </span>
        </div>

        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6 animate-fade-in-up text-foreground">
          {s.headline1} <span className="text-gradient-gold">{s.headline2}</span>
        </h1>

        <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto animate-fade-in-up" style={{ animationDelay: "0.15s" }}>
          {s.subtext}
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up" style={{ animationDelay: "0.45s" }}>
          <a href="#sessions">
            <Button variant="hero" size="xl">
              {s.cta1}
              <ArrowRight className="ms-1 rtl:rotate-180" />
            </Button>
          </a>
          <a href="#assessment">
            <Button variant="heroOutline" size="xl" className="w-full sm:w-auto">
              {s.cta2}
              <ArrowRight className="ms-1 w-5 h-5 opacity-70 rtl:rotate-180" />
            </Button>
          </a>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
