import type { MediaSlot } from "./media";

export interface Role {
  title: string;
  // Kept generic on purpose. Never name the employer.
  org: string;
  date: string;
  points: string[];
  // Photos or clips from the role. Strip location metadata, and keep
  // anything that names the employer or its gear out of frame.
  media?: MediaSlot[];
}

export const experience: Role[] = [
  {
    title: "Embedded Software Engineering Intern",
    org: "Defense contractor",
    date: "May 2026 – Aug 2026",
    points: [
      "Built C++ ROS 2 software for robotic vehicles on a 10-person engineering team.",
      "Ported Python prototypes to C++ ROS 2 nodes on Raspberry Pi and Jetson Orin companion computers.",
      "Designed a vehicle electrical system in KiCad: schematics, power distribution, wiring harnesses, and component selection.",
      "Cut the vehicle container image size by 82% (5 GB to 0.9 GB), which sped up deployment to onboard computers.",
      "Tested autonomy software in ArduPilot SITL simulation before field testing.",
      "Wrote a design document for each story and reviewed team pull requests.",
    ],
    media: [
      {
        src: "/media/experience/ugv-road.jpg",
        alt: "A small four-wheeled ground robot on a paved road with trees behind it",
        hint: "Ground robot outdoors",
        aspect: "3 / 4",
      },
      {
        src: "/media/experience/ugv-drive.mp4",
        alt: "The ground robot driving across an empty parking lot toward the camera",
        hint: "Ground robot driving",
        aspect: "3 / 4",
      },
      {
        src: "/media/experience/ugv-closeup.jpg",
        alt: "Close-up of the ground robot on asphalt",
        hint: "Ground robot close-up",
        aspect: "3 / 4",
      },
      {
        src: "/media/experience/uav-hex.jpg",
        alt: "A large multirotor drone on its landing gear in a parking lot",
        hint: "Multirotor drone",
        aspect: "3 / 4",
      },
      {
        src: "/media/experience/uav-cage.jpg",
        alt: "A caged quadcopter drone on a desk, with its antennas out of focus",
        hint: "Caged drone",
        aspect: "3 / 4",
      },
      {
        src: "/media/experience/fpv-front.jpg",
        alt: "A small quadcopter drone on a workbench, seen from the front",
        hint: "Small drone, front",
        aspect: "3 / 4",
      },
    ],
  },
];
