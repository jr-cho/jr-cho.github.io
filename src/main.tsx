import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import "@fontsource-variable/geist";
import "@fontsource-variable/geist-mono";
import "react-activity-calendar/tooltips.css";
import { ThemeProvider } from "./providers/theme-provider.tsx";
import { BrowserRouter } from "react-router-dom";
import Dock from "./components/Dock.tsx";
import ScrollToTop from "./components/helpers/ScrollToTop.tsx";
import SmoothScroll from "./components/helpers/SmoothScroll.tsx";
import Footer from "./components/Footer.tsx";
import AnimatedRoutes from "./components/helpers/AnimatedRoutes.tsx";
import AmbientBackground from "./components/AmbientBackground.tsx";
import { IntroProvider } from "./providers/intro-provider.tsx";
import IntroSequence from "./components/intro/IntroSequence.tsx";
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
      <IntroProvider>
        <SmoothScroll>
          <BrowserRouter>
            <ScrollToTop />
            <IntroSequence />
            <div className="relative flex flex-col min-h-screen bg-background text-foreground">
              {/* Ambient instrument grid — fixed, behind all content */}
              <AmbientBackground />

              {/* Content layer */}
              <div className="relative z-10 flex flex-col flex-1 pt-16 sm:pt-20">
                <Dock />
                <div className="flex-1">
                  <AnimatedRoutes />
                </div>
                <Footer />
              </div>
            </div>
          </BrowserRouter>
        </SmoothScroll>
      </IntroProvider>
      </MotionConfig>
    </ThemeProvider>
  </StrictMode>,
);
