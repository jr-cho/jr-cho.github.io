import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import type { MediaSlot } from "@/data/media";
import { cn } from "@/lib/utils";

type ParallaxFrameProps = {
  slot: MediaSlot;
  // How far the picture travels inside the frame, as a percent of frame
  // height in each direction. Higher numbers feel closer to the camera.
  speed?: number;
  className?: string;
  captionClassName?: string;
};

// A fixed frame whose picture moves at its own speed as the page scrolls.
// The picture is taller than the frame by 2 × speed, so no edge ever shows.
const ParallaxFrame = ({ slot, speed = 10, className, captionClassName }: ParallaxFrameProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [`${-speed}%`, `${speed}%`]);
  const src = slot.src ? `${import.meta.env.BASE_URL}${slot.src.replace(/^\//, "")}` : undefined;
  const isVideo = src?.endsWith(".mp4") || src?.endsWith(".webm");

  return (
    <figure className={className}>
      <div
        ref={ref}
        className="relative w-full overflow-hidden rounded-lg bg-card"
        style={{ aspectRatio: slot.aspect }}
      >
        <motion.div
          className="absolute inset-x-0"
          style={{ top: `${-speed}%`, bottom: `${-speed}%`, y: reduce ? 0 : y }}
        >
          {src && isVideo ? (
            <video
              src={src}
              autoPlay
              muted
              loop
              playsInline
              aria-label={slot.alt}
              className="h-full w-full object-cover"
            />
          ) : src ? (
            <img
              src={src}
              alt={slot.alt}
              loading="lazy"
              className={cn("h-full w-full object-cover", slot.imgClassName)}
            />
          ) : (
            // Placeholder: says which photo belongs here until one is added.
            <div className="flex h-full w-full flex-col items-center justify-center gap-2 p-6 text-center">
              <span className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
                Photo · {slot.aspect.replace(/\s/g, "")}
              </span>
              <span className="max-w-[28ch] text-[15px] leading-snug text-muted-foreground">
                {slot.hint}
              </span>
            </div>
          )}
        </motion.div>
      </div>
      {slot.caption && (
        <figcaption
          className={cn("mt-3 font-mono text-xs uppercase tracking-wider", captionClassName)}
        >
          {slot.caption}
        </figcaption>
      )}
    </figure>
  );
};

export default ParallaxFrame;
