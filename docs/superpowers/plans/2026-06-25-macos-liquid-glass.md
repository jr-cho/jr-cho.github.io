# macOS Liquid Glass Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the current warm amber/orange aesthetic with Apple macOS 16 Liquid Glass — Apple color palette, upgraded glass panels with specular highlights, animated Apple mesh background, and a floating liquid glass navbar.

**Architecture:** Pure CSS + component styling changes across 4 tasks. `index.css` is the foundation (all color tokens, glass classes, blob CSS vars). `main.tsx` gets new ambient blob elements. `Navbar.tsx` restructures into a floating pill. `ProjectCard.tsx` and `Hero.tsx` get small className updates. No new components or files created.

**Tech Stack:** React 18, Framer Motion v12, Tailwind CSS v4, TypeScript

## Global Constraints

- Tailwind v4 (`@import "tailwindcss"`) — CSS vars use `oklch()` format throughout
- Dark mode via `.dark` class selector (`@custom-variant dark (&:is(.dark *))`)
- Do NOT change: font stack, type scale, layout `max-w-3xl`, motion variants, content, or GitHub activity calendar colors
- All existing animations (Hero stagger, QuoteSection crossfade, SkillRow marquee) must remain unchanged
- `framer-motion` already at `^12.38.0` — no new deps needed
- Spec: `docs/superpowers/specs/2026-06-25-macos-liquid-glass-design.md`

---

### Task 1: Foundation — Color Tokens, Glass CSS, Blob Vars, Radius, Selection

**Files:**
- Modify: `src/index.css`

**Interfaces:**
- Produces: Apple color token system consumed by all components via Tailwind utilities (`bg-background`, `text-primary`, `border-border`, etc.)
- Produces: `.glass-card` and `.dark .glass-card` — consumed by `ProjectCard.tsx`, `Stats.tsx`, `BlogCard.tsx`
- Produces: `.glass-navbar` and `.dark .glass-navbar` — consumed by `Navbar.tsx` (Task 3)
- Produces: `--blob-1`, `--blob-2`, `--blob-3` CSS vars — consumed by `main.tsx` (Task 2)

- [ ] **Step 1: Replace the entire `:root { }` block**

In `src/index.css`, find the current `:root {` block and replace it entirely:

```css
:root {
  --background: oklch(0.957 0.005 264);
  --foreground: oklch(0.1450 0 0);
  --card: oklch(1 0 0);
  --card-foreground: oklch(0.1450 0 0);
  --popover: oklch(1 0 0);
  --popover-foreground: oklch(0.1450 0 0);
  --primary: oklch(0.537 0.232 258);
  --primary-foreground: oklch(1 0 0);
  --secondary: oklch(0.928 0.006 264);
  --secondary-foreground: oklch(0.2050 0 0);
  --muted: oklch(0.928 0.006 264);
  --muted-foreground: oklch(0.588 0.010 264);
  --accent: oklch(0.928 0.006 264);
  --accent-foreground: oklch(0.2050 0 0);
  --destructive: oklch(0.5770 0.2450 27.3250);
  --destructive-foreground: oklch(1 0 0);
  --border: oklch(0.880 0.005 264);
  --input: oklch(0.880 0.005 264);
  --ring: oklch(0.537 0.232 258);
  --chart-1: oklch(0.8100 0.1000 252);
  --chart-2: oklch(0.6200 0.1900 260);
  --chart-3: oklch(0.5500 0.2200 263);
  --chart-4: oklch(0.4900 0.2200 264);
  --chart-5: oklch(0.4200 0.1800 266);
  --sidebar: oklch(0.957 0.005 264);
  --sidebar-foreground: oklch(0.1450 0 0);
  --sidebar-primary: oklch(0.537 0.232 258);
  --sidebar-primary-foreground: oklch(1 0 0);
  --sidebar-accent: oklch(0.928 0.006 264);
  --sidebar-accent-foreground: oklch(0.2050 0 0);
  --sidebar-border: oklch(0.880 0.005 264);
  --sidebar-ring: oklch(0.537 0.232 258);
  --blob-1: rgba(180, 165, 255, 0.30);
  --blob-2: rgba(120, 195, 255, 0.25);
  --blob-3: rgba(145, 215, 230, 0.20);
  --font-sans: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'Noto Sans', sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji';
  --font-serif: ui-serif, Georgia, Cambria, "Times New Roman", Times, serif;
  --font-mono: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
  --radius: 0.75rem;
  --shadow-x: 0;
  --shadow-y: 1px;
  --shadow-blur: 3px;
  --shadow-spread: 0px;
  --shadow-opacity: 0.1;
  --shadow-color: oklch(0 0 0);
  --shadow-2xs: 0 1px 3px 0px hsl(0 0% 0% / 0.05);
  --shadow-xs: 0 1px 3px 0px hsl(0 0% 0% / 0.05);
  --shadow-sm: 0 1px 3px 0px hsl(0 0% 0% / 0.10), 0 1px 2px -1px hsl(0 0% 0% / 0.10);
  --shadow: 0 1px 3px 0px hsl(0 0% 0% / 0.10), 0 1px 2px -1px hsl(0 0% 0% / 0.10);
  --shadow-md: 0 1px 3px 0px hsl(0 0% 0% / 0.10), 0 2px 4px -1px hsl(0 0% 0% / 0.10);
  --shadow-lg: 0 1px 3px 0px hsl(0 0% 0% / 0.10), 0 4px 6px -1px hsl(0 0% 0% / 0.10);
  --shadow-xl: 0 1px 3px 0px hsl(0 0% 0% / 0.10), 0 8px 10px -1px hsl(0 0% 0% / 0.10);
  --shadow-2xl: 0 1px 3px 0px hsl(0 0% 0% / 0.25);
  --tracking-normal: 0em;
  --spacing: 0.25rem;
  --scrollbar-thumb: hsl(0 0% 42% / 0.35);
  --scrollbar-thumb-hover: hsl(0 0% 32% / 0.5);
}
```

