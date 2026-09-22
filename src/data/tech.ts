import {
  siArduino,
  siC,
  siCmake,
  siCplusplus,
  siDocker,
  siEspressif,
  siFastapi,
  siGit,
  siGithubactions,
  siGitlab,
  siGnubash,
  siKicad,
  siLinux,
  siMqtt,
  siNextdotjs,
  siNvidia,
  siPython,
  siRaspberrypi,
  siRos,
  siSqlite,
  siStmicroelectronics,
  siTypescript,
} from "simple-icons";

export interface TechItem {
  name: string;
  // Brand mark from simple-icons. Some tools have none.
  icon?: { path: string };
}

export const tech = {
  c: { name: "C", icon: siC },
  cpp: { name: "C++", icon: siCplusplus },
  python: { name: "Python", icon: siPython },
  typescript: { name: "TypeScript", icon: siTypescript },
  freertos: { name: "FreeRTOS" },
  ros2: { name: "ROS 2", icon: siRos },
  ardupilot: { name: "ArduPilot" },
  stm32: { name: "STM32", icon: siStmicroelectronics },
  esp32: { name: "ESP32", icon: siEspressif },
  arduino: { name: "Arduino", icon: siArduino },
  raspberrypi: { name: "Raspberry Pi", icon: siRaspberrypi },
  jetson: { name: "Jetson Orin", icon: siNvidia },
  kicad: { name: "KiCad", icon: siKicad },
  linux: { name: "Linux", icon: siLinux },
  docker: { name: "Docker", icon: siDocker },
  cmake: { name: "CMake", icon: siCmake },
  git: { name: "Git", icon: siGit },
  gitlab: { name: "GitLab CI/CD", icon: siGitlab },
  githubactions: { name: "GitHub Actions", icon: siGithubactions },
  bash: { name: "Bash", icon: siGnubash },
  powershell: { name: "PowerShell" },
  mqtt: { name: "MQTT", icon: siMqtt },
  fastapi: { name: "FastAPI", icon: siFastapi },
  nextjs: { name: "Next.js", icon: siNextdotjs },
  sqlite: { name: "SQLite", icon: siSqlite },
} satisfies Record<string, TechItem>;

export const skillRows: { category: string; summary: string; items: TechItem[] }[] = [
  {
    category: "Languages",
    summary:
      "C for firmware and drivers, C++ on microcontrollers, Python for test scripts and tools, and TypeScript for dashboards.",
    items: [tech.c, tech.cpp, tech.python, tech.typescript],
  },
  {
    category: "Embedded & Robotics",
    summary:
      "Firmware on STM32, ESP32, and Arduino, with FreeRTOS for real-time tasks. Higher-level control runs on ROS 2 on a Raspberry Pi or Jetson Orin.",
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
    category: "Tools",
    summary:
      "Linux day to day. Builds use CMake and Docker, and CI runs on GitLab CI/CD or GitHub Actions.",
    items: [
      tech.linux,
      tech.git,
      tech.docker,
      tech.cmake,
      tech.gitlab,
      tech.githubactions,
      tech.bash,
      tech.powershell,
      tech.mqtt,
    ],
  },
];
