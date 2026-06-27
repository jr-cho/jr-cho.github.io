# Ground Station Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Re-skin the portfolio with a graphite + amber palette, a real Space Grotesk / Inter / JetBrains Mono type system, restrained ground-station/telemetry cues, and one signature element (GitHub contributions as a telemetry readout) — keeping the macOS liquid-glass surfaces and existing layout/spacing.

**Architecture:** Token-first. Color and font changes live in `src/index.css` (CSS custom properties + Tailwind `@theme inline`). Components then consume the new tokens and add mono/display classes. No layout rewrite. One component (`Stats`) gets a real visual rebuild for the signature.

**Tech Stack:** Vite 8, React 19, Tailwind CSS v4 (`@tailwindcss/vite`), framer-motion, next-themes, `@fontsource/*` for self-hosted fonts, `react-activity-calendar`.

## Global Constraints

- Build must stay green: `npm run build` (runs `tsc -b && vite build`) must pass after every task.
- Lint must stay green: `npm run lint`.
- Light mode is primary; dark mode is retained and retuned to the same graphite + amber language.
- Amber `#F5A623` appears ONLY on the telemetry readout (active cells, total) and a single `● LIVE/ONLINE` status dot. Never on generic buttons, links, hovers, or body text.
- Graphite ink `#1C1C1E`; warm off-white background `#F4F4F2`; hairline `rgba(28,28,30,.12)`.
- Fonts: Space Grotesk = display/headings, Inter = body, JetBrains Mono = data/labels. Self-hosted via `@fontsource`, no external font CDN.
- Keep liquid-glass classes (`.glass-card`, `.glass-navbar`) and the dock/nav structure intact.
- Respect `prefers-reduced-motion` (already handled globally in `index.css` + `MotionConfig reducedMotion="user"`).
- Preserve existing spacing work (commit `612aee4`).

---

### Task 1: Self-host fonts and wire the type system

**Files:**
- Modify: `package.json` (add deps)
- Modify: `src/main.tsx:1-5` (import font CSS)
- Modify: `src/index.css:26-28,71-73,152-191` (font tokens + `@theme inline`)
- Modify: `index.html:8` (theme-color), `index.html:33` (body base font handled by CSS, no change needed)

**Interfaces:**
- Produces: Tailwind utilities `font-display`, `font-sans`, `font-mono` mapped to Space Grotesk, Inter, JetBrains Mono. Later tasks use `font-display` on headings and `font-mono` on data labels.

- [ ] **Step 1: Install fonts**

```bash
npm install @fontsource/space-grotesk @fontsource/inter @fontsource/jetbrains-mono
```

Expected: three packages added to `dependencies`, exit 0.

- [ ] **Step 2: Import font weights in `src/main.tsx`**

Add below `import "./index.css";` (line 3):

```ts
import "@fontsource-variable/inter";
import "@fontsource/space-grotesk/400.css";
import "@fontsource/space-grotesk/500.css";
import "@fontsource/space-grotesk/600.css";
import "@fontsource/space-grotesk/700.css";
import "@fontsource/jetbrains-mono/400.css";
import "@fontsource/jetbrains-mono/500.css";
```

Note: Inter ships a variable package `@fontsource-variable/inter`. If that import fails to resolve at build, fall back to `import "@fontsource/inter/400.css";` and `/500.css`, `/600.css`.

- [ ] **Step 3: Set font custom properties in `src/index.css`**

In `:root` (replace lines 26-28) and `.dark` (replace lines 71-73), set:

```css
  --font-sans: "Inter Variable", "Inter", ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  --font-display: "Space Grotesk", ui-sans-serif, system-ui, -apple-system, sans-serif;
  --font-mono: "JetBrains Mono", ui-monospace, SFMono-Regular, Menlo, monospace;
```

(Remove the `--font-serif` lines; serif is unused.)

- [ ] **Step 4: Expose `--font-display` to Tailwind**

In the `@theme inline` block (around lines 171-173), replace the font block with:

```css
  --font-sans: var(--font-sans);
  --font-mono: var(--font-mono);
  --font-display: var(--font-display);
```

(Remove `--font-serif: var(--font-serif);` at line 173.)

