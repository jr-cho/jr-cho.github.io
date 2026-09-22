export interface EducationEntry {
  school: string;
  degree: string;
  detail?: string;
  location: string;
  date: string;
  // Campus photo that fills the row on hover. Path under public/.
  image?: string;
}

export const education: EducationEntry[] = [
  {
    school: "Florida Polytechnic University",
    degree: "B.S. Computer Science",
    detail: "Cybersecurity Concentration",
    location: "Lakeland, FL",
    date: "Expected May 2027",
    image: "/media/school/florida-poly.jpg",
  },
  {
    school: "South Florida State College",
    degree: "Associate of Arts",
    location: "Avon Park, FL",
    date: "May 2024",
    image: "/media/school/south-florida-state-college.jpg",
  },
];
