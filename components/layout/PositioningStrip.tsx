import { Brain, Cloud, Search, Workflow, UserCheck } from "lucide-react";
import { useGlobalUX } from "@/components/providers/GlobalUXProvider";

const icons = [Brain, Cloud, Search, Workflow, UserCheck];

const PositioningStrip = () => {
  const { t } = useGlobalUX();
  const items = t.positioningStrip.items;

  return (
    <section className="relative py-8 border-y border-border bg-card/50">
      <div className="container mx-auto px-6">
        <div className="flex flex-wrap justify-center gap-x-10 gap-y-4">
          {items.map((label, i) => {
            const Icon = icons[i % icons.length];
            return (
              <div key={label} className="flex items-center gap-2.5 text-muted-foreground">
                <Icon className="w-4 h-4 text-gold flex-shrink-0" />
                <span className="text-sm font-medium whitespace-nowrap">{label}</span>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default PositioningStrip;
