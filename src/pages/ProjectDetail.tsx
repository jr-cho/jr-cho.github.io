import type { ReactNode } from "react";
import { projects, projectSlug } from "@/data/projects";
import NotFound from "@/pages/NotFound";
import { Link, useParams } from "react-router-dom";
import { Reveal } from "@/components/helpers/Reveal";
import ArrowLink from "@/components/helpers/ArrowLink";
import ProjectCover from "@/components/helpers/ProjectCover";
import ParallaxFrame from "@/components/helpers/ParallaxFrame";
import ScrollZoom from "@/components/helpers/ScrollZoom";
import { projectMedia } from "@/data/media";
import { motion } from "framer-motion";
import { pageDepthVariants } from "@/lib/motionVariants";
import { shell } from "@/lib/layout";
import { cn } from "@/lib/utils";

// Label in the left three columns, content in the right nine.
const Row = ({ label, children }: { label: string; children: ReactNode }) => (
  <Reveal className="grid grid-cols-1 gap-4 md:grid-cols-12 md:gap-10">
    <h2 className="text-[15px] md:col-span-3">{label}</h2>
    <div className="md:col-span-9">{children}</div>
  </Reveal>
);

// "9 / 16" is portrait, "16 / 9" is landscape.
const isPortrait = (aspect: string) => {
  const [w, h] = aspect.split("/").map(Number);
  return w < h;
};

const ProjectDetail = () => {
  const { slug } = useParams();
  const index = projects.findIndex((p) => projectSlug(p.name) === slug);
  const project = projects[index];

  if (!project) {
    return (
      <NotFound
        title="Project not found"
        message="This project does not exist or has moved."
        backTo="/projects"
        backLabel="All work"
      />
    );
  }

  const next = projects[(index + 1) % projects.length];
  const meta = [project.period, project.role, project.status].filter(Boolean);
  const mediaSet = projectMedia[projectSlug(project.name)];

  return (
    <motion.main
      className={cn(shell, "flex flex-col gap-20 pt-10 sm:gap-28 sm:pt-16")}
      variants={pageDepthVariants}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      <title>{`${project.name} · Joshua Gottus`}</title>

      <div className="space-y-8">
        <p className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
          <Link to="/projects" className="text-foreground underline-offset-4 hover:underline">
            Work
          </Link>
          {meta.map((item) => (
            <span key={item}> / {item}</span>
          ))}
        </p>
        <h1 className="display max-w-[14ch] text-[clamp(3rem,9vw,8.5rem)]">{project.name}</h1>
        <p className="max-w-[30ch] font-serif text-[clamp(1.75rem,3.2vw,2.75rem)] leading-[1.1]">
          {project.description}
        </p>
        {(project.githubLink || project.liveLink) && (
          <div className="flex flex-wrap gap-x-8">
            {project.githubLink && <ArrowLink href={project.githubLink}>View source on GitHub</ArrowLink>}
            {project.liveLink && <ArrowLink href={project.liveLink}>Live demo</ArrowLink>}
          </div>
        )}
      </div>

      <Reveal>
        {mediaSet ? (
          <ScrollZoom from={0.9}>
            <ParallaxFrame slot={mediaSet.cover} speed={6} />
          </ScrollZoom>
        ) : project.imgSrc ? (
          <img className="w-full rounded-lg" src={project.imgSrc} alt={project.name} loading="lazy" />
        ) : (
          <ProjectCover
            period={project.period}
            status={project.status}
            highlights={project.highlights}
            className="aspect-[16/9] sm:aspect-[21/9]"
          />
        )}
      </Reveal>

      <Row label="Overview">
        <p className="max-w-[60ch] text-[19px] leading-[1.5]">{project.about}</p>
      </Row>

      {project.story && (
        <Row label="The hard part">
          <dl className="max-w-[60ch] space-y-5">
            {(
              [
                ["Problem", project.story.problem],
                ["Approach", project.story.approach],
                ["Result", project.story.result],
              ] as const
            )
              .filter(([, text]) => text)
              .map(([label, text]) => (
                <div key={label} className="grid grid-cols-1 gap-1 sm:grid-cols-[7rem_1fr] sm:gap-6">
                  <dt className="pt-1 font-mono text-[11px] uppercase tracking-wider text-muted-foreground">{label}</dt>
                  <dd className="text-[17px] leading-[1.5]">{text}</dd>
                </div>
              ))}
          </dl>
        </Row>
      )}

      <Row label="What I built">
        <ol className="max-w-[60ch]">
          {project.features.map((feature, i) => (
            <li
              key={feature}
              className="grid grid-cols-[2.5rem_1fr] border-t border-border py-4 text-[17px] leading-[1.45] last:border-b"
            >
              <span className="tabular-nums text-muted-foreground">{i + 1}</span>
              {feature}
            </li>
          ))}
        </ol>
      </Row>

      {mediaSet && mediaSet.gallery.length > 0 && (
        <Row label="In the field">
          <div className="grid grid-cols-1 items-end gap-6 sm:grid-cols-12">
            {mediaSet.gallery.map((slot) => (
              <ScrollZoom
                key={slot.src}
                from={0.9}
                className={isPortrait(slot.aspect) ? "sm:col-span-4" : "sm:col-span-8"}
              >
                <ParallaxFrame slot={slot} speed={6} />
              </ScrollZoom>
            ))}
          </div>
        </Row>
      )}

      <Row label="Stack">
        <p className="font-mono text-sm uppercase tracking-wider">
          {project.techStack.map((t) => t.name).join(" · ")}
        </p>
      </Row>

      {next !== project && (
        <Link
          to={`/projects/${projectSlug(next.name)}`}
          className="group block border-t border-border pt-8"
        >
          <p className="text-[15px] text-muted-foreground">Next project</p>
          <p className="display mt-3 text-[clamp(2.5rem,7vw,6rem)] transition-opacity group-hover:opacity-60">
            {next.name}
          </p>
        </Link>
      )}
    </motion.main>
  );
};

export default ProjectDetail;
