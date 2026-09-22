import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform, type MotionValue } from "framer-motion";
import type { LanguageShare, RepoSummary } from "@/data/github";
import { github } from "@/lib/githubData";
import { cn } from "@/lib/utils";

// Same grey steps as the contribution calendar, darkest first.
const SHADES = ["#0A0A0A", "#4A4A4A", "#8C8C8C", "#B0B0B0", "#D4D4D4", "#E9E9E9"];


const monthYear = (iso: string) =>
  new Date(iso).toLocaleDateString("en-US", { month: "short", year: "numeric", timeZone: "UTC" });

// Language split across the shown repos. The bar fills from the left in
// step with scroll, one segment after another.
const LanguageBar = ({ languages }: { languages: LanguageShare[] }) => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "start 0.6"] });

  return (
    <div ref={ref}>
      <p className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground">Languages</p>
      <div className="mt-3 flex h-2.5 w-full overflow-hidden rounded-full bg-card" role="img" aria-label={languages.map((l) => `${l.name} ${l.share}%`).join(", ")}>
        {languages.map((lang, i) => (
          <Segment key={lang.name} lang={lang} shade={SHADES[i % SHADES.length]} index={i} count={languages.length} progress={scrollYProgress} />
        ))}
      </div>
      <ul className="mt-3 flex flex-wrap gap-x-5 gap-y-1 text-[13px]">
        {languages.map((lang, i) => (
          <li key={lang.name} className="flex items-center gap-1.5">
            <span aria-hidden="true" className="size-2 rounded-full" style={{ backgroundColor: SHADES[i % SHADES.length] }} />
            {lang.name}
            <span className="tabular-nums text-muted-foreground">{lang.share}%</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

type SegmentProps = {
  lang: LanguageShare;
  shade: string;
  index: number;
  count: number;
  progress: MotionValue<number>;
};

const Segment = ({ lang, shade, index, count, progress }: SegmentProps) => {
  const reduce = useReducedMotion();
  const start = (index / count) * 0.8;
  const scaleX = useTransform(progress, [start, start + 0.2], [reduce ? 1 : 0, 1]);
  return (
    <motion.span
      style={{ width: `${lang.share}%`, backgroundColor: shade, scaleX }}
      className="h-full origin-left"
    />
  );
};

// One repo: divider draws across, then the row slides in, tied to scroll.
export const RepoRow = ({ repo }: { repo: RepoSummary }) => {
  const ref = useRef<HTMLLIElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "start 0.75"] });
  const line = useTransform(scrollYProgress, [0, 0.6], [reduce ? 1 : 0, 1]);
  const x = useTransform(scrollYProgress, [0.1, 1], [reduce ? 0 : 50, 0]);
  const opacity = useTransform(scrollYProgress, [0.1, 0.9], [reduce ? 1 : 0, 1]);

  return (
    <li ref={ref} className="relative">
      <motion.span aria-hidden="true" style={{ scaleX: line }} className="absolute inset-x-0 top-0 h-px origin-left bg-border" />
      <motion.a
        href={repo.url}
        target="_blank"
        rel="noreferrer"
        style={{ x, opacity }}
        className="group grid grid-cols-1 gap-1 py-4 sm:grid-cols-[1fr_auto] sm:gap-6"
      >
        <div>
          <p className="font-mono text-[15px] underline-offset-4 group-hover:underline">{repo.name}</p>
          {repo.description && <p className="mt-1 max-w-[60ch] text-[14px] leading-[1.45] text-muted-foreground">{repo.description}</p>}
        </div>
        <p className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground sm:pt-1 sm:text-right">
          {[repo.language, `Updated ${monthYear(repo.pushedAt)}`].filter(Boolean).join(" · ")}
        </p>
      </motion.a>
    </li>
  );
};

// Language split and recent public repos, fetched when the site builds.
// Renders nothing if the build could not reach GitHub.
const GithubRepos = ({ className }: { className?: string }) => {
  if (github.repos.length === 0 && github.languages.length === 0) return null;

  return (
    <div className={cn("space-y-12", className)}>
      {github.languages.length > 0 && <LanguageBar languages={github.languages} />}
      {github.repos.length > 0 && (
        <div>
          <div className="flex items-baseline justify-between gap-4">
            <p className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground">Recently updated</p>
            <a
              href="https://github.com/jr-cho?tab=repositories"
              target="_blank"
              rel="noreferrer"
              className="font-mono text-[11px] uppercase tracking-wider underline-offset-4 hover:underline"
            >
              All repos
            </a>
          </div>
          <ul className="mt-3 border-b border-border">
            {github.repos.map((repo) => (
              <RepoRow key={repo.name} repo={repo} />
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default GithubRepos;