- [ ] **Step 2: Replace the entire `.dark { }` block**

Find the current `.dark {` block and replace it entirely:

```css
.dark {
  --background: oklch(0.138 0.006 285);
  --foreground: oklch(0.9850 0 0);
  --card: oklch(0.212 0.006 285);
  --card-foreground: oklch(0.9850 0 0);
  --popover: oklch(0.212 0.006 285);
  --popover-foreground: oklch(0.9850 0 0);
  --primary: oklch(0.573 0.228 258);
  --primary-foreground: oklch(1 0 0);
  --secondary: oklch(0.212 0.006 285);
  --secondary-foreground: oklch(0.9850 0 0);
  --muted: oklch(0.272 0.005 285);
  --muted-foreground: oklch(0.680 0.010 264);
  --accent: oklch(0.320 0.006 285);
  --accent-foreground: oklch(0.9850 0 0);
  --destructive: oklch(0.7040 0.1910 22.2160);
  --destructive-foreground: oklch(0.9850 0 0);
  --border: oklch(0.272 0.005 285);
  --input: oklch(0.320 0.006 285);
  --ring: oklch(0.573 0.228 258);
  --chart-1: oklch(0.8100 0.1000 252);
  --chart-2: oklch(0.6200 0.1900 260);
  --chart-3: oklch(0.5500 0.2200 263);
  --chart-4: oklch(0.4900 0.2200 264);
  --chart-5: oklch(0.4200 0.1800 266);
  --sidebar: oklch(0.138 0.006 285);
  --sidebar-foreground: oklch(0.9850 0 0);
  --sidebar-primary: oklch(0.573 0.228 258);
  --sidebar-primary-foreground: oklch(1 0 0);
  --sidebar-accent: oklch(0.272 0.005 285);
  --sidebar-accent-foreground: oklch(0.9850 0 0);
  --sidebar-border: oklch(0.272 0.005 285);
  --sidebar-ring: oklch(0.573 0.228 258);
  --blob-1: rgba(80, 60, 200, 0.50);
  --blob-2: rgba(10, 40, 150, 0.55);
  --blob-3: rgba(60, 10, 120, 0.45);
  --font-sans: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'Noto Sans', sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji';
  --font-serif: ui-serif, Georgia, Cambria, "Times New Roman", Times, serif;
  --font-mono: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
  --radius: 0.75rem;
  --shadow-x: 0;
  --shadow-y: 1px;
  --shadow-blur: 3px;
  --shadow-spread: 0px;
  --shadow-opacity: 0.1;
  --shadow-color: oklch(0 0 0);
  --shadow-2xs: 0 1px 3px 0px hsl(0 0% 0% / 0.05);
  --shadow-xs: 0 1px 3px 0px hsl(0 0% 0% / 0.05);
  --shadow-sm: 0 1px 3px 0px hsl(0 0% 0% / 0.10), 0 1px 2px -1px hsl(0 0% 0% / 0.10);
  --shadow: 0 1px 3px 0px hsl(0 0% 0% / 0.10), 0 1px 2px -1px hsl(0 0% 0% / 0.10);
  --shadow-md: 0 1px 3px 0px hsl(0 0% 0% / 0.10), 0 2px 4px -1px hsl(0 0% 0% / 0.10);
  --shadow-lg: 0 1px 3px 0px hsl(0 0% 0% / 0.10), 0 4px 6px -1px hsl(0 0% 0% / 0.10);
  --shadow-xl: 0 1px 3px 0px hsl(0 0% 0% / 0.10), 0 8px 10px -1px hsl(0 0% 0% / 0.10);
  --shadow-2xl: 0 1px 3px 0px hsl(0 0% 0% / 0.25);
  --scrollbar-thumb: hsl(0 0% 58% / 0.28);
  --scrollbar-thumb-hover: hsl(0 0% 68% / 0.4);
}
```

