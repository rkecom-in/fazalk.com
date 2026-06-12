export const SITE_URL = 'https://fazalk.com'
export const SITE_NAME = 'Fazal K. AI & Cloud Architecture Consulting'
export const DEFAULT_OG_IMAGE = `${SITE_URL}/hero-bg.jpg`

export type ServicePage = {
  slug: string
  title: string
  seoTitle: string
  description: string
  eyebrow: string
  h1: string
  intro: string
  audience: string[]
  outcomes: string[]
  process: string[]
  faqs: { question: string; answer: string }[]
}

export const servicePages: ServicePage[] = [
  {
    slug: 'ai-architecture-consulting',
    title: 'AI Architecture Consulting',
    seoTitle: 'AI Architecture Consultant for LLM, RAG & Agentic Systems | Fazal K.',
    description:
      'CTO-level AI architecture consulting for teams designing LLM, RAG, agentic workflow, data, and cloud systems before they build.',
    eyebrow: 'AI Architecture Consulting',
    h1: 'AI architecture consulting before costly build decisions are locked in.',
    intro:
      'For founders, SaaS teams, and software companies that need a senior architecture view before committing engineering time to an AI product, workflow, or platform.',
    audience: [
      'Founders validating an AI product architecture before hiring or building',
      'SaaS teams adding LLM, RAG, or agentic features to an existing platform',
      'Software companies choosing between build, buy, fine-tuning, RAG, or workflow automation',
      'Teams that need a practical architecture plan their engineers can execute',
    ],
    outcomes: [
      'Recommended AI system architecture and component boundaries',
      'LLM, RAG, vector database, orchestration, and cloud fit assessment',
      'Data flow, integration, latency, cost, and reliability tradeoffs',
      'Execution-ready technical direction for product and engineering teams',
    ],
    process: [
      'Clarify the product goal, users, data sources, constraints, and risk tolerance',
      'Map possible AI approaches against accuracy, latency, cost, and operational complexity',
      'Select the architecture pattern that fits the actual business and engineering context',
      'Document the recommended path, open risks, and next technical decisions',
    ],
    faqs: [
      {
        question: 'When should we involve an AI architecture consultant?',
        answer:
          'Before engineering starts, before vendor selection, or when an existing AI feature is expensive, slow, inaccurate, or difficult to scale.',
      },
      {
        question: 'Do we need RAG, fine-tuning, or agents?',
        answer:
          'That depends on the data shape, user workflow, quality target, latency budget, and operations model. The advisory session maps those constraints before choosing a pattern.',
      },
    ],
  },
  {
    slug: 'llm-rag-system-design',
    title: 'LLM & RAG System Design',
    seoTitle: 'LLM and RAG System Design Consultant | Fazal K.',
    description:
      'LLM and RAG system design consulting for teams that need grounded responses, reliable retrieval, controlled cost, and production-ready architecture.',
    eyebrow: 'LLM & RAG Design',
    h1: 'Design LLM and RAG systems that are grounded, measurable, and production-ready.',
    intro:
      'For teams building AI assistants, document intelligence, enterprise search, copilots, or workflow automation where retrieval quality and architecture decisions determine the result.',
    audience: [
      'Teams building AI assistants, knowledge search, or document intelligence',
      'Product leaders deciding whether RAG is enough or fine-tuning is justified',
      'Engineering teams struggling with hallucinations, poor retrieval, or high token cost',
      'Businesses integrating LLMs into existing SaaS, ERP, CRM, or internal systems',
    ],
    outcomes: [
      'Retrieval architecture across data ingestion, chunking, embeddings, indexes, and ranking',
      'Prompt, context, guardrail, evaluation, and fallback design',
      'Vector database and storage recommendations based on scale and filtering needs',
      'Cost, latency, observability, and quality evaluation plan',
    ],
    process: [
      'Review documents, data structure, user tasks, and answer-quality expectations',
      'Define the retrieval and generation flow before selecting tools',
      'Identify failure modes such as stale context, weak metadata, hallucination, and token waste',
      'Produce a practical design your team can implement and test',
    ],
    faqs: [
      {
        question: 'What makes a RAG system fail?',
        answer:
          'Most failures come from weak data preparation, poor chunking, missing metadata, shallow evaluation, or treating the LLM as a substitute for system design.',
      },
      {
        question: 'Can this help reduce LLM cost?',
        answer:
          'Yes. Architecture choices around retrieval filtering, context size, caching, model routing, and evaluation can materially reduce unnecessary token and infrastructure cost.',
      },
    ],
  },
  {
    slug: 'technical-architecture-review',
    title: 'Technical Architecture Review',
    seoTitle: 'Technical Architecture Review for AI and Cloud Systems | Fazal K.',
    description:
      'Independent architecture review for AI, SaaS, and cloud systems with risks around scale, latency, cost, reliability, or technical debt.',
    eyebrow: 'Architecture Review',
    h1: 'Independent technical architecture review before risks become production problems.',
    intro:
      'For teams with an existing design or live system that needs an outside CTO-level review before scaling, investing, migrating, or rebuilding.',
    audience: [
      'SaaS teams preparing to scale infrastructure or AI features',
      'Founders concerned that a vendor or internal design may not hold up',
      'Product teams seeing latency, cost, reliability, or quality issues',
      'Companies planning a rebuild, migration, or architecture correction',
    ],
    outcomes: [
      'Architecture risk assessment across system design, cloud, data, and AI layers',
      'Prioritized findings with severity, impact, and recommended corrective action',
      'Cost, reliability, scalability, and maintainability review',
      'Clear decision points for leadership and engineering',
    ],
    process: [
      'Review diagrams, repositories, cloud layout, data flows, and operational concerns',
      'Identify architectural bottlenecks, weak boundaries, and avoidable complexity',
      'Separate urgent production risks from longer-term design improvements',
      'Deliver a concise review that engineering and leadership can act on',
    ],
    faqs: [
      {
        question: 'Is this a code review?',
        answer:
          'No. It is an architecture-level review focused on system behavior, risk, scalability, reliability, cost, and technical direction.',
      },
      {
        question: 'Can you review a vendor proposal?',
        answer:
          'Yes. Vendor proposals can be reviewed for architectural fit, hidden complexity, integration risk, cost assumptions, and execution feasibility.',
      },
    ],
  },
  {
    slug: 'ai-technical-due-diligence',
    title: 'AI Technical Due Diligence',
    seoTitle: 'AI Technical Due Diligence Consultant for Vendors and Platforms | Fazal K.',
    description:
      'AI technical due diligence for vendor proposals, platforms, AI products, and architecture decisions before contracts, investment, or roadmap commitment.',
    eyebrow: 'Technical Due Diligence',
    h1: 'AI technical due diligence before you commit budget, contracts, or roadmap.',
    intro:
      'For leadership teams that need an independent technical view of an AI platform, vendor proposal, product architecture, or delivery claim before making a high-stakes decision.',
    audience: [
      'Businesses evaluating AI vendors, platforms, or implementation partners',
      'Investors or leadership teams reviewing AI product feasibility',
      'System integrators validating architecture before enterprise delivery',
      'Companies deciding whether a proposed AI roadmap is realistic',
    ],
    outcomes: [
      'Assessment of technical feasibility, architecture quality, and implementation risk',
      'Review of AI claims, data dependencies, operational complexity, and cost assumptions',
      'Red flags, missing controls, scalability concerns, and vendor lock-in risks',
      'Executive-friendly recommendation with technical rationale',
    ],
    process: [
      'Review the proposal, architecture, product claims, data model, and integration scope',
      'Test assumptions against real-world AI, cloud, and delivery constraints',
      'Identify risk areas that could affect cost, timeline, accuracy, or reliability',
      'Summarize the decision: proceed, adjust scope, challenge assumptions, or pause',
    ],
    faqs: [
      {
        question: 'What decisions does AI technical due diligence support?',
        answer:
          'It supports vendor selection, investment review, platform choice, roadmap commitment, build-versus-buy decisions, and architecture sign-off.',
      },
      {
        question: 'Can this be done before we share sensitive data?',
        answer:
          'Yes. Many due diligence reviews can begin with architecture documents, product claims, anonymized workflows, assumptions, and vendor responses.',
      },
    ],
  },
]

export function getServicePage(slug: string) {
  return servicePages.find(service => service.slug === slug)
}
