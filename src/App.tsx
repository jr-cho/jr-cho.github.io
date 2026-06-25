import Hero from "./components/Hero";
import SkillSection from "./components/SkillSection";
import { FadeIn } from "./components/helpers/FadeIn";
import { lazy, Suspense } from "react";
import QuoteSection from "./components/QuoteSection";
import { motion } from "framer-motion";
import { pageVariants } from "./lib/motionVariants";

const ProjectSection = lazy(() => import("./components/ProjectSection"));
const Stats = lazy(() => import("./components/Stats"));

const App = () => {
  return (
    <motion.div
      className="min-h-screen bg-transparent text-foreground flex flex-col relative"
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      <div className="relative z-10 flex flex-col flex-1">
        <main className="mx-auto flex w-full max-w-3xl flex-col gap-20 px-6 pb-6 sm:gap-20 sm:pb-20 overflow-x-hidden">
          <Hero />
          <FadeIn>
            <SkillSection />
          </FadeIn>
          <Suspense fallback={<div className="h-40 animate-pulse bg-white/5 rounded-2xl" />}>
            <FadeIn>
              <ProjectSection />
            </FadeIn>
          </Suspense>
          <Suspense fallback={<div className="h-40 animate-pulse bg-white/5 rounded-2xl" />}>
            <FadeIn>
              <Stats />
            </FadeIn>
          </Suspense>
          <Suspense fallback={<div className="h-24 animate-pulse bg-white/5 rounded-2xl" />}>
            <FadeIn>
              <QuoteSection />
            </FadeIn>
          </Suspense>
        </main>
      </div>
    </motion.div>
  );
};

export default App;
