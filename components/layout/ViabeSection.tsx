import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useGlobalUX } from "@/components/providers/GlobalUXProvider";

const VIABE_URL = "https://viabe.ai";
const VIABE_PULSE_URL = "https://viabe.ai/in/pulse";
const VIABE_LOCATION_CHECK_URL = "https://viabe.ai/in/location-check";
const VIABE_TEAM_WAITLIST_URL = "https://viabe.ai/in#team";

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
        <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
          <a href={VIABE_PULSE_URL} target="_blank" rel="noopener noreferrer" className="text-sm font-medium text-foreground underline decoration-gold/50 underline-offset-4 hover:text-gold">
            Viabe Pulse
          </a>
          <a href={VIABE_LOCATION_CHECK_URL} target="_blank" rel="noopener noreferrer" className="text-sm font-medium text-foreground underline decoration-gold/50 underline-offset-4 hover:text-gold">
            Viabe Location Check
          </a>
          <a href={VIABE_TEAM_WAITLIST_URL} target="_blank" rel="noopener noreferrer" className="text-sm font-medium text-muted-foreground underline decoration-border underline-offset-4 hover:text-gold">
            Viabe Team (join the waitlist)
          </a>
        </div>
      </div>
    </section>
  );
};

export default ViabeSection;