- [ ] **Step 5: Update `index.html` theme-color**

Change line 8 from `#007AFF` to `#1C1C1E`:

```html
  <meta name="theme-color" content="#1C1C1E" />
```

- [ ] **Step 6: Build to verify**

Run: `npm run build`
Expected: PASS, no TS or Vite errors. Bundle includes font assets.

- [ ] **Step 7: Commit**

```bash
git add package.json package-lock.json src/main.tsx src/index.css index.html
git commit -m "feat(type): self-host Space Grotesk + Inter + JetBrains Mono"
```

---

### Task 2: Graphite + amber color tokens

**Files:**
- Modify: `src/index.css:5-48` (`:root` light) and `:50-91` (`.dark`)
- Modify: `src/index.css:283-291` (`::selection`)

**Interfaces:**
- Produces: retuned semantic tokens (`--background`, `--foreground`, `--primary`, `--ring`, `--border`, `--muted-foreground`) plus new `--accent-amber`. Later tasks reference `--accent-amber` and the graphite `--primary`.

- [ ] **Step 1: Rewrite `:root` (light) color tokens**

In `src/index.css` `:root`, set these values (leave shadows, radius, spacing untouched):

```css
  --background: oklch(0.967 0.002 95);     /* #F4F4F2 warm off-white */
  --foreground: oklch(0.205 0.004 285);    /* #1C1C1E graphite */
  --card: oklch(1 0 0);
  --card-foreground: oklch(0.205 0.004 285);
  --primary: oklch(0.205 0.004 285);       /* graphite, not blue */
  --primary-foreground: oklch(0.985 0 0);
  --secondary: oklch(0.92 0.002 95);
  --secondary-foreground: oklch(0.205 0.004 285);
  --muted: oklch(0.92 0.002 95);
  --muted-foreground: oklch(0.50 0.004 285); /* ~#6B6B70 */
  --accent: oklch(0.92 0.002 95);
  --accent-foreground: oklch(0.205 0.004 285);
  --border: oklch(0.205 0.004 285 / 0.12);   /* graphite hairline */
  --input: oklch(0.205 0.004 285 / 0.14);
  --ring: oklch(0.205 0.004 285 / 0.45);     /* graphite focus ring */
  --accent-amber: #F5A623;                    /* signature only */
```

Remove `--blob-1/2/3` from `:root`.

- [ ] **Step 2: Rewrite `.dark` color tokens**

In `.dark`, set:

```css
  --background: oklch(0.18 0.004 285);     /* dark graphite */
  --foreground: oklch(0.97 0 0);
  --card: oklch(0.23 0.004 285);
  --card-foreground: oklch(0.97 0 0);
  --primary: oklch(0.97 0 0);              /* light graphite on dark */
  --primary-foreground: oklch(0.18 0.004 285);
  --secondary: oklch(0.26 0.004 285);
  --secondary-foreground: oklch(0.97 0 0);
  --muted: oklch(0.28 0.004 285);
  --muted-foreground: oklch(0.68 0.004 285);
  --accent: oklch(0.30 0.004 285);
  --accent-foreground: oklch(0.97 0 0);
  --border: oklch(0.97 0 0 / 0.12);
  --input: oklch(0.97 0 0 / 0.14);
  --ring: oklch(0.97 0 0 / 0.45);
  --accent-amber: #F5A623;
```

Remove `--blob-1/2/3` from `.dark`.

- [ ] **Step 3: Retune `::selection`**

Replace lines 283-291:

```css
::selection {
  background-color: rgba(245, 166, 35, 0.22);
  color: inherit;
}

.dark ::selection {
  background-color: rgba(245, 166, 35, 0.28);
  color: inherit;
}
```

- [ ] **Step 4: Expose amber to Tailwind**

In `@theme inline`, add after the color block:

```css
  --color-accent-amber: var(--accent-amber);
```

- [ ] **Step 5: Build to verify**

Run: `npm run build`
Expected: PASS.

- [ ] **Step 6: Visual check**

Run `npm run dev`, open the site. Confirm: background warm off-white, text graphite, buttons graphite (not blue), focus rings graphite. No amber visible yet anywhere.

