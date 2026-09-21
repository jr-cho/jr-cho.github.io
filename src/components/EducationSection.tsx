import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { education, type EducationEntry } from "@/data/education";
import Drift from "./helpers/Drift";
import { shell } from "@/lib/layout";
import { cn } from "@/lib/utils";

// One school: the divider draws across, then the row slides in from the right.
// Both follow scroll position, so they play forward and back.
const SchoolRow = ({ school, degree, detail, location, date }: EducationEntry) => {
  const ref = useRef<HTMLLIElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "start 0.7"] });
  const line = useTransform(scrollYProgress, [0, 0.6], [reduce ? 1 : 0, 1]);
  const x = useTransform(scrollYProgress, [0.1, 1], [reduce ? 0 : 60, 0]);
  const opacity = useTransform(scrollYProgress, [0.1, 0.9], [reduce ? 1 : 0, 1]);

  return (
    <li ref={ref} className="relative">
      <motion.span
        aria-hidden="true"
        style={{ scaleX: line }}
        className="absolute inset-x-0 top-0 h-px origin-left bg-border"
      />
      <motion.div
        style={{ x, opacity }}
        className="grid grid-cols-1 gap-1 py-5 sm:grid-cols-[1fr_auto] sm:gap-6"
      >
        <div>
          <p className="text-[17px] font-semibold tracking-[-0.01em]">{school}</p>
          <p className="text-[15px] text-muted-foreground">
            {degree}
            {detail && <>, {detail}</>}
          </p>
        </div>
        <p className="font-mono text-xs uppercase tracking-wider text-muted-foreground sm:pt-1 sm:text-right">
          {date}
          <br className="hidden sm:block" />
          <span className="sm:hidden"> · </span>
          {location}
        </p>
      </motion.div>
    </li>
  );
};

// The heading drifts up faster than the rows, which sit farther back.
const EducationSection = () => {
  return (
    <div className={cn(shell, "grid grid-cols-1 gap-10 md:grid-cols-12")}>
      <Drift distance={-80} className="md:col-span-4">
        <h2 className="font-serif text-[clamp(1.75rem,2.6vw,2.25rem)] leading-[1.1]">Education</h2>
      </Drift>
      <ol className="border-b border-border md:col-span-8">
        {education.map((entry) => (
          <SchoolRow key={entry.school} {...entry} />
        ))}
      </ol>
    </div>
  );
};

export default EducationSection;
