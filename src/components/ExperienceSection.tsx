import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform, type MotionValue } from "framer-motion";
import { experience, type Role } from "@/data/experience";
import type { MediaSlot } from "@/data/media";
import Drift from "./helpers/Drift";
import ParallaxFrame from "./helpers/ParallaxFrame";
import { shell } from "@/lib/layout";
import { cn } from "@/lib/utils";

// One role: the divider draws across, the header slides in, then each point
// fades up in turn. All of it follows scroll position, forward and back.
// Each tile drifts at its own speed, so the row has depth as it scrolls.
const TILE_DRIFT = [-40, 40, -80];
const COLUMNS = 3;

// A tile that wipes open from the bottom while its picture settles from a
// zoom. Tiles open in turn, left to right, then row by row. Tied to scroll,
// so it closes again on the way back up.
const RevealTile = ({ slot, index, progress }: { slot: MediaSlot; index: number; progress: MotionValue<number> }) => {
  const reduce = useReducedMotion();
  const col = index % COLUMNS;
  const row = Math.floor(index / COLUMNS);
  const start = row * 0.3 + col * 0.1;
  const end = start + 0.45;
  const clipPath = useTransform(progress, [start, end], ["inset(100% 0% 0% 0%)", "inset(0% 0% 0% 0%)"]);
  const scale = useTransform(progress, [start, end], [1.25, 1]);
  const y = useTransform(progress, [start, end], [60, 0]);

  if (reduce) return <ParallaxFrame slot={slot} speed={6} />;
  return (
    <motion.div style={{ clipPath, y }} className="overflow-hidden rounded-lg">
      <motion.div style={{ scale }} className="origin-bottom">
        <ParallaxFrame slot={slot} speed={6} />
      </motion.div>
    </motion.div>
  );
};

// The tile grid. Its own scroll position drives every tile's reveal.
const TileGrid = ({ media }: { media: MediaSlot[] }) => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end 0.85"] });

  return (
    <div ref={ref} className="grid grid-cols-3 gap-3 pb-10 sm:gap-4">
      {media.map((slot, i) => (
        <Drift key={slot.src} distance={TILE_DRIFT[i % TILE_DRIFT.length]}>
          <RevealTile slot={slot} index={i} progress={scrollYProgress} />
        </Drift>
      ))}
    </div>
  );
};

const RoleRow = ({ title, org, date, points, media }: Role) => {
  const ref = useRef<HTMLLIElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "center 0.6"] });
  const line = useTransform(scrollYProgress, [0, 0.3], [reduce ? 1 : 0, 1]);
  const x = useTransform(scrollYProgress, [0.05, 0.4], [reduce ? 0 : 60, 0]);
  const opacity = useTransform(scrollYProgress, [0.05, 0.35], [reduce ? 1 : 0, 1]);

  return (
    <li ref={ref} className="relative">
      <motion.span
        aria-hidden="true"
        style={{ scaleX: line }}
        className="absolute inset-x-0 top-0 h-px origin-left bg-border"
      />
      <motion.div
        style={{ x, opacity }}
        className="grid grid-cols-1 gap-1 pt-6 pb-4 sm:grid-cols-[1fr_auto] sm:gap-6"
      >
        <div>
          <p className="text-[17px] font-semibold tracking-[-0.01em]">{title}</p>
          <p className="text-[15px] text-muted-foreground">{org}</p>
        </div>
        <p className="font-mono text-xs uppercase tracking-wider text-muted-foreground sm:pt-1 sm:text-right">{date}</p>
      </motion.div>
      <ul className="max-w-[62ch] pb-6">
        {points.map((point, i) => (
          <Point key={point} text={point} progress={scrollYProgress} index={i} count={points.length} />
        ))}
      </ul>
      {media && media.length > 0 && <TileGrid media={media} />}
    </li>
  );
};

type PointProps = {
  text: string;
  progress: ReturnType<typeof useScroll>["scrollYProgress"];
  index: number;
  count: number;
};

// Points appear one after another across the second half of the row's pass.
const Point = ({ text, progress, index, count }: PointProps) => {
  const reduce = useReducedMotion();
  const start = 0.3 + (index / count) * 0.6;
  const opacity = useTransform(progress, [start, start + 0.12], [reduce ? 1 : 0.15, 1]);
  const y = useTransform(progress, [start, start + 0.12], [reduce ? 0 : 12, 0]);

  return (
    <motion.li
      style={{ opacity, y }}
      className="grid grid-cols-[1.25rem_1fr] py-1.5 text-[16px] leading-[1.5]"
    >
      <span aria-hidden="true" className="text-muted-foreground">–</span>
      {text}
    </motion.li>
  );
};

// The heading drifts up faster than the roles, which sit farther back.
const ExperienceSection = () => (
  <div className={cn(shell, "grid grid-cols-1 gap-10 md:grid-cols-12")}>
    <Drift distance={-80} className="md:col-span-4">
      <h2 className="font-serif text-[clamp(1.75rem,2.6vw,2.25rem)] leading-[1.1]">Experience</h2>
    </Drift>
    <ol className="border-b border-border md:col-span-8">
      {experience.map((role) => (
        <RoleRow key={role.title + role.date} {...role} />
      ))}
    </ol>
  </div>
);

export default ExperienceSection;