- [ ] **Step 7: Commit**

```bash
git add src/index.css
git commit -m "feat(color): graphite + amber palette, drop AI-blue"
```

---

### Task 3: Remove ambient rainbow blobs

**Files:**
- Modify: `src/components/AmbientBackground.tsx` (replace blobs with faint graphite grid)
- Modify: `src/main.tsx:32` (update comment)

**Interfaces:**
- Consumes: nothing. Produces: a calm fixed background layer; no blob tokens referenced.

- [ ] **Step 1: Replace `AmbientBackground.tsx` body**

Replace the whole file with a faint static grid (no rainbow, no per-blob animation):

```tsx
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";

export default function AmbientBackground() {
  const reduce = useReducedMotion();
  const { scrollY } = useScroll();
  const drift = useTransform(scrollY, [0, 1200], [0, reduce ? 0 : 40]);

  return (
    <motion.div
      style={{ y: drift }}
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
      aria-hidden="true"
    >
      {/* Faint instrument grid — ground-station texture, not decoration */}
      <div
        className="absolute inset-0 opacity-[0.04] dark:opacity-[0.06]"
        style={{
          backgroundImage:
            "linear-gradient(to right, var(--foreground) 1px, transparent 1px), linear-gradient(to bottom, var(--foreground) 1px, transparent 1px)",
          backgroundSize: "64px 64px",
          maskImage:
            "radial-gradient(ellipse 80% 60% at 50% 0%, black 40%, transparent 100%)",
          WebkitMaskImage:
            "radial-gradient(ellipse 80% 60% at 50% 0%, black 40%, transparent 100%)",
        }}
      />
    </motion.div>
  );
}
```

- [ ] **Step 2: Update the comment in `src/main.tsx`**

Change line 32 comment from `Ambient Apple mesh blob layer` to:

```tsx
              {/* Ambient instrument grid — fixed, behind all content */}
```

- [ ] **Step 3: Build to verify**

Run: `npm run build`
Expected: PASS.

- [ ] **Step 4: Visual check**

`npm run dev`: confirm the purple/blue/cyan blobs are gone, replaced by a barely-visible grid that fades out below the fold. No console warnings about missing `--blob-*`.

- [ ] **Step 5: Commit**

```bash
git add src/components/AmbientBackground.tsx src/main.tsx
git commit -m "feat(bg): replace rainbow blobs with faint instrument grid"
```

---

### Task 4: Hero — display type, mono micro-line, weights

**Files:**
- Modify: `src/components/Hero.tsx`

**Interfaces:**
- Consumes: `font-display`, `font-mono`, `--accent-amber` from Tasks 1-2.
- Produces: the hero pattern (display heading + mono status line) reused conceptually by section headers in Task 5.

- [ ] **Step 1: Name heading → display, real weight**

`src/components/Hero.tsx:35-37` — change the name `h1` class from:

`text-2xl font-light tracking-tight sm:text-2xl md:text-3xl`
to:
`font-display text-2xl font-semibold tracking-tight sm:text-2xl md:text-3xl`

- [ ] **Step 2: Add mono status micro-line under the handle**

In the identity column, replace the handle `<p>` (lines 38-40) with the handle plus a mono status line:

```tsx
            <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
              @jr-cho
            </p>
            <p className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
              SWE / PLATFORM
              <span className="text-muted-foreground/50">·</span>
              REV.2026
              <span className="inline-flex items-center gap-1 text-foreground">
                <span
                  className="h-1.5 w-1.5 rounded-full"
                  style={{ backgroundColor: "var(--accent-amber)" }}
                />
                ONLINE
              </span>
            </p>
```

- [ ] **Step 3: Tagline heading → display weight**

`src/components/Hero.tsx:65` — change `text-[1.7rem] font-normal tracking-tight leading-tight ...` to `font-display text-[1.7rem] font-medium tracking-tight leading-tight ...` (keep the responsive sizes). The muted `<span>` inside stays `font-light` for contrast.

- [ ] **Step 4: Body prose stays Inter**

No change to line 71 (`font-light` body is fine as Inter body text).

