import { useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";
import { projects } from "../../data/projects";

export default function ProjectsPage() {
  const reducedMotion = useReducedMotion();

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
      <header className="page-header">
        <h1>adi-kaul</h1>
        <p>pinned repositories</p>
      </header>
      <section className="repo-grid" aria-label="Pinned repositories">
        {projects.map((project) => (
          <Link className="repo-card" key={project.slug} to={`/projects/${project.slug}`}>
            <div>
              <span className="repo-card__name">
                <span className="folder-icon" aria-hidden="true" />
                {project.name}
              </span>
              <p className="repo-card__description">{project.description}</p>
              <div className="repo-card__topics">
                {project.topics.map((topic) => (
                  <span className="topic-pill" key={topic}>
                    {topic}
                  </span>
                ))}
              </div>
            </div>
            <div className="repo-card__footer">
              <span>
                <span
                  className="language-dot"
                  style={{ backgroundColor: project.languageColor }}
                  aria-hidden="true"
                />
                {project.language}
              </span>
              <span>{project.stars} stars</span>
              <span>{project.forks} forks</span>
              <span>{project.year}</span>
            </div>
          </Link>
        ))}
      </section>
    </motion.main>
  );
}
