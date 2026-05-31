import { lazy, Suspense } from "react";
import { useNavigate } from "react-router-dom";
import SilkRingsInteractive from "../../components/SilkRingsInteractive";

const ProjectCube = lazy(() => import("../../components/ProjectCube"));

export default function Slide2Projects() {
  const navigate = useNavigate();

  function openProjects() {
    sessionStorage.setItem("lastSlide", "1");
    navigate("/projects");
  }

  return (
    <section className="slide slide--two" aria-label="Projects">
      <SilkRingsInteractive className="silk-rings-gradient" />
      <div className="slide__inner">
        <div className="slide__content slide__content--projects">
          <aside className="project-slide__cube" aria-label="Interactive project cube">
            <Suspense fallback={null}>
              <ProjectCube className="project-cube" />
            </Suspense>
          </aside>
          <div className="project-slide__intro">
            <button className="project-slide__title-button" type="button" onClick={openProjects}>
              <h1 className="hero-title hero-title--home">
                <span className="hero-title__line hero-title__line--strong">Projects</span>
              </h1>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
