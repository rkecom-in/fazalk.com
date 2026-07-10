import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useGlobalUX } from "@/components/providers/GlobalUXProvider";

const VIABE_URL = "https://viabe.ai";

const ViabeSection = () => {
  const { t } = useGlobalUX();
  const s = t.viabe;

  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-6 max-w-3xl">
        <p className="text-sm font-semibold text-gold tracking-widest uppercase mb-4">{s.badge}</p>
        <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6 font-serif leading-tight">
          {s.headline}
        </h2>
        <p className="text-lg text-muted-foreground leading-relaxed mb-6">{s.body}</p>

        <p className="text-base text-foreground/80 leading-relaxed border-s-2 border-gold/40 ps-4 mb-10">
          {s.status}
        </p>

        <Button asChild variant="hero" size="lg" className="w-full sm:w-auto">
          <a href={VIABE_URL} target="_blank" rel="noopener noreferrer">
            {s.cta}
            <ArrowRight className="ms-1 rtl:rotate-180" />
          </a>
        </Button>
      </div>
    </section>
  );
};

export default ViabeSection;