- [ ] **Step 3: Replace `.glass-card` and `.dark .glass-card` CSS**

Find and replace the existing `.glass-card` block (currently at lines ~119–133):

```css
/* Liquid Glass — light mode */
.glass-card {
  backdrop-filter: blur(60px) saturate(1.8) brightness(1.02);
  -webkit-backdrop-filter: blur(60px) saturate(1.8) brightness(1.02);
  background: linear-gradient(
    145deg,
    rgba(255, 255, 255, 0.22) 0%,
    rgba(255, 255, 255, 0.08) 100%
  );
  border: 0.5px solid rgba(255, 255, 255, 0.5);
  border-radius: 20px;
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.6),
    inset 0 -0.5px 0 rgba(0, 0, 0, 0.06),
    0 20px 60px rgba(0, 0, 0, 0.08),
    0 4px 16px rgba(0, 0, 0, 0.05);
}

/* Liquid Glass — dark mode */
.dark .glass-card {
  backdrop-filter: blur(60px) saturate(1.8) brightness(0.85);
  -webkit-backdrop-filter: blur(60px) saturate(1.8) brightness(0.85);
  background: linear-gradient(
    145deg,
    rgba(255, 255, 255, 0.10) 0%,
    rgba(255, 255, 255, 0.04) 100%
  );
  border: 0.5px solid rgba(255, 255, 255, 0.18);
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.15),
    inset 0 -0.5px 0 rgba(0, 0, 0, 0.2),
    0 20px 60px rgba(0, 0, 0, 0.5),
    0 4px 16px rgba(0, 0, 0, 0.3);
}
```

- [ ] **Step 4: Add `.glass-navbar` CSS after the `.dark .glass-card` block**

```css
/* Liquid Glass Navbar — light mode */
.glass-navbar {
  backdrop-filter: blur(80px) saturate(1.8) brightness(1.02);
  -webkit-backdrop-filter: blur(80px) saturate(1.8) brightness(1.02);
  background: rgba(242, 242, 247, 0.72);
  border: 0.5px solid rgba(255, 255, 255, 0.6);
  border-radius: 1.25rem;
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.5),
    0 8px 32px rgba(0, 0, 0, 0.08),
    0 2px 8px rgba(0, 0, 0, 0.04);
}

/* Liquid Glass Navbar — dark mode */
.dark .glass-navbar {
  background: rgba(28, 28, 30, 0.72);
  border: 0.5px solid rgba(255, 255, 255, 0.12);
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.08),
    0 8px 32px rgba(0, 0, 0, 0.4),
    0 2px 8px rgba(0, 0, 0, 0.2);
}
```

- [ ] **Step 5: Replace `::selection` rule**

Find the current `::selection` block (at the bottom of `src/index.css`):

```css
::selection {
  background-color: #ffffff;
  color: #000000;
}
```

Replace with:

```css
::selection {
  background-color: rgba(0, 122, 255, 0.25);
  color: inherit;
}

.dark ::selection {
  background-color: rgba(10, 132, 255, 0.30);
  color: inherit;
}
```

- [ ] **Step 6: Start dev server and verify**

```bash
cd /home/joshua/Code/website && bun run dev
```

Open `http://localhost:5173`. Verify:
- Light mode background is a cool neutral gray (not warm cream) — roughly `#F2F2F7`
- Dark mode background has a subtle blue-gray undertone (not pure black)
- "Get in Touch" button is now Apple Blue, not near-black
- Focus rings on interactive elements are blue
- Text selection highlight is translucent blue
- Glass cards still show frosted appearance (check Stats section, project cards)

