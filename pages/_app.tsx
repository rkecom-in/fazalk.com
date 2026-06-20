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
