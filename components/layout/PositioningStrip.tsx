import { Brain, Cloud, Search, Workflow, UserCheck } from "lucide-react";

const items = [
  { icon: Brain, label: "AI System Design (LLMs, RAG, Agentic)" },
  { icon: Cloud, label: "AWS & Azure Architecture" },
  { icon: Search, label: "AI System Audits & Fix Plans" },
  { icon: Workflow, label: "AI Automation Workflow Design" },
  { icon: UserCheck, label: "Short-Term CTO Advisory" },
];

const PositioningStrip = () => {
  return (
    <section className="relative py-8 border-y border-border bg-card/50">
      <div className="container mx-auto px-6">
        <div className="flex flex-wrap justify-center gap-x-10 gap-y-4">
          {items.map((item) => (
            <div key={item.label} className="flex items-center gap-2.5 text-muted-foreground">
              <item.icon className="w-4 h-4 text-gold flex-shrink-0" />
              <span className="text-sm font-medium whitespace-nowrap">{item.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PositioningStrip;
