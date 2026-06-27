import { createContext, useContext } from "react";

export const IntroContext = createContext<{ done: boolean; finish: () => void }>(
  {
    done: true,
    finish: () => {},
  },
);

export const useIntro = () => useContext(IntroContext);
