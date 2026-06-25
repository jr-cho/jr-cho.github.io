# Liquid Glass + Framer Motion UI Refresh

**Date:** 2026-06-24  
**Status:** Approved

## Overview

Full UI refresh adding glassmorphism cards, warm amber/orange gradient background blobs, and bold Framer Motion animations across the site.

## Visual Identity

### Color — Background Blobs
- Blob A: amber `#f97316` — fixed top-right, large (~600px), opacity 0.14 dark / 0.08 light
- Blob B: burnt orange `#c2410c` — fixed bottom-left, medium (~400px), opacity 0.14 dark / 0.08 light
- Diagonal warmth flow, not scattered
- Light mode base: cream `#faf7f2` replacing plain white

### Glass Card Treatment
Dark mode:
- `backdrop-blur-xl`
- `bg-white/4`
- `border border-white/10`
- `rounded-2xl`
- `shadow-[0_8px_32px_rgba(0,0,0,0.25)]`

Light mode:
- `bg-white/60`
- `border border-white/50`
- Same blur, radius, shadow

Hover state:
- `translateY(-4px)` via Framer Motion spring
- Warm amber glow: `shadow-[0_12px_40px_rgba(249,115,22,0.18)]`

### Navbar
- Already has `backdrop-blur` — upgrade to `backdrop-blur-xl bg-background/40`
- Mobile menu: replace CSS transition with `AnimatePresence` height + opacity

## Animation System

### motionVariants.ts additions
```ts
// Tight mechanical spring — not bouncy, feels engineered
springSnap: { type: "spring", stiffness: 280, damping: 22 }

// Page transitions
pageVariants: {
  initial: { opacity: 0, scale: 0.98 },
  animate: { opacity: 1, scale: 1, transition: { duration: 0.22, ease: [0.16, 1, 0.3, 1] } },
  exit:    { opacity: 0, scale: 0.97, transition: { duration: 0.15, ease: "easeIn" } }
}

// Stagger grid container
staggerGrid: {
  hidden:  { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08, delayChildren: 0.05 } }
}

// Card entrance item
cardReveal: {
  hidden:  { opacity: 0, y: 18 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.35, ease: [0.16, 1, 0.3, 1] } }
}
```

### Blob animation (Framer Motion)
- Each blob: `animate={{ scale: [1, 1.06, 1] }}` with `transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}`
- Blob A and B offset phase by 4s

## Component Changes

### `src/main.tsx`
1. Add fixed blob layer (2 `motion.div` blobs) inside root div, behind content
2. Wrap `<Routes>` in `AnimatePresence mode="wait"`
3. Add `useLocation()` to key `AnimatePresence` on pathname

### `src/lib/motionVariants.ts`
- Add `pageVariants`, `staggerGrid`, `cardReveal`, `springSnap`

### `src/index.css`
- Add `.glass-card` utility (dark + light mode via `.dark` class selector)
- Update `:root` `--background` CSS variable to warm cream `oklch` or `#faf7f2` equivalent for light mode

### NEW: `src/components/helpers/AnimatedRoutes.tsx`
- New component rendered inside `BrowserRouter` that calls `useLocation()` and wraps `<Routes>` in `AnimatePresence mode="wait"` keyed on `location.pathname`
- All route `<Route>` elements move here from `main.tsx`

### `src/main.tsx`
1. Add fixed blob layer (2 `motion.div` blobs) inside root div, z-0, behind content (z-10)
2. Replace inline `<Routes>` block with `<AnimatedRoutes />`

### `src/App.tsx`
- Wrap root `<div>` in `motion.div` with `pageVariants` (initial/animate/exit)

### `src/pages/*.tsx` (Blog, Projects, Contact, ProjectDetail, BlogDetail)
- Wrap page root `<main>` in `motion.div` with `pageVariants`

### `src/components/ProjectCard.tsx`
- Outer `div` → `motion.div` with `cardReveal` variant + `whileHover` lift + `whileTap`
- Apply `.glass-card` replacing `bg-card border-dashed border-border/80`
- Image hover: keep existing `group-hover/image:blur-xs` (already there)

### `src/components/ComingSoonCard.tsx`
- Same glass treatment as ProjectCard

### `src/components/ProjectSection.tsx`
- Grid `div` → `motion.div` with `staggerGrid` + `whileInView` + `viewport={{ once: true }}`
- Each `ProjectCard` wrapper gets `cardReveal` variant (via stagger propagation)

### `src/components/Stats.tsx`
- Contribution count: `useMotionValue` + `useSpring` + `useEffect` animate 0→total
- Calendar card `div` → apply `.glass-card`

### `src/components/Navbar.tsx`
- Upgrade backdrop blur on `<nav>`
- Mobile menu: replace conditional CSS classes with `AnimatePresence` + `motion.div`
  - `initial={{ height: 0, opacity: 0 }}` → `animate={{ height: "auto", opacity: 1 }}`
  - Nav items inside: stagger with `staggerGrid` + `cardReveal`

## Scope Boundaries

- Does NOT change typography, font weights, or layout max-width
- Does NOT change the `SkillRow` scrolling animation (already animated)
- Does NOT change `QuoteSection` (already animated)
- Does NOT change `Hero` (already animated with stagger)
- Light mode gets blobs at reduced opacity — maintains readability
- All animations respect `prefers-reduced-motion` via Framer Motion's built-in support

## Files Changed

1. `src/main.tsx`
2. `src/components/helpers/AnimatedRoutes.tsx` *(new)*
3. `src/App.tsx`
4. `src/lib/motionVariants.ts`
5. `src/index.css`
6. `src/components/ProjectCard.tsx`
7. `src/components/ComingSoonCard.tsx`
8. `src/components/ProjectSection.tsx`
9. `src/components/Stats.tsx`
10. `src/components/Navbar.tsx`
11. `src/pages/Blog.tsx`
12. `src/pages/Projects.tsx`
13. `src/pages/Contact.tsx`
14. `src/pages/ProjectDetail.tsx`
15. `src/pages/BlogDetail.tsx`
