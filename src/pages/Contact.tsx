import { useState } from "react";
import { Reveal } from "@/components/helpers/Reveal";
import ArrowLink from "@/components/helpers/ArrowLink";
import { email, resumeHref, socials } from "@/data/socials";
import { Check, Copy } from "lucide-react";
import { motion } from "framer-motion";
import { pageDepthVariants } from "@/lib/motionVariants";
import { shell } from "@/lib/layout";
import { cn } from "@/lib/utils";

const details = [
  { label: "Location", value: "Lakeland, FL" },
  { label: "Available", value: "Full-time from May 2027" },
  { label: "Status", value: "U.S. Citizen · Clearance Eligible" },
];

const Contact = () => {
  const [copied, setCopied] = useState(false);
  const profiles = socials.filter((s) => !s.href.startsWith("mailto"));

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard can be blocked. The address stays visible to select by hand.
    }
  };

  return (
    <motion.main
      className={cn(shell, "flex flex-col gap-20 pt-10 sm:gap-28 sm:pt-16")}
      variants={pageDepthVariants}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      <title>Contact · Joshua Gottus</title>

      <div className="space-y-10">
        <h1 className="display text-[clamp(3.5rem,12vw,11rem)]">Contact</h1>
        <p className="max-w-[28ch] font-serif text-[clamp(1.75rem,3.2vw,2.75rem)] leading-[1.1]">
          I am looking for embedded software and robotics roles after I
          graduate in May 2027. Email is the fastest way to reach me.
        </p>
      </div>

      <Reveal className="grid grid-cols-1 gap-10 md:grid-cols-12">
        <p className="text-[15px] md:col-span-3">Email</p>
        <div className="flex flex-col gap-4 md:col-span-9">
          <a
            href={`mailto:${email}`}
            className="break-all text-[clamp(1.75rem,4vw,3.5rem)] font-semibold leading-none tracking-[-0.04em] underline-offset-[0.15em] hover:underline"
          >
            {email}
          </a>
          <button
            type="button"
            onClick={copyEmail}
            className="inline-flex min-h-10 w-fit items-center gap-2 text-[15px] transition-opacity hover:opacity-60"
          >
            {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            <span aria-live="polite">{copied ? "Copied" : "Copy address"}</span>
          </button>
        </div>
      </Reveal>

      <Reveal className="grid grid-cols-1 gap-10 md:grid-cols-12">
        <p className="text-[15px] md:col-span-3">Details</p>
        <dl className="md:col-span-9">
          {details.map(({ label, value }) => (
            <div
              key={label}
              className="grid grid-cols-[8rem_1fr] gap-4 border-t border-border py-4 text-[17px] last:border-b"
            >
              <dt className="text-muted-foreground">{label}</dt>
              <dd>{value}</dd>
            </div>
          ))}
        </dl>
      </Reveal>

      <Reveal className="grid grid-cols-1 gap-10 md:grid-cols-12">
        <p className="text-[15px] md:col-span-3">Elsewhere</p>
        <div className="flex flex-wrap gap-x-10 md:col-span-9">
          {profiles.map(({ name, href }) => (
            <ArrowLink key={name} href={href}>{name}</ArrowLink>
          ))}
          <ArrowLink href={resumeHref}>Resume (PDF)</ArrowLink>
        </div>
      </Reveal>
    </motion.main>
  );
};

export default Contact;
