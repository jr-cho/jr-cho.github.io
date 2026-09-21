export interface SocialLink {
  name: string;
  icon: string;
  darkIcon?: string;
  href: string;
}

export const socials: SocialLink[] = [
  {
    name: "Github",
    icon: "/social/github.svg",
    darkIcon: "/social/github-dark.svg",
    href: "https://github.com/jr-cho",
  },
  {
    name: "X",
    icon: "/social/x.svg",
    darkIcon: "/social/x-dark.svg",
    href: "https://x.com/jr_cho_",
  },
  {
    name: "Linkedin",
    icon: "/social/linkedin.svg",
    darkIcon: "/social/linkedin-dark.svg",
    href: "https://linkedin.com/in/jr-cho",
  },
  {
    name: "Email",
    icon: "/social/mail.svg",
    darkIcon: "/social/mail-dark.svg",
    href: "mailto:joshua.gottus@proton.me",
  },
];
