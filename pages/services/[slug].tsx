import type { GetStaticPaths, GetStaticProps } from 'next'
import Link from 'next/link'
import { ArrowRight, CheckCircle2 } from 'lucide-react'
import SiteHeader from '@/components/layout/SiteHeader'
import { Button } from '@/components/ui/button'
import SeoHead from '@/components/seo/SeoHead'
import { getServicePage, servicePages, SITE_URL, type ServicePage } from '@/lib/seo-services'

type ServicePageProps = {
  service: ServicePage
}

export const getStaticPaths: GetStaticPaths = async () => ({
  paths: servicePages.map(service => ({ params: { slug: service.slug } })),
  fallback: false,
})

export const getStaticProps: GetStaticProps<ServicePageProps> = async ({ params }) => {
  const slug = typeof params?.slug === 'string' ? params.slug : ''
  const service = getServicePage(slug)

  if (!service) return { notFound: true }

  return { props: { service } }
}

export default function ServiceLandingPage({ service }: ServicePageProps) {
  const path = `/services/${service.slug}`
  const structuredData = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Service',
        '@id': `${SITE_URL}${path}#service`,
        name: service.title,
        url: `${SITE_URL}${path}`,
        description: service.description,
        provider: { '@id': `${SITE_URL}/#organization` },
        serviceType: service.title,
        areaServed: [
          { '@type': 'Place', name: 'GCC' },
          { '@type': 'Place', name: 'Worldwide' },
        ],
      },
      {
        '@type': 'FAQPage',
        '@id': `${SITE_URL}${path}#faq`,
        mainEntity: service.faqs.map(item => ({
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

  return (
    <>
      <SeoHead
        title={service.seoTitle}
        description={service.description}
        path={path}
        structuredData={structuredData}
      />
      <main className="min-h-screen bg-background text-foreground">
        <SiteHeader />

        <section className="pt-32 pb-16 bg-card/30 border-b border-border">
          <div className="container mx-auto px-6 max-w-5xl">
            <Link href="/" className="text-xs tracking-widest uppercase text-muted-foreground hover:text-gold transition-colors">
              Fazal K. / Advisory
            </Link>
            <p className="text-sm font-semibold text-gold tracking-widest uppercase mt-10 mb-5">{service.eyebrow}</p>
            <h1 className="font-serif text-4xl md:text-5xl font-medium leading-tight max-w-4xl mb-6">
              {service.h1}
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed max-w-3xl">
              {service.intro}
            </p>
            <div className="mt-8">
              <Link href="/#assessment">
                <Button variant="hero" size="lg">
                  Start Assessment
                  <ArrowRight className="ms-2 w-4 h-4 rtl:rotate-180" />
                </Button>
              </Link>
            </div>
          </div>
        </section>

        <section className="py-16">
          <div className="container mx-auto px-6 max-w-5xl grid lg:grid-cols-[0.9fr_1.1fr] gap-12">
            <div>
              <p className="text-xs tracking-widest uppercase text-gold mb-4">Best fit</p>
              <h2 className="font-serif text-3xl font-medium mb-5">Who this is for</h2>
              <p className="text-muted-foreground leading-relaxed">
                This advisory path is designed for teams that need clarity before committing serious engineering budget, vendor contracts, or roadmap direction.
              </p>
            </div>
            <div className="grid gap-3">
              {service.audience.map(item => (
                <div key={item} className="flex gap-3 p-4 rounded-lg border border-border bg-card">
                  <CheckCircle2 className="w-5 h-5 text-gold shrink-0 mt-0.5" />
                  <span className="text-sm leading-relaxed text-foreground/90">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-16 bg-card/30 border-y border-border">
          <div className="container mx-auto px-6 max-w-5xl">
            <p className="text-xs tracking-widest uppercase text-gold mb-4">Outputs</p>
            <h2 className="font-serif text-3xl font-medium mb-8">What you walk away with</h2>
            <div className="grid md:grid-cols-2 gap-4">
              {service.outcomes.map(item => (
                <div key={item} className="p-5 rounded-lg border border-border bg-background">
                  <p className="text-sm leading-relaxed text-foreground/90">{item}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-16">
          <div className="container mx-auto px-6 max-w-5xl grid lg:grid-cols-[0.9fr_1.1fr] gap-12">
            <div>
              <p className="text-xs tracking-widest uppercase text-gold mb-4">Method</p>
              <h2 className="font-serif text-3xl font-medium mb-5">How the advisory session works</h2>
              <p className="text-muted-foreground leading-relaxed">
                The work stays practical: clarify context, pressure-test assumptions, choose a direction, and leave with decisions your team can execute.
              </p>
            </div>
            <ol className="space-y-4">
              {service.process.map((item, index) => (
                <li key={item} className="flex gap-4">
                  <span className="w-8 h-8 rounded-full border border-gold/30 text-gold text-xs tracking-widest flex items-center justify-center shrink-0">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <span className="text-sm leading-relaxed text-foreground/90 pt-1.5">{item}</span>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section className="py-16 bg-card/30 border-y border-border">
          <div className="container mx-auto px-6 max-w-5xl">
            <p className="text-xs tracking-widest uppercase text-gold mb-4">Questions</p>
            <h2 className="font-serif text-3xl font-medium mb-8">Common questions</h2>
            <div className="grid md:grid-cols-2 gap-4">
              {service.faqs.map(item => (
                <div key={item.question} className="p-5 rounded-lg border border-border bg-background">
                  <h3 className="font-serif text-lg font-medium mb-3">{item.question}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{item.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-16">
          <div className="container mx-auto px-6 max-w-5xl">
            <div className="border border-border bg-card rounded-xl p-6 md:p-8 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
              <div>
                <p className="text-xs tracking-widest uppercase text-gold mb-3">Next step</p>
                <h2 className="font-serif text-2xl font-medium">Assess your architecture and request the right session.</h2>
              </div>
              <Link href="/#assessment" className="w-full md:w-auto">
                <Button variant="hero" className="w-full md:w-auto">
                  Start Assessment
                  <ArrowRight className="ms-2 w-4 h-4 rtl:rotate-180" />
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>
    </>
  )
}
