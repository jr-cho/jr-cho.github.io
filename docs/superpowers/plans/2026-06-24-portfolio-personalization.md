# Portfolio Personalization Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace all Charan Munur identity and content with Joshua Gottus (SWE & Platform Engineer, aerospace/drones/infra).

**Architecture:** Pure data/content swap. No structural or architectural changes. Six files touched; no new components created. Blog section removed from render tree only (source files kept).

**Tech Stack:** React 19, TypeScript, Vite, Tailwind CSS v4, shadcn/ui, Framer Motion

## Global Constraints

- Do NOT delete any component source files — only remove from render tree
- Do NOT change visual design, theme, animations, or layout
- All icon paths must point to files that actually exist under `/public/`
- Placeholder links (`#`) acceptable for GitHub/live links — user will fill in
- User supplies avatar image and resume PDF separately

---

## File Map

| File | Change |
|------|--------|
| `src/data/socials.ts` | GitHub + LinkedIn + Gmail only, all jr-cho |
| `src/components/Hero.tsx` | Name, title, tagline strings |
| `src/data/tech.ts` | `skills` (hero badges) + `skillRows` |
| `public/tech/` | Add missing SVG icons for Joshua's stack |
| `src/data/projects.ts` | Replace all 3 projects |
| `src/data/blog.ts` | Empty `blogs` array |
| `src/App.tsx` | Remove `<BlogSection />` block |

---

### Task 1: Update socials data

**Files:**
- Modify: `src/data/socials.ts`

**Interfaces:**
- Produces: `socials` array consumed by `Hero.tsx` and `Footer.tsx`

- [ ] **Step 1: Replace socials.ts content**

```ts
export interface SocialLink {
  name: string;
  icon: string;
  darkIcon?: string;
  href: string;
}

export const socials: SocialLink[] = [
  {
    name: "Github",
    icon: "/social/github.svg",
    darkIcon: "/social/github-dark.svg",
    href: "https://github.com/jr-cho",
  },
  {
    name: "Linkedin",
    icon: "/social/linkedin.svg",
    darkIcon: "/social/linkedin-dark.svg",
    href: "https://linkedin.com/in/jr-cho",
  },
  {
    name: "Gmail",
    icon: "/social/gmail.svg",
    href: "mailto:joshmg427@gmail.com",
  },
];
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
cd /home/joshua/Code/website && npx tsc --noEmit
```

Expected: no errors

- [ ] **Step 3: Commit**

```bash
git add src/data/socials.ts
git commit -m "chore: replace socials with jr-cho identity"
```

---

### Task 2: Update Hero strings

**Files:**
- Modify: `src/components/Hero.tsx`

**Interfaces:**
- Consumes: `socials` from Task 1, `skills` from `src/data/tech.ts` (updated in Task 4)

- [ ] **Step 1: Update name, title, tagline, and bio text**

In `src/components/Hero.tsx`, make these exact replacements:

Replace:
```tsx
              Charan Munur
```
With:
```tsx
              Joshua Gottus
```

Replace:
```tsx
          <h1 className="max-w-full text-[1.7rem] font-normal tracking-tight leading-tight sm:text-[2.05rem] md:text-[2.15rem]">
            FullStack Developer -{" "}
            <span className="text-[0.95em] font-light text-muted-foreground sm:text-[0.96em]">
              Learning Systems, Shipping Clean Interfaces.
            </span>
          </h1>
```
With:
```tsx
          <h1 className="max-w-full text-[1.7rem] font-normal tracking-tight leading-tight sm:text-[2.05rem] md:text-[2.15rem]">
            SWE & Platform Engineer -{" "}
            <span className="text-[0.95em] font-light text-muted-foreground sm:text-[0.96em]">
              Building embedded systems, autonomous platforms, and cloud infrastructure.
            </span>
          </h1>
```

