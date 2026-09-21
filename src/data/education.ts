export interface EducationEntry {
  school: string;
  degree: string;
  detail?: string;
  location: string;
  date: string;
}

export const education: EducationEntry[] = [
  {
    school: "Florida Polytechnic University",
    degree: "B.S. Computer Science",
    detail: "Cybersecurity Concentration",
    location: "Lakeland, FL",
    date: "Expected May 2027",
  },
  {
    school: "South Florida State College",
    degree: "Associate of Arts",
    location: "Avon Park, FL",
    date: "May 2024",
  },
];
