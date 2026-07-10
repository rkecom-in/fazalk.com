import Link from "next/link";
import { useGlobalUX } from "@/components/providers/GlobalUXProvider";
import { Mail } from "lucide-react";
import { LinkedInIcon } from "@/components/ui/icons";

const VIABE_URL = "https://viabe.ai";
const RKECOM_URL = "https://rkecom.in";
const LINKEDIN_URL = "https://www.linkedin.com/in/fazalk1980";

const BottomSections = () => {
  const { t } = useGlobalUX();
  const c = t.connect;

  return (
    <>
      {/* Connect */}
      <section className="py-24 bg-background relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-gold/[0.02] to-transparent" />
        <div className="relative container mx-auto px-6 max-w-2xl text-center">
          <p className="text-sm font-semibold text-gold tracking-widest uppercase mb-4">{c.badge}</p>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-10 font-serif leading-tight">
            {c.headline}
          </h2>

          <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mb-8">
            <a
              href={LINKEDIN_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 h-11 rounded-full bg-card border border-border text-foreground/90 hover:border-gold/40 hover:text-gold transition-colors"
            >
              <LinkedInIcon className="w-4 h-4" />
              {c.linkedinLabel}
            </a>
            <a
              href="mailto:info@rkecom.in"
              className="inline-flex items-center gap-2 px-5 h-11 rounded-full bg-card border border-border text-foreground/90 hover:border-gold/40 hover:text-gold transition-colors"
            >
              <Mail className="w-4 h-4" />
              {c.emailLabel}
            </a>
          </div>

          <div className="flex justify-center gap-6 text-sm">
            <a href={VIABE_URL} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-gold transition-colors">
              {c.viabeLabel}
            </a>
            <a href={RKECOM_URL} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-gold transition-colors">
              {c.rkecomLabel}
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-border bg-background">
        <div className="container mx-auto px-6 text-center">
          <p className="text-sm text-muted-foreground max-w-xl mx-auto">
            {t.footer.entity}
          </p>
          <div className="flex justify-center gap-6 mt-6 mb-4">
            <Link href="/terms" className="text-xs text-muted-foreground hover:text-gold transition-colors">{t.footer.termsLabel}</Link>
            <Link href="/privacy" className="text-xs text-muted-foreground hover:text-gold transition-colors">{t.footer.privacyLabel}</Link>
          </div>
          <p className="text-xs text-muted-foreground/50 mt-4">
            &copy; {new Date().getFullYear()} RKeCom Services (OPC) Private Limited. {t.footer.copyright}
          </p>
        </div>
      </footer>
    </>
  );
};

export default BottomSections;
