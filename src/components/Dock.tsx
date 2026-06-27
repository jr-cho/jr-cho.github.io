import { House, FolderGit2, Mail, Moon, Sun, TvMinimal } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { Tabs, TabsList, TabsTrigger } from "./ui/tabs";
import { useTheme } from "next-themes";
import { motion, useMotionValue } from "framer-motion";
import { DockItem } from "./helpers/DockItem";

const dockItems = [
  { href: "/", label: "Home", icon: House, match: (p: string) => p === "/" },
  {
    href: "/projects",
    label: "Projects",
    icon: FolderGit2,
    match: (p: string) => p.startsWith("/projects"),
  },
  {
    href: "/contact",
    label: "Contact",
    icon: Mail,
    match: (p: string) => p.startsWith("/contact"),
  },
];

const themes = [
  { theme: "system", icon: TvMinimal },
  { theme: "light", icon: Sun },
  { theme: "dark", icon: Moon },
];

const Dock = () => {
  const location = useLocation();
  const { theme, setTheme } = useTheme();
  const currentTheme = theme ?? "system";
  const mouseX = useMotionValue(Infinity);

  return (
    <>
      {/* Mobile — top glass pill with full nav + theme */}
      <nav className="fixed top-3 left-1/2 z-50 w-[calc(100%-1.5rem)] max-w-sm -translate-x-1/2 sm:hidden">
        <div className="glass-navbar flex items-center justify-between gap-2 px-2 py-1.5">
          <div className="flex items-center gap-1">
            {dockItems.map(({ href, label, icon: Icon, match }) => {
              const isActive = match(location.pathname);
              return (
                <Link
                  key={href}
                  to={href}
                  aria-label={label}
                  className={`flex h-9 w-9 items-center justify-center rounded-xl transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                    isActive
                      ? "bg-foreground/10 text-foreground"
                      : "text-muted-foreground hover:bg-white/5 hover:text-foreground"
                  }`}
                >
                  <Icon className="size-[18px]" />
                </Link>
              );
            })}
          </div>

          <Tabs
            value={currentTheme}
            onValueChange={(v) => setTheme(v as "light" | "dark" | "system")}
          >
            <TabsList className="flex gap-1 rounded-full border border-white/10 bg-white/5 p-1">
              {themes.map(({ theme, icon: Icon }) => (
                <TabsTrigger
                  key={theme}
                  value={theme}
                  className="flex h-6 w-6 items-center justify-center rounded-full bg-transparent text-muted-foreground transition-colors hover:text-foreground data-[state=active]:bg-background data-[state=active]:text-foreground! data-[state=active]:shadow-sm"
                >
                  <Icon className="size-[15px]" />
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>
      </nav>

      {/* Desktop — floating macOS dock */}
      <nav className="fixed top-4 left-1/2 z-50 hidden -translate-x-1/2 sm:block">
        <motion.div
          onMouseMove={(e) => mouseX.set(e.clientX)}
          onMouseLeave={() => mouseX.set(Infinity)}
          className="glass-navbar flex items-start gap-2 px-3 py-2"
        >
          {dockItems.map(({ href, label, icon, match }) => (
            <DockItem
              key={href}
              mouseX={mouseX}
              to={href}
              label={label}
              icon={icon}
              active={match(location.pathname)}
            />
          ))}

          <div
            className="mx-1 h-8 w-px self-center bg-white/10"
            aria-hidden="true"
          />

          <div className="flex items-center self-center">
            <Tabs
              value={currentTheme}
              onValueChange={(v) =>
                setTheme(v as "light" | "dark" | "system")
              }
            >
              <TabsList className="flex gap-1 rounded-full border border-white/10 bg-white/5 p-1">
                {themes.map(({ theme, icon: Icon }) => (
                  <TabsTrigger
                    key={theme}
                    value={theme}
                    className="flex h-6 w-6 items-center justify-center rounded-full bg-transparent text-muted-foreground transition-colors hover:text-foreground data-[state=active]:bg-background data-[state=active]:text-foreground! data-[state=active]:shadow-sm"
                  >
                    <Icon className="size-[16px]" />
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          </div>
        </motion.div>
      </nav>
    </>
  );
};

export default Dock;
