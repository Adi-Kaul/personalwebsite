import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

const reveal = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true }
};

const heroPhotos = [
  { className: "about-photo-card--primary", label: "Adi portrait photo" },
  { className: "about-photo-card--secondary", label: "Adi working photo" },
  { className: "about-photo-card--tertiary", label: "Adi campus photo" },
  { className: "about-photo-card--small", label: "Adi project photo" }
];

const strengths = [
  "Product-minded engineering",
  "Fast learning",
  "Clean visual taste",
  "Frontend polish",
  "Systems thinking",
  "Clear communication"
];

const interests = [
  {
    title: "Interactive web apps",
    description: "Interfaces that feel quick, intentional, and genuinely useful.",
    imageClass: "interest-preview--web"
  },
  {
    title: "Creative coding and motion",
    description: "Motion, layout, and small interactions that give software personality.",
    imageClass: "interest-preview--motion"
  },
  {
    title: "AI-assisted workflows",
    description: "Tools that turn scattered thoughts into practical next steps.",
    imageClass: "interest-preview--ai"
  },
  {
    title: "Clean systems and thoughtful interfaces",
    description: "Readable code, calm structure, and products that make sense quickly.",
    imageClass: "interest-preview--systems"
  },
  {
    title: "Developer tools",
    description: "Small utilities that remove friction and help people move faster.",
    imageClass: "interest-preview--tools"
  },
  {
    title: "Product design",
    description: "Turning rough ideas into clear flows, strong defaults, and polished details.",
    imageClass: "interest-preview--product"
  },
  {
    title: "Startups and building from zero",
    description: "Early product decisions, fast iteration, and making useful things real.",
    imageClass: "interest-preview--startups"
  }
];

export default function AboutPage() {
  const reducedMotion = useReducedMotion();
  const [activeInterest, setActiveInterest] = useState(0);
  const selectedInterest = interests[activeInterest];

  useEffect(() => {
    document.body.dataset.slide = "0";
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
        <motion.div
          aria-label="Photo collage for Adi Kaul"
          className="about-photo-collage"
          {...(reducedMotion
            ? {}
            : {
                initial: { opacity: 0, x: 32 },
                animate: { opacity: 1, x: 0 },
                transition: { duration: 0.62, delay: 0.08, ease: "easeOut" }
              })}
        >
          {heroPhotos.map((photo) => (
            <div
              aria-label={photo.label}
              className={`about-photo-card ${photo.className}`}
              key={photo.className}
              role="img"
            />
          ))}
        </motion.div>
      </header>

      <motion.section className="content-section about-split" {...(reducedMotion ? {} : reveal)}>
        <article className="about-split__panel">
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
        </article>
        <article className="about-split__panel">
          <h2>Strengths</h2>
          <ul className="about-strength-list">
            {strengths.map((strength) => (
              <li key={strength}>{strength}</li>
            ))}
          </ul>
        </article>
      </motion.section>

      <motion.section className="content-section about-section about-interests" {...(reducedMotion ? {} : reveal)}>
        <div className="about-interest-layout">
          <div>
            <h2>Interests</h2>
            <ul className="interest-list" aria-label="Interest image selector">
              {interests.map((interest, index) => (
                <li key={interest.title}>
                  <button
                    aria-pressed={activeInterest === index}
                    className="interest-button"
                    type="button"
                    onClick={() => setActiveInterest(index)}
                  >
                    <span className="interest-button__dot" aria-hidden="true" />
                    <span>{interest.title}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
          <AnimatePresence mode="wait">
            <motion.figure
              animate={{ opacity: 1, y: 0 }}
              className={`interest-preview ${selectedInterest.imageClass}`}
              exit={reducedMotion ? { opacity: 1 } : { opacity: 0, y: -12 }}
              initial={reducedMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
              key={selectedInterest.title}
              transition={{ duration: reducedMotion ? 0 : 0.28, ease: "easeOut" }}
            >
              <div
                aria-label={`${selectedInterest.title} visual`}
                className="interest-preview__image"
                role="img"
              />
              <figcaption>
                <strong>{selectedInterest.title}</strong>
                <span>{selectedInterest.description}</span>
              </figcaption>
            </motion.figure>
          </AnimatePresence>
        </div>
      </motion.section>
    </motion.main>
  );
}
