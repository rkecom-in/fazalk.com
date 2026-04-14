import Head from 'next/head'
import Link from 'next/link'
import { useGlobalUX } from '@/components/providers/GlobalUXProvider'
import SiteHeader from '@/components/layout/SiteHeader'

export default function PrivacyPage() {
  const { t, language } = useGlobalUX()
  const s = t.privacy

  return (
    <>
      <Head>
        <title>{s.headline} | Fazal K.</title>
        <meta name="robots" content="noindex" />
      </Head>
      <div className="min-h-screen bg-background text-foreground">
        <SiteHeader />
        {/* Sub-nav */}
        <div className="border-b border-border/40 pt-24 pb-4">
          <div className="container mx-auto px-6 max-w-4xl">
            <Link href="/" className="text-sm text-muted-foreground hover:text-gold transition-colors">
              ← {language === 'ar' ? 'العودة إلى الرئيسية' : 'Back to Home'}
            </Link>
          </div>
        </div>

        {/* Content */}
        <main className="container mx-auto px-6 max-w-4xl py-16 md:py-24">
          <p className="text-sm font-semibold text-gold tracking-widest uppercase mb-4">{s.badge}</p>
          <h1 className="text-3xl md:text-4xl font-bold font-serif text-foreground mb-3">{s.headline}</h1>
          <p className="text-sm text-muted-foreground mb-12">{s.lastUpdated}</p>

          <div className="space-y-10">
            {s.sections.map((section) => (
              <div key={section.title} className="border-t border-border/40 pt-8">
                <h2 className="text-lg font-semibold text-foreground mb-3 font-serif">{section.title}</h2>
                <p className="text-muted-foreground leading-relaxed">{section.content}</p>
              </div>
            ))}
          </div>
        </main>

        {/* Footer */}
        <footer className="border-t border-border/30 py-8 mt-12">
          <div className="container mx-auto px-6 max-w-4xl flex flex-wrap gap-4 justify-between items-center">
            <p className="text-xs text-muted-foreground/50">
              © {new Date().getFullYear()} Fazal K. {t.footer.copyright}
            </p>
            <div className="flex gap-6">
              <Link href="/terms" className="text-xs text-muted-foreground hover:text-gold transition-colors">{t.footer.termsLabel}</Link>
              <Link href="/privacy" className="text-xs text-muted-foreground hover:text-gold transition-colors">{t.footer.privacyLabel}</Link>
            </div>
          </div>
        </footer>
      </div>
    </>
  )
}
