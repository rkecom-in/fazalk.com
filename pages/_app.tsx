import '@/styles/globals.css'
import { useEffect } from 'react'
import type { AppProps } from 'next/app'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { GlobalUXProvider } from '@/components/providers/GlobalUXProvider'
import ConsentBanner from '@/components/analytics/ConsentBanner'
import { pageview } from '@/lib/analytics'
import type { Language } from '@/lib/i18n'

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
      <Component {...pageProps} />
      <ConsentBanner />
    </GlobalUXProvider>
  )
}
