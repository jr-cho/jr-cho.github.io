import type { Variants } from "framer-motion";

// Fast start, long soft landing
export const easeOutExpo = [0.16, 1, 0.3, 1] as const;

export const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.05 },
  },
};

// Display line: slides up from behind a mask
export const maskLine: Variants = {
  hidden: { y: "105%" },
  visible: { y: "0%", transition: { duration: 1, ease: easeOutExpo } },
};

export const itemVariants: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: easeOutExpo },
  },
};

// Parent container that staggers children on scroll
export const staggerGrid: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.05 },
  },
};

// Child item for stagger grids
export const cardReveal: Variants = {
  hidden: { opacity: 0, y: 32 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.9, ease: easeOutExpo },
  },
};

// Section reveal: fade and lift
export const revealVariants: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.9, ease: easeOutExpo },
  },
};

// Route transition: plain fade
export const pageDepthVariants: Variants = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 0.4, ease: easeOutExpo } },
  exit: { opacity: 0, transition: { duration: 0.2, ease: "easeIn" } },
};
