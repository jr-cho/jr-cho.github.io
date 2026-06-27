import type { ReactNode } from "react";

type SectionHeaderProps = {
  eyebrow: string;
  title: string;
  children?: ReactNode;
};

export default function SectionHeader({ eyebrow, title, children }: SectionHeaderProps) {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-end justify-between gap-3">
        <div className="flex flex-col gap-1.5">
          <span className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
            {eyebrow}
          </span>
          <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
            {title}
          </h2>
        </div>
        {children}
      </div>
      {/* hairline rule with corner ticks */}
      <div className="relative h-px w-full bg-border">
        <span className="absolute -top-1 left-0 h-2 w-px bg-border" />
        <span className="absolute -top-1 right-0 h-2 w-px bg-border" />
      </div>
    </div>
  );
}
