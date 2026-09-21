import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { skillRows } from "@/data/tech";
import ScrollWords from "./helpers/ScrollWords";
import TechDrift from "./helpers/TechDrift";
import { containerVariants, itemVariants } from "@/lib/motionVariants";
import { shell } from "@/lib/layout";
import { cn } from "@/lib/utils";

// Numbered list in the style of a services index. Hover or focus a row
// to make it active. Its tools show in the right column.
const SkillSection = () => {
  const [active, setActive] = useState(0);

  return (
    <div className={cn(shell, "relative space-y-16 sm:space-y-24")}>
      <ScrollWords
        text="I write the software between the sensor and the motor: drivers, control loops, and the tools that test them."
        className="display max-w-[22ch] text-[clamp(2rem,4.6vw,4.25rem)] leading-[0.95]"
        from={0.12}
      />

      <div className="grid grid-cols-1 gap-8 md:grid-cols-12">
        <p className="text-[15px] md:col-span-3">Technical skills</p>

        <motion.ol
          className="md:col-span-5"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
        >
          {skillRows.map((row, i) => (
            <motion.li key={row.category} variants={itemVariants}>
              <button
                type="button"
                onMouseEnter={() => setActive(i)}
                onFocus={() => setActive(i)}
                onClick={() => setActive(i)}
                aria-expanded={active === i}
                className={cn(
                  "flex w-full items-baseline gap-6 py-1 text-left text-[clamp(1.75rem,3.4vw,3rem)] font-semibold leading-[1.05] tracking-[-0.04em] transition-colors duration-300",
                  "md:text-muted-foreground/35",
                  active === i && "md:text-foreground",
                )}
              >
                <span className="w-8 shrink-0 tabular-nums">{i + 1}</span>
                {row.category}
              </button>
              {/* Phones: every list shows under its heading */}
              <p className="pb-4 pl-14 text-[15px] leading-6 text-muted-foreground md:hidden">
                {row.items.map((t) => t.name).join(", ")}
              </p>
            </motion.li>
          ))}
        </motion.ol>

        <div className="hidden md:col-span-3 md:col-start-10 md:block">
          <AnimatePresence mode="wait">
            <motion.ul
              key={active}
              className="text-[15px] leading-6"
              initial="hidden"
              animate="visible"
              exit={{ opacity: 0, y: -8, transition: { duration: 0.15 } }}
              variants={{ visible: { transition: { staggerChildren: 0.03 } } }}
            >
              {skillRows[active].items.map((t) => (
                <motion.li
                  key={t.name}
                  variants={{ hidden: { opacity: 0, y: 8 }, visible: { opacity: 1, y: 0 } }}
                >
                  {t.name}
                </motion.li>
              ))}
            </motion.ul>
          </AnimatePresence>
        </div>
      </div>

      <TechDrift rows={skillRows.map((row) => row.items)} active={active} />
    </div>
  );
};

export default SkillSection;
