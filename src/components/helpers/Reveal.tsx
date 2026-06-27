import { motion, useReducedMotion, type HTMLMotionProps } from "framer-motion";
import { revealVariants } from "@/lib/motionVariants";

interface RevealProps extends HTMLMotionProps<"div"> {
  delay?: number;
}

export function Reveal({ children, delay = 0, className, ...props }: RevealProps) {
  const reduce = useReducedMotion();
  if (reduce)
    return <div className={className}>{children as React.ReactNode}</div>;
  return (
    <motion.div
      variants={revealVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-60px" }}
      transition={{ delay }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
}
