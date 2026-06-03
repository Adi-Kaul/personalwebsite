import { CSSProperties, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { projects } from "../../data/projects";
import LandingBackLink from "../../components/LandingBackLink";

export default function ProjectsPage() {
  const reducedMotion = useReducedMotion();
  const [activeSlug, setActiveSlug] = useState(projects[0]?.slug ?? "");
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [phonesPerView, setPhonesPerView] = useState(3);
  const [phonePage, setPhonePage] = useState(0);
  const activeProject = projects.find((project) => project.slug === activeSlug) ?? projects[0] ?? null;
  const activeImages = activeProject?.images ?? [];
  const activeImage = activeImages[activeImageIndex] ?? activeImages[0];
  const isPhoneCarousel = activeProject?.media === "phone" && activeImages.length > 0;
  const phonePageCount = Math.max(1, Math.ceil(activeImages.length / phonesPerView));
  const visiblePhoneStart = phonePage * phonesPerView;
  const visiblePhones = activeImages.slice(visiblePhoneStart, visiblePhoneStart + phonesPerView);

  useEffect(() => {
    document.body.dataset.slide = "1";
  }, []);

  useEffect(() => {
    setActiveImageIndex(0);
    setIsFullscreen(false);
    setPhonePage(0);
  }, [activeSlug]);

  // How many phones fit side-by-side: 3 on desktop, 2 on tablets, 1 on phones.
  useEffect(() => {
    function computePerView() {
      const width = window.innerWidth;
      if (width < 540) return 1;
      if (width < 960) return 2;
      return 3;
    }

    function handleResize() {
      setPhonesPerView(computePerView());
    }

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Keep the current page valid when the visible count changes.
  useEffect(() => {
    setPhonePage((page) => Math.min(page, phonePageCount - 1));
  }, [phonePageCount]);

  function showPreviousImage() {
    setActiveImageIndex((index) => (index - 1 + activeImages.length) % activeImages.length);
  }

  function showNextImage() {
    setActiveImageIndex((index) => (index + 1) % activeImages.length);
  }

  function showPreviousPhones() {
    setPhonePage((page) => (page - 1 + phonePageCount) % phonePageCount);
  }

  function showNextPhones() {
    setPhonePage((page) => (page + 1) % phonePageCount);
  }

  function openPhoneFullscreen(imageIndex: number) {
    setActiveImageIndex(imageIndex);
    setIsFullscreen(true);
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
              {isPhoneCarousel ? (
                <div
                  className="project-preview__media project-preview__media--phones"
                  aria-label={`Preview screens for ${activeProject.name}`}
                  aria-roledescription="carousel"
                  style={{ ["--phones-per-view" as string]: phonesPerView } as CSSProperties}
                >
                  <button
                    type="button"
                    className="phone-carousel__arrow phone-carousel__arrow--prev"
                    onClick={showPreviousPhones}
                    aria-label={`Previous ${activeProject.name} screens`}
                  >
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                      <path d="M15 5l-7 7 7 7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="square" />
                    </svg>
                  </button>

                  <div className="phone-carousel__viewport">
                    <AnimatePresence mode="wait">
                      <motion.div
                        className="phone-carousel__page"
                        key={phonePage}
                        animate={{ opacity: 1, x: 0 }}
                        exit={reducedMotion ? { opacity: 1 } : { opacity: 0 }}
                        initial={reducedMotion ? { opacity: 1 } : { opacity: 0, x: 12 }}
                        transition={{ duration: reducedMotion ? 0 : 0.22, ease: "easeOut" }}
                      >
                        {visiblePhones.map((src, index) => {
                          const imageIndex = visiblePhoneStart + index;
                          return (
                            <button
                              type="button"
                              className="phone-frame"
                              key={src}
                              onClick={() => openPhoneFullscreen(imageIndex)}
                              aria-label={`View ${activeProject.name} screen ${imageIndex + 1} fullscreen`}
                            >
                              <span className="phone-frame__island" aria-hidden="true" />
                              <img
                                alt={`${activeProject.name} screen ${imageIndex + 1}`}
                                className="phone-frame__screen"
                                height="2556"
                                loading="lazy"
                                src={src}
                                width="1179"
                              />
                            </button>
                          );
                        })}
                      </motion.div>
                    </AnimatePresence>
                  </div>

                  <button
                    type="button"
                    className="phone-carousel__arrow phone-carousel__arrow--next"
                    onClick={showNextPhones}
                    aria-label={`Next ${activeProject.name} screens`}
                  >
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                      <path d="M9 5l7 7-7 7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="square" />
                    </svg>
                  </button>

                  <span className="phone-carousel__counter" aria-hidden="true">
                    {phonePage + 1}/{phonePageCount}
                  </span>
                </div>
              ) : activeImages.length > 0 && activeImage ? (
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
                <p className="project-preview__meta">{activeProject.tagline}</p>
                <div className="project-preview__heading">
                  <h2>
                    {activeProject.name}
                    {activeProject.status ? (
                      <span className="project-preview__status">({activeProject.status})</span>
                    ) : null}
                  </h2>
                  {activeProject.isPrivate ? (
                    <span className="project-preview__github project-preview__github--private">
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                        <rect x="5" y="11" width="14" height="9" stroke="currentColor" strokeWidth="1.8" />
                        <path d="M8 11V8a4 4 0 0 1 8 0v3" stroke="currentColor" strokeWidth="1.8" />
                      </svg>
                      Private Repo
                    </span>
                  ) : activeProject.githubUrl ? (
                    <a
                      className="project-preview__github"
                      href={activeProject.githubUrl}
                      rel="noreferrer"
                      target="_blank"
                    >
                      GitHub
                    </a>
                  ) : null}
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
