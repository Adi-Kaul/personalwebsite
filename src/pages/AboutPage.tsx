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
      <header className="about-hero">
        <motion.div
          className="about-hero__copy"
          {...(reducedMotion
            ? {}
            : {
                initial: { opacity: 0, y: 24 },
                animate: { opacity: 1, y: 0 },
                transition: { duration: 0.5, ease: "easeOut" }
              })}
        >
          <p className="about-hero__eyebrow">About</p>
          <h1>I'm Adi.</h1>
          <p className="about-hero__intro">
            I am a Computer Science major at the University of Michigan who likes building
            thoughtful, useful software: the kind where the interface, the system, and the idea all
            feel like they belong together.
          </p>
        </motion.div>
        <motion.figure
          className="about-portrait"
          {...(reducedMotion
            ? {}
            : {
                initial: { opacity: 0, x: 32 },
                animate: { opacity: 1, x: 0 },
                transition: { duration: 0.62, delay: 0.08, ease: "easeOut" }
              })}
        >
          <div className="about-portrait__image" role="img" aria-label="Portrait placeholder for Adi Kaul">
            <span>AK</span>
          </div>
          <figcaption>Developer / Builder / Student</figcaption>
        </motion.figure>
      </header>

      <motion.section className="content-section about-section" {...(reducedMotion ? {} : reveal)}>
        <h2>What I like building</h2>
        <p className="body-copy">
          I am drawn to development that turns messy ideas into clean, working products. I like
          frontend engineering because every detail matters: the structure of the code, the rhythm
          of an interaction, and the small visual decisions that make something feel intuitive.
        </p>
        <p className="body-copy">
          I am especially interested in interactive web apps, developer tools, product engineering,
          and systems that make everyday work feel lighter. The sweet spot for me is where design
          taste and technical execution meet.
        </p>
      </motion.section>

      <motion.section className="content-section about-section" {...(reducedMotion ? {} : reveal)}>
        <h2>Strengths</h2>
        <div className="about-pillars">
          <article>
            <span>01</span>
            <h3>Product sense</h3>
            <p>I care about why something should exist before deciding how it should work.</p>
          </article>
          <article>
            <span>02</span>
            <h3>Fast learning</h3>
            <p>I like unfamiliar problems and can get from rough context to a working path quickly.</p>
          </article>
          <article>
            <span>03</span>
            <h3>Polish</h3>
            <p>I pay attention to the last 10 percent: spacing, motion, naming, and the feel of use.</p>
          </article>
        </div>
      </motion.section>

      <motion.section className="content-section about-section" {...(reducedMotion ? {} : reveal)}>
        <h2>Interests</h2>
        <div className="interest-list">
          <p>Human-centered software</p>
          <p>Creative coding and motion</p>
          <p>AI-assisted workflows</p>
          <p>Clean systems and thoughtful interfaces</p>
        </div>
      </motion.section>
    </motion.main>
  );
}
