import { useRef, useSyncExternalStore } from "react";
import { Link } from "react-router-dom";
import { motion, useReducedMotion, useScroll, useTransform, type MotionValue } from "framer-motion";
import { Cpu, Plane, SquareTerminal, type LucideIcon } from "lucide-react";
import { skillRows, type TechItem } from "@/data/tech";
import { projects, projectSlug } from "@/data/projects";
import { codeSnippet } from "@/data/snippet";
import ScrollWords from "./helpers/ScrollWords";
import TechDrift from "./helpers/TechDrift";
import CodeType from "./helpers/CodeType";
import ScrubVideo from "./helpers/ScrubVideo";
import { scrollToY } from "@/lib/lenis";
import { shell } from "@/lib/layout";
import { cn } from "@/lib/utils";

// Plain symbols for tools that have no brand icon.
const FALLBACK: Record<string, LucideIcon> = {
  FreeRTOS: Cpu,
  ArduPilot: Plane,
  PowerShell: SquareTerminal,
};

// How far each icon tile rises while its panel slides in. Tiles cycle
// through these, so neighbours move at different speeds.
const TILE_DEPTHS = [60, 140, 100, 180];

// Extra scroll that holds each panel in place before the next one arrives.
// Languages holds longest so its code has time to type out.
const DWELL = ["60svh", "0px", "0px"];

// The middle panel is dark, to break up the stack.
const DARK_PANEL = 1;

// The robot turning in place. Every frame is a keyframe so scroll can scrub it.
const ROBOT_CLIP = `${import.meta.env.BASE_URL}media/projects/secon-scrub.mp4`;
const ROBOT_POSTER = `${import.meta.env.BASE_URL}media/projects/secon-scrub.jpg`;

// Panels pin and stack only on screens wide enough to fit a panel's
// content in one screen. Phones get plain page flow.
const pinQuery = "(min-width: 768px)";
const subscribePin = (cb: () => void) => {
  const mq = window.matchMedia(pinQuery);
  mq.addEventListener("change", cb);
  return () => mq.removeEventListener("change", cb);
};
const usePinned = () => useSyncExternalStore(subscribePin, () => window.matchMedia(pinQuery).matches, () => true);

const ToolIcon = ({ tool, className }: { tool: TechItem; className?: string }) => {
  if (tool.icon) {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true" className={cn("fill-current", className)}>
        <path d={tool.icon.path} />
      </svg>
    );
  }
  const Fallback = FALLBACK[tool.name] ?? Cpu;
  return <Fallback aria-hidden="true" strokeWidth={1.5} className={className} />;
};

// Projects that list any of these tools, with the matching tools.
const usedIn = (items: TechItem[]) =>
  projects
    .map((project) => ({ project, tools: items.filter((t) => project.techStack.includes(t)) }))
    .filter(({ tools }) => tools.length > 0);

// One tool on the Tools card. Rises at its own speed while the panel slides in.
const ToolTile = ({ tool, enter, depth }: { tool: TechItem; enter: MotionValue<number>; depth: number }) => {
  const reduce = useReducedMotion();
  const y = useTransform(enter, [0, 1], [reduce ? 0 : depth, 0]);

  return (
    <motion.li style={{ y }} className="flex flex-col items-center gap-3 text-center">
      <ToolIcon tool={tool} className="size-10 sm:size-14 lg:size-16" />
      <span className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground sm:text-xs">{tool.name}</span>
    </motion.li>
  );
};

type PanelProps = {
  category: string;
  summary: string;
  items: TechItem[];
  index: number;
  pinned: boolean;
  onJump: (index: number) => void;
};