Replace the bio paragraph:
```tsx
          <p className="text-base font-light leading-7 text-muted-foreground sm:text-lg sm:leading-8">
            I build backend systems and clean interfaces with{" "}
            <span className="inline items-center gap-2 align-middle">
              {skills.map((skill) => (
                <span
                  key={skill.name}
                  className="bg-card ml-1 inline-flex items-center gap-1.5 rounded-md border border-dashed px-2 py-1 text-xs text-foreground sm:px-2.5 sm:text-sm transition-colors hover:border-foreground/30"
                >
                  <TechIcon
                    item={skill}
                    className="h-3.5 w-3.5 sm:h-4 sm:w-4"
                  />
                  {skill.name}
                </span>
              ))}
            </span>{" "}
            — with a keen eye for detail and responsiveness. Also exploring
            blockchain out of curiosity.
          </p>
```
With:
```tsx
          <p className="text-base font-light leading-7 text-muted-foreground sm:text-lg sm:leading-8">
            I build embedded systems and cloud infrastructure with{" "}
            <span className="inline items-center gap-2 align-middle">
              {skills.map((skill) => (
                <span
                  key={skill.name}
                  className="bg-card ml-1 inline-flex items-center gap-1.5 rounded-md border border-dashed px-2 py-1 text-xs text-foreground sm:px-2.5 sm:text-sm transition-colors hover:border-foreground/30"
                >
                  <TechIcon
                    item={skill}
                    className="h-3.5 w-3.5 sm:h-4 sm:w-4"
                  />
                  {skill.name}
                </span>
              ))}
            </span>{" "}
            — focused on aerospace, autonomous systems, and GitOps infrastructure.
          </p>
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
cd /home/joshua/Code/website && npx tsc --noEmit
```

Expected: no errors

- [ ] **Step 3: Commit**

```bash
git add src/components/Hero.tsx
git commit -m "chore: update hero copy for Joshua Gottus identity"
```

---

### Task 3: Add missing tech icons

**Files:**
- Add to: `public/tech/` — Docker, C, Python, AWS, Azure, Proxmox, Linux SVGs

No icons exist in `/public/tech/` for Joshua's stack (C/C++, Docker, Python, AWS, Azure, Proxmox, Linux). Download from Simple Icons (https://simpleicons.org) or use the CDN below.

- [ ] **Step 1: Download missing SVGs**

Run from repo root. These fetch the exact Simple Icons SVGs (monochrome, consistent style with existing icons):

```bash
cd /home/joshua/Code/website/public/tech

# C
curl -o c.svg "https://cdn.simpleicons.org/c/A8B9CC"

# C++
curl -o cpp.svg "https://cdn.simpleicons.org/cplusplus/00599C"

# Python
curl -o python.svg "https://cdn.simpleicons.org/python/3776AB"

# Docker
curl -o docker.svg "https://cdn.simpleicons.org/docker/2496ED"

# AWS (light/dark pair)
curl -o aws-light.svg "https://cdn.simpleicons.org/amazonwebservices/232F3E"
curl -o aws-dark.svg  "https://cdn.simpleicons.org/amazonwebservices/FF9900"

# Azure
curl -o azure.svg "https://cdn.simpleicons.org/microsoftazure/0078D4"

# Proxmox
curl -o proxmox.svg "https://cdn.simpleicons.org/proxmox/E57000"

# Linux
curl -o linux.svg "https://cdn.simpleicons.org/linux/FCC624"
```

- [ ] **Step 2: Verify files exist**

```bash
ls /home/joshua/Code/website/public/tech/c.svg \
      /home/joshua/Code/website/public/tech/cpp.svg \
      /home/joshua/Code/website/public/tech/python.svg \
      /home/joshua/Code/website/public/tech/docker.svg \
      /home/joshua/Code/website/public/tech/aws-light.svg \
      /home/joshua/Code/website/public/tech/azure.svg \
      /home/joshua/Code/website/public/tech/proxmox.svg \
      /home/joshua/Code/website/public/tech/linux.svg
```

Expected: all 8 paths print without error

- [ ] **Step 3: Commit**

```bash
cd /home/joshua/Code/website
git add public/tech/
git commit -m "chore: add tech SVG icons for Joshua's stack"
```

---

### Task 4: Update tech data (hero badges + skill rows)

**Files:**
- Modify: `src/data/tech.ts`

**Interfaces:**
- Consumes: icon files added in Task 3
- Produces: `skills` (hero badges in `Hero.tsx`), `skillRows` (consumed by `SkillSection.tsx`)

- [ ] **Step 1: Replace relevant exports in tech.ts**

Replace the `skills` export:
```ts
export const skills: TechItem[] = [
  { name: "React", icon: "/tech/react.svg" },
  { name: "JavaScript", icon: "/tech/js.svg" },
  { name: "TypeScript", icon: "/tech/typescript.svg" },
  { name: "Tailwind CSS", icon: "/tech/tailwindcss.svg" },
  { name: "Spring Boot", icon: "/tech/springboot.svg" },
  { name: "Supabase", icon: "/tech/supabase.svg" },
];
```
With:
```ts
export const skills: TechItem[] = [
  { name: "C/C++", icon: "/tech/cpp.svg" },
  { name: "Docker", icon: "/tech/docker.svg" },
  { name: "Python", icon: "/tech/python.svg" },
  { name: "TypeScript", icon: "/tech/typescript.svg" },
  { name: "Node.js", icon: "/tech/nodejs-light.svg", darkIcon: "/tech/nodejs-dark.svg" },
  { name: "CI/CD", icon: "/tech/git.svg" },
];
```

