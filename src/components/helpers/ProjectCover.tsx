import type { Project } from "@/data/projects";
import { cn } from "@/lib/utils";

type ProjectCoverProps = Pick<Project, "period" | "status" | "highlights"> & {
  className?: string;
};

// Typographic poster in place of a photo: the lead number set huge,
// the other two numbers small along the bottom.
const ProjectCover = ({ period, status, highlights, className }: ProjectCoverProps) => {
  const [lead, ...rest] = highlights;

  return (
    <div
      className={cn(
        "flex aspect-[4/3] w-full flex-col justify-between overflow-hidden rounded-lg bg-card p-5 transition-colors duration-500 group-hover:bg-accent sm:p-7",
        className,
      )}
    >
      <div className="flex items-start justify-between gap-4 font-mono text-xs uppercase tracking-wider text-muted-foreground">
        <span>{period}</span>
        {status && <span>{status}</span>}
      </div>

      {lead && (
        <div>
          <p className="display text-[clamp(2.75rem,7vw,6.5rem)] transition-transform duration-700 ease-out group-hover:-translate-y-1">
            {lead.value}
          </p>
          <p className="mt-2 font-mono text-xs uppercase tracking-wider text-muted-foreground">
            {lead.label}
          </p>
        </div>
      )}

      <dl className="grid grid-cols-2 gap-4 border-t border-border pt-4">
        {rest.map(({ value, label }) => (
          <div key={label}>
            <dd className="text-lg font-semibold tracking-[-0.02em]">{value}</dd>
            <dt className="font-mono text-xs uppercase tracking-wider text-muted-foreground">{label}</dt>
          </div>
        ))}
      </dl>
    </div>
  );
};

export default ProjectCover;
