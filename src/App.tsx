import { lazy, Suspense, useEffect, useRef, useState } from "react";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import { BrowserRouter } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import Landing from "./pages/Landing";

const ProjectsPage = lazy(() => import("./pages/projects/ProjectsPage"));
const ProjectDetail = lazy(() => import("./pages/projects/ProjectDetail"));
const AboutPage = lazy(() => import("./pages/AboutPage"));
const ExperiencePage = lazy(() => import("./pages/ExperiencePage"));
const RecentlyPage = lazy(() => import("./pages/RecentlyPage"));

function AnimatedRoutes() {
  const location = useLocation();
  const isLanding = location.pathname === "/";
  const previousPathRef = useRef(location.pathname);
  const [landingReturnToken, setLandingReturnToken] = useState(0);

  useEffect(() => {
    if (!isLanding) {
      window.scrollTo({ top: 0, left: 0 });
    }
  }, [isLanding, location.pathname]);

  useEffect(() => {
    const previousPath = previousPathRef.current;
    previousPathRef.current = location.pathname;

    if (previousPath !== "/" && location.pathname === "/") {
      setLandingReturnToken((token) => token + 1);
      document.body.dataset.landingReturning = "true";
      window.setTimeout(() => {
        delete document.body.dataset.landingReturning;
      }, 620);
    }
  }, [location.pathname]);

  return (
    <>
      <Landing isVisible={isLanding} returnToken={landingReturnToken} />
      <AnimatePresence mode="sync">
        {!isLanding ? (
          <Suspense fallback={null}>
            <Routes location={location} key={location.pathname}>
              <Route path="/projects" element={<ProjectsPage />} />
              <Route path="/projects/:slug" element={<ProjectDetail />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/experience" element={<ExperiencePage />} />
              <Route path="/recently" element={<RecentlyPage />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Suspense>
        ) : null}
      </AnimatePresence>
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AnimatedRoutes />
    </BrowserRouter>
  );
}