- [ ] **Step 7: Commit**

```bash
git add src/index.css
git commit -m "feat: Apple color tokens, liquid glass CSS, and navbar glass class"
```

---

### Task 2: Animated Apple Mesh Background

**Files:**
- Modify: `src/main.tsx`

**Interfaces:**
- Consumes: `--blob-1`, `--blob-2`, `--blob-3` CSS vars from Task 1
- Consumes: `motion` from `framer-motion` (already imported)
- Produces: three slow-drifting Apple mesh gradient blobs replacing the orange blobs

- [ ] **Step 1: Replace the ambient blob `<div>` in `src/main.tsx`**

Find this block in `src/main.tsx`:

```tsx
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
```

Replace it with:

```tsx
            {/* Ambient Apple mesh blob layer — fixed, behind all content */}
            <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden" aria-hidden="true">
              {/* Blob 1 — top-right — soft lavender/indigo — 25s cycle */}
              <motion.div
                className="absolute -top-60 -right-60 h-[800px] w-[800px] rounded-full"
                style={{
                  background: "radial-gradient(circle, var(--blob-1) 0%, transparent 65%)",
                }}
                animate={{ scale: [1, 1.08, 1], x: [0, 30, 0], y: [0, -20, 0] }}
                transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
              />
              {/* Blob 2 — center-left — pale blue/navy — 20s cycle, 7s offset */}
              <motion.div
                className="absolute top-1/3 -left-60 h-[700px] w-[700px] rounded-full"
                style={{
                  background: "radial-gradient(circle, var(--blob-2) 0%, transparent 65%)",
                }}
                animate={{ scale: [1, 1.06, 1], x: [0, -25, 0], y: [0, 35, 0] }}
                transition={{ duration: 20, repeat: Infinity, ease: "easeInOut", delay: 7 }}
              />
              {/* Blob 3 — bottom-center — teal/purple — 28s cycle, 14s offset */}
              <motion.div
                className="absolute -bottom-40 left-1/3 h-[600px] w-[600px] rounded-full"
                style={{
                  background: "radial-gradient(circle, var(--blob-3) 0%, transparent 65%)",
                }}
                animate={{ scale: [1, 1.10, 1], x: [0, 20, 0], y: [0, 20, 0] }}
                transition={{ duration: 28, repeat: Infinity, ease: "easeInOut", delay: 14 }}
              />
            </div>
```

- [ ] **Step 2: Verify blobs**

With dev server running:
- Light mode: three soft pastel blobs visible (lavender top-right, blue center-left, teal bottom-center). They should be subtle — barely perceptible, like a macOS dynamic wallpaper.
- Dark mode: three deep color blobs visible (indigo, navy, dark purple). More visible against the dark background.
- All three blobs drift very slowly. The drift is noticeable if you watch for ~5 seconds.
- No orange blobs anywhere.

- [ ] **Step 3: Commit**

```bash
git add src/main.tsx
git commit -m "feat: replace orange blobs with animated Apple mesh background"
```

---

### Task 3: Floating Liquid Glass Navbar

**Files:**
- Modify: `src/components/Navbar.tsx`

**Interfaces:**
- Consumes: `.glass-navbar` CSS class from Task 1
- Consumes: `--primary` CSS var for active link color (Apple Blue from Task 1)
- Produces: floating pill navbar with glass treatment, active links in Apple Blue

- [ ] **Step 1: Replace `src/components/Navbar.tsx` entirely**

```tsx
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
    <nav className="sticky top-0 z-50 w-full px-4 pt-3">
      <div className="glass-navbar mx-auto w-full max-w-3xl overflow-hidden transition-all">
        <div className="flex h-14 items-center justify-between gap-4 px-4 sm:px-6">
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
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:text-foreground hover:bg-white/5"
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

        {/* Mobile Menu — lives inside the glass pill so corners clip correctly */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
              className="sm:hidden overflow-hidden border-t border-white/10"
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
                              ? "bg-primary/10 text-primary"
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
      </div>
    </nav>
  );
};

export default Navbar;
```

- [ ] **Step 2: Verify navbar**

With dev server running:
- Navbar floats with visible gap and rounded corners above the page content (not flush to top edge)
- Light mode: frosted glass bar with white specular edge at top, subtle drop shadow
- Dark mode: dark translucent bar, same floating treatment
- Active nav link (e.g. `/projects` when on that page) shows Apple Blue text with translucent blue background pill
- Mobile: hamburger opens the menu inside the glass pill (corners clip), items stagger in
- Desktop: theme switcher still functions, links still route correctly

