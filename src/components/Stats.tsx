import { useEffect, useState, useRef } from "react";
import { useTheme } from "next-themes";
import { ActivityCalendar, type Activity } from "react-activity-calendar";
import { cn } from "@/lib/utils";
import SectionHeader from "./helpers/SectionHeader";
import { useMotionValue, useSpring } from "framer-motion";

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

  return (
    <section id="stats" className="w-full space-y-6">
      <SectionHeader eyebrow="SOURCE · GITHUB" title="GitHub Activity">
        <div className="flex flex-wrap items-center gap-2 text-sm">
          {yearOptions.map((option) => {
            const isActive = year === option;
            return (
              <button
                key={option}
                type="button"
                onClick={() => setYear(option)}
                className={cn(
                  "relative px-1.5 pb-1 font-normal tracking-tight text-muted-foreground transition-colors hover:text-foreground",
                  isActive &&
                    "text-foreground after:absolute after:inset-x-0 after:-bottom-0.5 after:h-0.5 after:rounded-full after:bg-foreground",
                )}
              >
                {option}
              </button>
            );
          })}
        </div>
      </SectionHeader>

      <div className="glass-card p-4 pb-3 sm:p-6 sm:pb-4">
        {loading ? (
          <p className="text-sm text-muted-foreground">Loading GitHub stats...</p>
        ) : error ? (
          <p className="text-sm text-muted-foreground">{error}</p>
        ) : (
          <div className="space-y-3">
            <div className="flex items-center justify-between font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
              <span className="flex items-center gap-2">
                <span
                  className="h-1.5 w-1.5 rounded-full"
                  style={{ backgroundColor: "var(--accent-amber)" }}
                />
                Activity · Signal
              </span>
              <span>{year === currentYear ? currentYear : year}</span>
            </div>
            <div
              ref={scrollRef}
              data-lenis-prevent="true"
              className="w-full overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
            >
              <div className="min-w-max">
                <ActivityCalendar
                  data={data}
                  className="bg-transparent"
                  style={{ backgroundColor: "transparent" }}
                  colorScheme={
                    resolvedTheme === "dark"
                      ? "dark"
                      : resolvedTheme === "light"
                        ? "light"
                        : undefined
                  }
                  theme={{
                    light: ["#E5E2DB", "#F8D38C", "#F7C25A", "#F6B22F", "#F5A623"],
                    dark: ["#2A2A2E", "#6E4E12", "#A8741C", "#D49323", "#F5A623"],
                  }}
                  blockSize={11}
                  blockMargin={5}
                  blockRadius={3}
                  fontSize={12}
                  showWeekdayLabels
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
              </div>
            </div>
            <div className="flex items-center justify-between font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
              <span className="text-foreground">
                <AnimatedNumber value={total} /> contributions ↑{" "}
                {year === currentYear ? "last 12 mo" : year}
              </span>
              <span className="hidden sm:inline">swipe to explore →</span>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default Stats;
