import type { Project } from "@/data/projects";
import { cn } from "@/lib/utils";

type ProjectCoverProps = Pick<Project, "name" | "period" | "status" | "highlights"> & {
  className?: string;
};

// Stands in for a screenshot: key numbers on a faint grid, 16:9 like the old images.
const ProjectCover = ({ name, period, status, highlights, className }: ProjectCoverProps) => {
  return (
    <div
      role="img"
      aria-label={`${name}: ${highlights.map((h) => `${h.value} ${h.label}`).join(", ")}`}
      className={cn(
        "relative flex aspect-video w-full flex-col justify-between overflow-hidden rounded-lg border border-border/60 bg-card p-4 sm:p-5",
        className,
      )}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.35] [background-image:linear-gradient(to_right,var(--color-border)_1px,transparent_1px),linear-gradient(to_bottom,var(--color-border)_1px,transparent_1px)] [background-size:24px_24px] [mask-image:radial-gradient(ellipse_at_center,black_40%,transparent_85%)]"
      />
      <div className="relative flex items-center justify-between font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
        <span>{period}</span>
        {status && (
          <span className="flex items-center gap-1.5">
            <span
              className="h-1.5 w-1.5 animate-pulse rounded-full"
              style={{ backgroundColor: "var(--accent-amber)" }}
            />
            {status}
          </span>
        )}
      </div>
      <dl className="relative grid grid-cols-3 gap-3">
        {highlights.map(({ value, label }) => (
          <div key={label} className="flex flex-col gap-1">
            <dt className="order-2 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
              {label}
            </dt>
            <dd className="order-1 text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
              {value}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
};

export default ProjectCover;
