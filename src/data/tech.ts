export interface TechItem {
  name: string;
  icon: string;
  darkIcon?: string;
}

export const skills: TechItem[] = [
  { name: "C/C++", icon: "/tech/cpp.svg" },
  { name: "Rust", icon: "/tech/rust.svg", darkIcon: "/tech/rust-dark.svg" },
  { name: "Python", icon: "/tech/python.svg" },
  { name: "Docker", icon: "/tech/docker.svg" },
  { name: "Kubernetes", icon: "/tech/kubernetes.svg" },
  { name: "TypeScript", icon: "/tech/typescript.svg" },
];

export const embeddedSkills: TechItem[] = [
  { name: "C", icon: "/tech/c.svg" },
  { name: "C++", icon: "/tech/cpp.svg" },
  { name: "Rust", icon: "/tech/rust.svg", darkIcon: "/tech/rust-dark.svg" },
  { name: "Python", icon: "/tech/python.svg" },
];

export const infraSkills: TechItem[] = [
  { name: "Kubernetes", icon: "/tech/kubernetes.svg" },
  { name: "Docker", icon: "/tech/docker.svg" },
  { name: "Terraform", icon: "/tech/terraform.svg" },
  { name: "Proxmox", icon: "/tech/proxmox.svg" },
  { name: "Azure", icon: "/tech/azure.svg" },
  { name: "AWS", icon: "/tech/aws-light.svg", darkIcon: "/tech/aws-dark.svg" },
  { name: "Linux", icon: "/tech/linux.svg" },
];

export const langToolsSkills: TechItem[] = [
  { name: "TypeScript", icon: "/tech/typescript.svg" },
  { name: "Go", icon: "/tech/go.svg" },
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
