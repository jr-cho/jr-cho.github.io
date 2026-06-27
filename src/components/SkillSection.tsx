import { useState } from "react";
import SkillRow from "./helpers/SkillRow";
import TechIcon from "./helpers/TechIcon";
import { skillRows } from "@/data/tech";
import { LayoutGrid, List } from "lucide-react";

const SkillSection = () => {
  const [isInline, setIsInline] = useState(false);

  return (
    <section id="skills" className="w-full space-y-8">
      <div className="flex items-center justify-between">
        <p className="text-2xl font-light tracking-tight sm:text-3xl">
          Technologies
        </p>
        <button
          onClick={() => setIsInline(!isInline)}
          className="flex items-center gap-2 rounded-md border border-dashed border-border/70 bg-card px-2.5 py-1.5 text-xs font-light text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
          aria-pressed={isInline}
          title={isInline ? "Show animated rows" : "Show static grid"}
        >
          {isInline ? <LayoutGrid size={14} /> : <List size={14} />}
          {isInline ? "Animated" : "Grid"}
        </button>
      </div>

      {isInline ? (
        <div className="flex flex-col gap-5 pt-1">
          {skillRows.map((row) => (
            <div key={row.category} className="flex flex-col gap-2.5">
              <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground/70">
                {row.category}
              </p>
              <div className="flex flex-wrap gap-2 sm:gap-2.5">
                {row.items.map((skill) => (
                  <span
                    key={skill.name}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-border/60 bg-card px-2.5 py-1.5 text-sm font-light text-foreground transition-colors hover:border-border hover:bg-accent"
                  >
                    <TechIcon item={skill} className="h-4 w-4" />
                    {skill.name}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col gap-5">
          {skillRows.map((row) => (
            <div key={row.category} className="flex flex-col gap-2">
              <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground/70">
                {row.category}
              </p>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-linear-to-r from-background to-transparent" />
                <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-linear-to-l from-background to-transparent" />
                <SkillRow skills={row.items} direction={row.direction} />
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};

export default SkillSection;
