export interface SocialLink {
  name: string;
  href: string;
}

export const socials: SocialLink[] = [
  { name: "GitHub", href: "https://github.com/jr-cho" },
  { name: "X", href: "https://x.com/jr_cho_" },
  { name: "LinkedIn", href: "https://linkedin.com/in/jr-cho" },
  { name: "Email", href: "mailto:joshua.gottus@proton.me" },
];

export const email = "joshua.gottus@proton.me";
export const resumeHref = `${import.meta.env.BASE_URL}global/Joshua-Gottus-Resume.pdf`;