// One skill category. On wide screens it pins to the top and the next panel
// slides up over it. While it slides in, the text rises faster than the
// visual (parallax) and the visual settles from a slight zoom. While the
// next panel covers it, it shrinks back and dims.
const SkillPanel = ({ category, summary, items, index, pinned, onJump }: PanelProps) => {
  const reduce = useReducedMotion();
  const panelRef = useRef<HTMLElement>(null);
  const dwellRef = useRef<HTMLDivElement>(null);
  const count = skillRows.length;
  const last = index === count - 1;
  const dark = index === DARK_PANEL;
  const flip = index % 2 === 1;

  // Slide-in: from the panel's top at the viewport bottom until it pins.
  const { scrollYProgress: enter } = useScroll({ target: panelRef, offset: ["start end", "start start"] });
  // Hold: the spacer after the panel scrolls past while the panel stays pinned.
  const { scrollYProgress: hold } = useScroll({ target: dwellRef, offset: ["start end", "end end"] });
  // Covered: the next panel, which follows the spacer, slides up over this one.
  const { scrollYProgress: exit } = useScroll({ target: dwellRef, offset: ["end end", "end start"] });

  const still = reduce || !pinned;
  const textY = useTransform(enter, [0, 1], [reduce ? 0 : 220, 0]);
  const visualY = useTransform(enter, [0, 1], [reduce ? 0 : 80, 0]);
  const visualScale = useTransform(enter, [0, 1], [reduce ? 1 : 1.12, 1]);
  const sink = useTransform(exit, [0, 1], [1, still || last ? 1 : 0.92]);
  const dim = useTransform(exit, [0, 1], [1, still || last ? 1 : 0.6]);
  // Once the next panel fully covers this one, stop drawing it. Otherwise
  // its edges peek out past the covering panel as a flickering line.
  const visibility = useTransform(exit, (v) => (pinned && !last && v >= 0.999 ? "hidden" : "visible"));
  // The code starts typing halfway through the slide-in and finishes during the hold.
  const typing = useTransform([enter, hold], ([e, h]: number[]) =>
    pinned ? Math.max(0, (e - 0.5) / 0.5) * 0.35 + h * 0.65 : e,
  );
  // The robot turns while its panel slides in, and keeps turning while the
  // next panel covers it.
  const turning = useTransform([enter, exit], ([e, x]: number[]) => (pinned ? e * 0.45 + x * 0.55 : e));

  const proof = usedIn(items);
  const muted = dark ? "text-white/60" : "text-muted-foreground";

  const visual =
    index === 0 ? (
      <div className={cn("flex h-full flex-col rounded-lg p-5 sm:p-8", dark ? "bg-white/5" : "bg-card")}>
        <div className={cn("mb-4 flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 font-mono text-[11px] uppercase tracking-wider", muted)}>
          <span>
            {codeSnippet.file} · gyro heading correction
          </span>
          <a href={codeSnippet.href} target="_blank" rel="noreferrer" className="underline-offset-4 hover:underline">
            View on GitHub
          </a>
        </div>
        <motion.div style={{ scale: visualScale }} className="min-h-0 flex-1 origin-top-left overflow-hidden">
          <CodeType code={codeSnippet.code} progress={typing} />
        </motion.div>
      </div>
    ) : index === DARK_PANEL ? (
      <figure className="flex h-full flex-col">
        <div className="relative min-h-0 flex-1 overflow-hidden rounded-lg">
          <motion.div style={{ scale: visualScale }} className="h-full w-full">
            <ScrubVideo
              src={ROBOT_CLIP}
              poster={ROBOT_POSTER}
              alt="The SoutheastCon 2026 ground robot turning in place next to a laptop running its firmware build"
              progress={turning}
            />
          </motion.div>
        </div>
        <figcaption className={cn("mt-3 font-mono text-xs uppercase tracking-wider", muted)}>
          SoutheastCon 2026 ground robot · C on Raspberry Pi
        </figcaption>
      </figure>
    ) : (
      <div className="h-full overflow-hidden rounded-lg bg-card">
        <motion.ul
          style={{ scale: visualScale }}
          className="grid h-full grid-cols-3 content-center gap-x-4 gap-y-8 p-6 sm:gap-y-12 sm:p-10 lg:gap-y-16"
        >
          {items.map((tool, i) => (
            <ToolTile key={tool.name} tool={tool} enter={enter} depth={TILE_DEPTHS[i % TILE_DEPTHS.length]} />
          ))}
        </motion.ul>
      </div>
    );

  return (
    <>
      <motion.section
        ref={panelRef}
        id={`skill-${index}`}
        aria-labelledby={`skill-${index}-title`}
        style={{ zIndex: index + 1, visibility }}
        className={cn(
          "overflow-hidden border-t",
          pinned && "sticky top-0 h-svh",
          dark ? "border-white/10 bg-[#0A0A0A] text-white" : "border-border bg-background",
        )}
      >
        <motion.div
          style={{ scale: sink, opacity: dim }}
          className={cn(shell, "grid gap-10 py-20 md:h-full md:grid-cols-12 md:items-center md:py-24")}
        >
          <motion.div style={{ y: textY }} className={cn("md:col-span-5", flip && "md:order-2 md:col-start-8")}>
            {/* Index of all panels. The current one is marked, the rest jump. */}
            <nav aria-label="Skill categories" className="flex flex-wrap gap-x-4 gap-y-1 font-mono text-[11px] uppercase tracking-wider">
              {skillRows.map((row, i) =>
                i === index ? (
                  <span key={row.category} aria-current="true" className="underline underline-offset-4">
                    {String(i + 1).padStart(2, "0")} {row.category}
                  </span>
                ) : (
                  <button
                    key={row.category}
                    type="button"
                    onClick={() => onJump(i)}
                    className={cn("transition-opacity hover:opacity-100", muted, "opacity-70")}
                  >
                    {String(i + 1).padStart(2, "0")} {row.category}
                  </button>
                ),
              )}
            </nav>

            <h3 id={`skill-${index}-title`} className="display mt-6 text-[clamp(2.5rem,5.5vw,5rem)] leading-[0.95]">
              {category}
            </h3>
            <p className={cn("mt-5 max-w-[44ch] text-[17px] leading-[1.45]", dark ? "text-white/80" : "text-foreground/80")}>
              {summary}
            </p>

            {/* Solid chips are tools used in a project listed below; outlined chips are not. */}
            {proof.length > 0 && (
              <p className={cn("mt-6 flex items-center gap-2 font-mono text-[11px] uppercase tracking-wider", muted)}>
                <span
                  aria-hidden="true"
                  className={cn("inline-block h-3 w-5 rounded-full", dark ? "bg-white" : "bg-foreground")}
                />
                Used in a project below
              </p>
            )}
            <ul className={cn("flex flex-wrap gap-2", proof.length > 0 ? "mt-3" : "mt-6")}>
              {items.map((tool) => {
                const used = proof.some(({ tools }) => tools.includes(tool));
                return (
                  <li
                    key={tool.name}
                    className={cn(
                      "flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[13px]",
                      used
                        ? dark
                          ? "border-white bg-white text-[#0A0A0A]"
                          : "border-foreground bg-foreground text-background"
                        : dark
                          ? "border-white/15"
                          : "border-border",
                    )}
                  >
                    <ToolIcon tool={tool} className="size-3.5" />
                    {tool.name}
                    {used && <span className="sr-only">, used in a project below</span>}
                  </li>
                );
              })}
            </ul>

            {proof.length > 0 && (
              <div className="mt-8">
                <p className={cn("font-mono text-[11px] uppercase tracking-wider", muted)}>Used in</p>
                <ul className={cn("mt-2 border-t", dark ? "border-white/10" : "border-border")}>
                  {proof.map(({ project, tools }) => (
                    <li key={project.name} className={cn("border-b", dark ? "border-white/10" : "border-border")}>
                      <Link
                        to={`/projects/${projectSlug(project.name)}`}
                        className="group flex items-baseline justify-between gap-4 py-2.5"
                      >
                        <span className="text-[15px] underline-offset-4 group-hover:underline">{project.name}</span>
                        <span className={cn("shrink-0 font-mono text-[11px] uppercase tracking-wider", muted)}>
                          {tools.map((t) => t.name).join(" · ")}
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </motion.div>

          <motion.div
            style={{ y: visualY }}
            className={cn(
              "h-[60svh] md:col-span-6 md:h-[72svh]",
              flip ? "md:order-1 md:col-start-1" : "md:col-start-7",
            )}
          >
            {visual}
          </motion.div>
        </motion.div>
      </motion.section>
      <div ref={dwellRef} id={`skill-${index}-hold`} aria-hidden="true" style={{ height: pinned ? DWELL[index] : 0 }} />
    </>
  );
};

// Intro line over faint drifting icons, then one panel per skill category.
// On wide screens the panels pin and stack as the page scrolls.
const SkillSection = () => {
  const pinned = usePinned();

  // Pinned: go to where the panel first pins, which is its spacer's top
  // one screen up. Unpinned: go to the panel's top, clear of the nav bar.
  const jump = (i: number) => {
    const target = document.getElementById(pinned ? `skill-${i}-hold` : `skill-${i}`);
    if (!target) return;
    const top = target.getBoundingClientRect().top + window.scrollY;
    scrollToY(pinned ? top - window.innerHeight : top - 80);
  };

  return (
    <div>
      <div className={cn(shell, "relative space-y-10 pb-16 sm:pb-24")}>
        <ScrollWords
          text="I write the software between the sensor and the motor: drivers, control loops, and the tools that test them."
          className="display max-w-[22ch] text-[clamp(2rem,4.6vw,4.25rem)] leading-[0.95]"
          from={0.12}
        />
        <p className="text-[15px]">Technical skills</p>
        <TechDrift rows={skillRows.map((row) => row.items)} />
      </div>

      <div className="relative">
        {skillRows.map((row, i) => (
          <SkillPanel
            key={row.category}
            category={row.category}
            summary={row.summary}
            items={row.items}
            index={i}
            pinned={pinned}
            onJump={jump}
          />
        ))}
      </div>
    </div>
  );
};

export default SkillSection;
