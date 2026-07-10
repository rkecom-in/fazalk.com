import { useGlobalUX } from "@/components/providers/GlobalUXProvider";

const TrackRecord = () => {
  const { t } = useGlobalUX();
  const s = t.track;

  return (
    <section className="py-24 bg-card/30 border-y border-border">
      <div className="container mx-auto px-6 max-w-3xl">
        <p className="text-sm font-semibold text-gold tracking-widest uppercase mb-4">{s.badge}</p>
        <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6 font-serif leading-tight">
          {s.headline}
        </h2>
        <p className="text-lg text-muted-foreground leading-relaxed">{s.body}</p>
      </div>
    </section>
  );
};

export default TrackRecord;
