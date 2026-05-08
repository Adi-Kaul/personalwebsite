import { useNavigate } from "react-router-dom";
import { projects } from "../../data/projects";

const featuredProjectDetails: Record<string, { summary: string; builtWith: string[] }> = {
  personalwebsite: {
    summary:
      "A single-page portfolio system with horizontal slide navigation, animated routing, and an editorial visual language built to grow with new work.",
    builtWith: ["React", "TypeScript", "GSAP"]
  },
  "studio-board": {
    summary:
      "A planning surface for creative and technical projects, focused on turning scattered ideas into clear next actions and lightweight shipping momentum.",
    builtWith: ["TypeScript", "UI systems", "Product design"]
  },
  "signal-notes": {
    summary:
      "An experiment in transforming loose notes into useful weekly signals, blending writing, automation, and small workflow design.",
    builtWith: ["JavaScript", "Automation", "Notes"]
  }
};

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
        <div className="slide__content slide__content--projects">
          <div className="project-slide__intro">
            <button className="project-slide__title-button" type="button" onClick={openProjects}>
              <h1 className="hero-title hero-title--home">
                <span className="hero-title__line hero-title__line--strong">Projects</span>
              </h1>
            </button>
            <button className="project-slide__all-link" type="button" onClick={openProjects}>
              See all projects -&gt;
            </button>
          </div>
          <aside className="project-slide__featured">
            <p className="project-slide__featured-label">Featured projects</p>
            <div className="project-teasers project-teasers--featured" aria-label="Featured projects">
              {featuredProjects.map((project) => {
                const details = featuredProjectDetails[project.slug] ?? {
                  builtWith: [project.language, ...project.topics.slice(0, 2)],
                  summary: project.description
                };

                return (
                  <button
                    className="teaser-card teaser-card--featured"
                    key={project.slug}
                    type="button"
                    onClick={() => {
                      sessionStorage.setItem("lastSlide", "1");
                      navigate(`/projects/${project.slug}`);
                    }}
                  >
                    <span className="teaser-card__title">{project.name}</span>
                    <span className="teaser-card__desc">{details.summary}</span>
                    <span className="teaser-card__tags">
                      {details.builtWith.map((tag) => (
                        <span className="tag-pill" key={tag}>
                          {tag}
                        </span>
                      ))}
                    </span>
                  </button>
                );
              })}
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}
