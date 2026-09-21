import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { Link } from "react-router-dom";
import Drift from "./helpers/Drift";
import { projectSlug, type Project } from "@/data/projects";

// One row: the divider draws across, then the row slides in from the right.
// Both are tied to scroll position, so they play forward and back.
const ProjectRow = ({ project, index }: { project: Project; index: number }) => {
  const ref = useRef<HTMLLIElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "start 0.65"] });
  const line = useTransform(scrollYProgress, [0, 0.6], [reduce ? 1 : 0, 1]);
  const x = useTransform(scrollYProgress, [0.1, 1], [reduce ? 0 : 90, 0]);
  const opacity = useTransform(scrollYProgress, [0.1, 0.9], [reduce ? 1 : 0, 1]);
  const lead = project.highlights[0];

  return (
    <li ref={ref} className="relative">
      <motion.span
        aria-hidden="true"
        style={{ scaleX: line }}
        className="absolute inset-x-0 top-0 h-px origin-left bg-border"
      />
      <motion.div style={{ x, opacity }}>
        <Link
          to={`/projects/${projectSlug(project.name)}`}
          className="group -mx-4 grid grid-cols-1 gap-x-8 gap-y-4 rounded-lg px-4 py-8 transition-colors hover:bg-card focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring sm:py-10 md:grid-cols-12"
        >
          <div className="flex gap-4 md:col-span-5">
            <span className="pt-1.5 font-mono text-xs text-muted-foreground tabular-nums sm:pt-2.5">
              {String(index + 1).padStart(2, "0")}
            </span>
            <div>
              <h3 className="text-[clamp(1.6rem,2.6vw,2.4rem)] font-semibold leading-[1.05] tracking-[-0.035em]">
                {project.name}
              </h3>
              <p className="mt-2 text-[15px] text-muted-foreground">
                {[project.period, project.role].filter(Boolean).join(" · ")}
              </p>
            </div>
          </div>

          <div className="pl-8 md:col-span-4 md:pl-0">
            <p className="text-[17px] leading-[1.45]">{project.description}</p>
            <p className="mt-3 font-mono text-xs uppercase tracking-wider text-muted-foreground">
              {project.techStack.map((t) => t.name).join(" · ")}
            </p>
          </div>

          <div className="flex items-end justify-between gap-4 pl-8 md:col-span-3 md:flex-col md:items-end md:justify-between md:pl-0 md:text-right">
            {lead && (
              <Drift distance={-40}>
                <p className="text-[clamp(1.6rem,2.6vw,2.4rem)] font-semibold leading-none tracking-[-0.035em]">
                  {lead.value}
                </p>
                <p className="mt-1.5 text-[15px] text-muted-foreground">{lead.label}</p>
              </Drift>
            )}
            <span className="flex items-center gap-2 text-[15px]">
              {project.status && (
                <span className="rounded-full bg-card px-2.5 py-0.5 text-xs group-hover:bg-background">
                  {project.status}
                </span>
              )}
              <span className="underline-offset-4 group-hover:underline">View</span>
              <span aria-hidden="true" className="transition-transform duration-300 group-hover:translate-x-1">
                →
              </span>
            </span>
          </div>
        </Link>
      </motion.div>
    </li>
  );
};

// Index of projects, one full-width row each, built for a fast scan:
// name, what came of it, and the one number that proves it.
const ProjectList = ({ projects }: { projects: Project[] }) => (
  <ol className="border-b border-border">
    {projects.map((project, i) => (
      <ProjectRow key={project.name} project={project} index={i} />
    ))}
  </ol>
);

export default ProjectList;
