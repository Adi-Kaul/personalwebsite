import DotNav from "../components/DotNav";
import ContactLinks from "../components/ContactLinks";
import { useSlideManager } from "../hooks/useSlideManager";
import Slide1Home from "./slides/Slide1Home";
import Slide2Projects from "./slides/Slide2Projects";
import Slide3About from "./slides/Slide3About";
import Slide4Experience from "./slides/Slide4Experience";
import Slide5Recently from "./slides/Slide5Recently";

const SLIDE_COUNT = 5;

export default function Landing() {
  const { containerRef, currentIndex, goToSlide } = useSlideManager({
    slideCount: SLIDE_COUNT
  });

  return (
    <main className="landing" ref={containerRef} aria-label="Adi Kaul landing slides">
      <DotNav currentIndex={currentIndex} goToSlide={goToSlide} slideCount={SLIDE_COUNT} />
      <ContactLinks />
      <div id="slides-track">
        <div className="slide-clone" aria-hidden="true">
          <Slide5Recently />
        </div>
        <Slide1Home />
        <Slide2Projects />
        <Slide3About />
        <Slide4Experience />
        <Slide5Recently />
        <div className="slide-clone" aria-hidden="true">
          <Slide1Home />
        </div>
      </div>
    </main>
  );
}
