import { lazy, Suspense, useEffect, useRef, useState } from "react";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import { BrowserRouter } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import Landing from "./pages/Landing";

const ProjectsPage = lazy(() => import("./pages/projects/ProjectsPage"));
const AboutPage = lazy(() => import("./pages/AboutPage"));
const ExperiencePage = lazy(() => import("./pages/ExperiencePage"));
const RecentlyPage = lazy(() => import("./pages/RecentlyPage"));

function AnimatedRoutes() {
  const location = useLocation();
  const isLanding = location.pathname === "/";
  const previousPathRef = useRef(location.pathname);
  const bootHandledRef = useRef(false);
  const [landingReturnToken, setLandingReturnToken] = useState(0);
  const [isAppReady, setIsAppReady] = useState(() => location.pathname !== "/");
  const [isBootMounted, setIsBootMounted] = useState(() => location.pathname === "/");
  const [isBootExiting, setIsBootExiting] = useState(false);

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

  useEffect(() => {
    if (bootHandledRef.current || location.pathname !== "/") {
      setIsAppReady(true);
      setIsBootMounted(false);
      return undefined;
    }

    bootHandledRef.current = true;
    let backgroundReady = document.querySelector(".silk-gradient.is-ready") !== null;
    let minTimePassed = false;
    let finished = false;
    let removeTimer = 0;

    function finishBoot() {
      if (finished || !backgroundReady || !minTimePassed) {
        return;
      }

      finished = true;
      setIsAppReady(true);
      setIsBootExiting(true);
      removeTimer = window.setTimeout(() => {
        setIsBootMounted(false);
      }, 760);
    }

    function handleBackgroundReady() {
      backgroundReady = true;
      finishBoot();
    }

    const minTimer = window.setTimeout(() => {
      minTimePassed = true;
      finishBoot();
    }, 420);

    const maxTimer = window.setTimeout(() => {
      backgroundReady = true;
      minTimePassed = true;
      finishBoot();
    }, 1200);

    window.addEventListener("silk-gradient:ready", handleBackgroundReady);

    return () => {
      window.clearTimeout(minTimer);
      window.clearTimeout(maxTimer);
      window.clearTimeout(removeTimer);
      window.removeEventListener("silk-gradient:ready", handleBackgroundReady);
    };
  }, [location.pathname]);

  return (
    <>
      <div className={`app-shell${isAppReady ? " app-shell--ready" : ""}`}>
        <Landing isVisible={isLanding} returnToken={landingReturnToken} />
        <AnimatePresence mode="sync">
          {!isLanding ? (
            <Suspense fallback={null}>
              <Routes location={location} key={location.pathname}>
                <Route path="/projects" element={<ProjectsPage />} />
                <Route path="/about" element={<AboutPage />} />
                <Route path="/experience" element={<ExperiencePage />} />
                <Route path="/recently" element={<RecentlyPage />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </Suspense>
          ) : null}
        </AnimatePresence>
      </div>
      {isBootMounted ? (
        <div className={`boot-screen${isBootExiting ? " boot-screen--exiting" : ""}`} aria-hidden="true">
          <span>Adi Kaul</span>
        </div>
      ) : null}
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
