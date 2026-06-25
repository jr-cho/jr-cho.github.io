# Liquid Glass + Framer Motion Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add glassmorphism cards, warm amber/orange gradient blobs, and bold Framer Motion animations across the portfolio site.

**Architecture:** Extend the existing `motionVariants.ts` with new animation presets, add a `.glass-card` CSS utility, inject fixed-position ambient blobs into `main.tsx`, create an `AnimatedRoutes` component for route-level `AnimatePresence`, then apply glass + motion to each component layer.

**Tech Stack:** React 18, Framer Motion v12, Tailwind CSS v4, React Router v6, TypeScript

## Global Constraints

- Tailwind v4 (`@import "tailwindcss"`) — use `@layer utilities` for custom CSS
- CSS vars use `oklch()` format — match that format when updating vars
- Dark mode via `.dark` class selector (configured as `@custom-variant dark (&:is(.dark *))`)
- All existing animations (Hero stagger, QuoteSection crossfade, SkillRow marquee) must remain unchanged
- `prefers-reduced-motion` handled automatically by Framer Motion — no extra work needed
- Do not change font weights, type scale, layout max-width (`max-w-3xl`), or spacing scale
- `framer-motion` is already installed at `^12.38.0`

---

### Task 1: Foundation — Motion Variants + Glass CSS + Warm Light Background

**Files:**
- Modify: `src/lib/motionVariants.ts`
- Modify: `src/index.css`

**Interfaces:**
- Produces: `pageVariants`, `staggerGrid`, `cardReveal`, `springSnap` exported from `src/lib/motionVariants.ts`
- Produces: `.glass-card` CSS class usable on any element

- [ ] **Step 1: Add new variants to motionVariants.ts**

Replace the entire file content:

```typescript
import type { Variants } from "framer-motion";

export const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.1,
    },
  },
};

export const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: [0.21, 0.47, 0.32, 0.98],
    },
  },
};

export const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" },
  },
};

// Tight mechanical spring — engineered, not organic
export const springSnap = {
  type: "spring" as const,
  stiffness: 280,
  damping: 22,
};

// Page-level fade + scale transition
export const pageVariants: Variants = {
  initial: { opacity: 0, scale: 0.98 },
  animate: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.22, ease: [0.16, 1, 0.3, 1] },
  },
  exit: {
    opacity: 0,
    scale: 0.97,
    transition: { duration: 0.15, ease: "easeIn" },
  },
};

// Parent container that staggers children on scroll
export const staggerGrid: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.05 },
  },
};

// Child item for stagger grids
export const cardReveal: Variants = {
  hidden: { opacity: 0, y: 18 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.35, ease: [0.16, 1, 0.3, 1] },
  },
};
```

- [ ] **Step 2: Add glass-card utility and warm light background to index.css**

Open `src/index.css`. Find the line:
```css
  --background: oklch(1 0 0);
```
Change it to:
```css
  --background: oklch(0.975 0.008 85);
```
(This is warm cream `#faf7f2` in oklch — replaces cold white in light mode only.)

Then add the following AFTER the closing `}` of the `.dark { }` block (find the end of the dark block, then append):

```css
/* Glass card utility — light mode */
.glass-card {
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  background-color: rgb(255 255 255 / 0.6);
  border: 1px solid rgb(255 255 255 / 0.5);
  border-radius: 1rem;
  box-shadow: 0 8px 32px rgb(0 0 0 / 0.08);
  overflow: hidden;
}

/* Glass card utility — dark mode */
.dark .glass-card {
  background-color: rgb(255 255 255 / 0.04);
  border-color: rgb(255 255 255 / 0.1);
  box-shadow: 0 8px 32px rgb(0 0 0 / 0.25);
}
```

- [ ] **Step 3: Start dev server and verify**

```bash
npm run dev
```

Open the site in a browser. In light mode: background should be slightly warm cream (not pure white). In dark mode: no change visible yet (blobs come in Task 2). No existing animations should be broken.

- [ ] **Step 4: Commit**

```bash
git add src/lib/motionVariants.ts src/index.css
git commit -m "feat: add glass-card utility and motion variant presets"
```

---

### Task 2: Ambient Blobs + AnimatedRoutes Shell

**Files:**
- Create: `src/components/helpers/AnimatedRoutes.tsx`
- Modify: `src/main.tsx`

**Interfaces:**
- Consumes: `pageVariants` from `src/lib/motionVariants.ts` (used in later tasks by page components)
- Produces: `<AnimatedRoutes />` component — renders all routes inside `AnimatePresence mode="wait"`, keyed on pathname

