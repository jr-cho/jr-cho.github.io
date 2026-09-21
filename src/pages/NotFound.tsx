import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { pageDepthVariants } from "@/lib/motionVariants";

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
      className="mx-auto flex min-h-[60vh] w-full max-w-3xl flex-col justify-center gap-4 px-6 sm:px-8"
      variants={pageDepthVariants}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      <title>{`${title} · Joshua Gottus`}</title>
      <p className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
        404
      </p>
      <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">{title}</h1>
      <p className="text-base text-muted-foreground sm:text-lg">{message}</p>
      <div className="pt-2">
        <Button asChild size="lg">
          <Link to={backTo}>{backLabel}</Link>
        </Button>
      </div>
    </motion.main>
  );
};

export default NotFound;
