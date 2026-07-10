import { useGlobalUX } from "@/components/providers/GlobalUXProvider";

const CompanySection = () => {
  const { t } = useGlobalUX();
  const s = t.company;

  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-6 max-w-3xl">
        <p className="text-sm font-semibold text-gold tracking-widest uppercase mb-4">{s.badge}</p>
        <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6 font-serif leading-tight">
          {s.headline}
        </h2>
        <p className="text-lg text-muted-foreground leading-relaxed mb-10">{s.body}</p>

        {/* Entity-signal facts strip — verbatim canonical facts */}
        <div className="rounded-xl bg-card border border-border/50 p-6">
          <dl className="flex flex-wrap gap-x-6 gap-y-4">
            {s.facts.map((fact) => (
              <div key={fact.label} className="flex flex-col">
                <dt className="text-xs uppercase tracking-widest text-muted-foreground/70 mb-1">
                  {fact.label}
                </dt>
                <dd className="text-sm font-medium text-foreground/90">{fact.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
};

export default CompanySection;
