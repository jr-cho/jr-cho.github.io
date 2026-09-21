import ProjectCard from "./ProjectCard";
import SectionHeader from "./helpers/SectionHeader";
import { projects } from "@/data/projects";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";
import { motion } from "framer-motion";
import { staggerGrid, cardReveal } from "@/lib/motionVariants";

// Home page shows this many. The "View all" button appears only when more exist.
const HOME_PROJECT_COUNT = 3;

const ProjectSection = () => {
  return (
    <section id="projects" className="w-full space-y-8">
      <SectionHeader eyebrow={`${projects.length} PROJECTS`} title="Projects" />
      <motion.div
        className="flex flex-col gap-5"
        variants={staggerGrid}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-60px" }}
      >
        {projects.slice(0, HOME_PROJECT_COUNT).map((project) => (
          <motion.div key={project.name} variants={cardReveal}>
            <ProjectCard {...project} />
          </motion.div>
        ))}
      </motion.div>
      {projects.length > HOME_PROJECT_COUNT && (
      <div className="flex justify-center pt-8">
        <Button asChild size="lg" className="text-base">
          <Link to="/projects">
            View all Projects
            <ChevronRight strokeWidth={2.25} />
          </Link>
        </Button>
      </div>
      )}
    </section>
  );
};

export default ProjectSection;
