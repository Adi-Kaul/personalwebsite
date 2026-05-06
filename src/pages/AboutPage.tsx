import { useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";

const reveal = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true }
};

export default function AboutPage() {
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    document.body.dataset.slide = "2";
  }, []);

  return (
    <motion.main
      animate={{ opacity: 1, y: 0 }}
      className="subpage subpage--about"
      exit={reducedMotion ? { opacity: 1 } : { opacity: 0, y: -12 }}
      initial={reducedMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
      transition={{ duration: reducedMotion ? 0 : 0.5, ease: "easeOut" }}
    >
      <Link className="back-link" to="/">
        &lt;- Adi Kaul
      </Link>
      <header className="page-header">
        <h1>I'm Adi.</h1>
        <p>TODO: replace this intro with Adi's real story, voice, and details.</p>
      </header>

      <motion.section className="content-section" {...(reducedMotion ? {} : reveal)}>
        <p className="body-copy">
          TODO: replace. I am a designer and developer interested in the small decisions that
          make digital products feel clear, useful, and alive.
        </p>
        <p className="body-copy">
          TODO: replace. I like building at the edge between visual thinking and practical code:
          the place where an idea stops being abstract and starts becoming something people can
          use.
        </p>
        <p className="body-copy">
          TODO: replace. This site is a living archive of projects, experiments, and notes.
        </p>
      </motion.section>

      <motion.section className="content-section" {...(reducedMotion ? {} : reveal)}>
        <h2>How I think about design</h2>
        <p className="body-copy">
          TODO: replace. Good design should lower the cost of understanding. The best interfaces
          feel composed, direct, and generous with attention.
        </p>
      </motion.section>

      <motion.section className="content-section" {...(reducedMotion ? {} : reveal)}>
        <h2>Moments</h2>
        <div className="personal-timeline">
          <div className="personal-timeline__item">
            <p>TODO: replace. Started turning ideas into working web experiments.</p>
          </div>
          <div className="personal-timeline__item">
            <p>TODO: replace. Built a habit of documenting process, not just outcomes.</p>
          </div>
          <div className="personal-timeline__item">
            <p>TODO: replace. Began shaping a personal system for projects and notes.</p>
          </div>
        </div>
      </motion.section>
    </motion.main>
  );
}