- [ ] **Step 5: Build + lint**

Run: `npm run build && npm run lint`
Expected: PASS.

- [ ] **Step 6: Visual check**

`npm run dev`: name renders in Space Grotesk with weight; mono status line shows under handle with a single small amber dot before ONLINE. Buttons graphite.

- [ ] **Step 7: Commit**

```bash
git add src/components/Hero.tsx
git commit -m "feat(hero): display type, mono status line, weight contrast"
```

---

### Task 5: Section headers — mono eyebrow + display title + hairline

**Files:**
- Create: `src/components/helpers/SectionHeader.tsx`
- Modify: `src/components/SkillSection.tsx:11-25`
- Modify: `src/components/ProjectSection.tsx:11-16`
- Modify: `src/components/Stats.tsx:96-103` (title portion only; readout handled in Task 7)

**Interfaces:**
- Produces: `SectionHeader` component.

```ts
type SectionHeaderProps = {
  index: string;        // e.g. "FIG.02"
  title: string;        // e.g. "Projects"
  children?: React.ReactNode; // optional right-side control
};
export default function SectionHeader(props: SectionHeaderProps): JSX.Element;
```

- [ ] **Step 1: Create `SectionHeader.tsx`**

```tsx
import type { ReactNode } from "react";

type SectionHeaderProps = {
  index: string;
  title: string;
  children?: ReactNode;
};

export default function SectionHeader({ index, title, children }: SectionHeaderProps) {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-end justify-between gap-3">
        <div className="flex items-baseline gap-3">
          <span className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
            {index}
          </span>
          <h2 className="font-display text-2xl font-semibold tracking-tight sm:text-3xl">
            {title}
          </h2>
        </div>
        {children}
      </div>
      {/* hairline rule with corner ticks */}
      <div className="relative h-px w-full bg-border">
        <span className="absolute -top-1 left-0 h-2 w-px bg-border" />
        <span className="absolute -top-1 right-0 h-2 w-px bg-border" />
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Use it in `SkillSection.tsx`**

Replace the header block (lines 12-25, the `<div className="flex items-center justify-between">…</div>`) with:

```tsx
      <SectionHeader index="FIG.01" title="Technologies">
        <button
          onClick={() => setIsInline(!isInline)}
          className="flex items-center gap-2 rounded-md border border-dashed border-border bg-card px-2.5 py-1.5 font-mono text-xs uppercase tracking-widest text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
          aria-pressed={isInline}
          title={isInline ? "Show animated rows" : "Show static grid"}
        >
          {isInline ? <LayoutGrid size={14} /> : <List size={14} />}
          {isInline ? "Animated" : "Grid"}
        </button>
      </SectionHeader>
```

Add `import SectionHeader from "./helpers/SectionHeader";` at the top.

- [ ] **Step 3: Use it in `ProjectSection.tsx`**

Replace lines 12-16 (`<div className="flex gap-3">…</div>`) with:

```tsx
      <SectionHeader index="FIG.02" title="Projects" />
```

Add the import.

- [ ] **Step 4: Use it in `Stats.tsx` title row**

Replace the title `<p>` block (lines 97-103) with a `SectionHeader` carrying the year buttons as children. Replace the outer `<div className="flex flex-col gap-3 pb-3 ...">` wrapper (lines 96-123) so the year buttons become the `children`:

```tsx
      <SectionHeader index="FIG.03" title="GitHub Activity">
        <div className="flex flex-wrap items-center gap-2 font-mono text-sm">
          {yearOptions.map((option) => {
            const isActive = year === option;
            return (
              <button
                key={option}
                type="button"
                onClick={() => setYear(option)}
                className={cn(
                  "relative px-1.5 pb-1 tracking-tight text-muted-foreground transition-colors hover:text-foreground",
                  isActive &&
                    "text-foreground after:absolute after:inset-x-0 after:-bottom-0.5 after:h-0.5 after:rounded-full after:bg-foreground",
                )}
              >
                {option}
              </button>
            );
          })}
        </div>
      </SectionHeader>
