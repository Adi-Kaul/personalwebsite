import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { projects } from "../../data/projects";
import LandingBackLink from "../../components/LandingBackLink";

export default function ProjectsPage() {
  const reducedMotion = useReducedMotion();
  const [activeSlug, setActiveSlug] = useState(projects[0]?.slug ?? "");
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const activeProject = projects.find((project) => project.slug === activeSlug) ?? projects[0] ?? null;
  const activeImages = activeProject?.images ?? [];
  const activeImage = activeImages[activeImageIndex] ?? activeImages[0];

  useEffect(() => {
    document.body.dataset.slide = "1";
  }, []);

  useEffect(() => {
    setActiveImageIndex(0);
  }, [activeSlug]);

  function showPreviousImage() {
    setActiveImageIndex((index) => (index - 1 + activeImages.length) % activeImages.length);
  }

  function showNextImage() {
    setActiveImageIndex((index) => (index + 1) % activeImages.length);
  }

  return (
    <motion.main
      animate={{ opacity: 1, y: 0 }}
      className="subpage subpage--projects"
      exit={reducedMotion ? { opacity: 1 } : { opacity: 0, y: 0 }}
      initial={reducedMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
      transition={{ duration: reducedMotion ? 0 : 0.24, ease: "easeOut" }}
    >
      <LandingBackLink slideIndex={1} />
      <section className="projects-showcase" aria-label="My projects">
        <div className="projects-showcase__list">
          <h1>My Projects</h1>
          <div className="project-index">
            {projects.map((project) => (
              <Link
                aria-current={project.slug === activeProject?.slug ? "true" : undefined}
                className="project-index__item"
                key={project.slug}
                onFocus={() => setActiveSlug(project.slug)}
                onMouseEnter={() => setActiveSlug(project.slug)}
                to={`/projects/${project.slug}`}
              >
                <span aria-hidden="true" />
                <strong>{project.name}</strong>
              </Link>
            ))}
          </div>
        </div>

        <AnimatePresence mode="wait">
          {activeProject ? (
            <motion.aside
              animate={{ opacity: 1 }}
              className="project-preview"
              exit={reducedMotion ? { opacity: 1 } : { opacity: 0 }}
              initial={reducedMotion ? { opacity: 1 } : { opacity: 0 }}
              key={activeProject.slug}
              transition={{ duration: reducedMotion ? 0 : 0.18, ease: "easeOut" }}
            >
              {activeProject.slug === "scopeplus" && activeImage ? (
                <div
                  className="project-preview__media project-preview__media--carousel"
                  aria-label={`Preview images for ${activeProject.name}`}
                >
                  <div className="project-preview__image project-preview__image--carousel">
                    <img
                      alt={`${activeProject.name} screenshot ${activeImageIndex + 1}`}
                      className="project-preview__photo"
                      height="900"
                      loading="lazy"
                      src={activeImage}
                      width="1600"
                    />
                    <div className="project-preview__carousel-controls">
                      <button type="button" onClick={showPreviousImage} aria-label="Previous ScopePlus screenshot">
                        Prev
                      </button>
                      <span>
                        {activeImageIndex + 1}/{activeImages.length}
                      </span>
                      <button type="button" onClick={showNextImage} aria-label="Next ScopePlus screenshot">
                        Next
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="project-preview__media" aria-label={`Preview images for ${activeProject.name}`}>
                  <div className="project-preview__image project-preview__image--primary" />
                  <div className="project-preview__stack">
                    <div className="project-preview__image project-preview__image--secondary" />
                    <div className="project-preview__image project-preview__image--tertiary" />
                  </div>
                </div>
              )}
              <div className="project-preview__body">
                <p className="project-preview__meta">
                  {activeProject.year} / {activeProject.language}
                </p>
                <div className="project-preview__heading">
                  <h2>{activeProject.name}</h2>
                  <a
                    className="project-preview__github"
                    href={activeProject.githubUrl}
                    rel="noreferrer"
                    target="_blank"
                  >
                    GitHub
                  </a>
                </div>
                <p>{activeProject.description}</p>
                <div className="project-preview__topics" aria-label={`${activeProject.name} tech stack`}>
                  {activeProject.topics.map((topic) => (
                    <span className="tag-pill" key={topic}>
                      {topic}
                    </span>
                  ))}
                </div>
              </div>
            </motion.aside>
          ) : null}
        </AnimatePresence>
      </section>
    </motion.main>
  );
}
