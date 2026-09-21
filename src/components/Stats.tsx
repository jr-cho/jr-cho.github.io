import { useEffect, useState, useRef } from "react";
import { useTheme } from "next-themes";
import { ActivityCalendar, type Activity } from "react-activity-calendar";
import { cn } from "@/lib/utils";
import { shell } from "@/lib/layout";
import { motion, useMotionValue, useSpring } from "framer-motion";

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

function AnimatedNumber({ value }: { value: number }) {
  const motionValue = useMotionValue(0);
  const spring = useSpring(motionValue, { stiffness: 100, damping: 30 });
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    const unsub = spring.on("change", (v) => setDisplay(Math.round(v)));
    return unsub;
  }, [spring]);

  useEffect(() => {
    motionValue.set(value);
  }, [value, motionValue]);

  return <span>{display.toLocaleString()}</span>;
}

const Stats = ({ year: initialYear = 2026 }: StatsProps) => {
  const { resolvedTheme } = useTheme();
  const [data, setData] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [year, setYear] = useState<StatsProps["year"]>(initialYear);
  const scrollRef = useRef<HTMLDivElement>(null);
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
    <div className={cn(shell, "grid grid-cols-1 gap-10 md:grid-cols-12")}>
      <div className="space-y-6 md:col-span-4">
        <h2 className="font-serif text-[clamp(1.75rem,2.6vw,2.25rem)] leading-[1.1]">
          GitHub contributions, {year === currentYear ? "last 12 months" : year}
        </h2>
        <p className="display text-[clamp(3.5rem,7vw,6rem)]">
          {loading ? "—" : <AnimatedNumber value={total} />}
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
      </div>

      <div className="md:col-span-8 md:self-end">
        <motion.div
          initial={{ clipPath: "inset(0 100% 0 0)" }}
          whileInView={{ clipPath: "inset(0 0% 0 0)" }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
        >
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
                colorScheme={resolvedTheme === "dark" ? "dark" : "light"}
                theme={{
                  light: ["#EDEDED", "#C4C4C4", "#8C8C8C", "#4A4A4A", "#0A0A0A"],
                  dark: ["#1C1C1C", "#3D3D3D", "#6E6E6E", "#A8A8A8", "#FFFFFF"],
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
