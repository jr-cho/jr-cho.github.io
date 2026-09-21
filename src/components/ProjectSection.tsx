import SectionHeader from "./helpers/SectionHeader";
import ProjectList from "./ProjectList";
import ArrowLink from "./helpers/ArrowLink";
import { projects } from "@/data/projects";
import { shell } from "@/lib/layout";
import { cn } from "@/lib/utils";

// Home page shows this many. The "All work" link appears only when more exist.
const HOME_PROJECT_COUNT = 3;

const ProjectSection = () => {
  return (
    <div className={cn(shell, "space-y-16 sm:space-y-24")}>
      <SectionHeader title="Selected work" lead="Firmware and robotics," emphasis="built on real hardware." />
      <ProjectList projects={projects.slice(0, HOME_PROJECT_COUNT)} />
      {projects.length > HOME_PROJECT_COUNT && (
        <div className="flex justify-center">
          <ArrowLink to="/projects">All work</ArrowLink>
        </div>
      )}
    </div>
  );
};

export default ProjectSection;
