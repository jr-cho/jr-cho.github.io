import type { IconType } from "react-icons";
import {
  SiC,
  SiCplusplus,
  SiPython,
  SiTypescript,
  SiRos,
  SiStmicroelectronics,
  SiEspressif,
  SiArduino,
  SiRaspberrypi,
  SiNvidia,
  SiKicad,
  SiLinux,
  SiDocker,
  SiCmake,
  SiGit,
  SiGitlab,
  SiGithubactions,
  SiGnubash,
  SiMqtt,
  SiFastapi,
  SiNextdotjs,
  SiSqlite,
} from "react-icons/si";
import { TbCpu, TbBrandPowershell, TbDrone } from "react-icons/tb";

export interface TechItem {
  name: string;
  Icon: IconType;
  // Brand color revealed on hover; icons sit graphite-mono at rest.
  brand: string;
}

export const tech = {
  c: { name: "C", Icon: SiC, brand: "#A8B9CC" },
  cpp: { name: "C++", Icon: SiCplusplus, brand: "#00599C" },
  python: { name: "Python", Icon: SiPython, brand: "#3776AB" },
  typescript: { name: "TypeScript", Icon: SiTypescript, brand: "#3178C6" },
  freertos: { name: "FreeRTOS", Icon: TbCpu, brand: "#7DB700" },
  ros2: { name: "ROS 2", Icon: SiRos, brand: "#22314E" },
  ardupilot: { name: "ArduPilot", Icon: TbDrone, brand: "#1F8CE6" },
  stm32: { name: "STM32", Icon: SiStmicroelectronics, brand: "#03234B" },
  esp32: { name: "ESP32", Icon: SiEspressif, brand: "#E7352C" },
  arduino: { name: "Arduino", Icon: SiArduino, brand: "#00878F" },
  raspberrypi: { name: "Raspberry Pi", Icon: SiRaspberrypi, brand: "#A22846" },
  jetson: { name: "Jetson Orin", Icon: SiNvidia, brand: "#76B900" },
  kicad: { name: "KiCad", Icon: SiKicad, brand: "#314CB0" },
  linux: { name: "Linux", Icon: SiLinux, brand: "#FCC624" },
  docker: { name: "Docker", Icon: SiDocker, brand: "#2496ED" },
  cmake: { name: "CMake", Icon: SiCmake, brand: "#064F8C" },
  git: { name: "Git", Icon: SiGit, brand: "#F05032" },
  gitlab: { name: "GitLab CI/CD", Icon: SiGitlab, brand: "#FC6D26" },
  githubactions: { name: "GitHub Actions", Icon: SiGithubactions, brand: "#2088FF" },
  bash: { name: "Bash", Icon: SiGnubash, brand: "#4EAA25" },
  powershell: { name: "PowerShell", Icon: TbBrandPowershell, brand: "#5391FE" },
  mqtt: { name: "MQTT", Icon: SiMqtt, brand: "#660066" },
  fastapi: { name: "FastAPI", Icon: SiFastapi, brand: "#009688" },
  nextjs: { name: "Next.js", Icon: SiNextdotjs, brand: "#888888" },
  sqlite: { name: "SQLite", Icon: SiSqlite, brand: "#0F80CC" },
} satisfies Record<string, TechItem>;

export const skillRows: { direction: "left" | "right"; category: string; items: TechItem[] }[] = [
  {
    direction: "left",
    category: "Languages",
    items: [tech.c, tech.cpp, tech.python, tech.typescript, tech.bash, tech.powershell],
  },
  {
    direction: "right",
    category: "Embedded & Robotics",
    items: [
      tech.freertos,
      tech.ros2,
      tech.ardupilot,
      tech.stm32,
      tech.esp32,
      tech.arduino,
      tech.raspberrypi,
      tech.jetson,
      tech.kicad,
    ],
  },
  {
    direction: "left",
    category: "Tools & Infrastructure",
    items: [
      tech.linux,
      tech.docker,
      tech.cmake,
      tech.git,
      tech.gitlab,
      tech.githubactions,
      tech.mqtt,
    ],
  },
];
