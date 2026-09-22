import { Link, useLocation } from "react-router-dom";
import { resumeHref } from "@/data/socials";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/projects", label: "Work", match: (p: string) => p.startsWith("/projects") },
  { href: "/contact", label: "Contact", match: (p: string) => p.startsWith("/contact") },
];

// Top bar: a grey pill with the wordmark and links on the left,
// a second pill with the resume link on the right.
const Dock = () => {
  const location = useLocation();

  return (
    <header className="fixed inset-x-0 top-0 z-50 flex items-start justify-between gap-3 p-3 sm:p-4">
      <nav aria-label="Main" className="glass-navbar flex h-12 items-center gap-1 px-2.5 sm:gap-2 sm:px-3">
        <Link
          to="/"
          aria-label="Joshua Gottus, home"
          className="mr-1 flex h-10 items-center px-1 text-[15px] font-bold uppercase leading-none tracking-[-0.04em] sm:mr-3 sm:text-lg"
        >
          <span className="sm:hidden">JG</span>
          <span className="hidden sm:inline">Joshua Gottus</span>
        </Link>
        {navItems.map(({ href, label, match }) => {
          const active = match(location.pathname);
          return (
            <Link
              key={href}
              to={href}
              aria-current={active ? "page" : undefined}
              className={cn(
                "flex h-10 items-center rounded px-2 text-[15px] transition-opacity hover:opacity-60",
                active && "underline decoration-1 underline-offset-4",
              )}
            >
              {label}
            </Link>
          );
        })}
      </nav>

      <div className="glass-navbar flex h-12 items-center gap-1 px-2">
        <a
          href={resumeHref}
          target="_blank"
          rel="noreferrer"
          className="flex h-10 items-center px-2 text-[15px] transition-opacity hover:opacity-60"
        >
          Resume
        </a>
      </div>
    </header>
  );
};

export default Dock;
