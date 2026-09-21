import { lazy, Suspense } from "react";
import { AnimatePresence } from "framer-motion";
import { Route, Routes, useLocation } from "react-router-dom";
import App from "@/App";

const Projects = lazy(() => import("@/pages/Projects"));
const ProjectDetail = lazy(() => import("@/pages/ProjectDetail"));
const Contact = lazy(() => import("@/pages/Contact"));
const NotFound = lazy(() => import("@/pages/NotFound"));

const RouteFallback = () => (
  <div className="mx-auto w-full max-w-[1440px] px-4 py-12 sm:px-8 lg:px-20">
    <div className="h-96" />
  </div>
);

export default function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Suspense fallback={<RouteFallback />}>
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<App />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/projects/:slug" element={<ProjectDetail />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </AnimatePresence>
  );
}
