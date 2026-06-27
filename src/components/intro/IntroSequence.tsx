import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { introStagger, introItem, easeOutExpo } from "@/lib/motionVariants";
import { useIntro } from "@/providers/intro-context";

export default function IntroSequence() {
  const { done, finish } = useIntro();
  const [show, setShow] = useState(true);

  useEffect(() => {
    if (done) return;
    const dismiss = () => setShow(false);
    const timer = window.setTimeout(dismiss, 2200);
    window.addEventListener("wheel", dismiss, { passive: true });
    window.addEventListener("touchstart", dismiss, { passive: true });
    window.addEventListener("keydown", dismiss);
    window.addEventListener("pointerdown", dismiss);
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("wheel", dismiss);
      window.removeEventListener("touchstart", dismiss);
      window.removeEventListener("keydown", dismiss);
      window.removeEventListener("pointerdown", dismiss);
    };
  }, [done]);

  if (done) return null;

  return (
    <AnimatePresence onExitComplete={finish}>
      {show && (
        <motion.div
          aria-hidden="true"
          className="fixed inset-0 z-[100] flex items-center justify-center overflow-hidden bg-background"
          variants={introStagger}
          initial="hidden"
          animate="visible"
          exit={{
            opacity: 0,
            scale: 1.05,
            filter: "blur(8px)",
            transition: { duration: 0.6, ease: easeOutExpo },
          }}
        >
          {/* Apple-Blue blob bloom */}
          <motion.div
            aria-hidden="true"
            className="pointer-events-none absolute h-[640px] w-[640px] rounded-full"
            style={{
              background:
                "radial-gradient(circle, var(--blob-1) 0%, transparent 65%)",
            }}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1.2, ease: easeOutExpo }}
          />

          <motion.h1
            variants={introItem}
            className="relative text-4xl font-light tracking-tight text-foreground sm:text-5xl"
          >
            @jr-cho
          </motion.h1>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
