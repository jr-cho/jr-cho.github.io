import { useEffect, useRef } from "react";
import { useMotionValueEvent, useReducedMotion, type MotionValue } from "framer-motion";
import { cn } from "@/lib/utils";

type ScrubVideoProps = {
  src: string;
  poster: string;
  alt: string;
  // 0 → 1 plays the clip from its first frame to its last.
  progress: MotionValue<number>;
  className?: string;
};

// A muted clip whose playhead follows scroll instead of time. Scrolling
// back plays it backward. The clip must be encoded with every frame as a
// keyframe, or seeking stutters. Reduced motion shows the still frame only.
const ScrubVideo = ({ src, poster, alt, progress, className }: ScrubVideoProps) => {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLVideoElement>(null);
  const frame = useRef(0);

  const seek = (p: number) => {
    const video = ref.current;
    if (!video || !video.duration) return;
    cancelAnimationFrame(frame.current);
    // Seek at most once per frame, and stop just short of the end so the
    // last frame shows instead of a blank.
    frame.current = requestAnimationFrame(() => {
      video.currentTime = Math.min(Math.max(p, 0), 1) * (video.duration - 0.05);
    });
  };

  useMotionValueEvent(progress, "change", seek);

  useEffect(() => {
    const video = ref.current;
    if (!video) return;
    const sync = () => seek(progress.get());
    video.addEventListener("loadedmetadata", sync);

    // Download the clip only once it is about a screen away, so it does
    // not compete with what loads first.
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();
        video.preload = "auto";
        video.load();
        // Some mobile browsers only allow seeking once a video has played.
        // Play and pause at once, then jump to the current position.
        video
          .play()
          .then(() => video.pause())
          .catch(() => {});
      },
      { rootMargin: "100% 0px" },
    );
    observer.observe(video);

    return () => {
      observer.disconnect();
      video.removeEventListener("loadedmetadata", sync);
      cancelAnimationFrame(frame.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (reduce) {
    return <img src={poster} alt={alt} loading="lazy" className={cn("h-full w-full object-cover", className)} />;
  }

  return (
    <video
      ref={ref}
      src={src}
      poster={poster}
      muted
      playsInline
      preload="none"
      aria-label={alt}
      className={cn("h-full w-full object-cover", className)}
    />
  );
};

export default ScrubVideo;
