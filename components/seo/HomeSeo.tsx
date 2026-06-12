import Head from 'next/head'
import { homepageFaqs } from '@/components/layout/FaqSection'
import { DEFAULT_OG_IMAGE, servicePages, SITE_NAME, SITE_URL } from '@/lib/seo-services'

const TITLE = 'AI CTO Consultant for AI Architecture & Cloud Strategy | Fazal K.'
const DESCRIPTION =
  'CTO-level AI and cloud architecture consulting for founders and teams planning, reviewing, or fixing high-stakes AI systems.'
const HOME_URL = `${SITE_URL}/`

const structuredData = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebSite',
      '@id': `${SITE_URL}/#website`,
      url: HOME_URL,
      name: SITE_NAME,
      description: DESCRIPTION,
      inLanguage: ['en', 'ar'],
      publisher: { '@id': `${SITE_URL}/#organization` },
      potentialAction: {
        '@type': 'ReadAction',
        target: servicePages.map(service => `${SITE_URL}/services/${service.slug}`),
      },
    },
    {
      '@type': 'Organization',
      '@id': `${SITE_URL}/#organization`,
      name: SITE_NAME,
      url: HOME_URL,
      logo: `${SITE_URL}/favicon.ico`,
      image: DEFAULT_OG_IMAGE,
      sameAs: ['https://in.linkedin.com/in/fazalk1980'],
      founder: { '@id': `${SITE_URL}/#person` },
      contactPoint: {
        '@type': 'ContactPoint',
        contactType: 'sales',
        email: 'connect@fazalk.com',
        availableLanguage: ['English', 'Arabic'],
      },
    },
    {
      '@type': 'Person',
      '@id': `${SITE_URL}/#person`,
      name: 'Fazal K.',
      url: HOME_URL,
      jobTitle: 'CTO-Level AI and Cloud Architecture Consultant',
      worksFor: { '@id': `${SITE_URL}/#organization` },
      sameAs: ['https://in.linkedin.com/in/fazalk1980'],
      knowsAbout: [
        'AI architecture',
        'Cloud architecture',
        'LLM systems',
        'RAG systems',
        'Technical due diligence',
        'Architecture reviews',
        'AWS architecture',
        'Azure architecture',
      ],
    },
    {
      '@type': 'Service',
      '@id': `${SITE_URL}/#service`,
      name: 'AI and Cloud Architecture Consulting',
      serviceType: [
        'AI system architecture',
        'Cloud architecture consulting',
        'LLM and RAG design',
        'Technical architecture review',
        'AI technical due diligence',
      ],
      provider: { '@id': `${SITE_URL}/#organization` },
      areaServed: [
        { '@type': 'Place', name: 'GCC' },
        { '@type': 'Place', name: 'Worldwide' },
      ],
      audience: {
        '@type': 'BusinessAudience',
        audienceType: 'Software companies, SaaS teams, founders, system integrators, and digital transformation firms',
      },
      description: DESCRIPTION,
      url: HOME_URL,
      hasOfferCatalog: {
        '@type': 'OfferCatalog',
        name: 'AI CTO advisory services',
        itemListElement: servicePages.map(service => ({
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: service.title,
            url: `${SITE_URL}/services/${service.slug}`,
            description: service.description,
          },
        })),
      },
    },
    {
      '@type': 'FAQPage',
      '@id': `${SITE_URL}/#faq`,
      mainEntity: homepageFaqs.map(item => ({
        '@type': 'Question',
        name: item.question,
        acceptedAnswer: {
          '@type': 'Answer',
          text: item.answer,
        },
      })),
    },
  ],
}

export default function HomeSeo() {
  return (
    <Head>
      <title>{TITLE}</title>
      <meta name="description" content={DESCRIPTION} key="description" />
      <meta name="robots" content="index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1" key="robots" />
      <link rel="canonical" href={HOME_URL} key="canonical" />

      <meta property="og:type" content="website" key="og:type" />
      <meta property="og:site_name" content={SITE_NAME} key="og:site_name" />
      <meta property="og:title" content={TITLE} key="og:title" />
      <meta property="og:description" content={DESCRIPTION} key="og:description" />
      <meta property="og:url" content={HOME_URL} key="og:url" />
      <meta property="og:image" content={DEFAULT_OG_IMAGE} key="og:image" />
      <meta property="og:image:width" content="1920" key="og:image:width" />
      <meta property="og:image:height" content="1080" key="og:image:height" />
      <meta property="og:image:alt" content="AI and cloud architecture consulting by Fazal K." key="og:image:alt" />
      <meta property="og:locale" content="en_US" key="og:locale" />

      <meta name="twitter:card" content="summary_large_image" key="twitter:card" />
      <meta name="twitter:title" content={TITLE} key="twitter:title" />
      <meta name="twitter:description" content={DESCRIPTION} key="twitter:description" />
      <meta name="twitter:image" content={DEFAULT_OG_IMAGE} key="twitter:image" />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
    </Head>
  )
}
