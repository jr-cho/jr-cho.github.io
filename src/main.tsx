import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import "react-activity-calendar/tooltips.css";
import { ThemeProvider } from "./providers/theme-provider.tsx";
import { BrowserRouter } from "react-router-dom";
import Navbar from "./components/Navbar.tsx";
import ScrollToTop from "./components/helpers/ScrollToTop.tsx";
import SmoothScroll from "./components/helpers/SmoothScroll.tsx";
import Footer from "./components/Footer.tsx";
import AnimatedRoutes from "./components/helpers/AnimatedRoutes.tsx";
import { motion } from "framer-motion";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <SmoothScroll>
        <BrowserRouter>
          <ScrollToTop />
          <div className="relative flex flex-col min-h-screen bg-background text-foreground">
            {/* Ambient blob layer — fixed, behind all content */}
            <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden" aria-hidden="true">
              <motion.div
                className="absolute -top-40 -right-40 h-[650px] w-[650px] rounded-full"
                style={{
                  background:
                    "radial-gradient(circle, rgba(249,115,22,0.14) 0%, transparent 70%)",
                }}
                animate={{ scale: [1, 1.06, 1] }}
                transition={{
                  duration: 12,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
              <motion.div
                className="absolute -bottom-32 -left-32 h-[450px] w-[450px] rounded-full"
                style={{
                  background:
                    "radial-gradient(circle, rgba(194,65,12,0.14) 0%, transparent 70%)",
                }}
                animate={{ scale: [1, 1.06, 1] }}
                transition={{
                  duration: 12,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 4,
                }}
              />
            </div>

            {/* Content layer */}
            <div className="relative z-10 flex flex-col flex-1">
              <Navbar />
              <div className="flex-1">
                <AnimatedRoutes />
              </div>
              <Footer />
            </div>
          </div>
        </BrowserRouter>
      </SmoothScroll>
    </ThemeProvider>
  </StrictMode>,
);
