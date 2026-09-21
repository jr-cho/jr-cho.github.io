import { createContext, useContext, useRef, type ReactNode } from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { cn } from "@/lib/utils";

type SceneContextValue = {
  // 0 → 1 while the scene's top travels from the viewport bottom to the top.
  enter: MotionValue<number>;
  // 0 → 1 while the scene's bottom travels from the viewport bottom to the top.
  exit: MotionValue<number>;
  reduce: boolean;
};

const SceneContext = createContext<SceneContextValue | null>(null);

// Scroll progress of the nearest Scene, for elements that animate with it.
// eslint-disable-next-line react-refresh/only-export-components
export function useScene() {
  const ctx = useContext(SceneContext);
  if (!ctx) throw new Error("useScene must be used inside <Scene>");
  return ctx;
}

type SceneProps = {
  children: ReactNode;
  id?: string;
  // Stacking order. Later scenes get higher layers so they slide over earlier ones.
  layer: number;
  tone?: "light" | "dark";
  className?: string;
};

// One section of the page. As it scrolls away, its content sinks and dims
// while the next scene, on a higher layer, slides up over it.
const Scene = ({ children, id, layer, tone = "light", className }: SceneProps) => {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion() ?? false;
  const { scrollYProgress: enter } = useScroll({ target: ref, offset: ["start end", "start start"] });
  const { scrollYProgress: exit } = useScroll({ target: ref, offset: ["end end", "end start"] });

  const y = useTransform(exit, [0, 1], [0, reduce ? 0 : 220]);
  const opacity = useTransform(exit, [0, 1], [1, reduce ? 1 : 0.25]);
  const scale = useTransform(exit, [0, 1], [1, reduce ? 1 : 0.96]);

  return (
    <SceneContext.Provider value={{ enter, exit, reduce }}>
      <section
        ref={ref}
        id={id}
        style={{ zIndex: layer }}
        className={cn(
          "relative",
          tone === "dark" ? "bg-[#0A0A0A] text-white dark:bg-[#171717]" : "bg-background",
        )}
      >
        <motion.div style={{ y, opacity, scale }} className={cn("origin-top", className)}>
          {children}
        </motion.div>
      </section>
    </SceneContext.Provider>
  );
};

export default Scene;
