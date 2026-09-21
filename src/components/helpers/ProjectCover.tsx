import type { Project } from "@/data/projects";
import { cn } from "@/lib/utils";

type ProjectCoverProps = Pick<Project, "period" | "status" | "highlights"> & {
  className?: string;
};

// Stands in for a screenshot: period, status, and key numbers as a short list.
const ProjectCover = ({ period, status, highlights, className }: ProjectCoverProps) => {
  return (
    <div
      className={cn(
        "flex h-full w-full flex-col gap-4 rounded-lg border border-border bg-background/60 p-4",
        className,
      )}
    >
      <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1 font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
        <span className="whitespace-nowrap">{period}</span>
        {status && (
          <span className="flex items-center gap-1.5 whitespace-nowrap">
            <span
              className="h-1.5 w-1.5 rounded-full"
              style={{ backgroundColor: "var(--accent-amber)" }}
            />
            {status}
          </span>
        )}
      </div>
      <dl className="flex flex-col divide-y divide-border">
        {highlights.map(({ value, label }) => (
          <div key={label} className="flex items-baseline justify-between gap-4 py-2 first:pt-0 last:pb-0">
            <dt className="text-sm text-muted-foreground">{label}</dt>
            <dd className="text-base font-semibold tracking-tight text-foreground">{value}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
};

export default ProjectCover;
