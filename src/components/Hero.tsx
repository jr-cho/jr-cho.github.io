import { BookText, ChevronRight } from "lucide-react";
import { Button } from "./ui/button";
import { socials } from "@/data/socials";
import SocialIcon from "./helpers/SocialIcon";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

import { containerVariants, itemVariants } from "@/lib/motionVariants";

const Hero = () => {
  return (
    <section
      className="flex flex-col justify-center pt-12 pb-10 sm:pt-20 sm:pb-16"
      id="home"
    >
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-5 sm:space-y-10"
      >
        <motion.div
          variants={itemVariants}
          className="flex items-center mb-10 gap-[14px] sm:mb-12 sm:gap-[24px]"
        >
          <div className="flex shrink-0 items-center justify-center">
            {/* avatar */}
            <img
              src={`${import.meta.env.BASE_URL}assets/musashi.svg`}
              alt="profile"
              className="block h-35 w-35 shrink-0 rounded-full border-2 border-border object-cover object-center p-1 shadow-sm sm:h-40 sm:w-40"
            />
          </div>
          <div className="flex h-full flex-col justify-center gap-2 sm:gap-3">
            <h1 className="text-2xl font-semibold tracking-tight sm:text-2xl md:text-3xl">
              Joshua Gottus
            </h1>
            <p className="flex flex-wrap items-center gap-x-2 font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
              @jr-cho
              <span className="text-muted-foreground/40">·</span>
              SWE / PLATFORM
              <span className="text-muted-foreground/40">·</span>
              2026
            </p>
            <div className="flex items-start gap-2.5 sm:gap-3">
              {socials.map(({ name, icon, darkIcon, href }) => (
                <a
                  key={name}
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={name}
                  title={name}
                  className="rounded border-0 transition-opacity hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <SocialIcon
                    icon={icon}
                    darkIcon={darkIcon}
                    alt={name}
                    className="h-6 w-6 rounded p-0.5 sm:h-7 sm:w-7"
                  />
                </a>
              ))}
            </div>
          </div>
        </motion.div>

        <motion.div variants={itemVariants} className="space-y-5 sm:space-y-6">
          <h1 className="max-w-full text-[1.85rem] font-semibold tracking-tight leading-tight sm:text-[2.4rem] md:text-[2.6rem]">
            SWE & Platform Engineer -{" "}
            <span className="text-[0.95em] font-light text-muted-foreground sm:text-[0.96em]">
              Building embedded systems, autonomous platforms, and cloud infrastructure.
            </span>
          </h1>
          <p className="text-base font-light leading-7 text-muted-foreground sm:text-lg sm:leading-8">
            I build embedded systems, autonomous platforms, and cloud
            infrastructure — focused on aerospace, real-time control, and GitOps.
          </p>

          <div className="flex flex-wrap gap-3 sm:gap-4 pt-2">
            <Link to="/contact">
              <Button size="lg">
                Get in Touch
                <ChevronRight strokeWidth={2.25} />
              </Button>
            </Link>
            <a
              href="https://drive.google.com/file/d/1AF0owusJPd1yf1vRwCJcaex04pnEVL_H/view?usp=sharing"
              target="_blank"
              rel="noreferrer"
            >
              <Button
                variant="outline"
                size="lg"
                className="bg-card text-foreground border-dashed cursor-pointer"
              >
                Resume
                <BookText />
              </Button>
            </a>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default Hero;
