import { useRef } from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { cn } from "@/lib/utils";

type ScrollWordsProps = {
  text: string;
  className?: string;
  // Opacity of a word before it fills in.
  from?: number;
};

const Word = ({
  word,
  progress,
  range,
  from,
}: {
  word: string;
  progress: MotionValue<number>;
  range: [number, number];
  from: number;
}) => {
  const opacity = useTransform(progress, range, [from, 1]);
  return (
    <motion.span aria-hidden="true" style={{ opacity }} className="inline-block">
      {word}&nbsp;
    </motion.span>
  );
};

// Paragraph that fills in word by word as it scrolls into place.
const ScrollWords = ({ text, className, from = 0.18 }: ScrollWordsProps) => {
  const ref = useRef<HTMLParagraphElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.9", "end 0.55"] });
  const words = text.split(" ");

  if (reduce) return <p className={className}>{text}</p>;

  return (
    <p ref={ref} className={cn("flex flex-wrap", className)} aria-label={text}>
      {words.map((word, i) => (
        <Word
          key={`${word}-${i}`}
          word={word}
          progress={scrollYProgress}
          range={[i / words.length, (i + 1) / words.length]}
          from={from}
        />
      ))}
    </p>
  );
};

export default ScrollWords;
