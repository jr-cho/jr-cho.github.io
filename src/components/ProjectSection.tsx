import ProjectCard from "./ProjectCard";
import { projects } from "@/data/projects";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";
import { motion } from "framer-motion";
import { staggerGrid, cardReveal } from "@/lib/motionVariants";

const ProjectSection = () => {
  return (
    <section id="projects" className="w-full space-y-6">
      <div className="flex gap-3">
        <p className="text-2xl font-light tracking-tight sm:text-3xl">
          Projects
        </p>
      </div>
      <motion.div
        className="grid grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-8"
        variants={staggerGrid}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-60px" }}
      >
        {projects.map((project) => (
          <motion.div key={project.name} variants={cardReveal}>
            <ProjectCard {...project} />
          </motion.div>
        ))}
      </motion.div>
      <div className="flex justify-center pt-6">
        <Button asChild size="lg" className="text-base">
          <Link to="/projects">
            View all Projects
            <ChevronRight strokeWidth={2.25} />
          </Link>
        </Button>
      </div>
    </section>
  );
};

export default ProjectSection;
