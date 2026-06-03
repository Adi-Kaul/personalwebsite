import { useEffect, useMemo } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import { marked } from "marked";
import { motion, useReducedMotion } from "framer-motion";
import { projects } from "../../data/projects";

export default function ProjectDetail() {
  const { slug } = useParams();
  const reducedMotion = useReducedMotion();
  const project = projects.find((item) => item.slug === slug);
  const readmeHtml = useMemo(() => (project ? marked.parse(project.readme) : ""), [project]);

  useEffect(() => {
    document.body.dataset.slide = "1";
  }, []);

  if (!project) {
    return <Navigate to="/projects" replace />;
  }

  return (
    <motion.main
      animate={{ opacity: 1, y: 0 }}
      className="subpage subpage--project-detail"
      exit={reducedMotion ? { opacity: 1 } : { opacity: 0, y: 0 }}
      initial={reducedMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
      transition={{ duration: reducedMotion ? 0 : 0.24, ease: "easeOut" }}
    >
      <Link className="back-link" to="/projects">
        &lt;- Projects
      </Link>
      <div className="page-header">
        <p className="breadcrumb">adi-kaul / {project.name}</p>
        <h1>
          {project.name}
          {project.status ? <span className="page-header__status">({project.status})</span> : null}
        </h1>
      </div>
      <div className="project-detail-layout">
        <article>
          <div className="tab-row">
            <span>README</span>
          </div>
          <div
            className="readme-panel"
            dangerouslySetInnerHTML={{ __html: readmeHtml }}
          />
        </article>
        <aside className="project-sidebar" aria-label="Project details">
          <h2>About</h2>
          <p>{project.description}</p>
          <div className="project-sidebar__topics">
            {project.topics.map((topic) => (
              <span className="topic-pill" key={topic}>
                {topic}
              </span>
            ))}
          </div>
          <div className="button-row">
            {project.isPrivate ? (
              <span className="text-button text-button--private">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <rect x="5" y="11" width="14" height="9" stroke="currentColor" strokeWidth="1.8" />
                  <path d="M8 11V8a4 4 0 0 1 8 0v3" stroke="currentColor" strokeWidth="1.8" />
                </svg>
                Private Repo
              </span>
            ) : project.githubUrl ? (
              <a className="text-button" href={project.githubUrl} rel="noreferrer" target="_blank">
                GitHub
              </a>
            ) : null}
            {project.demoUrl ? (
              <a className="text-button" href={project.demoUrl} rel="noreferrer" target="_blank">
                Live demo
              </a>
            ) : null}
          </div>
          <div className="project-stats">
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
          </div>
        </aside>
      </div>
    </motion.main>
  );
}
