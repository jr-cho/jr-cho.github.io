import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import "@fontsource-variable/geist";
import "@fontsource-variable/geist-mono";
import "@fontsource/instrument-serif/400.css";
import "react-activity-calendar/tooltips.css";
import { ThemeProvider } from "./providers/theme-provider.tsx";
import { BrowserRouter } from "react-router-dom";
import Dock from "./components/Dock.tsx";
import ScrollToTop from "./components/helpers/ScrollToTop.tsx";
import SmoothScroll from "./components/helpers/SmoothScroll.tsx";
import Footer from "./components/Footer.tsx";
import AnimatedRoutes from "./components/helpers/AnimatedRoutes.tsx";
import { MotionConfig } from "framer-motion";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <MotionConfig reducedMotion="user">
        <SmoothScroll>
          <BrowserRouter>
            <ScrollToTop />
            <div className="relative flex flex-col min-h-screen bg-background text-foreground">
              {/* Content layer */}
              <div className="relative z-10 flex flex-col flex-1 pt-20 sm:pt-24">
                <Dock />
                {/* Page sits above the footer, then lifts off to reveal it */}
                <div className="relative z-10 flex-1 bg-background pb-24 shadow-[0_24px_48px_-24px_rgba(0,0,0,0.25)]">
                  <AnimatedRoutes />
                </div>
                <Footer />
              </div>
            </div>
          </BrowserRouter>
        </SmoothScroll>
      </MotionConfig>
    </ThemeProvider>
  </StrictMode>,
);
