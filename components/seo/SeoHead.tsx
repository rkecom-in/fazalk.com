import Head from 'next/head'
import { DEFAULT_OG_IMAGE, SITE_NAME, SITE_URL } from '@/lib/seo-services'

type SeoHeadProps = {
  title: string
  description: string
  path?: string
  type?: 'website' | 'article'
  structuredData?: Record<string, unknown>
}

export default function SeoHead({
  title,
  description,
  path = '/',
  type = 'website',
  structuredData,
}: SeoHeadProps) {
  const canonical = path === '/' ? `${SITE_URL}/` : `${SITE_URL}${path}`

  return (
    <Head>
      <title>{title}</title>
      <meta name="description" content={description} key="description" />
      <meta name="robots" content="index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1" key="robots" />
      <link rel="canonical" href={canonical} key="canonical" />

      <meta property="og:type" content={type} key="og:type" />
      <meta property="og:site_name" content={SITE_NAME} key="og:site_name" />
      <meta property="og:title" content={title} key="og:title" />
      <meta property="og:description" content={description} key="og:description" />
      <meta property="og:url" content={canonical} key="og:url" />
      <meta property="og:image" content={DEFAULT_OG_IMAGE} key="og:image" />
      <meta property="og:image:width" content="1920" key="og:image:width" />
      <meta property="og:image:height" content="1080" key="og:image:height" />
      <meta property="og:image:alt" content="AI and cloud architecture consulting by Fazal K." key="og:image:alt" />
      <meta property="og:locale" content="en_US" key="og:locale" />

      <meta name="twitter:card" content="summary_large_image" key="twitter:card" />
      <meta name="twitter:title" content={title} key="twitter:title" />
      <meta name="twitter:description" content={description} key="twitter:description" />
      <meta name="twitter:image" content={DEFAULT_OG_IMAGE} key="twitter:image" />

      {structuredData && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      )}
    </Head>
  )
}
