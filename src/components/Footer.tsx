import { motion } from "framer-motion";
import { email, resumeHref, socials } from "@/data/socials";
import { shell } from "@/lib/layout";
import { cn } from "@/lib/utils";

const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="sticky bottom-0 z-0 bg-[#0A0A0A] text-white dark:bg-[#171717]">
      <div className={cn(shell, "flex flex-col gap-16 pt-20 pb-8 sm:pt-28")}>
        <div className="space-y-6">
          <p className="font-serif text-[clamp(1.5rem,2.4vw,2rem)] leading-tight text-white/70">
            Open to embedded and robotics roles from May 2027.
          </p>
          <motion.a
            href={`mailto:${email}`}
            initial={{ opacity: 0, y: 60, scale: 0.92 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: false, amount: 0.6 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="display block w-fit origin-left text-[clamp(3.25rem,11vw,10rem)] transition-opacity hover:opacity-70"
          >
            Let’s talk
          </motion.a>
          <a
            href={`mailto:${email}`}
            className="inline-block text-lg underline-offset-4 hover:underline sm:text-xl"
          >
            {email}
          </a>
        </div>

        <div className="flex flex-col gap-4 border-t border-white/15 pt-6 text-[15px] sm:flex-row sm:items-center sm:justify-between">
          <p className="text-white/60">
            &copy; {year} Joshua Gottus · @jr-cho
          </p>
          <ul className="flex flex-wrap gap-x-6 gap-y-2">
            {socials
              .filter((s) => !s.href.startsWith("mailto"))
              .map(({ name, href }) => (
                <li key={name}>
                  <a href={href} target="_blank" rel="noreferrer" className="transition-opacity hover:opacity-60">
                    {name}
                  </a>
                </li>
              ))}
            <li>
              <a href={resumeHref} target="_blank" rel="noreferrer" className="transition-opacity hover:opacity-60">
                Resume
              </a>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
