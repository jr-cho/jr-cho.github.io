import { tech, type TechItem } from "./tech";

export interface ProjectHighlight {
  value: string;
  label: string;
}

export interface Project {
  name: string;
  // Optional screenshot. Without one, the card shows the highlights panel.
  imgSrc?: string;
  period: string;
  role?: string;
  status?: string;
  description: string;
  highlights: ProjectHighlight[];
  techStack: TechItem[];
  liveLink?: string;
  githubLink?: string;
  about: string;
  features: string[];
}

export const projectSlug = (name: string) => name.toLowerCase().replace(/\s+/g, "-");

export const projects: Project[] = [
  {
    name: "Flight Control Data Bus",
    period: "Sep 2026 – Present",
    status: "In progress",
    description:
      "Multi-node flight control firmware in C on FreeRTOS, bridged to ROS 2.",
    highlights: [
      { value: "2-level", label: "watchdog" },
      { value: "Static", label: "memory only" },
      { value: "Fixed-point", label: "math" },
    ],
    about:
      "Flight control firmware split across several nodes on a shared data bus. Each node runs FreeRTOS and reports to ROS 2 through micro-ROS. The code follows safety-critical coding rules.",
    features: [
      "Two-level watchdog: a software task-health monitor gates the hardware watchdog",
      "Static memory allocation only. No heap use after startup.",
      "Fixed-point math in place of floating point",
      "Zero-warning builds enforced",
    ],
    techStack: [tech.c, tech.freertos, tech.ros2],
  },
  {
    name: "SoutheastCon 2026 Ground Robot",
    period: "Jun 2025 – Apr 2026",
    role: "Software Tech Lead & Project Manager",
    description:
      "Led a 9-person software team to 16th of 84 at IEEE SoutheastCon 2026.",
    highlights: [
      { value: "16th / 84", label: "final rank" },
      { value: "I2C", label: "motor + IMU drivers" },
      { value: "9", label: "engineers led" },
    ],
    about:
      "Competition ground robot for the IEEE SoutheastCon 2026 hardware contest, built by the Florida Poly IEEE RAS Society. I led the software team: I wrote and assigned GitHub issues and reviewed every PR before merge. The robot software is modular C on Raspberry Pi, with a hardware abstraction layer over an I2C motor driver and IMU.",
    features: [
      "Hardware abstraction layer over an I2C motor driver and IMU",
      "Gyro-based heading correction in the drive loop, in modular C on Raspberry Pi",
      "Traced a failed Raspberry Pi 5 with an oscilloscope to a 5 V signal on a 3.3 V GPIO pin",
      "Planned work through GitHub issues and reviewed team PRs before merge",
    ],
    techStack: [tech.c, tech.linux, tech.raspberrypi],
    githubLink: "https://github.com/Florida-Poly-IEEE-RAS-Society/SECON26",
  },
  {
    name: "MicroTransit GPS Tracker",
    period: "Mar 2026 – May 2026",
    description:
      "LTE-M vehicle tracker on an Arduino Uno, with a FastAPI backend and live map.",
    highlights: [
      { value: "2 KB", label: "SRAM" },
      { value: "46 entries", label: "offline buffer" },
      { value: "8 s", label: "hw watchdog" },
    ],
    about:
      "A GPS tracker for microtransit vehicles. I co-wrote the C++ firmware with an electrical engineering teammate for an Arduino Uno and SIM7000A LTE-M modem. I built the backend and live map, and taught the teammate each layer of the stack.",
    features: [
      "C++ firmware on an Arduino Uno with 2 KB of SRAM and a SIM7000A modem",
      "46-entry EEPROM buffer holds positions while the modem is offline",
      "Layered auto-reconnect and an 8 s hardware watchdog",
      "FastAPI backend: MQTT ingest, Kalman-filtered GPS, SQLite, WebSocket",
      "Next.js live map, deployed with Docker Compose",
    ],
    techStack: [tech.cpp, tech.arduino, tech.mqtt, tech.fastapi, tech.nextjs, tech.docker],
  },
];
