# macOS Liquid Glass Redesign — Design Spec

**Date:** 2026-06-25  
**Status:** Approved — ready for implementation  
**Goal:** Replace the current warm amber/orange glass aesthetic with Apple macOS 16 Liquid Glass: Apple color palette, true liquid glass panels with specular highlight, animated Apple mesh background, and a floating liquid glass navbar.

---

## Context

The site already has glassmorphism cards, motion animations, and page transitions from a previous plan. The orange/amber blobs and warm cream background made it feel warm but not distinctly Apple. This redesign replaces the full color system, upgrades glass fidelity, swaps the ambient background to a macOS-era animated mesh, and floats the navbar as a true liquid glass panel.

**No changes to:** layout, type scale, font stack (already `-apple-system` = SF Pro on macOS), content, motion variants, GitHub activity calendar colors.

---

## Color System

### Light Mode (Apple macOS Light)

| Token | Value | Hex equiv |
|-------|-------|-----------|
| `--background` | `oklch(0.957 0.005 264)` | `#F2F2F7` — Apple System Gray 6 |
| `--foreground` | `oklch(0.145 0 0)` | near `#000` |
| `--card` | `oklch(1 0 0)` | `#FFFFFF` — glass surface base |
| `--muted-foreground` | `oklch(0.588 0.010 264)` | `#8E8E93` — Apple System Gray |
| `--border` | `oklch(0.880 0.005 264)` | ~`#DCDCE0` |
| `--input` | `oklch(0.880 0.005 264)` | same as border |
| `--primary` | `oklch(0.537 0.232 258)` | `#007AFF` — Apple Blue |
| `--primary-foreground` | `oklch(1 0 0)` | `#FFFFFF` |
| `--secondary` | `oklch(0.928 0.006 264)` | light system fill |
| `--secondary-foreground` | `oklch(0.145 0 0)` | dark |
| `--muted` | `oklch(0.928 0.006 264)` | same as secondary |
| `--accent` | `oklch(0.928 0.006 264)` | same |
| `--accent-foreground` | `oklch(0.145 0 0)` | dark |
| `--ring` | `oklch(0.537 0.232 258)` | Apple Blue focus ring |
| `--popover` | `oklch(1 0 0)` | white |
| `--popover-foreground` | `oklch(0.145 0 0)` | dark |
| `--sidebar` | `oklch(0.957 0.005 264)` | same as background |
| `--radius` | `0.75rem` | 12px (Apple-standard component radius) |

Keep destructive, chart tokens unchanged.

### Dark Mode (Apple macOS Dark)

| Token | Value | Hex equiv |
|-------|-------|-----------|
| `--background` | `oklch(0.138 0.006 285)` | `#1C1C1E` — Apple Base Dark |
| `--foreground` | `oklch(0.985 0 0)` | `#FFFFFF` |
| `--card` | `oklch(0.212 0.006 285)` | `#2C2C2E` — elevated surface |
| `--muted-foreground` | `oklch(0.680 0.010 264)` | ~`rgba(235,235,245,0.6)` |
| `--border` | `oklch(0.272 0.005 285)` | `#3A3A3C` |
| `--input` | `oklch(0.320 0.006 285)` | slightly lighter |
| `--primary` | `oklch(0.573 0.228 258)` | `#0A84FF` — Apple Blue Dark |
| `--primary-foreground` | `oklch(1 0 0)` | `#FFFFFF` |
| `--secondary` | `oklch(0.212 0.006 285)` | elevated |
| `--secondary-foreground` | `oklch(0.985 0 0)` | white |
| `--muted` | `oklch(0.272 0.005 285)` | border-level |
| `--accent` | `oklch(0.320 0.006 285)` | higher elevated |
| `--accent-foreground` | `oklch(0.985 0 0)` | white |
| `--ring` | `oklch(0.573 0.228 258)` | Apple Blue Dark |
| `--popover` | `oklch(0.212 0.006 285)` | elevated |
| `--popover-foreground` | `oklch(0.985 0 0)` | white |
| `--sidebar` | `oklch(0.138 0.006 285)` | same as background |
| `--sidebar-primary` | `oklch(0.573 0.228 258)` | Apple Blue Dark |

---

## Liquid Glass CSS

Replace the existing `.glass-card` rule in `src/index.css`:

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

The `inset 0 1px 0` specular line is the Apple signature detail — mimics light hitting the top edge of a glass panel.

---

## Floating Liquid Glass Navbar CSS

Add `.glass-navbar` class to `src/index.css`:

```css
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

.dark .glass-navbar {
  background: rgba(28, 28, 30, 0.72);
  border: 0.5px solid rgba(255, 255, 255, 0.12);
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.08),
    0 8px 32px rgba(0, 0, 0, 0.4),
    0 2px 8px rgba(0, 0, 0, 0.2);
}
```

---

## Animated Apple Mesh Background

Add CSS variables for blob colors (theme-aware) in `:root` and `.dark` blocks of `src/index.css`:

