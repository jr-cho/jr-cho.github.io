import { LuGithub } from "react-icons/lu";
import { BiLink } from "react-icons/bi";
import TechIcon from "./helpers/TechIcon";
import type { Project } from "@/data/projects";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const ProjectCard = ({
  name,
  imgSrc,
  description,
  techStack,
  liveLink,
  githubLink,
}: Project) => {
  return (
    <motion.div
      className="glass-card flex flex-col gap-2 p-3 sm:p-4 w-full"
      whileHover={{
        y: -4,
        boxShadow: "0 12px 40px rgba(28,28,30,0.18)",
        transition: { type: "spring", stiffness: 280, damping: 22 },
      }}
      whileTap={{ scale: 0.98 }}
    >
      <div className="group/image rounded-lg overflow-hidden">
        <img
          src={imgSrc}
          alt={name}
          loading="lazy"
          className="rounded-lg border border-white/10 w-full object-cover transition-all duration-500 ease-out group-hover/image:blur-xs"
        />
      </div>

      <div className="px-2 mt-4">
        <div className="text-lg font-semibold tracking-tight">{name}</div>
        <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
          {description}
        </p>
      </div>

      <div className="flex items-center gap-3 px-2 mt-4">
        <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground/70">
          stack
        </span>
        <div className="flex items-center gap-4">
          {techStack.map((tech) => (
            <TechIcon key={tech.name} item={tech} className="w-5 h-5" />
          ))}
        </div>
      </div>

      <div className="w-full h-px bg-white/10 mt-2 mb-1" />

      <div className="flex items-center justify-between mt-1 px-2 pb-2">
        <div className="flex items-center gap-3">
          {liveLink && liveLink !== "#" && (
            <a
              href={liveLink}
              target="_blank"
              rel="noreferrer"
              aria-label={`${name} — live site`}
              title="Live site"
              className="rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <BiLink className="w-4 h-4 text-muted-foreground hover:text-foreground cursor-pointer transition-colors" />
            </a>
          )}
          <a
            href={githubLink}
            target="_blank"
            rel="noreferrer"
            aria-label={`${name} — source on GitHub`}
            title="Source code"
            className="rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <LuGithub className="w-4 h-4 text-muted-foreground hover:text-foreground cursor-pointer transition-colors" />
          </a>
        </div>
        <p className="text-xs font-mono text-muted-foreground hover:text-foreground cursor-pointer transition-colors uppercase tracking-widest">
          <Link to={`/projects/${name.toLowerCase().replace(/\s+/g, "-")}`}>
            Details →
          </Link>
        </p>
      </div>
    </motion.div>
  );
};

export default ProjectCard;
