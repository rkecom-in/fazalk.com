import { useGlobalUX } from '@/components/providers/GlobalUXProvider'

const faqsEn = [
  {
    question: 'What does an AI CTO consultant do?',
    answer:
      'An AI CTO consultant helps leadership and engineering teams make architecture decisions for AI products, LLM systems, RAG pipelines, cloud infrastructure, vendor selection, and technical risk before major budget or build commitments.',
  },
  {
    question: 'When should we request an architecture assessment?',
    answer:
      'Request an assessment before development starts, before selecting an AI vendor, before scaling a prototype, or when an existing AI system has issues with accuracy, latency, cost, reliability, or maintainability.',
  },
  {
    question: 'Can you help us choose between LLM, RAG, fine-tuning, and agents?',
    answer:
      'Yes. The advisory process maps your use case, data shape, user workflow, latency budget, quality target, and operational constraints before recommending an AI architecture pattern.',
  },
  {
    question: 'Do you work with GCC software companies and SaaS teams?',
    answer:
      'Yes. The work is especially suited to GCC software companies, SaaS businesses, system integrators, digital transformation firms, and founders building or reviewing AI-enabled platforms.',
  },
]

const faqsAr = [
  {
    question: 'ما دور مستشار CTO للذكاء الاصطناعي؟',
    answer:
      'يساعد مستشار CTO للذكاء الاصطناعي فرق القيادة والهندسة على اتخاذ قرارات معمارية حول منتجات الذكاء الاصطناعي، وأنظمة LLM، وخطوط RAG، والبنية السحابية، واختيار الموردين، والمخاطر التقنية قبل الالتزام بميزانيات أو بناء كبير.',
  },
  {
    question: 'متى ينبغي طلب تقييم معماري؟',
    answer:
      'اطلب التقييم قبل بدء التطوير، أو قبل اختيار مورد ذكاء اصطناعي، أو قبل توسيع نموذج أولي، أو عندما يعاني نظام ذكاء اصطناعي قائم من مشاكل في الدقة أو زمن الاستجابة أو التكلفة أو الاعتمادية أو قابلية الصيانة.',
  },
  {
    question: 'هل يمكنكم مساعدتنا في الاختيار بين LLM وRAG والضبط الدقيق والوكلاء؟',
    answer:
      'نعم. تربط العملية الاستشارية بين حالة الاستخدام وشكل البيانات وسير عمل المستخدم وميزانية زمن الاستجابة وهدف الجودة والقيود التشغيلية قبل التوصية بنمط معماري مناسب للذكاء الاصطناعي.',
  },
  {
    question: 'هل تعملون مع شركات البرمجيات وفرق SaaS في الخليج؟',
    answer:
      'نعم. يناسب هذا العمل شركات البرمجيات في الخليج، وشركات SaaS، ومتكاملي الأنظمة، وشركات التحول الرقمي، والمؤسسين الذين يبنون أو يراجعون منصات مدعومة بالذكاء الاصطناعي.',
  },
]

export { faqsEn as homepageFaqs, faqsAr as homepageFaqsAr }

export default function FaqSection() {
  const { language } = useGlobalUX()
  const isAr = language === 'ar'
  const faqs = isAr ? faqsAr : faqsEn

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-6 max-w-5xl">
        <p className="text-sm font-semibold text-gold tracking-widest uppercase mb-4 text-center">
          {isAr ? 'الأسئلة الشائعة' : 'FAQ'}
        </p>
        <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-12 text-center font-serif">
          {isAr
            ? 'أسئلة يطرحها العملاء قبل بدء استشارة CTO للذكاء الاصطناعي.'
            : 'AI CTO consulting questions clients ask before starting.'}
        </h2>
        <div className="grid md:grid-cols-2 gap-4">
          {faqs.map(item => (
            <div key={item.question} className="rounded-lg border border-border bg-card p-5">
              <h3 className="font-serif text-lg font-medium text-foreground mb-3">{item.question}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{item.answer}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
