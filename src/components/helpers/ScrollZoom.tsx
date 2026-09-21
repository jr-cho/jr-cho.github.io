import { useRef, type ReactNode } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";

type ScrollZoomProps = {
  children: ReactNode;
  // Scale when the element's top reaches the bottom of the viewport.
  // It grows to full size by the time its center reaches the viewport center.
  from?: number;
  className?: string;
};

// Grows its children to full size as they scroll into view, so the eye
// lands on them. Tied to scroll position, so it reverses on the way back.
const ScrollZoom = ({ children, from = 0.85, className }: ScrollZoomProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "center center"] });
  const scale = useTransform(scrollYProgress, [0, 1], [from, 1]);

  return (
    <motion.div ref={ref} style={{ scale: reduce ? 1 : scale }} className={className}>
      {children}
    </motion.div>
  );
};

export default ScrollZoom;
