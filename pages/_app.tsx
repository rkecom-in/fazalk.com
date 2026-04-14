import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import Head from 'next/head'
import { GlobalUXProvider } from '@/components/providers/GlobalUXProvider'

export default function App({ Component, pageProps }: AppProps) {
  return (
    <GlobalUXProvider>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
        <title>CTO-Level AI &amp; Cloud Architecture Consulting</title>
      </Head>
      <Component {...pageProps} />
    </GlobalUXProvider>
  )
}
