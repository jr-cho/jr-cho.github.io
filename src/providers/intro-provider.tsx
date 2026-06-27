import { useState } from "react";
import { useReducedMotion } from "framer-motion";
import { IntroContext } from "./intro-context";

const KEY = "intro-played";

export function IntroProvider({ children }: { children: React.ReactNode }) {
  const reduce = useReducedMotion();
  const seen =
    typeof sessionStorage !== "undefined" &&
    sessionStorage.getItem(KEY) === "1";
  const [done, setDone] = useState(Boolean(seen) || Boolean(reduce));

  const finish = () => {
    try {
      sessionStorage.setItem(KEY, "1");
    } catch {
      /* ignore storage failures */
    }
    setDone(true);
  };

  return (
    <IntroContext.Provider value={{ done, finish }}>
      {children}
    </IntroContext.Provider>
  );
}
