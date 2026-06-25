export interface TechItem {
  name: string;
  icon: string;
  darkIcon?: string;
}

export const skills: TechItem[] = [
  { name: "C/C++", icon: "/tech/cpp.svg" },
  { name: "Docker", icon: "/tech/docker.svg" },
  { name: "Python", icon: "/tech/python.svg" },
  { name: "TypeScript", icon: "/tech/typescript.svg" },
  { name: "Node.js", icon: "/tech/nodejs-light.svg", darkIcon: "/tech/nodejs-dark.svg" },
  { name: "CI/CD", icon: "/tech/git.svg" },
];

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
