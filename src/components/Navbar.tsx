import { Menu, Moon, Sun, TvMinimal, X } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { Tabs, TabsList, TabsTrigger } from "./ui/tabs";
import { useTheme } from "next-themes";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { staggerGrid, cardReveal } from "@/lib/motionVariants";

const navItems = [
  { href: "/projects", label: "Projects" },
  { href: "/blogs", label: "Blogs" },
];

const themes = [
  { theme: "system", icon: TvMinimal },
  { theme: "light", icon: Sun },
  { theme: "dark", icon: Moon },
];

const Navbar = () => {
  const location = useLocation();
  const { theme, setTheme } = useTheme();
  const currentTheme = theme ?? "system";
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 w-full px-4 pt-3">
      <div className="glass-navbar mx-auto w-full max-w-3xl overflow-hidden transition-all">
        <div className="flex h-14 items-center justify-between gap-4 px-4 sm:px-6">
          <Link
            to="/"
            onClick={() => setIsOpen(false)}
            className="shrink-0 text-lg font-light tracking-normal text-foreground sm:text-xl hover:opacity-80 transition-opacity"
          >
            @jr_cho_
          </Link>

          {/* Desktop Nav */}
          <div className="hidden sm:flex flex-1 items-center justify-end gap-1 pr-3">
            {navItems.map(({ href, label }) => {
              const isActive = location.pathname.startsWith(href);
              return (
                <Link
                  key={label}
                  to={href}
                  className={`rounded-md px-3 py-2 text-base font-light transition-colors ${
                    isActive
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:text-foreground hover:bg-white/5"
                  }`}
                >
                  {label}
                </Link>
              );
            })}
          </div>

          <div className="hidden sm:block h-6 w-px shrink-0 bg-white/10 mx-2" aria-hidden="true" />

          <div className="hidden sm:flex shrink-0 items-center">
            <Tabs
              value={currentTheme}
              onValueChange={(v) => setTheme(v as "light" | "dark" | "system")}
            >
              <TabsList className="flex rounded-full border border-white/10 bg-white/5 gap-1 p-1">
                {themes.map(({ theme, icon: Icon }) => (
                  <TabsTrigger
                    key={theme}
                    value={theme}
                    className="h-6 w-6 rounded-full flex items-center justify-center bg-transparent text-muted-foreground transition-colors hover:text-foreground data-[state=active]:bg-background data-[state=active]:text-foreground! data-[state=active]:shadow-sm"
                  >
                    <Icon className="size-[16px]" />
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          </div>

          {/* Mobile Toggle */}
          <button
            className="relative w-9 h-9 flex sm:hidden items-center justify-center p-2 text-muted-foreground hover:text-foreground rounded-md hover:bg-white/5 transition-colors duration-200"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle Menu"
          >
            <motion.span
              animate={{ opacity: isOpen ? 0 : 1 }}
              transition={{ duration: 0.15 }}
              className="absolute"
            >
              <Menu size={20} />
            </motion.span>
            <motion.span
              animate={{ opacity: isOpen ? 1 : 0 }}
              transition={{ duration: 0.15 }}
              className="absolute"
            >
              <X size={20} />
            </motion.span>
          </button>
        </div>

        {/* Mobile Menu — lives inside the glass pill so corners clip correctly */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
              className="sm:hidden overflow-hidden border-t border-white/10"
            >
              <div className="px-4 py-4 flex flex-col gap-4">
                <motion.div
                  variants={staggerGrid}
                  initial="hidden"
                  animate="visible"
                  className="flex flex-col gap-1"
                >
                  {navItems.map(({ href, label }) => {
                    const isActive = location.pathname.startsWith(href);
                    return (
                      <motion.div key={label} variants={cardReveal}>
                        <Link
                          to={href}
                          onClick={() => setIsOpen(false)}
                          className={`block rounded-md px-3 py-2.5 text-base font-light tracking-tight transition-colors ${
                            isActive
                              ? "bg-primary/10 text-primary"
                              : "text-muted-foreground hover:text-foreground hover:bg-white/5"
                          }`}
                        >
                          {label}
                        </Link>
                      </motion.div>
                    );
                  })}
                </motion.div>

                <div className="h-px w-full bg-white/10" aria-hidden="true" />

                <div className="flex items-center justify-between px-1">
                  <span className="text-base font-light tracking-tight text-muted-foreground">
                    Theme
                  </span>
                  <Tabs
                    value={currentTheme}
                    onValueChange={(v) => setTheme(v as "light" | "dark" | "system")}
                  >
                    <TabsList className="flex rounded-full border border-white/10 bg-white/5 gap-1 p-1">
                      {themes.map(({ theme, icon: Icon }) => (
                        <TabsTrigger
                          key={theme}
                          value={theme}
                          className="h-6 w-6 rounded-full flex items-center justify-center bg-transparent text-muted-foreground transition-colors hover:text-foreground data-[state=active]:bg-background data-[state=active]:text-foreground! data-[state=active]:shadow-sm"
                        >
                          <Icon className="size-[16px]" />
                        </TabsTrigger>
                      ))}
                    </TabsList>
                  </Tabs>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
};

export default Navbar;
