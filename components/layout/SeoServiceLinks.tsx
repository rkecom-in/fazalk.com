import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { servicePages } from '@/lib/seo-services'

export default function SeoServiceLinks() {
  return (
    <section className="py-20 bg-background border-y border-border/70">
      <div className="container mx-auto px-6 max-w-6xl">
        <p className="text-sm font-semibold text-gold tracking-widest uppercase mb-4 text-center">Specialist Advisory Areas</p>
        <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4 text-center font-serif">
          Focused AI CTO consulting for the decisions teams search for.
        </h2>
        <p className="text-lg text-muted-foreground text-center mb-12 max-w-2xl mx-auto">
          Each page explains a specific advisory path for AI architecture, LLM/RAG design, architecture review, and technical due diligence.
        </p>
        <div className="grid md:grid-cols-2 gap-4">
          {servicePages.map(service => (
            <Link
              key={service.slug}
              href={`/services/${service.slug}`}
              className="group rounded-lg border border-border bg-card p-5 transition-colors hover:border-gold/40"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="font-serif text-xl font-medium text-foreground mb-2">{service.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{service.description}</p>
                </div>
                <ArrowRight className="w-5 h-5 text-gold shrink-0 mt-1 transition-transform group-hover:translate-x-1 rtl:rotate-180" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
