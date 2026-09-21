import { ArrowUpRight, FileText } from "lucide-react";
import { Button } from "./ui/button";
import { socials } from "@/data/socials";
import SocialIcon from "./helpers/SocialIcon";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

import { containerVariants, itemVariants } from "@/lib/motionVariants";

const Hero = () => {
  return (
    <section className="flex flex-col justify-center pt-10 sm:pt-16" id="home">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-8 sm:space-y-10"
      >
        <motion.div variants={itemVariants} className="flex items-center gap-4 sm:gap-5">
          {/* monogram */}
          <div
            aria-hidden
            className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl border border-border bg-card font-mono text-lg font-semibold tracking-tight sm:h-16 sm:w-16 sm:text-xl"
          >
            JG
          </div>
          <div className="flex flex-col gap-1">
            <h1 className="text-xl font-semibold tracking-tight sm:text-2xl">
              Joshua Gottus
            </h1>
            <p className="flex flex-wrap items-center gap-x-2 font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
              Lakeland, FL
              <span className="text-muted-foreground/40">·</span>
              U.S. Citizen
              <span className="text-muted-foreground/40">·</span>
              Clearance Eligible
            </p>
          </div>
        </motion.div>

        <motion.div variants={itemVariants} className="space-y-5">
          <p className="text-[2rem] font-semibold leading-[1.1] tracking-tight sm:text-[2.75rem]">
            Embedded Software Engineer
          </p>
          <p className="max-w-[60ch] text-base leading-7 text-muted-foreground sm:text-lg sm:leading-8">
            I write C and C++ for microcontrollers, FreeRTOS, and ROS 2. I most
            recently worked as an embedded software engineering intern at a
            defense contracting company. I study Computer Science with a
            Cybersecurity concentration at Florida Polytechnic University,
            graduating May 2027.
          </p>
        </motion.div>

        <motion.div
          variants={itemVariants}
          className="flex flex-wrap items-center gap-3 sm:gap-4"
        >
          <Button asChild size="lg">
            <a
              href={`${import.meta.env.BASE_URL}global/Joshua-Gottus-Resume.pdf`}
              target="_blank"
              rel="noreferrer"
            >
              <FileText />
              Resume
            </a>
          </Button>
          <Button asChild variant="outline" size="lg" className="bg-card">
            <Link to="/contact">
              Contact
              <ArrowUpRight />
            </Link>
          </Button>
          <div className="flex items-center gap-2.5 sm:ml-2">
            {socials.map(({ name, icon, darkIcon, href }) => (
              <a
                key={name}
                href={href}
                target={href.startsWith("mailto") ? undefined : "_blank"}
                rel={href.startsWith("mailto") ? undefined : "noreferrer"}
                aria-label={name}
                title={name}
                className="rounded transition-opacity hover:opacity-70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <SocialIcon
                  icon={icon}
                  darkIcon={darkIcon}
                  alt={name}
                  className="h-6 w-6 rounded p-0.5"
                />
              </a>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default Hero;
