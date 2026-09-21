import { motion } from "framer-motion";
import { education } from "@/data/education";
import { containerVariants, itemVariants } from "@/lib/motionVariants";
import { shell } from "@/lib/layout";
import { cn } from "@/lib/utils";

const EducationSection = () => {
  return (
    <div className={cn(shell, "grid grid-cols-1 gap-10 md:grid-cols-12")}>
      <h2 className="font-serif text-[clamp(1.75rem,2.6vw,2.25rem)] leading-[1.1] md:col-span-4">
        Education
      </h2>
      <motion.ol
        className="md:col-span-8"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-80px" }}
      >
        {education.map(({ school, degree, detail, location, date }) => (
          <motion.li
            variants={itemVariants}
            key={school}
            className="grid grid-cols-1 gap-1 border-t border-border py-5 last:border-b sm:grid-cols-[1fr_auto] sm:gap-6"
          >
            <div>
              <p className="text-[17px] font-semibold tracking-[-0.01em]">{school}</p>
              <p className="text-[15px] text-muted-foreground">
                {degree}
                {detail && <>, {detail}</>}
              </p>
            </div>
            <p className="font-mono text-xs uppercase tracking-wider text-muted-foreground sm:pt-1 sm:text-right">
              {date}
              <br className="hidden sm:block" />
              <span className="sm:hidden"> · </span>
              {location}
            </p>
          </motion.li>
        ))}
      </motion.ol>
    </div>
  );
};

export default EducationSection;