```

Add the import. (The glass-card readout below stays for Task 7.)

- [ ] **Step 5: Build + lint**

Run: `npm run build && npm run lint`
Expected: PASS.

- [ ] **Step 6: Visual check**

`npm run dev`: each section shows `FIG.0x` mono eyebrow + Space Grotesk title + hairline rule with end ticks. Consistent across Technologies / Projects / GitHub Activity.

- [ ] **Step 7: Commit**

```bash
git add src/components/helpers/SectionHeader.tsx src/components/SkillSection.tsx src/components/ProjectSection.tsx src/components/Stats.tsx
git commit -m "feat(sections): mono eyebrow + display title + hairline headers"
```

---

### Task 6: Project cards — graphite, mono tags

**Files:**
- Modify: `src/components/ProjectCard.tsx`
- Modify: `src/components/SkillSection.tsx:31,37` (skill tag/category labels → mono)

**Interfaces:**
- Consumes: `font-display`, `font-mono`, graphite tokens.

- [ ] **Step 1: Card title → display; drop blue hover shadow**

`src/components/ProjectCard.tsx:21` — change `boxShadow: "0 12px 40px rgba(0,122,255,0.20)"` to `boxShadow: "0 12px 40px rgba(28,28,30,0.18)"`.

`src/components/ProjectCard.tsx:36` — change card name class from `text-xl font-light tracking-tight` to `font-display text-lg font-semibold tracking-tight`.

- [ ] **Step 2: Details link already mono — keep; make tech row a labeled mono strip**

Replace the tech-stack row (lines 42-46) with a mono label + icons:

```tsx
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
```

- [ ] **Step 3: Skill section labels → mono (consistency)**

In `SkillSection.tsx`, the category labels at lines 31 and 52 already use `text-xs font-medium uppercase tracking-widest`; add `font-mono` to both so category labels read as data labels. The skill chips (line 38) change `font-light` → keep, but it's body — leave as is.

- [ ] **Step 4: Build + lint**

Run: `npm run build && npm run lint`
Expected: PASS.

- [ ] **Step 5: Visual check**

`npm run dev`: project card titles in Space Grotesk; `stack` mono label before tech icons; hover lift shadow is graphite, not blue. Skill category labels are mono.

- [ ] **Step 6: Commit**

```bash
git add src/components/ProjectCard.tsx src/components/SkillSection.tsx
git commit -m "feat(cards): graphite styling + mono data labels"
```

---

### Task 7: Signature — contributions as telemetry readout

**Files:**
- Modify: `src/components/Stats.tsx:125-182` (the glass-card readout) and `:149-152` (calendar theme ramp)

**Interfaces:**
- Consumes: `--accent-amber`, `AnimatedNumber` (already in file), `react-activity-calendar` theme prop.

- [ ] **Step 1: Amber/graphite contribution ramp**

Replace the `theme` prop (lines 149-152) so cells ramp from faint graphite to amber:

```tsx
                  theme={{
                    light: ["rgba(28,28,30,0.06)", "rgba(245,166,35,0.30)", "rgba(245,166,35,0.55)", "rgba(245,166,35,0.78)", "#F5A623"],
                    dark: ["rgba(255,255,255,0.06)", "rgba(245,166,35,0.30)", "rgba(245,166,35,0.55)", "rgba(245,166,35,0.80)", "#F5A623"],
                  }}
```

- [ ] **Step 2: Add the mono readout frame above the calendar**

Inside the `glass-card` (after the opening `<div className="space-y-3">` at line 131), add a header row before the scroll container:

```tsx
            <div className="flex items-center justify-between font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
              <span className="flex items-center gap-2">
                <span
                  className="h-1.5 w-1.5 rounded-full"
                  style={{ backgroundColor: "var(--accent-amber)" }}
                />
                Activity · Signal
              </span>
              <span>{year === currentYear ? "REV.2026" : `REV.${year}`}</span>
            </div>
```

- [ ] **Step 3: Rework the footer line into a telemetry total**

Replace the footer `<div>` (lines 172-179) with:

```tsx
            <div className="flex items-center justify-between font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
              <span className="text-foreground">
                <AnimatedNumber value={total} /> contributions{" "}
                <span style={{ color: "var(--accent-amber)" }}>↑</span>{" "}
                {year === currentYear ? "last 12 mo" : year}
              </span>
              <span className="hidden sm:inline">swipe to explore →</span>
            </div>
