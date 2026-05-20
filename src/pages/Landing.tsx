import DotNav from "../components/DotNav";
import ContactLinks from "../components/ContactLinks";
import { useSlideManager } from "../hooks/useSlideManager";
import Slide1Home from "./slides/Slide1Home";
import Slide2Projects from "./slides/Slide2Projects";
import Slide3About from "./slides/Slide3About";

const SLIDE_COUNT = 3;

interface LandingProps {
  isVisible?: boolean;
}

export default function Landing({ isVisible = true }: LandingProps) {
  const { containerRef, currentIndex, goToSlide } = useSlideManager({
    slideCount: SLIDE_COUNT
  });

  return (
    <main
      aria-hidden={!isVisible}
      aria-label="Adi Kaul landing slides"
      className={`landing${isVisible ? "" : " landing--parked"}`}
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
