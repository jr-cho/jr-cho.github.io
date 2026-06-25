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
            {/* Ambient Apple mesh blob layer — fixed, behind all content */}
            <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden" aria-hidden="true">
              {/* Blob 1 — top-right — soft lavender/indigo — 25s cycle */}
              <motion.div
                className="absolute -top-60 -right-60 h-[800px] w-[800px] rounded-full"
                style={{
                  background: "radial-gradient(circle, var(--blob-1) 0%, transparent 65%)",
                }}
                animate={{ scale: [1, 1.08, 1], x: [0, 30, 0], y: [0, -20, 0] }}
                transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
              />
              {/* Blob 2 — center-left — pale blue/navy — 20s cycle, 7s offset */}
              <motion.div
                className="absolute top-1/3 -left-60 h-[700px] w-[700px] rounded-full"
                style={{
                  background: "radial-gradient(circle, var(--blob-2) 0%, transparent 65%)",
                }}
                animate={{ scale: [1, 1.06, 1], x: [0, -25, 0], y: [0, 35, 0] }}
                transition={{ duration: 20, repeat: Infinity, ease: "easeInOut", delay: 7 }}
              />
              {/* Blob 3 — bottom-center — teal/purple — 28s cycle, 14s offset */}
              <motion.div
                className="absolute -bottom-40 left-1/3 h-[600px] w-[600px] rounded-full"
                style={{
                  background: "radial-gradient(circle, var(--blob-3) 0%, transparent 65%)",
                }}
                animate={{ scale: [1, 1.10, 1], x: [0, 20, 0], y: [0, 20, 0] }}
                transition={{ duration: 28, repeat: Infinity, ease: "easeInOut", delay: 14 }}
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
