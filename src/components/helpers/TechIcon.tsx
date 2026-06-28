import { cn } from "@/lib/utils";
import type { CSSProperties } from "react";
import type { TechItem } from "@/data/tech";

type TechIconProps = {
  item: TechItem;
  className?: string;
};

// Mono-graphite at rest, true brand color on hover (own hover or parent `.group`).
const TechIcon = ({ item, className }: TechIconProps) => {
  const { Icon } = item;
  return (
    <Icon
      aria-label={item.name}
      role="img"
      style={{ "--brand": item.brand } as CSSProperties}
      className={cn(
        "shrink-0 text-foreground/75 transition-colors duration-300",
        "hover:text-[var(--brand)] group-hover:text-[var(--brand)]",
        className
      )}
    />
  );
};

export default TechIcon;
