import Link from 'next/link'
import { ArrowRight, CheckCircle2 } from 'lucide-react'
import SiteHeader from '@/components/layout/SiteHeader'
import { Button } from '@/components/ui/button'
import SeoHead from '@/components/seo/SeoHead'
import {
  getArabicServiceForEnglishSlug,
  getEnglishServiceForArabicSlug,
  servicePages,
  servicePagesAr,
  SITE_URL,
  type ServicePage,
} from '@/lib/seo-services'

type ServicePageContentProps = {
  service: ServicePage
  locale: 'en' | 'ar'
}

const labels = {
  en: {
    home: 'Fazal K. / Advisory',
    bestFit: 'Best fit',
    whoFor: 'Who this is for',
    whoForText:
      'This advisory path is designed for teams that need clarity before committing serious engineering budget, vendor contracts, or roadmap direction.',
    outputs: 'Outputs',
    outputsTitle: 'What you walk away with',
    method: 'Method',
    methodTitle: 'How the advisory session works',
    methodText:
      'The work stays practical: clarify context, pressure-test assumptions, choose a direction, and leave with decisions your team can execute.',
    questions: 'Questions',
    questionsTitle: 'Common questions',
    related: 'Related advisory pages',
    relatedTitle: 'Explore adjacent AI CTO consulting services',
    nextStep: 'Next step',
    ctaTitle: 'Assess your architecture and request the right session.',
    cta: 'Start Assessment',
    homeHref: '/',
    assessmentHref: '/#assessment',
  },
  ar: {
    home: 'Fazal K. / الاستشارات',
    bestFit: 'الملاءمة',
    whoFor: 'لمن يناسب هذا المسار',
    whoForText:
      'هذا المسار الاستشاري مصمم للفرق التي تحتاج وضوحاً قبل الالتزام بميزانية هندسية كبيرة أو عقود موردين أو اتجاه خارطة طريق.',
    outputs: 'المخرجات',
    outputsTitle: 'ما الذي تحصل عليه',
    method: 'المنهجية',
    methodTitle: 'كيف تعمل الجلسة الاستشارية',
    methodText:
      'يبقى العمل عملياً: توضيح السياق، واختبار الافتراضات، واختيار الاتجاه، والخروج بقرارات يستطيع الفريق تنفيذها.',
    questions: 'الأسئلة',
    questionsTitle: 'أسئلة شائعة',
    related: 'صفحات استشارية ذات صلة',
    relatedTitle: 'استكشف خدمات CTO أخرى للذكاء الاصطناعي',
    nextStep: 'الخطوة التالية',
    ctaTitle: 'قيّم المعمارية واطلب الجلسة المناسبة.',
    cta: 'ابدأ التقييم',
    homeHref: '/ar',
    assessmentHref: '/ar#assessment',
  },
}

function servicePath(service: ServicePage, locale: 'en' | 'ar') {
  return locale === 'ar' ? `/ar/services/${service.slug}` : `/services/${service.slug}`
}

function getAlternatePath(service: ServicePage, locale: 'en' | 'ar') {
  if (locale === 'en') {
    const arabic = getArabicServiceForEnglishSlug(service.slug)
    return arabic ? servicePath(arabic, 'ar') : undefined
  }

  const english = getEnglishServiceForArabicSlug(service.slug)
  return english ? servicePath(english, 'en') : undefined
}

function relatedServices(service: ServicePage, locale: 'en' | 'ar') {
  const collection = locale === 'ar' ? servicePagesAr : servicePages
  return collection.filter(item => item.slug !== service.slug).slice(0, 3)
}

export default function ServicePageContent({ service, locale }: ServicePageContentProps) {
  const l = labels[locale]
  const path = servicePath(service, locale)
  const alternatePath = getAlternatePath(service, locale)
  const related = relatedServices(service, locale)
  const structuredData = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Service',
        '@id': `${SITE_URL}${path}#service`,
        name: service.title,
        url: `${SITE_URL}${path}`,
        description: service.description,
        inLanguage: locale,
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
        inLanguage: locale,
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
        language={locale}
        alternates={alternatePath ? [{ hrefLang: locale === 'ar' ? 'en' : 'ar', href: `${SITE_URL}${alternatePath}` }] : undefined}
        structuredData={structuredData}
      />
      <main className="min-h-screen bg-background text-foreground" lang={locale} dir={locale === 'ar' ? 'rtl' : 'ltr'}>
        <SiteHeader />

        <section className="pt-32 pb-16 bg-card/30 border-b border-border">
          <div className="container mx-auto px-6 max-w-5xl">
            <Link href={l.homeHref} className="text-xs tracking-widest uppercase text-muted-foreground hover:text-gold transition-colors">
              {l.home}
            </Link>
            <p className="text-sm font-semibold text-gold tracking-widest uppercase mt-10 mb-5">{service.eyebrow}</p>
            <h1 className="font-serif text-4xl md:text-5xl font-medium leading-tight max-w-4xl mb-6">
              {service.h1}
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed max-w-3xl">
              {service.intro}
            </p>
            <div className="mt-8">
              <Link href={l.assessmentHref}>
                <Button variant="hero" size="lg">
                  {l.cta}
                  <ArrowRight className="ms-2 w-4 h-4 rtl:rotate-180" />
                </Button>
              </Link>
            </div>
          </div>
        </section>

        <section className="py-16">
          <div className="container mx-auto px-6 max-w-5xl grid lg:grid-cols-[0.9fr_1.1fr] gap-12">
            <div>
              <p className="text-xs tracking-widest uppercase text-gold mb-4">{l.bestFit}</p>
              <h2 className="font-serif text-3xl font-medium mb-5">{l.whoFor}</h2>
              <p className="text-muted-foreground leading-relaxed">{l.whoForText}</p>
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
            <p className="text-xs tracking-widest uppercase text-gold mb-4">{l.outputs}</p>
            <h2 className="font-serif text-3xl font-medium mb-8">{l.outputsTitle}</h2>
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
              <p className="text-xs tracking-widest uppercase text-gold mb-4">{l.method}</p>
              <h2 className="font-serif text-3xl font-medium mb-5">{l.methodTitle}</h2>
              <p className="text-muted-foreground leading-relaxed">{l.methodText}</p>
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
            <p className="text-xs tracking-widest uppercase text-gold mb-4">{l.questions}</p>
            <h2 className="font-serif text-3xl font-medium mb-8">{l.questionsTitle}</h2>
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
            <p className="text-xs tracking-widest uppercase text-gold mb-4">{l.related}</p>
            <h2 className="font-serif text-3xl font-medium mb-8">{l.relatedTitle}</h2>
            <div className="grid md:grid-cols-3 gap-4">
              {related.map(item => (
                <Link
                  key={item.slug}
                  href={servicePath(item, locale)}
                  className="rounded-lg border border-border bg-card p-5 transition-colors hover:border-gold/40"
                >
                  <h3 className="font-serif text-lg font-medium mb-3">{item.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{item.description}</p>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section className="py-16 bg-card/30 border-t border-border">
          <div className="container mx-auto px-6 max-w-5xl">
            <div className="border border-border bg-card rounded-xl p-6 md:p-8 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
              <div>
                <p className="text-xs tracking-widest uppercase text-gold mb-3">{l.nextStep}</p>
                <h2 className="font-serif text-2xl font-medium">{l.ctaTitle}</h2>
              </div>
              <Link href={l.assessmentHref} className="w-full md:w-auto">
                <Button variant="hero" className="w-full md:w-auto">
                  {l.cta}
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
