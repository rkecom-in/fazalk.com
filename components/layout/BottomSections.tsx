import { Button } from "@/components/ui/button";
import AssessmentTriage from "@/components/widgets/AssessmentTriage";
import Link from "next/link";
import { useGlobalUX } from "@/components/providers/GlobalUXProvider";
import { 
  Building2, Rocket, Cpu, Users, Network, ShoppingCart, 
  MessageSquare
} from "lucide-react";

const BottomSections = () => {
  const { t } = useGlobalUX();
  const clientIcons = [Building2, Rocket, Cpu, Users, Network, ShoppingCart];

  return (
    <>
      {/* Who I Work With */}
      <section className="py-20 bg-background transition-opacity duration-1000">
        <div className="container mx-auto px-6 max-w-4xl text-center">
          <p className="text-sm font-semibold text-gold tracking-widest uppercase mb-4 text-center">{t.clients.badge}</p>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-12 text-center font-serif">{t.clients.headline}</h2>
          <div className="grid sm:grid-cols-2 gap-5 text-left max-w-3xl mx-auto">
            {t.clients.list.map((label, i) => {
              const Icon = clientIcons[i % clientIcons.length];
              return (
                <div key={label} className="flex items-center gap-4 p-5 rounded-xl bg-card border border-border/50">
                  <Icon className="w-5 h-5 text-gold flex-shrink-0" />
                  <span className="text-foreground/90">{label}</span>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Assessment Funnel */}
      <AssessmentTriage />

      {/* Final CTA */}
      <section className="py-24 bg-card/30 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-gold/[0.02] to-transparent" />
        <div className="relative container mx-auto px-6 max-w-3xl text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
            {t.finalCta.headline}
          </h2>
          <p className="text-lg text-muted-foreground mb-10 max-w-xl mx-auto">
            {t.finalCta.subtext}
          </p>
          <div className="flex justify-center">
            <a href="#assessment" className="inline-block w-full sm:w-auto">
              <Button variant="hero" size="xl" className="w-full">
                {t.finalCta.cta}
                <MessageSquare className="ms-2 w-5 h-5 flex-shrink-0" />
              </Button>
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-border bg-background">
        <div className="container mx-auto px-6 text-center">
          <p className="text-sm text-muted-foreground max-w-lg mx-auto">
            {t.footer.tagline}
          </p>
          <div className="mt-6 mb-4">
            <a href="https://in.linkedin.com/in/fazalk1980" target="_blank" rel="noreferrer" className="text-sm text-muted-foreground hover:text-gold transition-colors inline-flex items-center gap-1">
              {t.footer.linkedinLabel} <span aria-hidden="true" className="rtl:rotate-180 inline-block">→</span>
            </a>
          </div>
          <div className="flex justify-center gap-6 mb-4">
            <Link href="/terms" className="text-xs text-muted-foreground hover:text-gold transition-colors">{t.footer.termsLabel}</Link>
            <Link href="/privacy" className="text-xs text-muted-foreground hover:text-gold transition-colors">{t.footer.privacyLabel}</Link>
          </div>
          <p className="text-xs text-muted-foreground/50 mt-4">
            &copy; {new Date().getFullYear()} {t.footer.copyright}
          </p>
        </div>
      </footer>
    </>
  );
};

export default BottomSections;