```

- [ ] **Step 4: Build + lint**

Run: `npm run build && npm run lint`
Expected: PASS.

- [ ] **Step 5: Visual check**

`npm run dev`: the GitHub card now reads as an instrument readout — `● ACTIVITY · SIGNAL` (amber dot) top-left, `REV.2026` top-right, amber-ramped cells, mono total counting up with an amber `↑`. This is the one bold moment; confirm amber appears nowhere else on the page.

- [ ] **Step 6: Commit**

```bash
git add src/components/Stats.tsx
git commit -m "feat(signature): contributions as telemetry readout"
```

---

### Task 8: Dock/nav active state + remaining pages

**Files:**
- Modify: `src/components/Dock.tsx:51` and `src/components/helpers/DockItem.tsx:35` (active state)
- Modify: `src/pages/Projects.tsx`, `src/pages/Contact.tsx`, `src/pages/ProjectDetail.tsx`, `src/components/intro/IntroSequence.tsx` (display headings, drop blue shadow)
- Modify: `src/components/Footer.tsx:14` (name → display)

**Interfaces:**
- Consumes: `font-display`, graphite `--primary`.

- [ ] **Step 1: Dock active state legibility**

`bg-primary/10 text-primary` now renders graphite-on-glass (primary is graphite). Keep it — verify visually it reads as "active". If too subtle, change both `Dock.tsx:51` and `DockItem.tsx:35` active branch to `bg-foreground/10 text-foreground`.

- [ ] **Step 2: Page headings → display**

Add `font-display` and bump weight from `font-light` to `font-semibold` on these headings:
- `src/pages/Projects.tsx:29` (`All Projects` h1)
- `src/pages/Contact.tsx:34` (`Let's connect` h1)
- `src/pages/ProjectDetail.tsx:51` (project h1), `:89`, `:105`, `:111` (section h2s → `font-display font-medium`)
- `src/components/intro/IntroSequence.tsx:60` (intro h → `font-display`, keep its weight)
- `src/components/Footer.tsx:14` (name span → `font-display`)

- [ ] **Step 3: Drop remaining blue shadow**

`src/pages/Contact.tsx:57` — change `hover:shadow-[0_8px_24px_rgba(0,122,255,0.16)]` to `hover:shadow-[0_8px_24px_rgba(28,28,30,0.14)]`.

- [ ] **Step 4: Build + lint**

Run: `npm run build && npm run lint`
Expected: PASS.

- [ ] **Step 5: Visual check**

`npm run dev`: navigate Home / Projects / Contact / a project detail + reload to see intro. Headings all Space Grotesk; active dock item legible; no blue anywhere; amber only on the Stats readout.

- [ ] **Step 6: Commit**

```bash
git add src/components/Dock.tsx src/components/helpers/DockItem.tsx src/pages/Projects.tsx src/pages/Contact.tsx src/pages/ProjectDetail.tsx src/components/intro/IntroSequence.tsx src/components/Footer.tsx
git commit -m "feat(pages): display headings, graphite nav, drop blue shadows"
```

---

## Self-Review

**Spec coverage:**
- Color tokens (graphite+amber, drop blue+blobs) → Tasks 2, 3. ✓
- Font self-hosting + Tailwind wiring → Task 1. ✓
- Per-component polish (Hero, Skill, Project, ProjectCard, Stats, Footer, Dock) → Tasks 4, 5, 6, 8. ✓
- Signature (contributions readout) → Task 7. ✓
- Remove ambient rainbow → Task 3. ✓
- Dark mode retained/retuned → Task 2 (`.dark` block). ✓
- Quality floor (focus ring graphite, reduced motion, amber on fills not text) → Tasks 2, 7. ✓

**Placeholder scan:** No TBD/TODO; every code step shows full code.

**Type consistency:** `SectionHeader` props (`index`, `title`, `children`) consistent across Tasks 5 usages. `--accent-amber` token name consistent across Tasks 2, 4, 7. `AnimatedNumber` reused from existing file.