- [ ] **Step 1: Create AnimatedRoutes.tsx**

Create `src/components/helpers/AnimatedRoutes.tsx`:

```typescript
import { AnimatePresence } from "framer-motion";
import { Route, Routes, useLocation } from "react-router-dom";
import App from "@/App";
import Blog from "@/pages/Blog";
import Projects from "@/pages/Projects";
import ProjectDetail from "@/pages/ProjectDetail";
import BlogDetail from "@/pages/BlogDetail";
import Contact from "@/pages/Contact";

export default function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<App />} />
        <Route path="/blogs" element={<Blog />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/projects/:slug" element={<ProjectDetail />} />
        <Route path="/blogs/:slug" element={<BlogDetail />} />
        <Route path="/contact" element={<Contact />} />
      </Routes>
    </AnimatePresence>
  );
}
```

- [ ] **Step 2: Update main.tsx — add blobs + use AnimatedRoutes**

Replace the entire content of `src/main.tsx`:

```typescript
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import "react-activity-calendar/tooltips.css";
import { ThemeProvider } from "./providers/theme-provider.tsx";
import { BrowserRouter } from "react-router-dom";
import Navbar from "./components/Navbar.tsx";
import ScrollToTop from "./components/helpers/ScrollToTop.tsx";
import SmoothScroll from "./components/helpers/SmoothScroll.tsx";
import Footer from "./components/Footer.tsx";
import AnimatedRoutes from "./components/helpers/AnimatedRoutes.tsx";
import { motion } from "framer-motion";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <SmoothScroll>
        <BrowserRouter>
          <ScrollToTop />
          <div className="relative flex flex-col min-h-screen bg-background text-foreground">
            {/* Ambient blob layer — fixed, behind all content */}
            <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden" aria-hidden="true">
              <motion.div
                className="absolute -top-40 -right-40 h-[650px] w-[650px] rounded-full"
                style={{
                  background:
                    "radial-gradient(circle, rgba(249,115,22,0.14) 0%, transparent 70%)",
                }}
                animate={{ scale: [1, 1.06, 1] }}
                transition={{
                  duration: 12,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
              <motion.div
                className="absolute -bottom-32 -left-32 h-[450px] w-[450px] rounded-full"
                style={{
                  background:
                    "radial-gradient(circle, rgba(194,65,12,0.14) 0%, transparent 70%)",
                }}
                animate={{ scale: [1, 1.06, 1] }}
                transition={{
                  duration: 12,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 4,
                }}
              />
            </div>

            {/* Content layer */}
            <div className="relative z-10 flex flex-col flex-1">
              <Navbar />
              <div className="flex-1">
                <AnimatedRoutes />
              </div>
              <Footer />
            </div>
          </div>
        </BrowserRouter>
      </SmoothScroll>
    </ThemeProvider>
  </StrictMode>,
);
```

- [ ] **Step 3: Verify blobs and routing**

With the dev server running, open the site. You should see:
- Warm amber glow at top-right corner of viewport, slowly pulsing
- Burnt orange glow at bottom-left corner, pulsing with 4s offset
- Navigating between pages works (no console errors)
- Light mode: blobs visible on cream background
- Dark mode: blobs more prominent against dark background

- [ ] **Step 4: Commit**

```bash
git add src/components/helpers/AnimatedRoutes.tsx src/main.tsx
git commit -m "feat: add ambient warm blobs and AnimatedRoutes shell"
```

---

### Task 3: Glass + Motion on Cards

**Files:**
- Modify: `src/components/ProjectCard.tsx`
- Modify: `src/components/ComingSoonCard.tsx`

