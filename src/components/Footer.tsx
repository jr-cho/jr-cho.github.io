import { socials } from "@/data/socials";
import SocialIcon from "./helpers/SocialIcon";

const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <div className="mx-auto w-full max-w-3xl px-6 pb-12 sm:pb-14">
      <footer className="flex flex-col items-center gap-5 border-t border-dashed border-border/80 pt-10 text-sm sm:flex-row sm:items-center sm:justify-between sm:gap-6">
        <p className="flex flex-wrap items-center gap-x-1.5 gap-y-0.5">
          <span className="text-base text-muted-foreground">
            &copy; {year}
          </span>
          <span className="text-base font-light tracking-tight text-foreground">
            Joshua Gottus
          </span>
          <span className="text-base text-muted-foreground">· @jr-cho</span>
        </p>

        <div className="flex items-center gap-3">
          {socials.map(({ name, icon, darkIcon, href }) => (
            <a
              key={name}
              href={href}
              target={href.startsWith("mailto") ? undefined : "_blank"}
              rel={href.startsWith("mailto") ? undefined : "noreferrer"}
              aria-label={name}
              title={name}
              className="rounded transition-opacity hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <SocialIcon
                icon={icon}
                darkIcon={darkIcon}
                alt={name}
                className="h-5 w-5 rounded p-0.5"
              />
            </a>
          ))}
        </div>
      </footer>
    </div>
  );
};

export default Footer;
