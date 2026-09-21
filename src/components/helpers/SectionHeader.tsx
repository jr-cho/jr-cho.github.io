import type { ReactNode } from "react";
import { motion } from "framer-motion";
import { maskLine } from "@/lib/motionVariants";
import Drift from "./Drift";

type SectionHeaderProps = {
  title: string;
  // Two-tone subline: grey lead-in, then the black part.
  lead?: string;
  emphasis?: string;
  children?: ReactNode;
};

// Big centered display title, like a chapter card.
export default function SectionHeader({ title, lead, emphasis, children }: SectionHeaderProps) {
  return (
    <div className="flex flex-col items-center gap-6 text-center">
      <Drift distance={-70}>
      <motion.h2
        className="display overflow-hidden pb-[0.06em] text-[clamp(3rem,9vw,8.5rem)]"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-80px" }}
      >
        <motion.span variants={maskLine} className="block">
          {title}
        </motion.span>
      </motion.h2>
      </Drift>
      {(lead || emphasis) && (
        <p className="text-lg font-semibold tracking-[-0.02em] sm:text-xl">
          {lead && <span className="text-muted-foreground">{lead} </span>}
          {emphasis}
        </p>
      )}
      {children}
    </div>
  );
}
