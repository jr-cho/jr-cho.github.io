import { useRef, type ReactNode } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";

type DriftProps = {
  children: ReactNode;
  // Pixels moved across the element's pass through the viewport.
  // Positive drifts down (feels farther away), negative drifts up (closer).
  distance?: number;
  className?: string;
};

// Moves its children at a different speed from the page while in view.
const Drift = ({ children, distance = 60, className }: DriftProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [-distance / 2, distance / 2]);

  return (
    <motion.div ref={ref} style={{ y: reduce ? 0 : y }} className={className}>
      {children}
    </motion.div>
  );
};

export default Drift;
