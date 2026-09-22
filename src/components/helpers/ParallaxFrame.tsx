import { useEffect, useRef, useState, type PointerEvent } from "react";
import { Pause, Play } from "lucide-react";
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
  // Each video has a still frame beside it with the same name: clip.mp4 → clip.jpg.
  const poster = isVideo ? src?.replace(/\.(mp4|webm)$/, ".jpg") : undefined;
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);

  // Reduced motion: hold the still frame until the viewer presses play.
  useEffect(() => {
    if (reduce) videoRef.current?.pause();
  }, [reduce]);

  // Move the color spotlight to the cursor.
  const moveSpot = (e: PointerEvent<HTMLDivElement>) => {
    const box = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty("--spot-x", `${e.clientX - box.left}px`);
    e.currentTarget.style.setProperty("--spot-y", `${e.clientY - box.top}px`);
  };

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) void video.play();
    else video.pause();
  };

  return (
    <figure className={className}>
      <div
        ref={ref}
        onPointerMove={slot.colorSpot ? moveSpot : undefined}
        className={cn("relative w-full overflow-hidden rounded-lg bg-card", slot.colorSpot && "color-spot")}
        style={{ aspectRatio: slot.aspect }}
      >
        <motion.div
          className="absolute inset-x-0"
          style={{ top: `${-speed}%`, bottom: `${-speed}%`, y: reduce ? 0 : y }}
        >
          {src && isVideo ? (
            <video
              ref={videoRef}
              src={src}
              poster={poster}
              autoPlay={!reduce}
              muted
              loop
              playsInline
              preload={reduce ? "none" : "auto"}
              onPlay={() => setPlaying(true)}
              onPause={() => setPlaying(false)}
              onClick={togglePlay}
              aria-label={slot.alt}
              className="h-full w-full cursor-pointer object-cover"
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
        {slot.colorSpot && <div aria-hidden="true" className="color-spot-layer pointer-events-none absolute inset-0" />}
        {src && isVideo && (
          <button
            type="button"
            onClick={togglePlay}
            aria-label={playing ? "Pause video" : "Play video"}
            className="absolute bottom-3 right-3 flex size-9 items-center justify-center rounded-full bg-black/55 text-white backdrop-blur-sm transition-opacity hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
          >
            {playing ? <Pause className="size-4" /> : <Play className="size-4" />}
          </button>
        )}
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
