import { useEffect } from "react";
import { motion, useReducedMotion } from "framer-motion";
import LandingBackLink from "../components/LandingBackLink";
import { experience } from "../data/experience";

export default function ExperiencePage() {
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    document.body.dataset.slide = "2";
  }, []);

  return (
    <motion.main
      animate={{ opacity: 1, y: 0 }}
      className="subpage subpage--experience"
      exit={reducedMotion ? { opacity: 1 } : { opacity: 0, y: 0 }}
      initial={reducedMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
      transition={{ duration: reducedMotion ? 0 : 0.24, ease: "easeOut" }}
    >
      <LandingBackLink slideIndex={2} />
      <header className="page-header">
        <h1>The path.</h1>
        <p>Roles, projects, and learning moments.</p>
      </header>
      <section className="timeline" aria-label="Experience timeline">
        {experience.map((role) => (
          <motion.article
            className="timeline-entry"
            initial={reducedMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            key={`${role.company}-${role.period}`}
            transition={{ duration: reducedMotion ? 0 : 0.45, ease: "easeOut" }}
            viewport={{ once: true }}
            whileInView={{ opacity: 1, y: 0 }}
          >
            <div className="timeline-entry__meta">
              <span>{role.period}</span>
              <span>{role.type}</span>
            </div>
            <h2>
              {role.company} · {role.title}
            </h2>
            <p className="body-copy">{role.description}</p>
            <ul>
              {role.highlights.map((highlight) => (
                <li key={highlight}>{highlight}</li>
              ))}
            </ul>
          </motion.article>
        ))}
      </section>
    </motion.main>
  );
}
