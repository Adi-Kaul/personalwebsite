import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";
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
      <section className="projects-showcase" aria-label="All projects">
        <div className="projects-showcase__list">
          <p className="projects-showcase__eyebrow">All projects</p>
          <h1>Selected work</h1>
          <div className="project-index">
            {projects.map((project, index) => (
              <Link
                aria-current={project.slug === activeProject?.slug ? "true" : undefined}
                className="project-index__item"
                key={project.slug}
                onFocus={() => setActiveSlug(project.slug)}
                onMouseEnter={() => setActiveSlug(project.slug)}
                to={`/projects/${project.slug}`}
              >
                <span>{String(index + 1).padStart(2, "0")}</span>
                <strong>{project.name}</strong>
              </Link>
            ))}
          </div>
        </div>

        {activeProject ? (
          <motion.aside
            animate={reducedMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
            className="project-preview"
            initial={reducedMotion ? { opacity: 1 } : { opacity: 0, y: 12 }}
            key={activeProject.slug}
            transition={{ duration: reducedMotion ? 0 : 0.28, ease: "easeOut" }}
          >
            <div className="project-preview__media" aria-label={`Preview images for ${activeProject.name}`}>
              <div className="project-preview__image project-preview__image--primary">
                <span>{activeProject.name}</span>
              </div>
              <div className="project-preview__stack">
                <div className="project-preview__image project-preview__image--secondary" />
                <div className="project-preview__image project-preview__image--tertiary" />
              </div>
            </div>
            <div className="project-preview__body">
              <p className="project-preview__meta">
                {activeProject.year} / {activeProject.language}
              </p>
              <h2>{activeProject.name}</h2>
              <p>{activeProject.description}</p>
              <div className="project-preview__topics">
                {activeProject.topics.map((topic) => (
                  <span className="topic-pill" key={topic}>
                    {topic}
                  </span>
                ))}
              </div>
              <div className="project-preview__actions">
                <Link className="text-button" to={`/projects/${activeProject.slug}`}>
                  Project notes
                </Link>
                <a
                  className="text-button"
                  href={activeProject.githubUrl}
                  rel="noreferrer"
                  target="_blank"
                >
                  GitHub
                </a>
                {activeProject.demoUrl ? (
                  <a
                    className="text-button"
                    href={activeProject.demoUrl}
                    rel="noreferrer"
                    target="_blank"
                  >
                    Live demo
                  </a>
                ) : null}
              </div>
            </div>
          </motion.aside>
        ) : null}
      </section>
    </motion.main>
  );
}
