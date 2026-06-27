import {
  motion,
  useScroll,
  useTransform,
  useReducedMotion,
} from "framer-motion";

export default function AmbientBackground() {
  const reduce = useReducedMotion();
  const { scrollY } = useScroll();
  const drift = useTransform(scrollY, [0, 1200], [0, reduce ? 0 : 120]);

  return (
    <motion.div
      style={{ y: drift }}
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
      aria-hidden="true"
    >
      {/* Blob 1 — top-right — soft lavender/indigo — 25s cycle */}
      <motion.div
        className="absolute -top-60 -right-60 h-[800px] w-[800px] rounded-full"
        style={{
          background:
            "radial-gradient(circle, var(--blob-1) 0%, transparent 65%)",
        }}
        animate={{ scale: [1, 1.08, 1], x: [0, 30, 0], y: [0, -20, 0] }}
        transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
      />
      {/* Blob 2 — center-left — pale blue/navy — 20s cycle, 7s offset */}
      <motion.div
        className="absolute top-1/3 -left-60 h-[700px] w-[700px] rounded-full"
        style={{
          background:
            "radial-gradient(circle, var(--blob-2) 0%, transparent 65%)",
        }}
        animate={{ scale: [1, 1.06, 1], x: [0, -25, 0], y: [0, 35, 0] }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 7,
        }}
      />
      {/* Blob 3 — bottom-center — teal/purple — 28s cycle, 14s offset */}
      <motion.div
        className="absolute -bottom-40 left-1/3 h-[600px] w-[600px] rounded-full"
        style={{
          background:
            "radial-gradient(circle, var(--blob-3) 0%, transparent 65%)",
        }}
        animate={{ scale: [1, 1.1, 1], x: [0, 20, 0], y: [0, 20, 0] }}
        transition={{
          duration: 28,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 14,
        }}
      />
    </motion.div>
  );
}
