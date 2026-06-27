import { useRef } from "react";
import {
  motion,
  useSpring,
  useTransform,
  useReducedMotion,
  type MotionValue,
} from "framer-motion";

interface DockItemProps {
  mouseX: MotionValue<number>;
  children: React.ReactNode;
}

export function DockItem({ mouseX, children }: DockItemProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();

  const distance = useTransform(mouseX, (x) => {
    const b = ref.current?.getBoundingClientRect() ?? { x: 0, width: 0 };
    return x - b.x - b.width / 2;
  });
  const sizeSync = useTransform(distance, [-160, 0, 160], [44, 62, 44]);
  const size = useSpring(sizeSync, { stiffness: 170, damping: 20, mass: 0.4 });

  if (reduce) {
    return (
      <div className="flex h-11 w-11 items-center justify-center">
        {children}
      </div>
    );
  }

  return (
    <motion.div
      ref={ref}
      style={{ width: size, height: size }}
      className="flex items-center justify-center"
    >
      {children}
    </motion.div>
  );
}
