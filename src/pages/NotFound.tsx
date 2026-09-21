import { motion } from "framer-motion";
import ArrowLink from "@/components/helpers/ArrowLink";
import { pageDepthVariants } from "@/lib/motionVariants";
import { shell } from "@/lib/layout";
import { cn } from "@/lib/utils";

type NotFoundProps = {
  title?: string;
  message?: string;
  backTo?: string;
  backLabel?: string;
};

const NotFound = ({
  title = "Page not found",
  message = "This page does not exist or has moved.",
  backTo = "/",
  backLabel = "Back to home",
}: NotFoundProps) => {
  return (
    <motion.main
      className={cn(shell, "flex min-h-[60vh] flex-col justify-center gap-8 pt-10")}
      variants={pageDepthVariants}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      <title>{`${title} · Joshua Gottus`}</title>
      <p className="display text-[clamp(6rem,24vw,20rem)]">404</p>
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold tracking-[-0.03em] sm:text-3xl">{title}</h1>
        <p className="text-[17px] text-muted-foreground">{message}</p>
      </div>
      <ArrowLink to={backTo}>{backLabel}</ArrowLink>
    </motion.main>
  );
};

export default NotFound;
