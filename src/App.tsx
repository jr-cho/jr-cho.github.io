import Hero from "./components/Hero";
import SkillSection from "./components/SkillSection";
import { Reveal } from "./components/helpers/Reveal";
import { lazy, Suspense } from "react";
import { motion } from "framer-motion";
import { pageDepthVariants } from "./lib/motionVariants";

const ProjectSection = lazy(() => import("./components/ProjectSection"));
const Stats = lazy(() => import("./components/Stats"));

const App = () => {
  return (
    <motion.div
      className="min-h-screen bg-transparent text-foreground flex flex-col relative"
      variants={pageDepthVariants}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      <div className="relative z-10 flex flex-col flex-1">
        <main className="mx-auto flex w-full max-w-3xl flex-col gap-20 px-6 pb-6 sm:gap-20 sm:pb-20 overflow-x-hidden">
          <Hero />
          <Reveal>
            <SkillSection />
          </Reveal>
          <Suspense fallback={<div className="h-40 animate-pulse bg-white/5 rounded-2xl" />}>
            <Reveal>
              <ProjectSection />
            </Reveal>
          </Suspense>
          <Suspense fallback={<div className="h-40 animate-pulse bg-white/5 rounded-2xl" />}>
            <Reveal>
              <Stats />
            </Reveal>
          </Suspense>
        </main>
      </div>
    </motion.div>
  );
};

export default App;
