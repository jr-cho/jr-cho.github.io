import Hero from "./components/Hero";
import SkillSection from "./components/SkillSection";
import EducationSection from "./components/EducationSection";
import Scene from "./components/helpers/Scene";
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
      <title>Joshua Gottus · Embedded Software Engineer</title>
      <div className="relative z-10 flex flex-col flex-1">
        <main className="flex w-full flex-col overflow-x-clip">
          <Hero />
          <Scene id="projects" layer={3} className="py-28 sm:py-40">
            <Suspense fallback={<div className="h-96" />}>
              <ProjectSection />
            </Suspense>
          </Scene>
          <Scene id="skills" layer={4} className="py-28 sm:py-40">
            <SkillSection />
          </Scene>
          <Scene id="education" layer={5} className="py-24 sm:py-32">
            <EducationSection />
          </Scene>
          <Scene id="stats" layer={6} className="pt-24 pb-40 sm:pt-32 sm:pb-52">
            <Suspense fallback={<div className="h-40" />}>
              <Stats />
            </Suspense>
          </Scene>
        </main>
      </div>
    </motion.div>
  );
};

export default App;