**Interfaces:**
- Consumes: `springSnap` from `src/lib/motionVariants.ts`
- Consumes: `.glass-card` CSS class from `src/index.css`
- Produces: `ProjectCard` — `motion.div` with glass treatment, hover lift+amber glow, tap scale
- Produces: `ComingSoonCard` — same glass treatment, no hover animation (it's disabled/coming soon)

- [ ] **Step 1: Update ProjectCard.tsx**

Replace the entire file:

```typescript
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
      className="glass-card flex flex-col gap-2 p-2 w-full"
      whileHover={{
        y: -4,
        boxShadow: "0 12px 40px rgba(249,115,22,0.18)",
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
        <div className="text-xl font-light tracking-tight">{name}</div>
        <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
          {description}
        </p>
      </div>

      <div className="flex items-center gap-4 px-2 mt-4">
        {techStack.map((tech) => (
          <TechIcon key={tech.name} item={tech} className="w-5 h-5" />
        ))}
      </div>

      <div className="w-full h-px bg-white/10 mt-2 mb-1" />

      <div className="flex items-center justify-between mt-1 px-2 pb-2">
        <div className="flex items-center gap-3">
          <a href={liveLink} target="_blank">
            <BiLink className="w-4 h-4 text-muted-foreground hover:text-foreground cursor-pointer transition-colors" />
          </a>
          <a href={githubLink} target="_blank">
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
```

- [ ] **Step 2: Update ComingSoonCard.tsx**

Replace the entire file:

```typescript
import { LuGithub } from "react-icons/lu";
import { BiLink } from "react-icons/bi";

const ComingSoonCard = () => {
  return (
    <div className="glass-card flex flex-col gap-2 p-2 w-full opacity-60">
      <div className="rounded-lg overflow-hidden w-full aspect-video bg-white/5 border border-white/10 flex items-center justify-center">
        <span className="text-xl font-mono text-muted-foreground uppercase tracking-widest">
          Coming Soon
        </span>
      </div>

      <div className="px-2 mt-4">
        <div className="text-xl font-light tracking-tight">Project Unknown</div>
        <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
          Something awesome is currently being built. Exploring new ideas and technologies. Stay tuned for updates.
        </p>
      </div>

      <div className="flex items-center gap-4 px-2 mt-4 h-5">
        <span className="text-[10px] font-mono text-muted-foreground uppercase bg-white/5 px-2 rounded-md border border-white/10 h-full flex items-center">Tech</span>
        <span className="text-[10px] font-mono text-muted-foreground uppercase bg-white/5 px-2 rounded-md border border-white/10 h-full flex items-center">Stack</span>
        <span className="text-[10px] font-mono text-muted-foreground uppercase bg-white/5 px-2 rounded-md border border-white/10 h-full flex items-center">Hidden</span>
      </div>

      <div className="w-full h-px bg-white/10 mt-2 mb-1" />

      <div className="flex items-center justify-between mt-1 px-2 pb-2">
        <div className="flex items-center gap-3">
          <BiLink className="w-4 h-4 text-muted-foreground/50 cursor-not-allowed" />
          <LuGithub className="w-4 h-4 text-muted-foreground/50 cursor-not-allowed" />
        </div>
        <p className="text-xs font-mono text-muted-foreground uppercase tracking-widest">
          Later →
        </p>
      </div>
    </div>
  );
};

export default ComingSoonCard;
```

- [ ] **Step 3: Verify cards**

With dev server running, navigate to the home page. Project cards should:
- Show frosted glass appearance (lighter/translucent bg, no dashed border)
- Lift 4px with amber glow on hover
- Press down slightly on click
- Coming Soon card shows glass treatment but does not hover-lift (no `whileHover`)

- [ ] **Step 4: Commit**

```bash
git add src/components/ProjectCard.tsx src/components/ComingSoonCard.tsx
git commit -m "feat: apply glass treatment and hover motion to project cards"
```

---

### Task 4: Stagger Grid + Stats Count-Up + Stats Glass

**Files:**
- Modify: `src/components/ProjectSection.tsx`
- Modify: `src/pages/Projects.tsx`
- Modify: `src/components/Stats.tsx`

**Interfaces:**
- Consumes: `staggerGrid`, `cardReveal` from `src/lib/motionVariants.ts`
- Consumes: `.glass-card` CSS class

- [ ] **Step 1: Update ProjectSection.tsx with stagger grid**

Replace the entire file:

```typescript
import ProjectCard from "./ProjectCard";
import { projects } from "@/data/projects";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";
import ComingSoonCard from "./ComingSoonCard";
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
        <motion.div variants={cardReveal}>
          <ComingSoonCard />
        </motion.div>
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
```

- [ ] **Step 2: Update Projects.tsx — stagger grid for all-projects page**

Read the full current content of `src/pages/Projects.tsx` first, then replace the grid section. The file currently wraps each `ProjectCard` in individual `FadeIn` components. Replace the full file:

```typescript
import ProjectCard from "@/components/ProjectCard";
import ComingSoonCard from "@/components/ComingSoonCard";
import { projects } from "@/data/projects";
import { useNavigate } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import { FadeIn } from "@/components/helpers/FadeIn";
import { motion } from "framer-motion";
import { staggerGrid, cardReveal, pageVariants } from "@/lib/motionVariants";

const Projects = () => {
  const navigate = useNavigate();

  return (
    <motion.main
      className="mx-auto flex w-full max-w-3xl flex-col px-6 pt-6 pb-8 sm:pt-12 sm:pb-12 space-y-6"
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      <FadeIn yOffset={10} duration={0.4}>
        <button
          onClick={() => navigate("/")}
          className="flex w-fit items-center gap-3 text-md font-light tracking-tight text-muted-foreground cursor-pointer duration-200 hover:text-foreground"
        >
          <ChevronLeft size={20} strokeWidth={2.25} /> Back to Home
        </button>
      </FadeIn>
      <FadeIn
        delay={0.1}
        yOffset={15}
        duration={0.5}
        className="flex flex-col gap-2"
      >
        <h1 className="text-2xl font-light tracking-tight sm:text-3xl">
          All Projects
        </h1>
        <p className="text-muted-foreground font-light text-lg">
          A collection of things I've built — from embedded systems to cloud infrastructure.
        </p>
      </FadeIn>
      <motion.div
        className="grid grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-8"
        variants={staggerGrid}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-40px" }}
      >
        {projects.map((project) => (
          <motion.div key={project.name} variants={cardReveal}>
            <ProjectCard {...project} />
          </motion.div>
        ))}
        <motion.div variants={cardReveal}>
          <ComingSoonCard />
        </motion.div>
      </motion.div>
    </motion.main>
  );
};

export default Projects;
```

- [ ] **Step 3: Update Stats.tsx — glass calendar card + animated contribution count**

Replace the entire file:

```typescript
import { useEffect, useState, useRef } from "react";
import { useTheme } from "next-themes";
import { ActivityCalendar, type Activity } from "react-activity-calendar";
import { cn } from "@/lib/utils";
import { useMotionValue, useSpring } from "framer-motion";

type StatsProps = {
  year?: "last" | "all" | number;
};

type ContributionResponse = {
  contributions: Activity[];
};

const monthNames = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

const formatActivityDate = (date: string) => {
  const parsed = new Date(date);
  if (Number.isNaN(parsed.getTime())) return date;
  return `${parsed.getDate()} ${monthNames[parsed.getMonth()]} ${parsed.getFullYear()}`;
};

function AnimatedNumber({ value }: { value: number }) {
  const motionValue = useMotionValue(0);
  const spring = useSpring(motionValue, { stiffness: 100, damping: 30 });
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    const unsub = spring.on("change", (v) => setDisplay(Math.round(v)));
    return unsub;
  }, [spring]);

  useEffect(() => {
    motionValue.set(value);
  }, [value, motionValue]);

  return <span>{display.toLocaleString()}</span>;
}

const Stats = ({ year: initialYear = 2026 }: StatsProps) => {
  const { resolvedTheme } = useTheme();
  const [data, setData] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [year, setYear] = useState<StatsProps["year"]>(initialYear);
  const scrollRef = useRef<HTMLDivElement>(null);
  const currentYear = new Date().getFullYear();
  const yearOptions: number[] = Array.from(
    { length: Math.max(currentYear - 2025 + 1, 1) },
    (_, index) => currentYear - index,
  );

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    setTimeout(() => { el.scrollLeft = el.scrollWidth; }, 10);
    const onWheel = (e: WheelEvent) => {
      if (e.deltaY !== 0) {
        e.preventDefault();
        e.stopPropagation();
        el.scrollLeft += e.deltaY;
      }
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, [data]);

  useEffect(() => {
    const controller = new AbortController();
    let active = true;

    const fetchContributions = async () => {
      try {
        if (!active) return;
        setLoading(true);
        setError(null);
        const apiYear = year === currentYear ? "last" : year;
        const res = await fetch(
          `https://github-contributions-api.jogruber.de/v4/jr-cho?y=${apiYear}`,
          { signal: controller.signal },
        );
        if (!res.ok) throw new Error("Failed to fetch contribution data");
        const json = (await res.json()) as ContributionResponse;
        if (active) setData(json.contributions);
      } catch (err) {
        if (err instanceof DOMException && err.name === "AbortError") return;
        if (active) setError(err instanceof Error ? err.message : "Something went wrong");
      } finally {
        if (active) setLoading(false);
      }
    };

    fetchContributions();
    return () => { active = false; controller.abort(); };
  }, [year, currentYear]);

  const total = data.reduce((sum, activity) => sum + activity.count, 0);

  return (
    <section id="stats" className="w-full space-y-3">
      <div className="flex flex-col gap-3 pb-3 sm:flex-row sm:items-end sm:justify-between">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-3">
            <p className="text-2xl font-light tracking-tight sm:text-3xl">
              GitHub Activity
            </p>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2 text-sm">
          {yearOptions.map((option) => {
            const isActive = year === option;
            return (
              <button
                key={option}
                type="button"
                onClick={() => setYear(option)}
                className={cn(
                  "relative px-1.5 pb-1 font-normal tracking-tight text-muted-foreground transition-colors hover:text-foreground",
                  isActive &&
                    "text-foreground after:absolute after:inset-x-0 after:-bottom-0.5 after:h-0.5 after:rounded-full after:bg-foreground",
                )}
              >
                {option}
              </button>
            );
          })}
        </div>
      </div>

      <div className="glass-card p-4 pb-3 sm:p-6 sm:pb-4">
        {loading ? (
          <p className="text-sm text-muted-foreground">Loading GitHub stats...</p>
        ) : error ? (
          <p className="text-sm text-muted-foreground">{error}</p>
        ) : (
          <div className="space-y-3">
            <div
              ref={scrollRef}
              data-lenis-prevent="true"
              className="w-full overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
            >
              <div className="min-w-max">
                <ActivityCalendar
                  data={data}
                  className="bg-transparent"
                  style={{ backgroundColor: "transparent" }}
                  colorScheme={
                    resolvedTheme === "dark"
                      ? "dark"
                      : resolvedTheme === "light"
                        ? "light"
                        : undefined
                  }
                  theme={{
                    light: ["#ebedf0", "#9be9a8", "#40c463", "#30a14e", "#216e39"],
                    dark: ["#212121", "#0e4429", "#006d32", "#26a641", "#39d353"],
                  }}
                  blockSize={11}
                  blockMargin={5}
                  blockRadius={3}
                  fontSize={12}
                  showWeekdayLabels
                  showColorLegend={false}
                  showTotalCount={false}
                  tooltips={{
                    activity: {
                      placement: "top",
                      withArrow: true,
                      offset: { mainAxis: 10 },
                      text: (activity) =>
                        `${formatActivityDate(activity.date)} • ${activity.count} contribution${activity.count === 1 ? "" : "s"}`,
                    },
                  }}
                />
              </div>
            </div>
            <div className="flex items-center justify-between text-[11px] text-muted-foreground">
              <span className="text-xs font-light sm:text-sm">
                <AnimatedNumber value={total} />{" "}
                contributions{" "}
                {year === currentYear ? "in the last year" : `in ${year}`}
              </span>
              <span>Scroll horizontal to view</span>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default Stats;
```

- [ ] **Step 4: Verify stagger + stats**

With dev server running:
- Scroll down to Projects section on home page — cards should stagger in (0.08s between each)
- Stats section: contribution count should animate up from 0 when the section scrolls into view (triggered when `loading` becomes false and `motionValue.set(total)` fires)
- Stats calendar container shows glass treatment
- Navigate to `/projects` — all project cards stagger in on load

- [ ] **Step 5: Commit**

```bash
git add src/components/ProjectSection.tsx src/pages/Projects.tsx src/components/Stats.tsx
git commit -m "feat: stagger grid animations and animated contribution count"
```

---

### Task 5: Navbar Glass + AnimatePresence Mobile Menu

**Files:**
- Modify: `src/components/Navbar.tsx`

**Interfaces:**
- Consumes: `staggerGrid`, `cardReveal` from `src/lib/motionVariants.ts`

- [ ] **Step 1: Update Navbar.tsx**

Replace the entire file:

```typescript
import { Menu, Moon, Sun, TvMinimal, X } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { Tabs, TabsList, TabsTrigger } from "./ui/tabs";
import { useTheme } from "next-themes";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { staggerGrid, cardReveal } from "@/lib/motionVariants";

const navItems = [
  { href: "/projects", label: "Projects" },
  { href: "/blogs", label: "Blogs" },
];

const themes = [
  { theme: "system", icon: TvMinimal },
  { theme: "light", icon: Sun },
  { theme: "dark", icon: Moon },
];

const Navbar = () => {
  const location = useLocation();
  const { theme, setTheme } = useTheme();
  const currentTheme = theme ?? "system";
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-white/10 bg-background/40 backdrop-blur-xl transition-all">
      <div className="mx-auto flex h-16 w-full max-w-3xl items-center justify-between gap-4 px-4 sm:px-6">
        <Link
          to="/"
          onClick={() => setIsOpen(false)}
          className="shrink-0 text-lg font-light tracking-normal text-foreground sm:text-xl hover:opacity-80 transition-opacity"
        >
          @jr_cho_
        </Link>

        {/* Desktop Nav */}
        <div className="hidden sm:flex flex-1 items-center justify-end gap-1 pr-3">
          {navItems.map(({ href, label }) => {
            const isActive = location.pathname.startsWith(href);
            return (
              <Link
                key={label}
                to={href}
                className={`rounded-md px-3 py-2 text-base font-light transition-colors ${
                  isActive
                    ? "!text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {label}
              </Link>
            );
          })}
        </div>

        <div className="hidden sm:block h-6 w-px shrink-0 bg-white/10 mx-2" aria-hidden="true" />

        <div className="hidden sm:flex shrink-0 items-center">
          <Tabs
            value={currentTheme}
            onValueChange={(v) => setTheme(v as "light" | "dark" | "system")}
          >
            <TabsList className="flex rounded-full border border-white/10 bg-white/5 gap-1 p-1">
              {themes.map(({ theme, icon: Icon }) => (
                <TabsTrigger
                  key={theme}
                  value={theme}
                  className="h-6 w-6 rounded-full flex items-center justify-center bg-transparent text-muted-foreground transition-colors hover:text-foreground data-[state=active]:bg-background data-[state=active]:text-foreground! data-[state=active]:shadow-sm"
                >
                  <Icon className="size-[16px]" />
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>

        {/* Mobile Toggle */}
        <button
          className="relative w-9 h-9 flex sm:hidden items-center justify-center p-2 text-muted-foreground hover:text-foreground rounded-md hover:bg-white/5 transition-colors duration-200"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle Menu"
        >
          <motion.span
            animate={{ opacity: isOpen ? 0 : 1 }}
            transition={{ duration: 0.15 }}
            className="absolute"
          >
            <Menu size={20} />
          </motion.span>
          <motion.span
            animate={{ opacity: isOpen ? 1 : 0 }}
            transition={{ duration: 0.15 }}
            className="absolute"
          >
            <X size={20} />
          </motion.span>
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            className="sm:hidden overflow-hidden border-b border-white/10 bg-background/80 backdrop-blur-xl"
          >
            <div className="px-4 py-4 flex flex-col gap-4">
              <motion.div
                variants={staggerGrid}
                initial="hidden"
                animate="visible"
                className="flex flex-col gap-1"
              >
                {navItems.map(({ href, label }) => {
                  const isActive = location.pathname.startsWith(href);
                  return (
                    <motion.div key={label} variants={cardReveal}>
                      <Link
                        to={href}
                        onClick={() => setIsOpen(false)}
                        className={`block rounded-md px-3 py-2.5 text-base font-light tracking-tight transition-colors ${
                          isActive
                            ? "bg-white/5 text-foreground"
                            : "text-muted-foreground hover:text-foreground hover:bg-white/5"
                        }`}
                      >
                        {label}
                      </Link>
                    </motion.div>
                  );
                })}
              </motion.div>

              <div className="h-px w-full bg-white/10" aria-hidden="true" />

              <div className="flex items-center justify-between px-1">
                <span className="text-base font-light tracking-tight text-muted-foreground">
                  Theme
                </span>
                <Tabs
                  value={currentTheme}
                  onValueChange={(v) => setTheme(v as "light" | "dark" | "system")}
                >
                  <TabsList className="flex rounded-full border border-white/10 bg-white/5 gap-1 p-1">
                    {themes.map(({ theme, icon: Icon }) => (
                      <TabsTrigger
                        key={theme}
                        value={theme}
                        className="h-6 w-6 rounded-full flex items-center justify-center bg-transparent text-muted-foreground transition-colors hover:text-foreground data-[state=active]:bg-background data-[state=active]:text-foreground! data-[state=active]:shadow-sm"
                      >
                        <Icon className="size-[16px]" />
                      </TabsTrigger>
                    ))}
                  </TabsList>
                </Tabs>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
```

- [ ] **Step 2: Verify navbar**

With dev server running on mobile viewport (or DevTools responsive mode):
- Navbar has frosted glass appearance (blobs visible behind it)
- Hamburger/X icons fade between each other smoothly
- Mobile menu slides open with height animation, not jump
- Menu items stagger in from bottom
- Menu slides closed on exit
- Desktop nav unchanged

- [ ] **Step 3: Commit**

```bash
git add src/components/Navbar.tsx
git commit -m "feat: glass navbar and AnimatePresence mobile menu with stagger"
```

---

### Task 6: Page Transitions — All Pages

**Files:**
- Modify: `src/App.tsx`
- Modify: `src/pages/Blog.tsx`
- Modify: `src/pages/Contact.tsx`
- Modify: `src/pages/ProjectDetail.tsx`
- Modify: `src/pages/BlogDetail.tsx`

Note: `src/pages/Projects.tsx` was already updated in Task 4 — it already has `pageVariants`.

**Interfaces:**
- Consumes: `pageVariants` from `src/lib/motionVariants.ts`
- Consumes: `AnimatedRoutes` from Task 2 (provides `AnimatePresence mode="wait"` wrapper)

- [ ] **Step 1: Update App.tsx**

The App root `<div>` must become a `motion.div` with `pageVariants`. Replace the entire file:

```typescript
import Hero from "./components/Hero";
import SkillSection from "./components/SkillSection";
import { FadeIn } from "./components/helpers/FadeIn";
import { lazy, Suspense } from "react";
import QuoteSection from "./components/QuoteSection";
import { motion } from "framer-motion";
import { pageVariants } from "./lib/motionVariants";

const ProjectSection = lazy(() => import("./components/ProjectSection"));
const Stats = lazy(() => import("./components/Stats"));

const App = () => {
  return (
    <motion.div
      className="min-h-screen bg-transparent text-foreground flex flex-col relative"
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      <div className="relative z-10 flex flex-col flex-1">
        <main className="mx-auto flex w-full max-w-3xl flex-col gap-20 px-6 pb-6 sm:gap-20 sm:pb-20 overflow-hidden">
          <Hero />
          <FadeIn>
            <SkillSection />
          </FadeIn>
          <Suspense fallback={<div className="h-40 animate-pulse bg-white/5 rounded-2xl" />}>
            <FadeIn>
              <ProjectSection />
            </FadeIn>
          </Suspense>
          <Suspense fallback={<div className="h-40 animate-pulse bg-white/5 rounded-2xl" />}>
            <FadeIn>
              <Stats />
            </FadeIn>
          </Suspense>
          <Suspense fallback={<div className="h-24 animate-pulse bg-white/5 rounded-2xl" />}>
            <FadeIn>
              <QuoteSection />
            </FadeIn>
          </Suspense>
        </main>
      </div>
    </motion.div>
  );
};

export default App;
```

- [ ] **Step 2: Update Blog.tsx**

Read the full current `src/pages/Blog.tsx`, then wrap the `<main>` in `motion.main` with `pageVariants`. Replace:

```typescript
import BlogCard from "@/components/BlogCard";
import { blogs } from "@/data/blog";
import { ChevronLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { FadeIn } from "@/components/helpers/FadeIn";
import { motion } from "framer-motion";
import { pageVariants } from "@/lib/motionVariants";

const Blog = () => {
  const navigate = useNavigate();

  return (
    <motion.main
      className="mx-auto flex w-full max-w-3xl flex-col px-6 pt-6 pb-8 sm:pt-12 sm:pb-12 space-y-6"
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      <FadeIn yOffset={10} duration={0.4}>
        <button
          onClick={() => navigate("/")}
          className="flex w-fit items-center gap-3 text-md font-light tracking-tight text-muted-foreground cursor-pointer duration-200 hover:text-foreground"
        >
          <ChevronLeft size={20} strokeWidth={2.25} /> Back to Home
        </button>
      </FadeIn>
      <FadeIn delay={0.1} yOffset={15} duration={0.5} className="flex flex-col gap-2">
        <h1 className="text-2xl font-light tracking-tight sm:text-3xl">All Blogs</h1>
        <p className="text-muted-foreground font-light text-lg">
          Thoughts, write-ups, and explorations on design, development, and everything in between.
        </p>
      </FadeIn>
      <div className="flex flex-col gap-4 mt-6">
        {blogs.map((blog, idx) => (
          <FadeIn key={blog.title} delay={0.15 + idx * 0.05} yOffset={20}>
            <BlogCard {...blog} />
          </FadeIn>
        ))}
      </div>
    </motion.main>
  );
};

export default Blog;
```

- [ ] **Step 3: Update Contact.tsx**

Replace `<main ...>` opening tag and add closing `</motion.main>`:

Find this opening tag in `src/pages/Contact.tsx`:
```typescript
  return (
    <main className="mx-auto flex w-full max-w-3xl flex-col px-6 pb-8 pt-6 sm:pt-12 sm:pb-24 space-y-8">
```

Replace with:
```typescript
  return (
    <motion.main
      className="mx-auto flex w-full max-w-3xl flex-col px-6 pb-8 pt-6 sm:pt-12 sm:pb-24 space-y-8"
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
    >
```

Find the closing `</main>` and replace with `</motion.main>`.

Also add the social link glass treatment — find each social link `<a>` tag that has `className="group flex items-center justify-between rounded-xl border border-dashed border-border/80 bg-card p-4 ...` and replace with:
```typescript
className="group glass-card flex items-center justify-between p-4 transition-all hover:shadow-[0_8px_24px_rgba(249,115,22,0.12)]"
```

Add imports at the top of the file:
```typescript
import { motion } from "framer-motion";
import { pageVariants } from "@/lib/motionVariants";
```

- [ ] **Step 4: Update ProjectDetail.tsx**

Find the opening `<main ...>` tag:
```typescript
  return (
    <main className="mx-auto flex w-full max-w-3xl flex-col px-6 pt-6 pb-8 sm:pt-12 sm:pb-24 space-y-6">
```

Replace with:
```typescript
  return (
    <motion.main
      className="mx-auto flex w-full max-w-3xl flex-col px-6 pt-6 pb-8 sm:pt-12 sm:pb-24 space-y-6"
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
    >
```

Replace closing `</main>` with `</motion.main>`.

Add imports:
```typescript
import { motion } from "framer-motion";
import { pageVariants } from "@/lib/motionVariants";
```

Note: The "not found" fallback div does NOT need `pageVariants` — it's a static error state.

- [ ] **Step 5: Update BlogDetail.tsx**

Same pattern as ProjectDetail — find the `<main ...>` opening in the return statement (after the not-found check), replace with `motion.main` + `pageVariants`, add imports.

Add imports:
```typescript
import { motion } from "framer-motion";
import { pageVariants } from "@/lib/motionVariants";
```

- [ ] **Step 6: Verify page transitions**

With dev server running:
- Navigate from home to `/projects` — page fades out + scales slightly down, new page fades in + scales up from 0.98
- Navigate back — same transition in reverse
- Navigate to `/contact`, `/blogs` — same fade+scale on each route change
- No flash of unstyled content between routes
- Existing FadeIn animations on page content still fire after page transition completes

- [ ] **Step 7: Commit**

```bash
git add src/App.tsx src/pages/Blog.tsx src/pages/Contact.tsx src/pages/ProjectDetail.tsx src/pages/BlogDetail.tsx
git commit -m "feat: add page transitions with fade+scale AnimatePresence"
```

---

## Self-Review

**Spec coverage check:**
- ✅ Warm amber/orange gradient blobs (Task 2) — amber top-right, burnt orange bottom-left, diagonal
- ✅ Blob pulse animation 12s cycle with 4s phase offset (Task 2)
- ✅ Light mode warm cream background (`oklch(0.975 0.008 85)`) (Task 1)
- ✅ `.glass-card` dark + light modes (Task 1)
- ✅ Page transitions fade+scale 0.98→1 (Task 6, AnimatedRoutes Task 2)
- ✅ ProjectCard glass + hover lift + amber glow + whileTap (Task 3)
- ✅ ComingSoonCard glass (Task 3)
- ✅ ProjectSection stagger grid 0.08s (Task 4)
- ✅ Projects page stagger grid (Task 4)
- ✅ Stats count-up AnimatedNumber (Task 4)
- ✅ Stats calendar card glass (Task 4)
- ✅ Navbar glass backdrop-blur-xl (Task 5)
- ✅ Navbar mobile AnimatePresence height animation (Task 5)
- ✅ Mobile menu items stagger (Task 5)
- ✅ Hero, QuoteSection, SkillRow untouched (all tasks avoid these)

**Type consistency:**
- `staggerGrid` and `cardReveal` defined in Task 1, consumed in Tasks 4 and 5 ✅
- `pageVariants` defined in Task 1, consumed in Tasks 4 and 6 ✅
- `AnimatedNumber` component defined and consumed within `Stats.tsx` (Task 4) ✅
- `AnimatedRoutes` created in Task 2, imported in main.tsx in Task 2 ✅

**No placeholders found.** All steps contain actual code.
