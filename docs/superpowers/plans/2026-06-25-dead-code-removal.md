# Dead Code Removal Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Remove all confirmed-dead files, packages, CSS variables, and config entries in four discrete commits.

**Architecture:** Mechanical deletion only — no new code. Each commit is independently bisectable. Verification is `bun run build` passing (TypeScript + Vite) after each commit.

**Tech Stack:** React 19, TypeScript, Vite, Tailwind CSS v4, Bun

## Global Constraints

- Never delete a file without confirming zero imports in the codebase first
- `bun run build` must pass after every commit — treat a build failure as a blocker
- Do not touch any file not listed in a task
- `react-activity-calendar` and `framer-motion` are NOT dead — do not remove them

---

### Task 1: Delete dead source files and wire up routing/nav

**Files:**
- Delete: `src/components/BlogSection.tsx`
- Delete: `src/components/BlogCard.tsx`
- Delete: `src/pages/Blog.tsx`
- Delete: `src/pages/BlogDetail.tsx`
- Delete: `src/data/blog.ts`
- Delete: `src/features/theme/mode-toggle.tsx`
- Delete: `src/components/ui/avatar.tsx`
- Modify: `src/components/helpers/AnimatedRoutes.tsx`
- Modify: `src/components/Navbar.tsx`

**Interfaces:**
- Consumes: nothing from earlier tasks
- Produces: clean routing table and nav (Tasks 2-4 don't depend on this)

- [ ] **Step 1: Confirm zero imports for each file being deleted**

Run each of these — every command must return no output:

```bash
grep -rn "BlogSection" /home/joshua/Code/website/src --include="*.tsx" --include="*.ts" | grep -v "BlogSection.tsx"
grep -rn "BlogCard" /home/joshua/Code/website/src --include="*.tsx" --include="*.ts" | grep -v "BlogCard.tsx"
grep -rn "from.*pages/Blog\b\|from.*[\"']@/pages/Blog[\"']" /home/joshua/Code/website/src --include="*.tsx" --include="*.ts" | grep -v "AnimatedRoutes\|Blog.tsx"
grep -rn "BlogDetail" /home/joshua/Code/website/src --include="*.tsx" --include="*.ts" | grep -v "BlogDetail.tsx\|AnimatedRoutes.tsx"
grep -rn "from.*data/blog" /home/joshua/Code/website/src --include="*.tsx" --include="*.ts" | grep -v "Blog"
grep -rn "ModeToggle\|mode-toggle" /home/joshua/Code/website/src --include="*.tsx" --include="*.ts" | grep -v "mode-toggle.tsx"
grep -rn "from.*ui/avatar\|Avatar" /home/joshua/Code/website/src --include="*.tsx" --include="*.ts" | grep -v "avatar.tsx"
```

- [ ] **Step 2: Delete the seven dead files**

```bash
rm src/components/BlogSection.tsx \
   src/components/BlogCard.tsx \
   src/pages/Blog.tsx \
   src/pages/BlogDetail.tsx \
   src/data/blog.ts \
   src/features/theme/mode-toggle.tsx \
   src/components/ui/avatar.tsx
```

- [ ] **Step 3: Update AnimatedRoutes.tsx**

Replace entire contents of `src/components/helpers/AnimatedRoutes.tsx` with:

```tsx
import { AnimatePresence } from "framer-motion";
import { Route, Routes, useLocation } from "react-router-dom";
import App from "@/App";
import Projects from "@/pages/Projects";
import ProjectDetail from "@/pages/ProjectDetail";
import Contact from "@/pages/Contact";

export default function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<App />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/projects/:slug" element={<ProjectDetail />} />
        <Route path="/contact" element={<Contact />} />
      </Routes>
    </AnimatePresence>
  );
}
```

- [ ] **Step 4: Update Navbar.tsx navItems**

Find this block in `src/components/Navbar.tsx`:

```tsx
const navItems = [
  { href: "/projects", label: "Projects" },
  { href: "/blogs", label: "Blogs" },
];
```

Replace with:

```tsx
const navItems = [
  { href: "/projects", label: "Projects" },
];
```

- [ ] **Step 5: Verify build passes**

```bash
bun run build
```

Expected: build completes with no TypeScript errors and no missing-module errors.

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "chore: remove dead blog feature and unused components"
```

---

### Task 2: Uninstall dead npm packages and remove typography plugin

**Files:**
- Modify: `package.json` (via bun remove)
- Modify: `bun.lock` (via bun remove)
- Modify: `src/index.css` (remove @plugin line)

**Interfaces:**
- Consumes: nothing from Task 1
- Produces: clean dependency tree (Task 3 does not depend on this)

- [ ] **Step 1: Uninstall all seven dead packages**

```bash
bun remove react-github-calendar motion tw-animate-css @fontsource-variable/inter react-markdown remark-gfm @tailwindcss/typography
```

Expected: all seven removed from `package.json` dependencies. `bun.lock` updated.

- [ ] **Step 2: Remove the @plugin line from index.css**

In `src/index.css`, remove line 2:

```css
@plugin "@tailwindcss/typography";
```

After the edit, the top of the file should read:

```css
@import "tailwindcss";

@custom-variant dark (&:is(.dark *));
```

- [ ] **Step 3: Verify build passes**

```bash
bun run build
```

Expected: build completes cleanly. No missing-package errors, no missing `prose` styles (those were only in deleted BlogDetail).

- [ ] **Step 4: Commit**

```bash
git add package.json bun.lock src/index.css
git commit -m "chore: remove 7 unused npm packages"
```

---

### Task 3: Remove dead CSS variables

**Files:**
- Modify: `src/index.css`

**Interfaces:**
- Consumes: nothing from earlier tasks
- Produces: trimmed CSS token set

- [ ] **Step 1: Remove chart variables from :root block**

In `src/index.css`, inside the `:root { }` block, remove these 5 lines (currently lines 26–30):

```css
  --chart-1: oklch(0.8100 0.1000 252);
  --chart-2: oklch(0.6200 0.1900 260);
  --chart-3: oklch(0.5500 0.2200 263);
  --chart-4: oklch(0.4900 0.2200 264);
  --chart-5: oklch(0.4200 0.1800 266);
```

- [ ] **Step 2: Remove sidebar variables from :root block**

In `src/index.css`, inside the `:root { }` block, remove these 8 lines (currently lines 31–38):

```css
  --sidebar: oklch(0.957 0.005 264);
  --sidebar-foreground: oklch(0.1450 0 0);
  --sidebar-primary: oklch(0.537 0.232 258);
  --sidebar-primary-foreground: oklch(1 0 0);
  --sidebar-accent: oklch(0.928 0.006 264);
  --sidebar-accent-foreground: oklch(0.2050 0 0);
  --sidebar-border: oklch(0.880 0.005 264);
  --sidebar-ring: oklch(0.537 0.232 258);
```

- [ ] **Step 3: Remove popover variables from :root block**

In `src/index.css`, inside the `:root { }` block, remove these 2 lines (currently lines 11–12):

```css
  --popover: oklch(1 0 0);
  --popover-foreground: oklch(0.1450 0 0);
```

- [ ] **Step 4: Remove chart variables from .dark block**

In `src/index.css`, inside the `.dark { }` block, remove these 5 lines (currently lines 86–90):

```css
  --chart-1: oklch(0.8100 0.1000 252);
  --chart-2: oklch(0.6200 0.1900 260);
  --chart-3: oklch(0.5500 0.2200 263);
  --chart-4: oklch(0.4900 0.2200 264);
  --chart-5: oklch(0.4200 0.1800 266);
```

- [ ] **Step 5: Remove sidebar variables from .dark block**

In `src/index.css`, inside the `.dark { }` block, remove these 8 lines (currently lines 91–98):

```css
  --sidebar: oklch(0.138 0.006 285);
  --sidebar-foreground: oklch(0.9850 0 0);
  --sidebar-primary: oklch(0.573 0.228 258);
  --sidebar-primary-foreground: oklch(1 0 0);
  --sidebar-accent: oklch(0.272 0.005 285);
  --sidebar-accent-foreground: oklch(0.9850 0 0);
  --sidebar-border: oklch(0.272 0.005 285);
  --sidebar-ring: oklch(0.573 0.228 258);
```

- [ ] **Step 6: Remove popover variables from .dark block**

In `src/index.css`, inside the `.dark { }` block, remove these 2 lines (currently lines 71–72):

```css
  --popover: oklch(0.212 0.006 285);
  --popover-foreground: oklch(0.9850 0 0);
```

- [ ] **Step 7: Remove dead @theme mappings**

In `src/index.css`, inside the `@theme inline { }` block, remove these 10 lines:

```css
  --color-popover: var(--popover);
  --color-popover-foreground: var(--popover-foreground);
```

```css
  --color-chart-1: var(--chart-1);
  --color-chart-2: var(--chart-2);
  --color-chart-3: var(--chart-3);
  --color-chart-4: var(--chart-4);
  --color-chart-5: var(--chart-5);
  --color-sidebar: var(--sidebar);
  --color-sidebar-foreground: var(--sidebar-foreground);
  --color-sidebar-primary: var(--sidebar-primary);
  --color-sidebar-primary-foreground: var(--sidebar-primary-foreground);
  --color-sidebar-accent: var(--sidebar-accent);
  --color-sidebar-accent-foreground: var(--sidebar-accent-foreground);
  --color-sidebar-border: var(--sidebar-border);
  --color-sidebar-ring: var(--sidebar-ring);
```

- [ ] **Step 8: Verify build passes**

```bash
bun run build
```

Expected: build completes cleanly. CSS compiles without errors.

- [ ] **Step 9: Commit**

```bash
git add src/index.css
git commit -m "chore: remove unused CSS custom properties (sidebar, chart, popover)"
```

---

### Task 4: Clean up vite config

**Files:**
- Modify: `vite.config.ts`

**Interfaces:**
- Consumes: nothing from earlier tasks
- Produces: clean dev config

- [ ] **Step 1: Remove stale ngrok allowedHosts from vite.config.ts**

Find this block in `vite.config.ts`:

```ts
  server: {
    allowedHosts: [
      'copulatively-refractive-leticia.ngrok-free.dev' 
    ],
    port: 5173,
    proxy: {
      "/api": "http://localhost:3000",
    },
  },
```

Replace with:

```ts
  server: {
    port: 5173,
    proxy: {
      "/api": "http://localhost:3000",
    },
  },
```

- [ ] **Step 2: Verify dev server starts**

```bash
bun run build
```

Expected: build passes. (Dev server start is equivalent verification without needing an interactive terminal.)

- [ ] **Step 3: Commit**

```bash
git add vite.config.ts
git commit -m "chore: remove stale ngrok allowedHosts from vite config"
```
