export interface TechItem {
  name: string;
}

export const tech = {
  c: { name: "C" },
  cpp: { name: "C++" },
  python: { name: "Python" },
  typescript: { name: "TypeScript" },
  freertos: { name: "FreeRTOS" },
  ros2: { name: "ROS 2" },
  ardupilot: { name: "ArduPilot" },
  stm32: { name: "STM32" },
  esp32: { name: "ESP32" },
  arduino: { name: "Arduino" },
  raspberrypi: { name: "Raspberry Pi" },
  jetson: { name: "Jetson Orin" },
  kicad: { name: "KiCad" },
  linux: { name: "Linux" },
  docker: { name: "Docker" },
  cmake: { name: "CMake" },
  git: { name: "Git" },
  gitlab: { name: "GitLab CI/CD" },
  githubactions: { name: "GitHub Actions" },
  bash: { name: "Bash" },
  powershell: { name: "PowerShell" },
  mqtt: { name: "MQTT" },
  fastapi: { name: "FastAPI" },
  nextjs: { name: "Next.js" },
  sqlite: { name: "SQLite" },
} satisfies Record<string, TechItem>;

export const skillRows: { category: string; items: TechItem[] }[] = [
  {
    category: "Languages",
    items: [tech.c, tech.cpp, tech.python, tech.typescript],
  },
  {
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
    category: "Tools",
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
