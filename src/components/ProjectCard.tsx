import { LuGithub } from "react-icons/lu";
import { BiLink } from "react-icons/bi";
import ProjectCover from "./helpers/ProjectCover";
import { projectSlug, type Project } from "@/data/projects";
import { Link } from "react-router-dom";

const ProjectCard = ({
  name,
  imgSrc,
  period,
  status,
  role,
  description,
  highlights,
  techStack,
  liveLink,
  githubLink,
}: Project) => {
  return (
    <article className="glass-card grid w-full gap-5 p-4 transition-colors hover:border-foreground/25 sm:grid-cols-[15rem_1fr] sm:gap-6 sm:p-5">
      {imgSrc ? (
        <img
          src={imgSrc}
          alt={name}
          loading="lazy"
          className="aspect-video w-full rounded-lg border border-border object-cover sm:aspect-auto sm:h-full"
        />
      ) : (
        <ProjectCover period={period} status={status} highlights={highlights} />
      )}

      <div className="flex flex-col">
        <h3 className="text-lg font-semibold tracking-tight">{name}</h3>
        {role && (
          <p className="mt-0.5 text-sm text-muted-foreground">{role}</p>
        )}
        <p className="mt-2 text-sm leading-6 text-muted-foreground">{description}</p>

        <ul className="mt-4 flex flex-wrap gap-1.5" aria-label="Technologies">
          {techStack.map((tech) => (
            <li
              key={tech.name}
              className="rounded-md border border-border px-2 py-0.5 font-mono text-xs text-muted-foreground"
            >
              {tech.name}
            </li>
          ))}
        </ul>

        <div className="mt-auto flex items-center justify-between pt-5">
          <div className="flex items-center gap-1">
            {liveLink && (
              <a
                href={liveLink}
                target="_blank"
                rel="noreferrer"
                aria-label={`${name}: live site`}
                title="Live site"
                className="flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <BiLink className="h-4 w-4" />
              </a>
            )}
            {githubLink && (
              <a
                href={githubLink}
                target="_blank"
                rel="noreferrer"
                aria-label={`${name}: source on GitHub`}
                title="Source code"
                className="flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <LuGithub className="h-4 w-4" />
              </a>
            )}
          </div>
          <Link
            to={`/projects/${projectSlug(name)}`}
            className="inline-flex h-8 items-center rounded-md px-2 text-sm font-medium text-foreground transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            Read more →
          </Link>
        </div>
      </div>
    </article>
  );
};

export default ProjectCard;
