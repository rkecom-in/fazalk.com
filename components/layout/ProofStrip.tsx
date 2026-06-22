import { useGlobalUX } from "@/components/providers/GlobalUXProvider";

const ProofStrip = () => {
  const { t } = useGlobalUX();
  const s = t.proofStrip;

  return (
    <section className="py-14 border-y border-border bg-card/40">
      <div className="container mx-auto px-6 max-w-3xl text-center">
        <p className="text-sm font-semibold text-gold tracking-widest uppercase mb-4">{s.badge}</p>
        <p className="text-base md:text-lg text-muted-foreground leading-relaxed">{s.text}</p>
      </div>
    </section>
  );
};

export default ProofStrip;
