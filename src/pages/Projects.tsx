import { projects } from "@/data/projects";
import { motion } from "framer-motion";
import SectionHeader from "@/components/helpers/SectionHeader";
import ProjectList from "@/components/ProjectList";
import { pageDepthVariants } from "@/lib/motionVariants";
import { shell } from "@/lib/layout";
import { cn } from "@/lib/utils";

const Projects = () => {
  return (
    <motion.main
      className={cn(shell, "flex flex-col gap-16 pt-10 sm:gap-24 sm:pt-16")}
      variants={pageDepthVariants}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      <title>Work · Joshua Gottus</title>
      <SectionHeader title="Work" lead="Firmware, robotics, and embedded systems," emphasis="2025 to now." />
      <ProjectList projects={projects} />
    </motion.main>
  );
};

export default Projects;
