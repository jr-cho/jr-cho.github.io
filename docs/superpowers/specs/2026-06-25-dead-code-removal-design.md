# Dead Code Removal Design

**Date:** 2026-06-25  
**Status:** Approved

## Goal

Strip confirmed dead files, packages, CSS variables, and config from the portfolio codebase in four discrete, bisectable commits.

## Scope

Anything confirmed dead by static analysis (grep + import tracing). Blog feature removed entirely — data array is empty (`blogs: Blog[] = []`) and user confirmed removal.

## Commit 1 — Dead files

**Delete:**
- `src/components/BlogSection.tsx` — never imported anywhere
- `src/components/BlogCard.tsx` — blog feature removed
- `src/pages/Blog.tsx` — blog feature removed
- `src/pages/BlogDetail.tsx` — blog feature removed
- `src/data/blog.ts` — blog feature removed
- `src/features/theme/mode-toggle.tsx` — never imported anywhere
- `src/components/ui/avatar.tsx` — never imported anywhere

**Edit:**
- `src/components/helpers/AnimatedRoutes.tsx` — remove Blog + BlogDetail imports and routes
- `src/components/Navbar.tsx` — remove `{ href: "/blogs", label: "Blogs" }` from `navItems`

## Commit 2 — Dead packages

**Uninstall (npm/bun remove):**
- `react-github-calendar` — not imported anywhere
- `motion` — standalone package; only `framer-motion` is used
- `tw-animate-css` — not imported anywhere
- `@fontsource-variable/inter` — not imported anywhere
- `react-markdown` — only used by deleted BlogDetail
- `remark-gfm` — only used by deleted BlogDetail
- `@tailwindcss/typography` — only used by deleted BlogDetail

**Edit:**
- `src/index.css` — remove `@plugin "@tailwindcss/typography"` line

## Commit 3 — Dead CSS variables

Remove from `src/index.css` (both `:root` and `.dark` blocks, plus `@theme` mappings):

- `--sidebar` / `--sidebar-foreground` / `--sidebar-primary` / `--sidebar-primary-foreground` / `--sidebar-accent` / `--sidebar-accent-foreground` / `--sidebar-border` / `--sidebar-ring` — no sidebar component exists
- `--chart-1` through `--chart-5` — no chart component exists
- `--popover` / `--popover-foreground` — no popover component exists
- Corresponding `--color-sidebar-*`, `--color-chart-*`, `--color-popover-*` entries in `@theme`

## Commit 4 — Config cleanup

- `vite.config.ts` — remove stale ngrok `allowedHosts` entry and the `server.allowedHosts` block (nothing else uses it; port and proxy config stays)

## What stays

- `react-activity-calendar` + `react-activity-calendar/tooltips.css` — used by Stats component
- `framer-motion` — used everywhere
- `@tailwindcss/vite` — active build plugin
- `lenis` — used by SmoothScroll
- `radix-ui` — used by Button (Slot) and Tabs
- `react-icons` — used by ProjectCard, ComingSoonCard, ProjectDetail
- `react-markdown` / `remark-gfm` / `@tailwindcss/typography` — removed with blog
- `--card-*`, `--input`, `--ring`, `--border`, `--background`, `--foreground`, `--primary`, `--secondary`, `--muted`, `--accent`, `--destructive` CSS vars — all actively used
