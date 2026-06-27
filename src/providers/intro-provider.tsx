import { createContext, useContext, useState } from "react";
import { useReducedMotion } from "framer-motion";

const KEY = "intro-played";

const Ctx = createContext<{ done: boolean; finish: () => void }>({
  done: true,
  finish: () => {},
});

export const useIntro = () => useContext(Ctx);

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

  return <Ctx.Provider value={{ done, finish }}>{children}</Ctx.Provider>;
}