Replace the `frontendSkills`, `backendSkills`, `toolsSkills`, and `skillRows` exports with:
```ts
export const embeddedSkills: TechItem[] = [
  { name: "C", icon: "/tech/c.svg" },
  { name: "C++", icon: "/tech/cpp.svg" },
  { name: "Python", icon: "/tech/python.svg" },
];

export const infraSkills: TechItem[] = [
  { name: "Docker", icon: "/tech/docker.svg" },
  { name: "Proxmox", icon: "/tech/proxmox.svg" },
  { name: "Azure", icon: "/tech/azure.svg" },
  { name: "AWS", icon: "/tech/aws-light.svg", darkIcon: "/tech/aws-dark.svg" },
  { name: "Linux", icon: "/tech/linux.svg" },
];

export const langToolsSkills: TechItem[] = [
  { name: "TypeScript", icon: "/tech/typescript.svg" },
  { name: "Node.js", icon: "/tech/nodejs-light.svg", darkIcon: "/tech/nodejs-dark.svg" },
  { name: "Git", icon: "/tech/git.svg" },
];

export const skillRows: { direction: "left" | "right"; category: string; items: TechItem[] }[] = [
  {
    direction: "left",
    category: "Embedded & Systems",
    items: embeddedSkills,
  },
  {
    direction: "right",
    category: "Infrastructure",
    items: infraSkills,
  },
  {
    direction: "left",
    category: "Languages & Tools",
    items: langToolsSkills,
  },
];
```

Also remove or replace `frontendSkills`, `backendSkills`, `toolsSkills` exports (they are no longer used). Search the codebase first:

```bash
grep -r "frontendSkills\|backendSkills\|toolsSkills" /home/joshua/Code/website/src/
```

If no files import them besides `tech.ts` itself, delete those three named exports. If something imports them, replace the import sites too.

- [ ] **Step 2: Verify TypeScript compiles**

```bash
cd /home/joshua/Code/website && npx tsc --noEmit
```

Expected: no errors

- [ ] **Step 3: Commit**

```bash
git add src/data/tech.ts
git commit -m "chore: update tech stack to Joshua's skills"
```

---

### Task 5: Replace projects data

**Files:**
- Modify: `src/data/projects.ts`

**Interfaces:**
- Produces: `projects` array consumed by `ProjectSection.tsx` and `ProjectDetail.tsx`

- [ ] **Step 1: Replace projects.ts content**

```ts
import type { TechItem } from "@/data/tech";

export interface Project {
  name: string;
  imgSrc: string;
  description: string;
  techStack: TechItem[];
  liveLink: string;
  githubLink: string;
  about: string;
  features: string[];
}

export const projects: Project[] = [
  {
    name: "Homelab",
    imgSrc: "/projects/homelab.png",
    description:
      "Personal homelab for development and service hosting with full GitOps pipeline via Forgejo and Docker Compose.",
    about:
      "A self-hosted development environment built on Proxmox. Uses Forgejo as the Git forge and CI/CD runner, with Docker Compose managing all services. Infrastructure changes are version-controlled and applied via GitHub Actions workflows.",
    features: [
      "GitOps pipeline with Forgejo CI/CD — all infra changes tracked in Git",
      "Docker Compose service orchestration for self-hosted apps",
      "GitHub Actions integration for automated deployments",
      "Proxmox hypervisor managing isolated VMs and containers",
    ],
    techStack: [
      { name: "Docker", icon: "/tech/docker.svg" },
      { name: "Linux", icon: "/tech/linux.svg" },
      { name: "Git", icon: "/tech/git.svg" },
      { name: "Proxmox", icon: "/tech/proxmox.svg" },
    ],
    liveLink: "#",
    githubLink: "https://github.com/jr-cho/homelab",
  },
  {
    name: "Fraud Detection Algorithm",
    imgSrc: "/projects/fraud-detection.png",
    description:
      "Transaction graph system in C modeling user accounts and finances. Detects money-laundering rings via cycle detection.",
    about:
      "Designed and implemented a directed graph system in C representing financial transactions between accounts. Applies cycle detection algorithms to identify money-laundering rings — closed loops of transfers used to obscure the origin of funds.",
    features: [
      "Directed graph representation of accounts and transactions in C",
      "Cycle detection to flag potential money-laundering rings",
      "Efficient traversal over large transaction datasets",
      "Modular design separating graph construction, traversal, and reporting",
    ],
    techStack: [
      { name: "C", icon: "/tech/c.svg" },
    ],
    liveLink: "#",
    githubLink: "https://github.com/jr-cho/fraud-detection",
  },
  {
    name: "Ground Robot + UAV",
    imgSrc: "/projects/ground-uav.png",
    description:
      "Custom embedded C library for ground robot hardware abstraction. Competition system with UAV-to-ground-robot communication.",
    about:
      "Developed a custom embedded C hardware abstraction library for a competition ground robot, enabling clean driver interfaces for sensors and actuators. Integrated communication between a UAV and ground robot to satisfy competition requirements for coordinated autonomous operation.",
    features: [
      "Custom embedded C HAL for ground robot sensors and actuators",
      "UAV-to-ground-robot communication protocol",
      "Hardware abstraction enabling portable driver code across platforms",
      "Designed and managed for competition use under real-time constraints",
    ],
    techStack: [
      { name: "C", icon: "/tech/c.svg" },
      { name: "C++", icon: "/tech/cpp.svg" },
    ],
    liveLink: "#",
    githubLink: "https://github.com/jr-cho/ground-uav",
  },
];
```

