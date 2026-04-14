// English string dictionary for fazalk.com
export const en = {
  meta: {
    title: "Fazal K. | CTO-Level AI & Cloud Architecture Consulting",
    description: "AI & Cloud Architecture Consulting for High-Stakes Decisions. We design the right AI system, fix what's broken, or get clarity before you commit serious time and money.",
  },
  nav: {
    bookSession: "Book a Strategic Session",
  },
  hero: {
    badge: "CTO-Level Consulting",
    headline1: "Get the Architecture Decision Right",
    headline2: "Before You Build.",
    subtext: "Most AI and cloud failures are locked in at the architecture stage — long before systems go live. These engagements exist to give you clarity, direction, and a written plan before you commit time or budget.",
    cta1: "Book a Strategic Session",
    cta2: "Take AI Assessment",
  },
  positioningStrip: {
    items: [
      "AI System Architecture",
      "Cloud Infrastructure Advisory",
      "LLM & RAG Design",
      "Architecture Reviews",
    ],
  },
  whatWeSolve: {
    badge: "The Problem",
    headline: "Why Most AI Initiatives Fail Before They Start",
    subtext: "The decisions that determine success or failure are made early — before development begins. Most teams don't realise they've made the wrong ones until they're deep into a build.",
    problems: [
      {
        title: "Wrong Architecture Chosen",
        description: "Teams select AI frameworks, cloud providers, or system designs based on trends rather than fit. The result is technical debt baked in from day one.",
      },
      {
        title: "No Clear AI Strategy",
        description: "Building AI features without a coherent technical strategy leads to fragmented systems that don't scale, integrate, or deliver measurable ROI.",
      },
      {
        title: "Expensive Pivots Mid-Build",
        description: "Discovering architectural flaws after significant development investment forces costly redesigns, timeline extensions, and team frustration.",
      },
      {
        title: "Missing Technical Leadership",
        description: "Founders and product teams often lack access to senior technical guidance at the critical strategy stage, when the stakes are highest.",
      },
    ],
  },
  coreOfferings: {
    badge: "What We Do",
    headline: "CTO-Level Thinking, Without the Full-Time Hire",
    subtext: "Three engagement types, each designed for a specific stage of technical decision-making.",
    offerings: [
      {
        title: "Architecture Design",
        description: "Full system architecture for AI products, cloud infrastructure, and data pipelines — built around your constraints, team, and strategic goals.",
      },
      {
        title: "Technical Review",
        description: "An independent assessment of your existing architecture, identifying risks, inefficiencies, and opportunities before they become problems.",
      },
      {
        title: "AI Due Diligence",
        description: "Rigorous technical evaluation of AI systems, vendor proposals, or existing platforms — before you sign a contract, make a hire, or commit to a roadmap.",
      },
    ],
  },

  clients: {
    badge: "Clients",
    headline: "Who We Work With",
    list: [
      "GCC Software & IT Companies",
      "SaaS & Platform Businesses",
      "Digital Transformation Firms",
      "Founders Building AI Products",
      "IT Resellers & System Integrators",
      "SME Platform & Marketplace Businesses",
    ],
  },
  bookingSessions: {
    badge: "Request a Session",
    headline: "Choose the Right Engagement",
    subtext: "Every session is outcome-driven with clear, written deliverables. Pick the depth that matches your decision.",
    idealForLabel: "Ideal For",
    whatYouGetLabel: "What You Get",
    currency: "USD",
    bookLabelPrefix: "Request Session",
    sessionSuffix: "Session",
    sessions: [
      {
        id: "strategic",
        title: "Strategic Clarity Session",
        duration: "1-2 Hours",
        calendlyUrl: "#",
        description: "A focused, high-impact session for leaders who need fast clarity on a specific AI or cloud architecture decision.",
        idealFor: [
          "Evaluating AI feasibility for a product or workflow",
          "Choosing between build vs. buy for an AI capability",
          "Getting a second opinion on an existing architecture",
          "Understanding LLM, RAG, or agentic workflow fit",
        ],
        outcome: "Walk away with a clear recommendation, decision framework, or validated direction — documented in a follow-up summary.",
        price: "$350 / Hour",
        accent: "from-gold/20 to-transparent",
      },
      {
        id: "deep-dive",
        title: "Deep Dive Session",
        duration: "3-7 Hours",
        calendlyUrl: "#",
        description: "An intensive working session to go deep on your AI system design, cloud architecture, or technical strategy.",
        idealFor: [
          "Designing a full AI system architecture end-to-end",
          "Auditing an underperforming AI system",
          "Planning an AWS/Azure migration or optimization",
          "Building a technical roadmap for a new AI product",
        ],
        outcome: "You receive a comprehensive architecture document covering system design, tech stack, data flow, cost estimates, and an execution-ready build plan for your engineering team.",
        price: "$400 / Hour",
        accent: "from-primary/20 to-transparent",
      },
    ]
  },
  directConnect: {
    headline: "Request Your Session",
    subtext: "If you know what you need or prefer to discuss your case directly, provide your details below.",
    nameLabel: "Full Name",
    emailLabel: "Email Address",
    phoneLabel: "Phone Number (Optional)",
    websiteLabel: "Corporate Website (Optional)",
    websitePlaceholder: "https://yourcompany.com",
    messageLabel: "How can I help?",
    messagePlaceholder: "Briefly describe your situation, what you are building, or what you need help with...",
    submit: "Request Session",
    submitting: "Sending...",
    successHeadline: "Request Sent.",
    successSubtext: "Your message has been received. I will be in touch shortly.",
  },
  inviteGate: {
    badge: "Restricted Access",
    headline: "Invitation Required",
    subtext: "Please enter your invitation code to access the platform.",
    placeholder: "Enter code...",
    buttonDefault: "Enter site",
    buttonVerifying: "Verifying...",
    errorInvalid: "Invalid invitation code",
    errorRequired: "Code is required"
  },
  assessment: {
    badge: "Assessment",
    headline1: "Assess your architecture.",
    headline2: "Get the right engagement.",
    subtext: "5 questions to identify your risk profile. Then a single AI-powered recommendation — the exact engagement, the exact reason, specific to your situation.",
  },
  finalCta: {
    headline: "If the architecture decision matters, it's worth getting it right before you build.",
    subtext: "If you are planning, fixing, or accelerating an AI or cloud initiative, we determine the optimal architectural direction and mitigate build risks fast.",
    cta: "Assess Your Case",
  },
  footer: {
    tagline: "CTO-level AI and cloud architecture consulting for businesses that need clarity before execution.",
    linkedinLabel: "View Fazal's LinkedIn Profile",
    termsLabel: "Terms of Use",
    privacyLabel: "Privacy Policy",
    copyright: "All rights reserved.",
  },
  sampleDeliverables: {
    badge: "Proof of Work",
    headline: "Sample Deliverables",
    subtext: "Every engagement produces clear, written outputs. Here's what that looks like.",
    blueprintCard: {
      title: "AI Architecture Blueprint",
      extract: "Sample Extract",
      useCaseLabel: "Use Case:",
      useCase: "AI-powered document intelligence system for enterprise workflows",
      stackItems: [
        "Frontend + API Gateway → Orchestration → AI Layer (LLM + RAG + Vector DB)",
        "PostgreSQL + S3 for structured/unstructured storage",
        "Query → Vector search → Context injection → Grounded LLM response",
      ],
      decisionsLabel: "Key Decisions",
      decisions: [
        "Use RAG over fine-tuning for early-stage flexibility",
        "Separate retrieval and generation layers for scalability",
        "Control cost via retrieval filtering and token optimization",
      ],
      outcome: "Outcome: Production-ready, scalable AI system with controlled cost and improved accuracy",
    },
    auditCard: {
      title: "AI System Audit Report",
      extract: "Sample Extract",
      systemLabel: "System:",
      system: "AI-powered search + recommendation engine",
      findings: [
        { title: "Incorrect Architecture", desc: "No retrieval layer → high hallucination risk", severity: "Critical" },
        { title: "Cost Inefficiency", desc: "2–4x higher infra cost than necessary", severity: "High" },
        { title: "Latency Bottleneck", desc: "3–6 second response time, no streaming", severity: "High" },
        { title: "Weak Data Pipeline", desc: "No structured indexing, reliance on raw prompts", severity: "Medium" },
      ],
      outcomeLabel: "Expected Outcome After Fix",
      stats: [
        { metric: "40–60%", label: "Cost Reduction" },
        { metric: "2–3x", label: "Faster Response" },
        { metric: "↑↑", label: "Output Relevance" },
      ],
    },
    workflowCard: {
      title: "AI Workflow Design — Business Process Automation",
      extract: "Sample Extract",
      useCaseLabel: "Use Case:",
      useCase: "Automating a multi-step seller onboarding and verification workflow",
      steps: [
        {
          label: "1. Document Intake",
          action: "LLM extraction + classification",
          output: "Output: Structured entity record",
        },
        {
          label: "2. Validation",
          action: "Rule engine + confidence scoring",
          output: "Output: Pass / flag / reject with reason",
        },
        {
          label: "3. Escalation",
          action: "Human-in-the-loop trigger",
          output: "Output: Routed review task",
        },
      ],
      outcome: "Outcome: 70% reduction in manual review load with full audit trail",
    },
  },
  assessmentWidget: {
    questions: [
      {
        category: "Build Stage",
        text: "Where are you in the build process right now?",
        options: [
          "We have an idea and are deciding what to build",
          "We have a rough design but development has not started",
          "We are actively building — some components are live",
          "We have a live system that is underperforming or expensive",
        ],
      },
      {
        category: "Technical Leadership",
        text: "Who is making the core architecture decisions on your team?",
        options: [
          "A CTO or senior architect with AI/cloud production experience",
          "A senior developer who is learning as we build",
          "Decisions are made by the founder or product team",
          "We are relying on a vendor or agency to decide for us",
        ],
      },
      {
        category: "Decision Clarity",
        text: "How clearly defined are your core architecture decisions right now?",
        options: [
          "All major decisions are documented and agreed",
          "Most decisions are made but a few key gaps remain",
          "Rough direction only — significant unknowns still open",
          "We are building without a clear architecture plan",
        ],
      },
      {
        category: "Risk Exposure",
        text: "What is the cost of getting the architecture wrong at this stage?",
        options: [
          "Low — we can pivot quickly, limited investment committed",
          "Moderate — a few months of work and some budget at stake",
          "High — significant engineering time and budget committed",
          "Critical — a wrong call would set us back 6+ months",
        ],
      },
      {
        category: "Primary Challenge",
        text: "What is your single biggest architecture concern right now?",
        options: [
          "Choosing the right AI approach — LLM, RAG, fine-tuning, or agentic",
          "Cloud infrastructure — scalability, cost, and reliability at production",
          "Existing system is broken — high cost, latency, or poor output quality",
          "We do not know what we do not know — need an expert second opinion",
        ],
      },
    ],
    phase2: {
      heading: "One more thing.",
      subheading: "Optional — but the analysis will be sharper.",
      label: "Briefly describe your situation.",
      placeholder: "What are you building? What decision are you stuck on? What has already been tried?",
      skip: "Skip — use my answers only",
      generate: "Generate My Assessment",
    },
    phase3: {
      heading: "Generating your assessment…",
      subheading: "Analysing your risk profile against the engagement framework.",
    },
    result: {
      riskLabel: "Risk Level",
      scoreLabel: "Risk Score",
      analysisLabel: "Assessment",
      topRiskLabel: "Primary Risk Identified",
      engagementLabel: "Recommended Engagement",
      reasonLabel: "Why this engagement",
      nextStepLabel: "Immediate next step",
      cta: "Request This Engagement",
      restart: "Re-take Assessment",
      errorLabel: "Something went wrong",
      retry: "Please try again.",
      fallbackHeading: "Assessment Unavailable",
      fallbackSubheading: "We couldn't generate your recommendation right now.",
      fallbackText: "Our AI service is temporarily unavailable. Your answers have been noted — share your details below and Fazal will personally review your situation and be in touch with a recommendation.",
      fallbackContext: "Assessment Follow-up",
    },
  },
  terms: {
    badge: "Legal",
    headline: "Terms of Use",
    lastUpdated: "Last updated: April 2026",
    sections: [
      {
        title: "1. Acceptance of Terms",
        content: "By accessing and using this website (fazalk.com), you accept and agree to be bound by these Terms of Use. If you do not agree to these terms, please do not use this website.",
      },
      {
        title: "2. Nature of Services",
        content: "This website provides information about CTO-level AI and cloud architecture consulting services offered by Fazal K. The content on this site is for informational purposes. Engagement for consulting services is subject to a separate consulting agreement.",
      },
      {
        title: "3. Intellectual Property",
        content: "All content on this website, including text, graphics, and assessments, is the intellectual property of Fazal K. and protected by applicable copyright laws. You may not reproduce, distribute, or create derivative works without express written permission.",
      },
      {
        title: "4. Assessment Tool",
        content: "The AI-powered architecture assessment tool on this website is provided as a value-added service. Results are generated by an AI model and are indicative only. They do not constitute professional consulting advice and should not be solely relied upon for technical or business decisions.",
      },
      {
        title: "5. Limitation of Liability",
        content: "To the fullest extent permitted by law, Fazal K. shall not be liable for any indirect, incidental, or consequential damages arising from the use of this website or its services. Total liability shall not exceed the fees paid for consulting services in the prior 3 months.",
      },
      {
        title: "6. Governing Law",
        content: "These terms are governed by the laws of the United Arab Emirates. Disputes shall be subject to the exclusive jurisdiction of the courts of Dubai, UAE.",
      },
      {
        title: "7. Changes to Terms",
        content: "We reserve the right to modify these terms at any time. Continued use of the website after changes constitutes your acceptance of the new terms.",
      },
      {
        title: "8. Contact",
        content: "For questions regarding these terms, please connect via the LinkedIn profile linked in the footer.",
      },
    ],
  },
  privacy: {
    badge: "Legal",
    headline: "Privacy Policy",
    lastUpdated: "Last updated: April 2026",
    sections: [
      {
        title: "1. Information We Collect",
        content: "When you use the assessment tool or contact form, we may collect your name, email address, phone number, and the information you provide as part of the assessment. We do not collect data through cookies or tracking scripts beyond what is standard for web analytics.",
      },
      {
        title: "2. How We Use Your Information",
        content: "Information you submit is used solely to review your assessment results, respond to your enquiry, and determine whether an engagement is appropriate. We do not sell, share, or rent your personal data to third parties.",
      },
      {
        title: "3. AI Assessment Data",
        content: "Responses submitted through the architecture assessment tool are processed by Anthropic's Claude API to generate a recommendation. Your responses are transmitted securely and are not stored by us beyond the session.",
      },
      {
        title: "4. Data Retention",
        content: "If you choose to submit your contact details after an assessment, this information may be retained in our CRM for up to 12 months for the purpose of follow-up communication. You may request deletion at any time.",
      },
      {
        title: "5. Security",
        content: "We implement industry-standard security measures to protect your personal information. All data transmission occurs over HTTPS. API keys and credentials are stored in secure environment variables and never exposed client-side.",
      },
      {
        title: "6. Your Rights",
        content: "Under applicable data protection laws (including GDPR for EU/UK visitors and PDPL for Saudi Arabia), you have the right to access, correct, or delete your personal data. To exercise these rights, please contact us via LinkedIn.",
      },
      {
        title: "7. Third-Party Services",
        content: "This website uses Anthropic's API for the assessment feature and Notion for lead capture. These services have their own privacy policies. We are not responsible for the data practices of these third parties.",
      },
      {
        title: "8. Changes to This Policy",
        content: "We may update this Privacy Policy periodically. The 'Last updated' date at the top of this page indicates when the most recent changes were made.",
      },
    ],
  },
};

export type Strings = typeof en;
