import type { IconType } from "react-icons";
import {
  SiC,
  SiCplusplus,
  SiRust,
  SiPython,
  SiKubernetes,
  SiDocker,
  SiTerraform,
  SiProxmox,
  SiLinux,
  SiTypescript,
  SiGo,
  SiGit,
  SiNodedotjs,
} from "react-icons/si";
import { FaAws } from "react-icons/fa6";
import { TbBrandAzure } from "react-icons/tb";

export interface TechItem {
  name: string;
  Icon: IconType;
  // Brand color revealed on hover; icons sit graphite-mono at rest.
  brand: string;
}

export const tech = {
  c: { name: "C", Icon: SiC, brand: "#A8B9CC" },
  cpp: { name: "C++", Icon: SiCplusplus, brand: "#00599C" },
  rust: { name: "Rust", Icon: SiRust, brand: "#F74C00" },
  python: { name: "Python", Icon: SiPython, brand: "#3776AB" },
  kubernetes: { name: "Kubernetes", Icon: SiKubernetes, brand: "#326CE5" },
  docker: { name: "Docker", Icon: SiDocker, brand: "#2496ED" },
  terraform: { name: "Terraform", Icon: SiTerraform, brand: "#7B42BC" },
  proxmox: { name: "Proxmox", Icon: SiProxmox, brand: "#E57000" },
  azure: { name: "Azure", Icon: TbBrandAzure, brand: "#0078D4" },
  aws: { name: "AWS", Icon: FaAws, brand: "#FF9900" },
  linux: { name: "Linux", Icon: SiLinux, brand: "#FCC624" },
  typescript: { name: "TypeScript", Icon: SiTypescript, brand: "#3178C6" },
  go: { name: "Go", Icon: SiGo, brand: "#00ADD8" },
  nodejs: { name: "Node.js", Icon: SiNodedotjs, brand: "#5FA04E" },
  git: { name: "Git", Icon: SiGit, brand: "#F05032" },
} satisfies Record<string, TechItem>;

export const embeddedSkills: TechItem[] = [tech.c, tech.cpp, tech.rust, tech.python];

export const infraSkills: TechItem[] = [
  tech.kubernetes,
  tech.docker,
  tech.terraform,
  tech.proxmox,
  tech.azure,
  tech.aws,
  tech.linux,
];

export const langToolsSkills: TechItem[] = [tech.typescript, tech.go, tech.nodejs, tech.git];

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
