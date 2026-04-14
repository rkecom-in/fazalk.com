import Head from 'next/head'
import { useState } from 'react'
import { useGlobalUX } from '@/components/providers/GlobalUXProvider'
import SiteHeader from '@/components/layout/SiteHeader'
import { Lock, ArrowRight, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function InvitePage() {
  const [code, setCode] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(false)
  const { t, language } = useGlobalUX()
  const c = t.inviteGate

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!code) return

    setLoading(true)
    setError(false)

    try {
      const res = await fetch('/api/verify-invite', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code })
      })

      if (res.ok) {
        // Force hard reload to root to trigger middleware clearance natively
        window.location.href = '/'
      } else {
        setError(true)
        setLoading(false)
      }
    } catch (err) {
      setError(true)
      setLoading(false)
    }
  }

  return (
    <>
      <Head>
        <title>{c.headline} | Fazal K.</title>
        <meta name="robots" content="noindex" />
      </Head>
      <div className="min-h-screen bg-background text-foreground flex flex-col">
        <SiteHeader />
        
        <main className="flex-1 flex flex-col items-center justify-center p-6 relative overflow-hidden">
          <div className="relative w-full max-w-md z-10 animate-fade-in text-center">
            <div className="mb-8 flex justify-center">
              <div className="w-12 h-12 rounded-full bg-gold/10 flex items-center justify-center border border-gold/20">
                <Lock className="w-5 h-5 text-gold" />
              </div>
            </div>
            
            <p className="text-sm font-semibold text-gold tracking-widest uppercase mb-4">
              {c.badge}
            </p>
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4 font-serif">
              {c.headline}
            </h1>
            <p className="text-muted-foreground mb-8 text-lg">
              {c.subtext}
            </p>
            
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div className="relative">
                <input
                  type="text"
                  value={code}
                  onChange={(e) => {
                    setCode(e.target.value)
                    setError(false)
                  }}
                  placeholder={c.placeholder}
                  autoFocus
                  className={`w-full h-14 bg-card border rounded-xl px-4 text-center font-bold tracking-widest uppercase transition-colors focus:outline-none focus:ring-1 shadow-sm
                    ${error ? 'border-red-500/50 focus:border-red-500 focus:ring-red-500/20' : 'border-border focus:border-gold focus:ring-gold/20'}`}
                  dir="ltr"
                />
              </div>
              
              {error && (
                <p className="text-sm text-red-500 font-medium">{c.errorInvalid}</p>
              )}
              
              <Button
                type="submit"
                variant="hero"
                size="lg"
                disabled={!code || loading}
                className="w-full h-14 text-base mt-2 shadow-xl shadow-primary/10"
              >
                {loading ? (
                  <Loader2 className="w-5 h-5 animate-spin mx-auto" />
                ) : (
                  <>
                    {c.buttonDefault}
                    <ArrowRight className={`w-5 h-5 opacity-80 ${language === 'ar' ? 'mr-2' : 'ml-2'}`} />
                  </>
                )}
              </Button>
            </form>
          </div>
        </main>
      </div>
    </>
  )
}
