import { Button } from "@/components/ui/button";
import { projects, projectSlug } from "@/data/projects";
import { ChevronLeft } from "lucide-react";
import { LuGithub } from "react-icons/lu";
import { BiLink } from "react-icons/bi";
import NotFound from "@/pages/NotFound";
import { useNavigate, useParams } from "react-router-dom";
import { Reveal } from "@/components/helpers/Reveal";
import { motion } from "framer-motion";
import { pageDepthVariants } from "@/lib/motionVariants";

const ProjectDetail = () => {
  const navigate = useNavigate();
  const { slug } = useParams();
  const project = projects.find((p) => projectSlug(p.name) === slug);

  if (!project) {
    return (
      <NotFound
        title="Project not found"
        message="This project does not exist or has moved."
        backTo="/projects"
        backLabel="All projects"
      />
    );
  }

  return (
    <motion.main
      className="mx-auto flex w-full max-w-3xl flex-col px-6 pt-6 pb-8 sm:pt-12 sm:pb-24 space-y-6"
      variants={pageDepthVariants}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      <title>{`${project.name} · Joshua Gottus`}</title>
      <Reveal>
        <button
          onClick={() => navigate("/projects")}
          className="flex w-fit items-center gap-3 text-md font-light tracking-tight text-muted-foreground cursor-pointer duration-200 hover:text-foreground"
        >
          <ChevronLeft size={20} strokeWidth={2.25} /> Back to Projects
        </button>
      </Reveal>
      <div className="flex flex-col gap-6">
        <Reveal delay={0.1}>
          <p className="mb-3 flex flex-wrap items-center gap-x-2 font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
            {project.period}
            {project.role && (
              <>
                <span className="text-muted-foreground/40">·</span>
                {project.role}
              </>
            )}
            {project.status && (
              <>
                <span className="text-muted-foreground/40">·</span>
                {project.status}
              </>
            )}
          </p>
          <h1 className="text-2xl font-semibold tracking-tight sm:text-4xl">
            {project.name}
          </h1>
          <p className="mt-4 text-lg font-light text-muted-foreground sm:text-xl">
            {project.description}
          </p>
        </Reveal>
        <Reveal delay={0.15}>
          <div className="flex flex-wrap gap-3 sm:gap-4">
            {project.githubLink && (
              <a href={project.githubLink} target="_blank" rel="noreferrer">
                <Button
                  variant="outline"
                  className="border border-border"
                  size="lg"
                >
                  <LuGithub className="w-4 h-4" />
                  View Source
                </Button>
              </a>
            )}
            {project.liveLink && (
              <a href={project.liveLink} target="_blank" rel="noreferrer">
                <Button size="lg">
                  <BiLink className="w-4 h-4" />
                  Live Demo
                </Button>
              </a>
            )}
          </div>
        </Reveal>
        <Reveal delay={0.2}>
          <dl className="grid grid-cols-1 divide-y divide-border rounded-lg border border-border bg-card sm:grid-cols-3 sm:divide-x sm:divide-y-0">
            {project.highlights.map(({ value, label }) => (
              <div key={label} className="flex flex-col gap-1 px-4 py-3">
                <dt className="order-2 text-sm text-muted-foreground">{label}</dt>
                <dd className="order-1 text-xl font-semibold tracking-tight">{value}</dd>
              </div>
            ))}
          </dl>
          {project.imgSrc && (
            <img
              className="mt-6 rounded-lg border border-border"
              src={project.imgSrc}
              alt={project.name}
              loading="lazy"
            />
          )}
        </Reveal>
        <Reveal delay={0.25}>
          <h2 className="mb-4 text-xl font-semibold tracking-tight sm:text-2xl">
            Technologies Used
          </h2>
          <div className="flex flex-wrap items-center gap-2 mt-2">
            {project.techStack.map((tech) => (
              <span
                key={tech.name}
                className="rounded-md border border-border px-2.5 py-1 font-mono text-xs text-muted-foreground sm:text-sm"
              >
                {tech.name}
              </span>
            ))}
          </div>
        </Reveal>
        <Reveal delay={0.3}>
          <h2 className="mb-4 text-xl font-semibold tracking-tight sm:text-2xl">
            About the Project
          </h2>
          <p className="text-muted-foreground font-light">{project.about}</p>
        </Reveal>
        <Reveal delay={0.35}>
          <h2 className="mb-4 text-xl font-semibold tracking-tight sm:text-2xl">
            Key Features
          </h2>
          <ul className="list-disc pl-5 space-y-2 text-muted-foreground font-light ">
            {project.features.map((feature, idx) => (
              <li key={idx}>{feature}</li>
            ))}
          </ul>
        </Reveal>
      </div>
    </motion.main>
  );
};

export default ProjectDetail;
