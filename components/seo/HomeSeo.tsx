import Head from 'next/head'
import { homepageFaqs, homepageFaqsAr } from '@/components/layout/FaqSection'
import { DEFAULT_OG_IMAGE, servicePages, servicePagesAr, SITE_NAME, SITE_URL } from '@/lib/seo-services'
import type { Language } from '@/lib/i18n'

const TITLE_EN = 'AI CTO Consultant for AI Architecture & Cloud Strategy | Fazal K.'
const TITLE_AR = 'استشارات CTO للذكاء الاصطناعي والمعمارية السحابية | Fazal K.'
const DESCRIPTION_EN =
  'CTO-level AI and cloud architecture consulting for founders and teams planning, reviewing, or fixing high-stakes AI systems.'
const DESCRIPTION_AR =
  'استشارات معمارية بمستوى CTO للذكاء الاصطناعي والسحابة للفرق التي تخطط أو تراجع أو تعالج أنظمة ذكاء اصطناعي عالية الأثر.'

function homeUrl(language: Language) {
  return language === 'ar' ? `${SITE_URL}/ar` : `${SITE_URL}/`
}

function buildStructuredData(language: Language) {
  const isAr = language === 'ar'
  const description = isAr ? DESCRIPTION_AR : DESCRIPTION_EN
  const url = homeUrl(language)
  const services = isAr ? servicePagesAr : servicePages
  const faqs = isAr ? homepageFaqsAr : homepageFaqs

  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebSite',
        '@id': `${SITE_URL}/#website`,
        url,
        name: SITE_NAME,
        description,
        inLanguage: language,
        publisher: { '@id': `${SITE_URL}/#organization` },
        potentialAction: {
          '@type': 'ReadAction',
          target: services.map(service => `${SITE_URL}${isAr ? '/ar' : ''}/services/${service.slug}`),
        },
      },
      {
        '@type': 'Organization',
        '@id': `${SITE_URL}/#organization`,
        name: SITE_NAME,
        url: `${SITE_URL}/`,
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
        url: `${SITE_URL}/`,
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
        name: isAr ? 'استشارات معمارية للذكاء الاصطناعي والسحابة' : 'AI and Cloud Architecture Consulting',
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
          audienceType: 'Software companies, SaaS teams, founders, system integrators, digital transformation firms',
        },
        description,
        url,
        hasOfferCatalog: {
          '@type': 'OfferCatalog',
          name: isAr ? 'خدمات استشارية CTO للذكاء الاصطناعي' : 'AI CTO advisory services',
          itemListElement: services.map(service => ({
            '@type': 'Offer',
            itemOffered: {
              '@type': 'Service',
              name: service.title,
              url: `${SITE_URL}${isAr ? '/ar' : ''}/services/${service.slug}`,
              description: service.description,
            },
          })),
        },
      },
      {
        '@type': 'FAQPage',
        '@id': `${url}#faq`,
        inLanguage: language,
        mainEntity: faqs.map(item => ({
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
}

export default function HomeSeo({ language = 'en' }: { language?: Language }) {
  const isAr = language === 'ar'
  const title = isAr ? TITLE_AR : TITLE_EN
  const description = isAr ? DESCRIPTION_AR : DESCRIPTION_EN
  const url = homeUrl(language)
  const alternateUrl = isAr ? `${SITE_URL}/` : `${SITE_URL}/ar`

  return (
    <Head>
      <title>{title}</title>
      <meta name="description" content={description} key="description" />
      <meta name="robots" content="index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1" key="robots" />
      <link rel="canonical" href={url} key="canonical" />
      <link rel="alternate" hrefLang={language} href={url} key={`alternate-${language}`} />
      <link rel="alternate" hrefLang={isAr ? 'en' : 'ar'} href={alternateUrl} key={`alternate-${isAr ? 'en' : 'ar'}`} />
      <link rel="alternate" hrefLang="x-default" href={`${SITE_URL}/`} key="alternate-x-default" />

      <meta property="og:type" content="website" key="og:type" />
      <meta property="og:site_name" content={SITE_NAME} key="og:site_name" />
      <meta property="og:title" content={title} key="og:title" />
      <meta property="og:description" content={description} key="og:description" />
      <meta property="og:url" content={url} key="og:url" />
      <meta property="og:image" content={DEFAULT_OG_IMAGE} key="og:image" />
      <meta property="og:image:width" content="1920" key="og:image:width" />
      <meta property="og:image:height" content="1080" key="og:image:height" />
      <meta property="og:image:alt" content="AI and cloud architecture consulting by Fazal K." key="og:image:alt" />
      <meta property="og:locale" content={isAr ? 'ar_AE' : 'en_US'} key="og:locale" />

      <meta name="twitter:card" content="summary_large_image" key="twitter:card" />
      <meta name="twitter:title" content={title} key="twitter:title" />
      <meta name="twitter:description" content={description} key="twitter:description" />
      <meta name="twitter:image" content={DEFAULT_OG_IMAGE} key="twitter:image" />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(buildStructuredData(language)) }}
      />
    </Head>
  )
}
