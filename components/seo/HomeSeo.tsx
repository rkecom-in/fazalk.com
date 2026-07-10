import Head from 'next/head'
import { DEFAULT_OG_IMAGE, SITE_NAME, SITE_URL } from '@/lib/seo-services'
import type { Language } from '@/lib/i18n'

const TITLE = 'Fazal Khan — CEO of RKeCom Services | Building Viabe'
const DESCRIPTION =
  'Fazal Khan is the CEO of RKeCom Services, a Mumbai-based applied-AI company building Viabe — AI-powered business intelligence for small businesses. Former CTO of GlobalLinker.'
const OG_ALT = 'Fazal Khan — CEO of RKeCom Services, building Viabe'

const LINKEDIN = 'https://www.linkedin.com/in/fazalk1980'
const VIABE = 'https://viabe.ai'
const RKECOM = 'https://rkecom.in'

function buildStructuredData() {
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebSite',
        '@id': `${SITE_URL}/#website`,
        url: `${SITE_URL}/`,
        name: SITE_NAME,
        description: DESCRIPTION,
        inLanguage: 'en',
        publisher: { '@id': `${SITE_URL}/#organization` },
      },
      {
        '@type': 'ProfilePage',
        '@id': `${SITE_URL}/#profilepage`,
        url: `${SITE_URL}/`,
        name: TITLE,
        inLanguage: 'en',
        isPartOf: { '@id': `${SITE_URL}/#website` },
        mainEntity: { '@id': `${SITE_URL}/#fazal` },
      },
      {
        '@type': 'Organization',
        '@id': `${SITE_URL}/#organization`,
        name: 'RKeCom Services',
        legalName: 'RKeCom Services (OPC) Private Limited',
        url: RKECOM,
        foundingDate: '2020-08-23',
        logo: `${SITE_URL}/favicon.ico`,
        image: DEFAULT_OG_IMAGE,
        address: {
          '@type': 'PostalAddress',
          addressLocality: 'Mumbai',
          addressRegion: 'Maharashtra',
          addressCountry: 'IN',
        },
        identifier: {
          '@type': 'PropertyValue',
          propertyID: 'CIN',
          value: 'U52609MH2020OPC344309',
        },
        brand: { '@type': 'Brand', name: 'Viabe' },
        founder: { '@id': `${SITE_URL}/#lubna` },
        employee: { '@id': `${SITE_URL}/#fazal` },
        sameAs: [VIABE, LINKEDIN],
      },
      {
        '@type': 'Service',
        '@id': `${SITE_URL}/#viabe-reports`,
        name: 'Viabe Reports',
        serviceType: 'AI-powered business location viability report',
        description:
          'A composite viability score for a specific address and business type — competitor landscape, rent-burden analysis, footfall read, local consumer personas and a positioning view, every figure sourced with cited methodology.',
        url: VIABE,
        brand: { '@type': 'Brand', name: 'Viabe' },
        provider: { '@id': `${SITE_URL}/#organization` },
        areaServed: [
          { '@type': 'Country', name: 'IN' },
          { '@type': 'Country', name: 'US' },
          { '@type': 'Country', name: 'AE' },
        ],
      },
      {
        '@type': 'Person',
        '@id': `${SITE_URL}/#fazal`,
        name: 'Fazal Khan',
        url: `${SITE_URL}/`,
        jobTitle: 'Chief Executive Officer',
        worksFor: { '@id': `${SITE_URL}/#organization` },
        alumniOf: { '@type': 'Organization', name: 'GlobalLinker' },
        description:
          'CEO of RKeCom Services, building Viabe. Former CTO of GlobalLinker.',
        knowsAbout: [
          'Applied AI',
          'Business intelligence',
          'Semantic search',
          'Cloud architecture',
          'AWS',
          'B2B/B2C marketplaces',
          'Multi-tenant commerce platforms',
        ],
        sameAs: [LINKEDIN],
      },
      {
        '@type': 'Person',
        '@id': `${SITE_URL}/#lubna`,
        name: 'Lubna Khan',
        jobTitle: 'Founder & Director',
        worksFor: { '@id': `${SITE_URL}/#organization` },
      },
    ],
  }
}

export default function HomeSeo({ language = 'en' }: { language?: Language }) {
  // English-only surface (0003 §5). The prop is retained for call-site
  // compatibility; the Arabic surface is dormant and redirected to `/`.
  void language
  const url = `${SITE_URL}/`

  return (
    <Head>
      <title>{TITLE}</title>
      <meta name="description" content={DESCRIPTION} key="description" />
      <meta name="robots" content="index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1" key="robots" />
      <link rel="canonical" href={url} key="canonical" />
      <link rel="alternate" hrefLang="en" href={url} key="alternate-en" />
      <link rel="alternate" hrefLang="x-default" href={url} key="alternate-x-default" />

      <meta property="og:type" content="website" key="og:type" />
      <meta property="og:site_name" content={SITE_NAME} key="og:site_name" />
      <meta property="og:title" content={TITLE} key="og:title" />
      <meta property="og:description" content={DESCRIPTION} key="og:description" />
      <meta property="og:url" content={url} key="og:url" />
      <meta property="og:image" content={DEFAULT_OG_IMAGE} key="og:image" />
      <meta property="og:image:secure_url" content={DEFAULT_OG_IMAGE} key="og:image:secure_url" />
      <meta property="og:image:type" content="image/png" key="og:image:type" />
      <meta property="og:image:width" content="1200" key="og:image:width" />
      <meta property="og:image:height" content="630" key="og:image:height" />
      <meta property="og:image:alt" content={OG_ALT} key="og:image:alt" />
      <meta property="og:locale" content="en_US" key="og:locale" />

      <meta name="twitter:card" content="summary_large_image" key="twitter:card" />
      <meta name="twitter:title" content={TITLE} key="twitter:title" />
      <meta name="twitter:description" content={DESCRIPTION} key="twitter:description" />
      <meta name="twitter:image" content={DEFAULT_OG_IMAGE} key="twitter:image" />
      <meta name="twitter:image:alt" content={OG_ALT} key="twitter:image:alt" />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(buildStructuredData()) }}
      />
    </Head>
  )
}
