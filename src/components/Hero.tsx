import type { ReactNode } from "react";
import { motion, useTransform } from "framer-motion";
import ArrowLink from "./helpers/ArrowLink";
import ParallaxFrame from "./helpers/ParallaxFrame";
import Scene, { useScene } from "./helpers/Scene";
import ScrollWords from "./helpers/ScrollWords";
import Drift from "./helpers/Drift";
import { media } from "@/data/media";
import { resumeHref, socials } from "@/data/socials";
import { containerVariants, itemVariants, maskLine } from "@/lib/motionVariants";
import { shell } from "@/lib/layout";
import { cn } from "@/lib/utils";

// One display line that slides up from behind a mask.
const Line = ({ children, className }: { children: ReactNode; className?: string }) => (
  <span className="block overflow-hidden pb-[0.06em]">
    <motion.span variants={maskLine} className={cn("block", className)}>
      {children}
    </motion.span>
  </span>
);

const claims = [
  "16th of 84 at IEEE SoutheastCon 2026",
  "Embedded intern at a defense contractor",
  "B.S. Computer Science, May 2027",
];

// Headline halves pull apart and the claims drop away as the scene leaves.
const HeroContent = () => {
  const { exit, reduce } = useScene();
  const pull = reduce ? 0 : 1;
  const leftX = useTransform(exit, [0, 1], [0, -160 * pull]);
  const rightX = useTransform(exit, [0, 1], [0, 160 * pull]);
  const claimsY = useTransform(exit, [0, 0.6], [0, 80 * pull]);
  const claimsOpacity = useTransform(exit, [0, 0.5], [1, reduce ? 1 : 0]);

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className={cn(shell, "flex min-h-[calc(100svh-6rem)] flex-col justify-between gap-16 pt-4 pb-10 sm:pt-6")}
    >
      <h1 className="display grid grid-cols-1 gap-x-8 gap-y-[0.12em] text-[clamp(3rem,7vw,7.5rem)] md:grid-cols-2">
        <span className="sr-only">Joshua Gottus, </span>
        <motion.span style={{ x: leftX }}>
          <Line>Embedded</Line>
          <Line>Software</Line>
        </motion.span>
        <motion.span style={{ x: rightX }} className="text-right">
          <Line>For real</Line>
          <Line>hardware</Line>
        </motion.span>
      </h1>

      <motion.ul
        style={{ y: claimsY, opacity: claimsOpacity }}
        className="grid grid-cols-1 gap-2 text-base font-semibold tracking-[-0.02em] sm:text-lg md:grid-cols-3"
      >
        {claims.map((claim, i) => (
          <motion.li
            key={claim}
            variants={itemVariants}
            className={cn(i === 1 && "md:text-center", i === 2 && "md:text-right")}
          >
            {claim}
          </motion.li>
        ))}
      </motion.ul>
    </motion.div>
  );
};

const about =
  "I write C and C++ for microcontrollers, FreeRTOS, and ROS 2. Most recently I was an embedded software engineering intern at a defense contracting company. I study Computer Science at Florida Polytechnic University.";

// Dark band: text fills in word by word, portrait and links at their own depths.
const AboutContent = () => (
  <div className={cn(shell, "grid grid-cols-1 gap-12 py-24 sm:py-36 md:grid-cols-12")}>
    <div className="flex flex-col justify-between gap-12 md:col-span-7">
      <ScrollWords
        text={about}
        className="font-serif text-[clamp(1.75rem,3.2vw,2.75rem)] leading-[1.1]"
      />
      <motion.div
        className="space-y-6"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-80px" }}
      >
        <motion.p variants={itemVariants} className="font-mono text-xs uppercase tracking-wider text-white/60">
          Lakeland, FL · U.S. Citizen · Clearance Eligible
        </motion.p>
        <div className="flex flex-wrap gap-x-8">
          <motion.div variants={itemVariants}>
            <ArrowLink to="/contact">Get in touch</ArrowLink>
          </motion.div>
          <motion.div variants={itemVariants}>
            <ArrowLink href={resumeHref}>Resume (PDF)</ArrowLink>
          </motion.div>
        </div>
      </motion.div>
    </div>

    <Drift distance={-120} className="md:col-span-4 md:col-start-9">
      <ParallaxFrame slot={media.portrait} speed={10} />
      <motion.div
        className="mt-3 flex flex-wrap gap-x-4 font-mono text-xs uppercase tracking-wider"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        <motion.span variants={itemVariants}>@jr-cho</motion.span>
        {socials.map(({ name, href }) => (
          <motion.a
            key={name}
            variants={itemVariants}
            href={href}
            target={href.startsWith("mailto") ? undefined : "_blank"}
            rel={href.startsWith("mailto") ? undefined : "noreferrer"}
            className="text-white/60 transition-colors hover:text-white"
          >
            {name}
          </motion.a>
        ))}
      </motion.div>
    </Drift>
  </div>
);

const Hero = () => (
  <>
    <Scene id="home" layer={1}>
      <HeroContent />
    </Scene>
    <Scene id="about" layer={2} tone="dark">
      <AboutContent />
    </Scene>
  </>
);

export default Hero;
