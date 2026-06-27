import { useRef } from "react";
import {
  motion,
  useSpring,
  useTransform,
  useReducedMotion,
  type MotionValue,
} from "framer-motion";
import { Link } from "react-router-dom";
import type { LucideIcon } from "lucide-react";

interface DockItemProps {
  mouseX: MotionValue<number>;
  to: string;
  label: string;
  icon: LucideIcon;
  active: boolean;
}

export function DockItem({ mouseX, to, label, icon: Icon, active }: DockItemProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();

  const distance = useTransform(mouseX, (x) => {
    const b = ref.current?.getBoundingClientRect() ?? { x: 0, width: 0 };
    return x - b.x - b.width / 2;
  });
  const sizeSync = useTransform(distance, [-170, 0, 170], [44, 62, 44]);
  const size = useSpring(sizeSync, { stiffness: 170, damping: 20, mass: 0.4 });
  const iconSync = useTransform(distance, [-170, 0, 170], [20, 30, 20]);
  const iconSize = useSpring(iconSync, { stiffness: 170, damping: 20, mass: 0.4 });

  const linkClass = `flex h-full w-full items-center justify-center rounded-xl transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
    active
      ? "bg-foreground/10 text-foreground"
      : "text-muted-foreground hover:bg-white/5 hover:text-foreground"
  }`;

  const tooltip = (
    <span className="pointer-events-none absolute left-1/2 top-full mt-2 -translate-x-1/2 whitespace-nowrap rounded-md border border-white/10 bg-card/90 px-2 py-1 text-xs text-foreground opacity-0 shadow-sm backdrop-blur-md transition-opacity duration-150 group-hover:opacity-100">
      {label}
    </span>
  );

  if (reduce) {
    return (
      <div className="group relative flex h-11 w-11 items-center justify-center">
        <Link to={to} aria-label={label} className={linkClass}>
          <Icon className="size-[20px]" />
        </Link>
        {tooltip}
      </div>
    );
  }

  return (
    <motion.div
      ref={ref}
      style={{ width: size, height: size }}
      className="group relative flex items-center justify-center"
    >
      <Link to={to} aria-label={label} className={linkClass}>
        <motion.span
          style={{ width: iconSize, height: iconSize }}
          className="flex items-center justify-center"
        >
          <Icon className="h-full w-full" strokeWidth={1.75} />
        </motion.span>
      </Link>
      {tooltip}
    </motion.div>
  );
}
