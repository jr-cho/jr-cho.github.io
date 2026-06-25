# Portfolio Personalization Design

**Date:** 2026-06-24  
**Owner:** Joshua Gottus  
**Scope:** Replace all Charan Munur identity/content with Joshua Gottus identity. No structural or architectural changes.

---

## Identity

| Field | Value |
|-------|-------|
| Name | Joshua Gottus |
| Title | SWE & Platform Engineer |
| Tagline | Building embedded systems, autonomous platforms, and cloud infrastructure. |
| GitHub | jr-cho |
| LinkedIn | jr-cho |
| Email | joshmg427@gmail.com |
| Avatar | user-supplied (`/assets/` — user will place file) |
| Resume | user-supplied (user will place PDF and link) |

---

## Hero Section

- Name: `Joshua Gottus`
- Title line: `SWE & Platform Engineer`
- Subtitle: `Building embedded systems, autonomous platforms, and cloud infrastructure.`
- Bio skill badges (6): C/C++, Docker, Python, TypeScript, Node.js, CI/CD
- Socials: GitHub (`jr-cho`), LinkedIn (`jr-cho`), Gmail (`joshmg427@gmail.com`)
- Remove: X/Twitter, LeetCode
- CTA buttons: "Get in Touch" (keep), "Resume" (keep — user will wire link)

---

## Skills Section

Three scrolling rows replacing current frontend/backend/tools:

| Row | Direction | Category | Items |
|-----|-----------|----------|-------|
| 1 | left | Embedded & Systems | C/C++, Python, Assembly (if icon available) |
| 2 | right | Infrastructure | Docker, Proxmox, Azure, AWS, Linux |
| 3 | left | Languages & Tools | TypeScript, Node.js, Git, CI/CD |

Icons: use existing `/tech/` SVGs where available; skip entries with no matching icon rather than adding placeholder paths.

---

## Projects

Replace all three existing projects:

### 1. Homelab
- **Description:** Personal homelab for development and service hosting with full GitOps pipeline via Forgejo and Docker Compose.
- **Tech:** Docker, Docker Compose, GitHub Actions, Linux
- **Links:** GitHub `jr-cho/homelab` (confirm repo name), no live link

### 2. Fraud Detection Algorithm
- **Description:** Transaction graph system in C modeling user accounts and finances. Detects money-laundering rings via cycle detection.
- **Tech:** C, Graph Algorithms
- **Links:** GitHub repo (confirm name), no live link

### 3. Ground Robot + UAV
- **Description:** Custom embedded C library for ground robot hardware abstraction. Competition system with UAV-to-ground-robot communication.
- **Tech:** Embedded C, C++, UAV/Drone systems
- **Links:** GitHub repo if public, no live link

**Images:** `/projects/` — user supplies or we use placeholder.

---

## Blog Section

**Removed entirely.** Delete `BlogSection` from `App.tsx` and `BlogCard` renders. Keep component files (don't delete source files, just remove from render tree).

---

## Removed Socials

Remove from `src/data/socials.ts`:
- X (Twitter) — `CharanMunur`
- LeetCode — `CharanMunur`

---

## Out of Scope

- Visual design, theme, animations — unchanged
- Stats section, VisitorCount, QuoteSection, Footer structure — unchanged
- GitHub calendar (will auto-reflect jr-cho once API key/config updated if applicable)
- Component file deletion — keep all files, only update data and render tree

---

## Files to Change

| File | Change |
|------|--------|
| `src/data/socials.ts` | Replace all entries with GitHub + LinkedIn + Gmail for jr-cho |
| `src/data/tech.ts` | Update `skills` (hero badges) and `skillRows` to Joshua's stack |
| `src/data/projects.ts` | Replace all 3 projects |
| `src/data/blog.ts` | Clear `blogs` array (keep file/type) |
| `src/components/Hero.tsx` | Update name, title, tagline strings |
| `src/App.tsx` | Remove `<BlogSection />` render |
