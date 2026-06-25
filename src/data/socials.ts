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
    href: "https://github.com/CharanMunur",
  },
  {
    name: "X",
    icon: "/social/x.svg",
    darkIcon: "/social/x-dark.svg",
    href: "https://x.com/CharanMunur",
  },
  {
    name: "Linkedin",
    icon: "/social/linkedin.svg",
    darkIcon: "/social/linkedin-dark.svg",
    href: "https://linkedin.com/in/sai-charan-munur-614623352",
  },
  {
    name: "Gmail",
    icon: "/social/gmail.svg",
    href: "mailto:charanmunur@gmail.com",
  },
  {
    name: "Leetcode",
    icon: "/social/leetcode.svg",
    href: "https://leetcode.com/u/CharanMunur/",
  },
];