- [ ] **Step 3: Commit**

```bash
git add src/components/Navbar.tsx
git commit -m "feat: floating liquid glass navbar with Apple Blue active states"
```

---

### Task 4: Component Sweep — Card Glow + Hero Badges

**Files:**
- Modify: `src/components/ProjectCard.tsx`
- Modify: `src/components/Hero.tsx`

**Interfaces:**
- Consumes: Apple Blue from `--primary` token (Task 1)
- Produces: project card hover glow in Apple Blue (not amber)
- Produces: hero tech badges with solid hairline glass border (not dashed)

- [ ] **Step 1: Update hover glow in `src/components/ProjectCard.tsx`**

Find this in `src/components/ProjectCard.tsx`:

```tsx
      whileHover={{
        y: -4,
        boxShadow: "0 12px 40px rgba(249,115,22,0.18)",
        transition: { type: "spring", stiffness: 280, damping: 22 },
      }}
```

Replace with:

```tsx
      whileHover={{
        y: -4,
        boxShadow: "0 12px 40px rgba(0,122,255,0.20)",
        transition: { type: "spring", stiffness: 280, damping: 22 },
      }}
```

- [ ] **Step 2: Update tech badge className in `src/components/Hero.tsx`**

Find this className string in `src/components/Hero.tsx` (inside the `skills.map` span):

```tsx
                  className="bg-card ml-1 inline-flex items-center gap-1.5 rounded-md border border-dashed px-2 py-1 text-xs text-foreground sm:px-2.5 sm:text-sm transition-colors hover:border-foreground/30"
```

Replace with:

```tsx
                  className="ml-1 inline-flex items-center gap-1.5 rounded-lg border border-border/60 bg-white/40 backdrop-blur-sm dark:bg-white/5 px-2 py-1 text-xs text-foreground sm:px-2.5 sm:text-sm transition-colors hover:border-border"
```

- [ ] **Step 3: Verify components**

With dev server running:
- Navigate to home page
- Hover a project card: glow should be blue (not amber/orange)
- Hero section: tech skill badges (`C/C++`, `Docker`, etc.) show solid hairline border with glass tint, no dashed line
- Dark mode: badges show slight white tint from `dark:bg-white/5`

- [ ] **Step 4: Commit**

```bash
git add src/components/ProjectCard.tsx src/components/Hero.tsx
git commit -m "feat: Apple Blue card hover glow and glass tech badges"
```

---

## Self-Review

**Spec coverage:**
- ✅ `--background` light: `oklch(0.957 0.005 264)` = `#F2F2F7` (Task 1 Step 1)
- ✅ `--background` dark: `oklch(0.138 0.006 285)` = `#1C1C1E` (Task 1 Step 2)
- ✅ Apple Blue `--primary`: `oklch(0.537 0.232 258)` light / `oklch(0.573 0.228 258)` dark (Tasks 1)
- ✅ `--ring` = Apple Blue (focus rings) (Task 1)
- ✅ `--radius: 0.75rem` (Task 1 Step 1)
- ✅ `.glass-card` liquid glass with specular `inset 0 1px 0` (Task 1 Step 3)
- ✅ `.dark .glass-card` dark glass variant (Task 1 Step 3)
- ✅ `.glass-navbar` + `.dark .glass-navbar` (Task 1 Step 4)
- ✅ `--blob-1/2/3` light and dark (Task 1 Steps 1–2)
- ✅ `::selection` Apple Blue (Task 1 Step 5)
- ✅ Three Apple mesh blobs replace two orange blobs (Task 2)
- ✅ Blobs use `var(--blob-*)` — theme-aware without JS (Task 2)
- ✅ Navbar floating pill with `glass-navbar` (Task 3)
- ✅ Active nav links = Apple Blue `bg-primary/10 text-primary` (Task 3)
- ✅ Mobile menu inside glass pill (Task 3)
- ✅ ProjectCard hover glow → blue (Task 4)
- ✅ Hero tech badges → solid hairline glass (Task 4)
- ✅ Font stack, motion variants, layout, content, GitHub calendar — all untouched

**Placeholder scan:** No TBD, no TODO, no "implement later", all steps contain actual code.

**Type consistency:** No TypeScript changes — all changes are className strings and CSS. No type mismatches possible.
