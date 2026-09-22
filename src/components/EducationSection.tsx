import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { education, type EducationEntry } from "@/data/education";
import Drift from "./helpers/Drift";
import { shell } from "@/lib/layout";
import { cn } from "@/lib/utils";

// Row states shared by the text: plain by default, white over the photo
// on hover, and always over the photo on touch screens (no hover there).
const onPhoto = "transition-colors duration-500 group-hover:text-white pointer-coarse:text-white";
const onPhotoMuted =
  "text-muted-foreground transition-colors duration-500 group-hover:text-white/75 pointer-coarse:text-white/75";

// One school: the divider draws across, then the row slides in from the right.
// Both follow scroll position, so they play forward and back. Hovering the
// row wipes the school's campus photo across it.
const SchoolRow = ({ school, degree, detail, location, date, image }: EducationEntry) => {
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
        className="group relative -mx-4 grid grid-cols-1 gap-1 overflow-hidden rounded-lg px-4 py-6 sm:grid-cols-[1fr_auto] sm:gap-6"
      >
        {image && (
          <div
            aria-hidden="true"
            className="absolute inset-0 [clip-path:inset(0_100%_0_0)] transition-[clip-path] duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:[clip-path:inset(0_0_0_0)] pointer-coarse:[clip-path:inset(0_0_0_0)] motion-reduce:transition-none"
          >
            <img
              src={`${import.meta.env.BASE_URL}${image.replace(/^\//, "")}`}
              alt=""
              loading="lazy"
              className="h-full w-full scale-110 object-cover transition-transform duration-1000 ease-out group-hover:scale-100 motion-reduce:transition-none"
            />
            {/* Darker on the left, where the text sits */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-black/40" />
          </div>
        )}
        <div className="relative">
          <p className={cn("text-[17px] font-semibold tracking-[-0.01em]", onPhoto)}>{school}</p>
          <p className={cn("text-[15px]", onPhotoMuted)}>
            {degree}
            {detail && <>, {detail}</>}
          </p>
        </div>
        <p className={cn("relative font-mono text-xs uppercase tracking-wider sm:pt-1 sm:text-right", onPhotoMuted)}>
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
