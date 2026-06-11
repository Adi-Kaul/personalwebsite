import { useEffect, useRef, useState } from "react";
import DotNav from "../components/DotNav";
import ContactLinks from "../components/ContactLinks";
import { useSlideManager } from "../hooks/useSlideManager";
import Slide1Home from "./slides/Slide1Home";
import Slide2Projects from "./slides/Slide2Projects";
import Slide3About from "./slides/Slide3About";

const SLIDE_COUNT = 3;

interface LandingProps {
  isVisible?: boolean;
  returnToken?: number;
}

export default function Landing({ isVisible = true, returnToken = 0 }: LandingProps) {
  const [isReturning, setIsReturning] = useState(false);
  const { containerRef, currentIndex, goToSlide } = useSlideManager({
    slideCount: SLIDE_COUNT
  });
  const currentIndexRef = useRef(currentIndex);
  currentIndexRef.current = currentIndex;

  useEffect(() => {
    function animateReturn() {
      setIsReturning(true);
      window.setTimeout(() => {
        setIsReturning(false);
      }, 620);
    }

    window.addEventListener("landing:returning", animateReturn);
    return () => window.removeEventListener("landing:returning", animateReturn);
  }, []);

  useEffect(() => {
    if (isVisible) {
      document.body.dataset.slide = String(currentIndexRef.current);
    }
  }, [isVisible]);

  useEffect(() => {
    if (!isVisible) {
      setIsReturning(false);
      return;
    }

    if (returnToken === 0 && sessionStorage.getItem("landingReturnAnimation") !== "true") {
      return;
    }

    sessionStorage.removeItem("landingReturnAnimation");
    setIsReturning(true);
    const timeout = window.setTimeout(() => {
      setIsReturning(false);
    }, 620);

    return () => window.clearTimeout(timeout);
  }, [isVisible, returnToken]);

  return (
    <main
      aria-hidden={!isVisible}
      aria-label="Adi Kaul landing slides"
      className={`landing${isVisible ? "" : " landing--parked"}${isReturning ? " landing--returning" : ""}`}
      ref={containerRef}
    >
      <DotNav currentIndex={currentIndex} goToSlide={goToSlide} slideCount={SLIDE_COUNT} />
      <ContactLinks />
      <div id="slides-track">
        <div className="slide-clone" aria-hidden="true">
          <Slide3About />
        </div>
        <Slide1Home />
        <Slide2Projects />
        <Slide3About />
        <div className="slide-clone" aria-hidden="true">
          <Slide1Home />
        </div>
      </div>
    </main>
  );
}
