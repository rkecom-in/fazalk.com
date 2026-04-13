import Head from 'next/head'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import BottomSections from '@/components/layout/BottomSections'

export default function ConfirmPage() {
  return (
    <>
      <Head>
        <title>Assessment Sent | Fazal K.</title>
      </Head>
      <main className="min-h-screen flex flex-col bg-background relative overflow-hidden">
        {/* Simple Navbar equivalent */}
        <header className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-md border-b border-white/5">
          <div className="container mx-auto px-6 h-20 flex items-center justify-between">
            <Link href="/" className="font-serif text-xl md:text-2xl font-semibold tracking-wide text-foreground hover:text-gold transition-colors">
              Fazal K.
            </Link>
            <Link href="/">
              <Button variant="ghost" className="text-muted-foreground uppercase tracking-widest text-xs">
                {'\u2190 '}Return Home
              </Button>
            </Link>
          </div>
        </header>

        {/* Content */}
        <section className="flex-1 flex items-center justify-center pt-20 px-6">
          <div className="max-w-2xl text-center animate-fade-in-up">
            <div className="inline-block mb-6 px-4 py-1.5 rounded-full border border-[#4a9e6b]/30 bg-[#4a9e6b]/10 text-[#4a9e6b]">
              <span className="text-sm font-medium tracking-widest uppercase">
                Assessment Received
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold font-serif mb-6 text-foreground leading-tight">
              Thanks for sharing your <span className="text-gradient-gold italic">architecture context</span>.
            </h1>
            <p className="text-lg text-muted-foreground mb-10 max-w-xl mx-auto leading-relaxed">
              I generally review incoming assessments within 24 hours. Depending on the risk exposure and complexity of your situation, I will follow up via email with either access to book the recommended session, or some clarificatory questions.
            </p>
            <Link href="/">
              <Button variant="hero" className="w-full sm:w-auto h-12 px-8 uppercase tracking-widest text-xs">
                Return to homepage
              </Button>
            </Link>
          </div>
        </section>

        <BottomSections />
      </main>
    </>
  )
}
