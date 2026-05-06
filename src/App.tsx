import { lazy, Suspense, useEffect, useState } from "react";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import { BrowserRouter } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import Wordmark from "./components/Wordmark";

const initialPathname = window.location.pathname;

const Landing = lazy(() => import("./pages/Landing"));
const ProjectsPage = lazy(() => import("./pages/projects/ProjectsPage"));
const ProjectDetail = lazy(() => import("./pages/projects/ProjectDetail"));
const AboutPage = lazy(() => import("./pages/AboutPage"));
const ExperiencePage = lazy(() => import("./pages/ExperiencePage"));
const RecentlyPage = lazy(() => import("./pages/RecentlyPage"));

function AnimatedRoutes() {
  const location = useLocation();
  const [hasPlayedLandingIntro, setHasPlayedLandingIntro] = useState(false);
  const shouldPlayLandingIntro = initialPathname === "/" && !hasPlayedLandingIntro;

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0 });
  }, [location.pathname]);

  return (
    <>
      {location.pathname === "/" ? <Wordmark /> : null}
      <AnimatePresence mode="wait">
        <Suspense fallback={<div className="route-loading">Loading</div>}>
          <Routes location={location} key={location.pathname}>
            <Route
              path="/"
              element={
                <Landing
                  playIntro={shouldPlayLandingIntro}
                  onIntroComplete={() => setHasPlayedLandingIntro(true)}
                />
              }
            />
            <Route path="/projects" element={<ProjectsPage />} />
            <Route path="/projects/:slug" element={<ProjectDetail />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/experience" element={<ExperiencePage />} />
            <Route path="/recently" element={<RecentlyPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
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
