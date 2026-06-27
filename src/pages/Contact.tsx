import { Reveal } from "@/components/helpers/Reveal";
import { socials } from "@/data/socials";
import { useTheme } from "next-themes";
import { ArrowUpRight, ChevronLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { pageDepthVariants } from "@/lib/motionVariants";

const Contact = () => {
  const { resolvedTheme } = useTheme();
  const navigate = useNavigate();

  return (
    <motion.main
      className="mx-auto flex w-full max-w-3xl flex-col px-6 pb-12 pt-10 sm:px-8 sm:pt-20 sm:pb-24 space-y-8"
      variants={pageDepthVariants}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      <Reveal>
        <button
          onClick={() => navigate("/")}
          className="flex w-fit items-center gap-3 text-md font-light tracking-tight text-muted-foreground cursor-pointer duration-200 hover:text-foreground"
        >
          <ChevronLeft size={20} strokeWidth={2.25} /> Back to Home
        </button>
      </Reveal>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16 pt-4">
        {/* Left Side: Matter */}
        <div className="flex flex-col gap-10 justify-center">
          <Reveal delay={0.1}>
            <h1 className="text-3xl font-light tracking-tight sm:text-4xl">
              Let's connect
            </h1>
          </Reveal>
          <Reveal delay={0.15}>
            <p className="text-muted-foreground text-base sm:text-lg leading-relaxed">
              I'm always open to discussing new projects, creative ideas, or
              opportunities to be part of your visions. Whether you have a
              question or just want to say hi, feel free to drop a message!
            </p>
          </Reveal>
        </div>

        {/* Right Side: Links */}
        <div className="flex flex-col gap-3 justify-center">
          {socials.map((social, index) => (
            <Reveal key={social.name} delay={0.2 + index * 0.05}>
              <a
                href={social.href}
                target={social.href.startsWith("mailto") ? undefined : "_blank"}
                rel={
                  social.href.startsWith("mailto") ? undefined : "noreferrer"
                }
                className="group glass-card flex items-center justify-between p-4 transition-all hover:shadow-[0_8px_24px_rgba(0,122,255,0.16)]"
              >
                <div className="flex items-center gap-4">
                  <img
                    src={
                      resolvedTheme === "dark" && social.darkIcon
                        ? social.darkIcon
                        : social.icon
                    }
                    alt={social.name}
                    className="h-6 w-6 rounded-sm object-contain"
                  />
                  <span className="text-base font-light tracking-tight">
                    {social.name}
                  </span>
                </div>
                <ArrowUpRight className="h-5 w-5 text-muted-foreground transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-foreground" />
              </a>
            </Reveal>
          ))}
        </div>
      </div>
    </motion.main>
  );
};

export default Contact;
