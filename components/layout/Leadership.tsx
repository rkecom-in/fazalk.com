import { useGlobalUX } from "@/components/providers/GlobalUXProvider";
import { LinkedInIcon } from "@/components/ui/icons";

const Leadership = () => {
  const { t } = useGlobalUX();
  const s = t.leadership;

  return (
    <section className="py-24 bg-card/30 border-y border-border">
      <div className="container mx-auto px-6 max-w-4xl">
        <p className="text-sm font-semibold text-gold tracking-widest uppercase mb-4 text-center">{s.badge}</p>
        <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-12 text-center font-serif">
          {s.headline}
        </h2>

        <div className="grid md:grid-cols-2 gap-6">
          {s.people.map((person) => (
            <div key={person.name} className="rounded-xl bg-card border border-border/50 p-7 flex flex-col">
              <h3 className="text-xl font-semibold text-foreground font-serif">{person.name}</h3>
              <p className="text-sm font-medium text-gold tracking-wide mb-4">{person.title}</p>
              <p className="text-muted-foreground leading-relaxed flex-1">{person.bio}</p>
              {person.linkedin && (
                <a
                  href={person.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-5 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-gold transition-colors"
                >
                  <LinkedInIcon className="w-4 h-4" />
                  LinkedIn
                </a>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Leadership;
