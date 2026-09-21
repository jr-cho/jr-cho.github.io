import SectionHeader from "./helpers/SectionHeader";
import { education } from "@/data/education";

const EducationSection = () => {
  return (
    <section id="education" className="w-full space-y-8">
      <SectionHeader eyebrow="B.S. · EXPECTED MAY 2027" title="Education" />
      <ol className="flex flex-col gap-3">
        {education.map(({ school, degree, detail, location, date }) => (
          <li
            key={school}
            className="glass-card flex flex-col gap-1 p-4 sm:flex-row sm:items-start sm:justify-between sm:gap-6 sm:p-5"
          >
            <div className="flex flex-col gap-1">
              <span className="text-base font-semibold tracking-tight sm:text-lg">
                {school}
              </span>
              <span className="text-sm font-light text-muted-foreground">
                {degree}
                {detail && <> · {detail}</>}
              </span>
            </div>
            <div className="flex shrink-0 flex-row gap-2 font-mono text-[11px] uppercase tracking-widest text-muted-foreground sm:flex-col sm:items-end sm:gap-1 sm:pt-1">
              <span className="text-foreground/80">{date}</span>
              <span className="text-muted-foreground/40 sm:hidden">·</span>
              <span>{location}</span>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
};

export default EducationSection;
