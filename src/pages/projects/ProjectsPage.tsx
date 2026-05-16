import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { projects } from "../../data/projects";

export default function ProjectsPage() {
  const reducedMotion = useReducedMotion();
  const [activeSlug, setActiveSlug] = useState(projects[0]?.slug ?? "");
  const activeProject = projects.find((project) => project.slug === activeSlug) ?? projects[0] ?? null;

  useEffect(() => {
    document.body.dataset.slide = "1";
  }, []);

  return (
    <motion.main
      animate={{ opacity: 1, y: 0 }}
      className="subpage subpage--projects"
      exit={reducedMotion ? { opacity: 1 } : { opacity: 0, y: -12 }}
      initial={reducedMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
      transition={{ duration: reducedMotion ? 0 : 0.5, ease: "easeOut" }}
    >
      <Link className="back-link" to="/">
        &lt;- Adi Kaul
      </Link>
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
              <div className="project-preview__media" aria-label={`Preview images for ${activeProject.name}`}>
                <div className="project-preview__image project-preview__image--primary" />
                <div className="project-preview__stack">
                  <div className="project-preview__image project-preview__image--secondary" />
                  <div className="project-preview__image project-preview__image--tertiary" />
                </div>
              </div>
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
              </div>
            </motion.aside>
          ) : null}
        </AnimatePresence>
      </section>
    </motion.main>
  );
}
