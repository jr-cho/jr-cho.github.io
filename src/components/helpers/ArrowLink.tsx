import type { ReactNode } from "react";
import { CornerDownRight } from "lucide-react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

// "↳ Label" link. Pass `to` for an in-app route or `href` for anything else.
const ArrowLink = ({
  to,
  href,
  children,
  className,
}: {
  to?: string;
  href?: string;
  children: ReactNode;
  className?: string;
}) => {
  const inner = (
    <>
      <CornerDownRight className="h-4 w-4 shrink-0" strokeWidth={1.75} />
      <span className="underline-offset-4 group-hover:underline">{children}</span>
    </>
  );
  const cls = cn("group inline-flex min-h-10 items-center gap-2 text-[15px]", className);
  if (to) return <Link to={to} className={cls}>{inner}</Link>;
  const external = href && !href.startsWith("mailto");
  return (
    <a href={href} className={cls} target={external ? "_blank" : undefined} rel={external ? "noreferrer" : undefined}>
      {inner}
    </a>
  );
};

export default ArrowLink;
