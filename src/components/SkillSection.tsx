import TechIcon from "./helpers/TechIcon";
import SectionHeader from "./helpers/SectionHeader";
import { skillRows } from "@/data/tech";

const SkillSection = () => {
  const techCount = skillRows.reduce((sum, row) => sum + row.items.length, 0);

  return (
    <section id="skills" className="w-full space-y-8">
      <SectionHeader eyebrow={`${techCount} TECHNOLOGIES`} title="Technical Skills" />

      <dl className="flex flex-col gap-6">
        {skillRows.map((row) => (
          <div
            key={row.category}
            className="grid gap-2.5 sm:grid-cols-[11rem_1fr] sm:gap-6"
          >
            <dt className="font-mono text-xs font-medium uppercase tracking-widest text-muted-foreground sm:pt-2">
              {row.category}
            </dt>
            <dd className="flex flex-wrap gap-2">
              {row.items.map((skill) => (
                <span
                  key={skill.name}
                  className="group inline-flex items-center gap-1.5 rounded-md border border-border bg-card px-2.5 py-1.5 text-sm text-foreground transition-colors hover:border-foreground/25"
                >
                  <TechIcon item={skill} className="h-4 w-4" />
                  {skill.name}
                </span>
              ))}
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
};

export default SkillSection;