- [ ] **Step 2: Add placeholder project images**

Project cards expect images at `/projects/homelab.png`, `/projects/fraud-detection.png`, `/projects/ground-uav.png`. Create placeholder files so the build doesn't show broken images (user will replace later):

```bash
cp /home/joshua/Code/website/public/projects/supertodo.png /home/joshua/Code/website/public/projects/homelab.png
cp /home/joshua/Code/website/public/projects/supertodo.png /home/joshua/Code/website/public/projects/fraud-detection.png
cp /home/joshua/Code/website/public/projects/supertodo.png /home/joshua/Code/website/public/projects/ground-uav.png
```

- [ ] **Step 3: Verify TypeScript compiles**

```bash
cd /home/joshua/Code/website && npx tsc --noEmit
```

Expected: no errors

- [ ] **Step 4: Commit**

```bash
git add src/data/projects.ts public/projects/
git commit -m "chore: replace projects with Joshua's work"
```

---

### Task 6: Remove blog section and clear blog data

**Files:**
- Modify: `src/App.tsx` — remove BlogSection render block
- Modify: `src/data/blog.ts` — empty blogs array

- [ ] **Step 1: Clear blog data**

In `src/data/blog.ts`, replace the `blogs` array with an empty array. Keep the `Blog` interface and the export:

```ts
export interface Blog {
  title: string;
  description: string;
  content: string;
  tags: string[];
  date: string;
  readTime: string;
}

export const blogs: Blog[] = [];
```

- [ ] **Step 2: Remove BlogSection from App.tsx**

In `src/App.tsx`, remove the lazy import and the entire Suspense block for BlogSection:

Remove this import line:
```ts
const BlogSection = lazy(() => import("./components/BlogSection"));
```

Remove this Suspense block:
```tsx
          <Suspense
            fallback={
              <div className="h-40 animate-pulse bg-muted/20 rounded-xl" />
            }
          >
            <FadeIn>
              <BlogSection />
            </FadeIn>
          </Suspense>
```

- [ ] **Step 3: Verify TypeScript compiles**

```bash
cd /home/joshua/Code/website && npx tsc --noEmit
```

Expected: no errors

- [ ] **Step 4: Commit**

```bash
git add src/App.tsx src/data/blog.ts
git commit -m "chore: remove blog section"
```

---

### Task 7: Final visual verification

No code changes — manual check only.

- [ ] **Step 1: Start dev server**

```bash
cd /home/joshua/Code/website && npm run dev
```

- [ ] **Step 2: Check each section**

Open `http://localhost:5173` and verify:

| Check | Expected |
|-------|----------|
| Hero name | "Joshua Gottus" |
| Hero title | "SWE & Platform Engineer" |
| Hero socials | GitHub, LinkedIn, Gmail only (no X, no LeetCode) |
| Hero skill badges | C/C++, Docker, Python, TypeScript, Node.js, CI/CD |
| Skill rows | "Embedded & Systems", "Infrastructure", "Languages & Tools" |
| Projects | Homelab, Fraud Detection Algorithm, Ground Robot + UAV |
| Blog section | Gone |
| Theme toggle | Still works |
| Mobile layout | Responsive, no broken layout |

- [ ] **Step 3: Fix any issues found, then commit**

```bash
git add -p
git commit -m "chore: fix visual issues from final review"
```
