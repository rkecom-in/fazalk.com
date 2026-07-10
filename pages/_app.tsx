import '@/styles/globals.css'
import { useEffect } from 'react'
import type { AppProps } from 'next/app'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { Inter, Playfair_Display } from 'next/font/google'
import { GlobalUXProvider } from '@/components/providers/GlobalUXProvider'
import ConsentBanner from '@/components/analytics/ConsentBanner'
import { pageview } from '@/lib/analytics'
import type { Language } from '@/lib/i18n'

// Self-hosted via next/font — removes the render-blocking fonts.googleapis.com
// stylesheet and the extra RTT to fonts.gstatic.com. Fonts are inlined and
// preloaded from our own origin. Variable fonts cover every weight the design
// uses (Inter 100–900, Playfair 400–900).
const inter = Inter({ subsets: ['latin'], variable: '--font-inter', display: 'swap' })
const playfair = Playfair_Display({ subsets: ['latin'], variable: '--font-playfair', display: 'swap' })

type PageProps = {
  initialLanguage?: Language
}

export default function App({ Component, pageProps }: AppProps<PageProps>) {
  const router = useRouter()

  // Track client-side navigations (the initial pageview is sent by gtag config).
  useEffect(() => {
    const handler = (url: string) => pageview(url)
    router.events.on('routeChangeComplete', handler)
    return () => router.events.off('routeChangeComplete', handler)
  }, [router.events])

  // Scroll-reveal: fade/slide section content in as it enters the viewport.
  // Re-scans on route change. No-op under reduced-motion; reveals all if
  // IntersectionObserver is unavailable so content is never stuck hidden.
  useEffect(() => {
    if (typeof window === 'undefined') return
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return
    const sections = document.querySelectorAll('main > section:not(:first-of-type)')
    if (!('IntersectionObserver' in window)) {
      sections.forEach((s) => s.classList.add('is-visible'))
      return
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            e.target.classList.add('is-visible')
            io.unobserve(e.target)
          }
        }
      },
      { rootMargin: '0px 0px -15% 0px', threshold: 0.05 },
    )
    sections.forEach((s) => io.observe(s))
    return () => io.disconnect()
  }, [router.asPath])

  return (
    <GlobalUXProvider initialLanguage={pageProps.initialLanguage}>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      {/* font-sans here (not just on <body>) so the --font-inter variable —
          which is defined on this wrapper — actually resolves for the whole
          subtree; body sits above the variable scope. */}
      <div className={`${inter.variable} ${playfair.variable} font-sans`}>
        <Component {...pageProps} />
        <ConsentBanner />
      </div>
    </GlobalUXProvider>
  )
}
