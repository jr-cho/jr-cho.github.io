import ProjectCard from "@/components/ProjectCard";
import { projects } from "@/data/projects";
import { useNavigate } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import { Reveal } from "@/components/helpers/Reveal";
import { motion } from "framer-motion";
import { staggerGrid, cardReveal, pageDepthVariants } from "@/lib/motionVariants";

const Projects = () => {
  const navigate = useNavigate();

  return (
    <motion.main
      className="mx-auto flex w-full max-w-3xl flex-col px-6 pt-10 pb-12 sm:px-8 sm:pt-20 sm:pb-24 space-y-8"
      variants={pageDepthVariants}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      <Reveal>
        <button
          onClick={() => navigate("/")}
          className="flex w-fit items-center gap-3 text-md font-light tracking-tight text-muted-foreground cursor-pointer duration-200 hover:text-foreground"
        >
          <ChevronLeft size={20} strokeWidth={2.25} /> Back to Home
        </button>
      </Reveal>
      <Reveal delay={0.1} className="flex flex-col gap-3">
        <h1 className="text-2xl font-light tracking-tight sm:text-3xl">
          All Projects
        </h1>
        <p className="text-muted-foreground font-light text-lg">
          A collection of things I've built — from embedded systems to cloud infrastructure.
        </p>
      </Reveal>
      <motion.div
        className="grid grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-8"
        variants={staggerGrid}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-40px" }}
      >
        {projects.map((project) => (
          <motion.div key={project.name} variants={cardReveal}>
            <ProjectCard {...project} />
          </motion.div>
        ))}
      </motion.div>
    </motion.main>
  );
};

export default Projects;
