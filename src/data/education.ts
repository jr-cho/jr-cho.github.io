export interface EducationEntry {
  school: string;
  degree: string;
  detail?: string;
  location: string;
  date: string;
  // Campus photo that fills the row on hover. Path under public/.
  image?: string;
  // Clubs and roles held at the school. `to` links to a page on this site.
  activities?: { role: string; group: string; to?: string }[];
}

export const education: EducationEntry[] = [
  {
    school: "Florida Polytechnic University",
    degree: "B.S. Computer Science",
    detail: "Cybersecurity Concentration",
    location: "Lakeland, FL",
    date: "Expected May 2027",
    image: "/media/school/florida-poly.jpg",
    activities: [
      { role: "Vice President", group: "IEEE Robotics & Automation Society" },
      { role: "Co-founder · Vice President (founding President)", group: "Linux Club" },
      {
        role: "Software Tech Lead",
        group: "SoutheastCon 2026 robot team",
        to: "/projects/southeastcon-2026-ground-robot",
      },
    ],
  },
  {
    school: "South Florida State College",
    degree: "Associate of Arts",
    location: "Avon Park, FL",
    date: "May 2024",
    image: "/media/school/south-florida-state-college.jpg",
    activities: [{ role: "Phi Theta Kappa", group: "honor society" }],
  },
];