```css
/* In :root */
--blob-1: rgba(180, 165, 255, 0.30);  /* soft lavender */
--blob-2: rgba(120, 195, 255, 0.25);  /* pale blue */
--blob-3: rgba(145, 215, 230, 0.20);  /* muted teal */

/* In .dark */
--blob-1: rgba(80, 60, 200, 0.50);    /* deep indigo */
--blob-2: rgba(10, 40, 150, 0.55);    /* dark navy */
--blob-3: rgba(60, 10, 120, 0.45);    /* dark purple */
```

Replace the two orange blobs in `src/main.tsx` ambient layer with three Apple mesh blobs:

```tsx
{/* Ambient Apple mesh blob layer */}
<div className="pointer-events-none fixed inset-0 z-0 overflow-hidden" aria-hidden="true">
  {/* Blob 1 — top-right — 800px — 25s cycle */}
  <motion.div
    className="absolute -top-60 -right-60 h-[800px] w-[800px] rounded-full"
    style={{
      background: "radial-gradient(circle, var(--blob-1) 0%, transparent 65%)",
    }}
    animate={{ scale: [1, 1.08, 1], x: [0, 30, 0], y: [0, -20, 0] }}
    transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
  />
  {/* Blob 2 — center-left — 700px — 20s cycle, 7s offset */}
  <motion.div
    className="absolute top-1/3 -left-60 h-[700px] w-[700px] rounded-full"
    style={{
      background: "radial-gradient(circle, var(--blob-2) 0%, transparent 65%)",
    }}
    animate={{ scale: [1, 1.06, 1], x: [0, -25, 0], y: [0, 35, 0] }}
    transition={{ duration: 20, repeat: Infinity, ease: "easeInOut", delay: 7 }}
  />
  {/* Blob 3 — bottom-center — 600px — 28s cycle, 14s offset */}
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

---

## Navbar Floating Layout

Replace `src/components/Navbar.tsx` outer `<nav>` structure. Change from full-width sticky border-b to a padded floating pill:

**Before:**
```tsx
<nav className="sticky top-0 z-50 w-full border-b border-white/10 bg-background/40 backdrop-blur-xl transition-all">
  <div className="mx-auto flex h-16 w-full max-w-3xl items-center justify-between gap-4 px-4 sm:px-6">
```

**After:**
```tsx
<nav className="sticky top-0 z-50 w-full px-4 pt-3 pb-0">
  <div className="glass-navbar mx-auto flex h-14 w-full max-w-3xl items-center justify-between gap-4 px-4 sm:px-6">
```

Mobile menu: change from `border-b border-white/10 bg-background/80 backdrop-blur-xl` to `glass-navbar rounded-t-none mt-0` (remove top radius, attach to nav pill bottom).

Active nav link classes: change from `!text-foreground` to `rounded-md bg-[#007AFF]/10 text-[#007AFF]` (light) — use `text-primary` Tailwind alias.

**Active link className (updated):**
```tsx
isActive
  ? "rounded-md px-3 py-2 text-base font-light bg-primary/10 text-primary"
  : "rounded-md px-3 py-2 text-base font-light text-muted-foreground hover:text-foreground hover:bg-white/5"
```

---

## Component Sweep

### ProjectCard.tsx — hover glow: amber → blue
```tsx
whileHover={{
  y: -4,
  boxShadow: "0 12px 40px rgba(0,122,255,0.20)",
  transition: { type: "spring", stiffness: 280, damping: 22 },
}}
```

### Hero.tsx — tech badge borders: dashed → solid hairline glass

**Before:**
```tsx
className="bg-card ml-1 inline-flex items-center gap-1.5 rounded-md border border-dashed px-2 py-1 text-xs text-foreground sm:px-2.5 sm:text-sm transition-colors hover:border-foreground/30"
```

**After:**
```tsx
className="ml-1 inline-flex items-center gap-1.5 rounded-lg border border-border/60 bg-white/40 backdrop-blur-sm px-2 py-1 text-xs text-foreground dark:bg-white/5 sm:px-2.5 sm:text-sm transition-colors hover:border-border"
```

### index.css — selection color: black/white → Apple Blue

**Before:**
```css
::selection {
  background-color: #ffffff;
  color: #000000;
}
```

**After:**
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

---

## Files Changed

| File | Changes |
|------|---------|
| `src/index.css` | All color tokens, glass-card, glass-navbar, blob CSS vars, radius, selection |
| `src/main.tsx` | 3 Apple mesh blobs replace 2 orange blobs |
| `src/components/Navbar.tsx` | Floating pill layout, glass-navbar class, active link = Apple Blue |
| `src/components/ProjectCard.tsx` | Hover glow → blue |
| `src/components/Hero.tsx` | Tech badge border style |

**Files NOT changed:** `motionVariants.ts`, `App.tsx`, all page components, all data files, all other components.

---

## Self-Review

- ✅ No amber/orange left anywhere (all moved to Apple Blue)
- ✅ Blobs use CSS vars — theme-aware without JS
- ✅ Glass panels: blur 60px + saturate + specular inset — matches Apple Liquid Glass
- ✅ Navbar: floating pill, glass-navbar class, blue active states
- ✅ Background: `#F2F2F7`/`#1C1C1E` Apple grays
- ✅ Font stack unchanged — SF Pro already resolves on macOS
- ✅ GitHub calendar green unchanged (intentional)
- ✅ Motion variants, page transitions, all other components untouched
- ✅ 5 files only — bounded scope
