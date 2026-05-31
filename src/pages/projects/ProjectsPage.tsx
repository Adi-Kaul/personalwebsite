import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { projects } from "../../data/projects";
import LandingBackLink from "../../components/LandingBackLink";

export default function ProjectsPage() {
  const reducedMotion = useReducedMotion();
  const [activeSlug, setActiveSlug] = useState(projects[0]?.slug ?? "");
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const activeProject = projects.find((project) => project.slug === activeSlug) ?? projects[0] ?? null;
  const activeImages = activeProject?.images ?? [];
  const activeImage = activeImages[activeImageIndex] ?? activeImages[0];

  useEffect(() => {
    document.body.dataset.slide = "1";
  }, []);

  useEffect(() => {
    setActiveImageIndex(0);
    setIsFullscreen(false);
  }, [activeSlug]);

  function showPreviousImage() {
    setActiveImageIndex((index) => (index - 1 + activeImages.length) % activeImages.length);
  }

  function showNextImage() {
    setActiveImageIndex((index) => (index + 1) % activeImages.length);
  }

  useEffect(() => {
    if (!isFullscreen) return;

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setIsFullscreen(false);
      if (event.key === "ArrowLeft") showPreviousImage();
      if (event.key === "ArrowRight") showNextImage();
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isFullscreen, activeImages.length]);

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
              {activeImages.length > 0 && activeImage ? (
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
                    <button
                      type="button"
                      className="project-preview__carousel-fullscreen"
                      onClick={() => setIsFullscreen(true)}
                      aria-label={`View ${activeProject.name} screenshots fullscreen`}
                    >
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                        <path
                          d="M2 6V2h4M14 6V2h-4M2 10v4h4M14 10v4h-4"
                          stroke="currentColor"
                          strokeWidth="1.6"
                          strokeLinecap="square"
                        />
                      </svg>
                    </button>
                    <div className="project-preview__carousel-controls">
                      <button type="button" onClick={showPreviousImage} aria-label={`Previous ${activeProject.name} screenshot`}>
                        Prev
                      </button>
                      <span>
                        {activeImageIndex + 1}/{activeImages.length}
                      </span>
                      <button type="button" onClick={showNextImage} aria-label={`Next ${activeProject.name} screenshot`}>
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

      <AnimatePresence>
        {isFullscreen && activeImage ? (
          <motion.div
            className="project-lightbox"
            role="dialog"
            aria-modal="true"
            aria-label={`${activeProject?.name ?? "Project"} screenshots`}
            onClick={() => setIsFullscreen(false)}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            initial={reducedMotion ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: reducedMotion ? 0 : 0.2, ease: "easeOut" }}
          >
            <button
              type="button"
              className="project-lightbox__close"
              onClick={() => setIsFullscreen(false)}
              aria-label="Exit fullscreen"
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="square" />
              </svg>
            </button>

            <button
              type="button"
              className="project-lightbox__arrow project-lightbox__arrow--prev"
              onClick={(event) => {
                event.stopPropagation();
                showPreviousImage();
              }}
              aria-label="Previous screenshot"
            >
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M15 5l-7 7 7 7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="square" />
              </svg>
            </button>

            <figure className="project-lightbox__stage" onClick={(event) => event.stopPropagation()}>
              <img
                alt={`${activeProject?.name ?? "Project"} screenshot ${activeImageIndex + 1}`}
                className="project-lightbox__image"
                src={activeImage}
              />
              <figcaption className="project-lightbox__counter">
                {activeImageIndex + 1}/{activeImages.length}
              </figcaption>
            </figure>

            <button
              type="button"
              className="project-lightbox__arrow project-lightbox__arrow--next"
              onClick={(event) => {
                event.stopPropagation();
                showNextImage();
              }}
              aria-label="Next screenshot"
            >
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M9 5l7 7-7 7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="square" />
              </svg>
            </button>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </motion.main>
  );
}
