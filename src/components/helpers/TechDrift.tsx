import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform, type MotionValue } from "framer-motion";
import type { TechItem } from "@/data/tech";
import { cn } from "@/lib/utils";

// Repeat a row's icons enough times to span twice the widest screen.
const COPIES = 6;

const DriftRow = ({
  items,
  progress,
  direction,
  active,
}: {
  items: TechItem[];
  progress: MotionValue<number>;
  direction: 1 | -1;
  active: boolean;
}) => {
  const reduce = useReducedMotion();
  const x = useTransform(
    progress,
    [0, 1],
    reduce ? ["-25%", "-25%"] : direction === 1 ? ["-40%", "-10%"] : ["-10%", "-40%"],
  );
  const icons = items.filter((t) => t.icon);

  return (
    <motion.div
      style={{ x }}
      className={cn(
        "flex w-max gap-16 transition-opacity duration-500 sm:gap-24",
        active ? "opacity-[0.08]" : "opacity-[0.04]",
      )}
    >
      {Array.from({ length: COPIES }, (_, copy) =>
        icons.map((t) => (
          <svg
            key={`${copy}-${t.name}`}
            viewBox="0 0 24 24"
            className="size-14 shrink-0 fill-current sm:size-20"
          >
            <path d={t.icon!.path} />
          </svg>
        )),
      )}
    </motion.div>
  );
};

// Faint rows of tool icons behind a section, one row per category.
// Scrolling slides each row sideways, alternating direction.
// The active category's row brightens a little. Pass -1 for none.
const TechDrift = ({ rows, active = -1 }: { rows: TechItem[][]; active?: number }) => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className="pointer-events-none absolute inset-y-0 -z-10 left-1/2 flex w-screen -translate-x-1/2 flex-col justify-around overflow-hidden"
    >
      {rows.map((items, i) => (
        <DriftRow
          key={i}
          items={items}
          progress={scrollYProgress}
          direction={i % 2 === 0 ? 1 : -1}
          active={i === active}
        />
      ))}
    </div>
  );
};

export default TechDrift;
