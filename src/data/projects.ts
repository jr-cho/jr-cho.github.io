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
