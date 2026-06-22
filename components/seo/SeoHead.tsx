import Head from 'next/head'
import { DEFAULT_OG_IMAGE, DEFAULT_OG_IMAGE_AR, SITE_NAME, SITE_URL } from '@/lib/seo-services'

type SeoHeadProps = {
  title: string
  description: string
  path?: string
  type?: 'website' | 'article'
  language?: 'en' | 'ar'
  alternates?: { hrefLang: string; href: string }[]
  structuredData?: Record<string, unknown>
}

export default function SeoHead({
  title,
  description,
  path = '/',
  type = 'website',
  language = 'en',
  alternates = [],
  structuredData,
}: SeoHeadProps) {
  const canonical = path === '/' ? `${SITE_URL}/` : `${SITE_URL}${path}`
  const ogImage = language === 'ar' ? DEFAULT_OG_IMAGE_AR : DEFAULT_OG_IMAGE

  return (
    <Head>
      <title>{title}</title>
      <meta name="description" content={description} key="description" />
      <meta name="robots" content="index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1" key="robots" />
      <link rel="canonical" href={canonical} key="canonical" />
      <link rel="alternate" hrefLang={language} href={canonical} key={`alternate-${language}`} />
      {alternates.map(alternate => (
        <link
          key={`alternate-${alternate.hrefLang}`}
          rel="alternate"
          hrefLang={alternate.hrefLang}
          href={alternate.href}
        />
      ))}

      <meta property="og:type" content={type} key="og:type" />
      <meta property="og:site_name" content={SITE_NAME} key="og:site_name" />
      <meta property="og:title" content={title} key="og:title" />
      <meta property="og:description" content={description} key="og:description" />
      <meta property="og:url" content={canonical} key="og:url" />
      <meta property="og:image" content={ogImage} key="og:image" />
      <meta property="og:image:secure_url" content={ogImage} key="og:image:secure_url" />
      <meta property="og:image:type" content="image/png" key="og:image:type" />
      <meta property="og:image:width" content="1200" key="og:image:width" />
      <meta property="og:image:height" content="630" key="og:image:height" />
      <meta property="og:image:alt" content="AI and cloud architecture consulting by Fazal K." key="og:image:alt" />
      <meta property="og:locale" content={language === 'ar' ? 'ar_AE' : 'en_US'} key="og:locale" />

      <meta name="twitter:card" content="summary_large_image" key="twitter:card" />
      <meta name="twitter:title" content={title} key="twitter:title" />
      <meta name="twitter:description" content={description} key="twitter:description" />
      <meta name="twitter:image" content={ogImage} key="twitter:image" />
      <meta name="twitter:image:alt" content="AI and cloud architecture consulting by Fazal K." key="twitter:image:alt" />

      {structuredData && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      )}
    </Head>
  )
}
