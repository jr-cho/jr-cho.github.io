import { useEffect, useState, useRef } from "react";
import { ActivityCalendar, type Activity } from "react-activity-calendar";
import { cn } from "@/lib/utils";
import { shell } from "@/lib/layout";
import {
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useTransform,
  type MotionValue,
} from "framer-motion";
import Drift from "./helpers/Drift";

type StatsProps = {
  year?: "last" | "all" | number;
};

type ContributionResponse = {
  contributions: Activity[];
};

const monthNames = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

const formatActivityDate = (date: string) => {
  const parsed = new Date(date);
  if (Number.isNaN(parsed.getTime())) return date;
  return `${parsed.getDate()} ${monthNames[parsed.getMonth()]} ${parsed.getFullYear()}`;
};

// Counts up from zero as `progress` goes from 0 to 1. Only this span
// re-renders on scroll, not the calendar next to it.
function ScrollNumber({ value, progress }: { value: number; progress: MotionValue<number> }) {
  const reduce = useReducedMotion();
  const [p, setP] = useState(() => progress.get());
  useMotionValueEvent(progress, "change", setP);
  // Ease out, so the count slows as it lands on the total.
  const eased = reduce ? 1 : 1 - (1 - p) ** 3;
  return <span>{Math.round(value * eased).toLocaleString()}</span>;
}

const Stats = ({ year: initialYear = 2026 }: StatsProps) => {
  const [data, setData] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [year, setYear] = useState<StatsProps["year"]>(initialYear);
  const scrollRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  // 0 → 1 while the section travels from the viewport bottom to its center.
  // The count and the calendar both build up along this path.
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start end", "center center"] });
  const calendarClip = useTransform(scrollYProgress, [0.2, 1], ["inset(0 100% 0 0)", "inset(0 0% 0 0)"]);
  const currentYear = new Date().getFullYear();
  const yearOptions: number[] = Array.from(
    { length: Math.max(currentYear - 2025 + 1, 1) },
    (_, index) => currentYear - index,
  );

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    // Start scrolled to the most recent weeks; let the user scroll natively.
    setTimeout(() => { el.scrollLeft = el.scrollWidth; }, 10);
  }, [data]);

  useEffect(() => {
    const controller = new AbortController();
    let active = true;

    const fetchContributions = async () => {
      try {
        if (!active) return;
        setLoading(true);
        setError(null);
        const apiYear = year === currentYear ? "last" : year;
        const res = await fetch(
          `https://github-contributions-api.jogruber.de/v4/jr-cho?y=${apiYear}`,
          { signal: controller.signal },
        );
        if (!res.ok) throw new Error("Failed to fetch contribution data");
        const json = (await res.json()) as ContributionResponse;
        if (active) setData(json.contributions);
      } catch (err) {
        if (err instanceof DOMException && err.name === "AbortError") return;
        if (active) setError(err instanceof Error ? err.message : "Something went wrong");
      } finally {
        if (active) setLoading(false);
      }
    };

    fetchContributions();
    return () => { active = false; controller.abort(); };
  }, [year, currentYear]);

  const total = data.reduce((sum, activity) => sum + activity.count, 0);

  // The data comes from a third-party API. Hide the section when it fails.
  if (error) return null;

  return (
    <div ref={sectionRef} className={cn(shell, "grid grid-cols-1 gap-10 md:grid-cols-12")}>
      <Drift distance={-80} className="space-y-6 md:col-span-4">
        <h2 className="font-serif text-[clamp(1.75rem,2.6vw,2.25rem)] leading-[1.1]">
          GitHub contributions, {year === currentYear ? "last 12 months" : year}
        </h2>
        <p className="display text-[clamp(3.5rem,7vw,6rem)]">
          {loading ? "—" : <ScrollNumber value={total} progress={scrollYProgress} />}
        </p>
        <div className="flex items-center gap-4 text-[15px]">
          {yearOptions.map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => setYear(option)}
              aria-pressed={year === option}
              className={cn(
                "min-h-10 transition-opacity hover:opacity-60",
                year === option ? "underline decoration-1 underline-offset-4" : "text-muted-foreground",
              )}
            >
              {option}
            </button>
          ))}
        </div>
      </Drift>

      <div className="md:col-span-8 md:self-end">
        {/* The calendar wipes in from the left in step with the count */}
        <motion.div style={{ clipPath: reduce ? "none" : calendarClip }}>
        <div
          ref={scrollRef}
          data-lenis-prevent="true"
          className="w-full overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
        >
          <div className="min-w-max">
            {!loading && (
              <ActivityCalendar
                data={data}
                className="bg-transparent"
                style={{ backgroundColor: "transparent" }}
                colorScheme="light"
                theme={{
                  light: ["#EDEDED", "#C4C4C4", "#8C8C8C", "#4A4A4A", "#0A0A0A"],
                }}
                blockSize={11}
                blockMargin={3}
                blockRadius={2}
                fontSize={12}
                showColorLegend={false}
                showTotalCount={false}
                tooltips={{
                  activity: {
                    placement: "top",
                    withArrow: true,
                    offset: { mainAxis: 10 },
                    text: (activity) =>
                      `${formatActivityDate(activity.date)} • ${activity.count} contribution${activity.count === 1 ? "" : "s"}`,
                  },
                }}
              />
            )}
          </div>
        </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Stats;
