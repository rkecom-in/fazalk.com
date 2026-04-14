import { useState } from "react";
import { Button } from "@/components/ui/button";
import AssessmentTriage from "@/components/widgets/AssessmentTriage";
import DirectConnectOverlay from "@/components/widgets/DirectConnectOverlay";
import Link from "next/link";
import { useGlobalUX } from "@/components/providers/GlobalUXProvider";
import { 
  Building2, Rocket, Cpu, Users, Network, ShoppingCart, 
  CheckCircle2, Clock, Target, ArrowRight, Zap, FileText, Lock, MessageSquare
} from "lucide-react";

const BottomSections = () => {
  const { t } = useGlobalUX();
  const [isConnectOpen, setIsConnectOpen] = useState(false);
  const [selectedSession, setSelectedSession] = useState<string | undefined>();
  const clientIcons = [Building2, Rocket, Cpu, Users, Network, ShoppingCart];

  return (
    <>
      {/* Who We Work With */}
      <section className="py-20 bg-background transition-opacity duration-1000">
        <div className="container mx-auto px-6 max-w-4xl text-center">
          <p className="text-sm font-semibold text-gold tracking-widest uppercase mb-4 text-center">{t.clients.badge}</p>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-12 text-center font-serif">{t.clients.headline}</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 text-left">
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

      {/* Book a Session */}
      <section id="sessions" className="py-20 md:py-28 bg-card/30">
        <div className="container mx-auto px-6 max-w-6xl">
          <p className="text-sm font-semibold text-gold tracking-widest uppercase mb-4 text-center">
            {t.bookingSessions.badge}
          </p>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4 text-center font-serif">
            {t.bookingSessions.headline}
          </h2>
          <p className="text-lg text-muted-foreground mb-16 text-center max-w-2xl mx-auto">
            {t.bookingSessions.subtext}
          </p>

          <div className="flex flex-col md:flex-row justify-center gap-8 max-w-5xl mx-auto text-left">
            {t.bookingSessions.sessions.map((session, i) => (
              <div key={session.id} className="relative flex flex-col w-full md:w-[calc(50%-1rem)] max-w-md rounded-2xl bg-card border border-border/50 hover:border-gold/30 transition-all duration-300 overflow-hidden group">
                <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${session.accent}`}></div>
                <div className="p-6 md:p-8 flex flex-col flex-1">
                  <div className="flex items-start gap-3 mb-4">
                    {i === 0 ? <Target className="w-6 h-6 text-gold flex-shrink-0 mt-1" /> : <Zap className="w-6 h-6 text-gold flex-shrink-0 mt-1" />}
                    <h3 className="text-xl font-bold text-foreground font-serif">{session.title}</h3>
                  </div>
                  
                  <p className="text-sm text-muted-foreground leading-relaxed mb-6">
                    {session.description}
                  </p>
                  
                  <div className="mb-6">
                    <p className="text-xs font-semibold text-foreground/70 uppercase tracking-wider mb-3">{t.bookingSessions.idealForLabel}</p>
                    <ul className="space-y-2">
                      {session.idealFor.map((text) => (
                        <li key={text} className="flex items-start gap-2 text-sm text-muted-foreground">
                          <CheckCircle2 className="w-4 h-4 text-gold/70 flex-shrink-0 mt-0.5" />
                          <span>{text}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div className="mb-8 p-4 rounded-lg bg-secondary/50 border border-border/30 flex-1">
                    <p className="text-xs font-semibold text-gold uppercase tracking-wider mb-2">{t.bookingSessions.whatYouGetLabel}</p>
                    <p className="text-sm text-foreground/80 leading-relaxed">
                      {session.outcome}
                    </p>
                  </div>

                  <div className="flex items-center justify-between mt-auto pt-6 border-t border-border/50">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">{session.duration}</p>
                      <p className="text-lg font-bold text-foreground">{session.price}</p>
                    </div>
                    <Button 
                      variant="heroOutline"
                      onClick={() => {
                        setSelectedSession(session.title);
                        setIsConnectOpen(true);
                      }}
                    >
                      {t.bookingSessions.bookLabelPrefix}
                      <ArrowRight className="ms-2 w-4 h-4 opacity-70" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Assessment Funnel */}
      <div id="assessment">
        <AssessmentTriage />
      </div>

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

      {/* Direct Connect Overlay */}
      <DirectConnectOverlay 
        isOpen={isConnectOpen} 
        onClose={() => {
            setIsConnectOpen(false);
            setSelectedSession(undefined);
        }} 
        sessionTitle={selectedSession}
      />

      {/* Footer */}
      <footer className="py-12 border-t border-border bg-background">
        <div className="container mx-auto px-6 text-center">
          <p className="text-sm text-muted-foreground max-w-lg mx-auto">
            {t.footer.tagline}
          </p>
          <div className="mt-6 mb-4">
            <a href="https://in.linkedin.com/in/fazalk1980" target="_blank" rel="noreferrer" className="text-sm text-muted-foreground hover:text-gold transition-colors inline-flex items-center gap-1">
              {t.footer.linkedinLabel} <span aria-hidden="true">&rarr;</span>
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
