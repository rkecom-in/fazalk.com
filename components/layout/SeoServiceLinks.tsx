import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { servicePages } from '@/lib/seo-services'
import { useGlobalUX } from '@/components/providers/GlobalUXProvider'

const serviceCopyAr: Record<string, { title: string; description: string }> = {
  'ai-architecture-consulting': {
    title: 'استشارات معمارية الذكاء الاصطناعي',
    description:
      'استشارات CTO-level لتصميم معمارية الذكاء الاصطناعي للفرق التي تبني أنظمة LLM أو RAG أو وكلاء أو منصات ذكاء اصطناعي قبل بدء التنفيذ.',
  },
  'llm-rag-system-design': {
    title: 'تصميم أنظمة LLM وRAG',
    description:
      'استشارات تصميم أنظمة LLM وRAG للفرق التي تحتاج إجابات موثوقة، واسترجاعاً دقيقاً، وتكلفة مضبوطة، ومعمارية جاهزة للإنتاج.',
  },
  'technical-architecture-review': {
    title: 'مراجعة المعمارية التقنية',
    description:
      'مراجعة مستقلة لمعمارية أنظمة الذكاء الاصطناعي وSaaS والسحابة عندما توجد مخاطر في التوسع أو زمن الاستجابة أو التكلفة أو الاعتمادية.',
  },
  'ai-technical-due-diligence': {
    title: 'العناية التقنية الواجبة للذكاء الاصطناعي',
    description:
      'تقييم تقني لعروض الموردين والمنصات ومنتجات الذكاء الاصطناعي قبل توقيع العقود أو الاستثمار أو الالتزام بخارطة طريق.',
  },
}

export default function SeoServiceLinks() {
  const { language } = useGlobalUX()
  const isAr = language === 'ar'

  return (
    <section className="py-20 bg-background border-y border-border/70">
      <div className="container mx-auto px-6 max-w-6xl">
        <p className="text-sm font-semibold text-gold tracking-widest uppercase mb-4 text-center">
          {isAr ? 'مجالات الاستشارة المتخصصة' : 'Specialist Advisory Areas'}
        </p>
        <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4 text-center font-serif">
          {isAr
            ? 'استشارات CTO مركزة للذكاء الاصطناعي حول القرارات التي تبحث عنها الفرق.'
            : 'Focused AI CTO consulting for the decisions teams search for.'}
        </h2>
        <p className="text-lg text-muted-foreground text-center mb-12 max-w-2xl mx-auto">
          {isAr
            ? 'تشرح كل صفحة مساراً استشارياً محدداً لمعمارية الذكاء الاصطناعي، وتصميم LLM/RAG، ومراجعة المعمارية، والعناية التقنية الواجبة.'
            : 'Each page explains a specific advisory path for AI architecture, LLM/RAG design, architecture review, and technical due diligence.'}
        </p>
        <div className="grid md:grid-cols-2 gap-4">
          {servicePages.map(service => {
            const copy = isAr ? serviceCopyAr[service.slug] : service

            return (
              <Link
                key={service.slug}
                href={`/services/${service.slug}`}
                className="group rounded-lg border border-border bg-card p-5 transition-colors hover:border-gold/40"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="font-serif text-xl font-medium text-foreground mb-2">{copy.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{copy.description}</p>
                  </div>
                  <ArrowRight className="w-5 h-5 text-gold shrink-0 mt-1 transition-transform group-hover:translate-x-1 rtl:rotate-180" />
                </div>
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}
