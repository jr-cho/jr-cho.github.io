import type { Variants } from "framer-motion";

export const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.1,
    },
  },
};

export const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: [0.21, 0.47, 0.32, 0.98],
    },
  },
};

export const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" },
  },
};

// Tight mechanical spring — engineered, not organic
export const springSnap = {
  type: "spring" as const,
  stiffness: 280,
  damping: 22,
};

// Page-level fade + scale transition
export const pageVariants: Variants = {
  initial: { opacity: 0, scale: 0.98 },
  animate: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.22, ease: [0.16, 1, 0.3, 1] },
  },
  exit: {
    opacity: 0,
    scale: 0.97,
    transition: { duration: 0.15, ease: "easeIn" },
  },
};

// Parent container that staggers children on scroll
export const staggerGrid: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.05 },
  },
};

// Child item for stagger grids
export const cardReveal: Variants = {
  hidden: { opacity: 0, y: 18 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.35, ease: [0.16, 1, 0.3, 1] },
  },
};

// Cinematic easings
export const easeOutExpo = [0.16, 1, 0.3, 1] as const;
export const easeOutBack = [0.34, 1.56, 0.64, 1] as const;

// Section reveal — blur + scale + lift (the "cinematic" feel)
export const revealVariants: Variants = {
  hidden: { opacity: 0, y: 28, scale: 0.965, filter: "blur(8px)" },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    filter: "blur(0px)",
    transition: { duration: 0.7, ease: easeOutExpo },
  },
};

// Route transition — depth push
export const pageDepthVariants: Variants = {
  initial: { opacity: 0, scale: 0.97, filter: "blur(6px)" },
  animate: {
    opacity: 1,
    scale: 1,
    filter: "blur(0px)",
    transition: { duration: 0.45, ease: easeOutExpo },
  },
  exit: {
    opacity: 0,
    scale: 1.02,
    filter: "blur(6px)",
    transition: { duration: 0.25, ease: "easeIn" },
  },
};

// Intro overlay
export const introStagger: Variants = {
  hidden: { opacity: 1 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.12, delayChildren: 0.2 },
  },
};
export const introItem: Variants = {
  hidden: { opacity: 0, y: 16, filter: "blur(10px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.6, ease: easeOutExpo },
  },
};
