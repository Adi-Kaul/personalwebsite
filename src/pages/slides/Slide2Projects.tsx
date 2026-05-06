import { useNavigate } from "react-router-dom";
import { projects } from "../../data/projects";

export default function Slide2Projects() {
  const navigate = useNavigate();
  const featuredProjects = projects.slice(0, 3);

  function openProjects() {
    sessionStorage.setItem("lastSlide", "1");
    navigate("/projects");
  }

  return (
    <section className="slide slide--two" aria-label="Projects">
      <div className="slide__inner">
        <div className="slide__content">
          <button className="slide__cta" type="button" onClick={openProjects}>
            <h1 className="hero-title">
              <span className="hero-title__line hero-title__line--strong">The work.</span>
            </h1>
          </button>
          <div className="project-teasers" aria-label="Featured projects">
            {featuredProjects.map((project) => (
              <button
                className="teaser-card"
                key={project.slug}
                type="button"
                onClick={openProjects}
              >
                <span className="teaser-card__title">{project.name}</span>
                <span className="teaser-card__desc">{project.description}</span>
                <span className="tag-pill">{project.language}</span>
              </button>
            ))}
          </div>
          <button className="slide__cta" type="button" onClick={openProjects}>
            See all projects -&gt;
          </button>
        </div>
      </div>
    </section>
  );
}
