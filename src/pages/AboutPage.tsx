import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import LandingBackLink from "../components/LandingBackLink";

const reveal = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true }
};

const heroPhotos = [
  {
    className: "about-photo-card--primary",
    label: "Adi Kaul headshot",
    src: "/images/adi-headshot.jpg"
  },
  {
    className: "about-photo-card--secondary",
    label: "Michigan Stadium photo",
    src: "/images/umich-football.jpg"
  },
  {
    className: "about-photo-card--tertiary",
    label: "Jellyfish aquarium photo",
    src: "/images/jelly.jpg"
  },
  {
    className: "about-photo-card--small",
    label: "Rocky sea coast photo",
    src: "/images/the-sea.jpg"
  }
];

const strengths = [
  "Python",
  "C++",
  "Web Development (React, JavaScript)",
  "App Development (Flutter / Dart)",
  "Firebase",
  "Git"
];

const interests = [
  {
    title: "Tech Consulting",
    description: "A final client presentation with my Tech Plus Consulting team at UofM, where I served as Senior Technical Analyst.",
    imageClass: "interest-preview--motion",
    imageSrc: "/images/interest-consulting.png"
  },
  {
    title: "Snowboarding",
    description: "Growing up around Vancouver spoiled me with mountains to choose from; Cypress is still my favorite.",
    imageClass: "interest-preview--tools",
    imageSrc: "/images/interest-snowboarding.jpg"
  },
  {
    title: "Bouldering",
    description: "I usually climb indoors, but this was my first time trying outdoor bouldering in Squamish.",
    imageClass: "interest-preview--product",
    imageSrc: "/images/interest-bouldering.jpg"
  },
  {
    title: "Photography",
    description: "I shoot with a Nikon AF-P DX Nikkor. This is a yellow eyelash viper I photographed at the San Diego Zoo.",
    imageClass: "interest-preview--startups",
    imageSrc: "/images/interest-photography.jpg"
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
      exit={reducedMotion ? { opacity: 1 } : { opacity: 0, y: 0 }}
      initial={reducedMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
      transition={{ duration: reducedMotion ? 0 : 0.24, ease: "easeOut" }}
    >
      <LandingBackLink slideIndex={0} />
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
            I am a Computer Science major at the University of Michigan interested in building
            purposeful software that blends human-centered design with AI to improve people's lives.
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
              className={`about-photo-card ${photo.className}`}
              key={photo.className}
              {...(photo.src ? {} : { "aria-label": photo.label, role: "img" as const })}
            >
              {photo.src ? (
                <img
                  alt={photo.label}
                  className="about-photo-card__image"
                  height="1200"
                  src={photo.src}
                  width="900"
                />
              ) : null}
            </div>
          ))}
        </motion.div>
      </header>

      <motion.section className="content-section about-split" {...(reducedMotion ? {} : reveal)}>
        <article className="about-split__panel">
          <h2>What I like building</h2>
          <p className="body-copy">
            I like building things that start from real problems, especially the small frustrations
            people run into every day. Recently, I have been especially drawn to products centered
            around AI, not just AI added onto existing software. I am interested in exploring how AI
            can reshape the way people learn, work, create, and solve everyday problems.
          </p>
          <p className="body-copy">
            Ultimately, what I care about most is building with purpose. I want the things I make to feel
            thoughtful, practical, and genuinely useful, while pushing toward a future where software
            makes people more capable.
          </p>
        </article>
        <article className="about-split__panel">
          <h2>Skills</h2>
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
            <h2>Other Interests</h2>
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
                className={`interest-preview__image${selectedInterest.imageSrc ? " interest-preview__image--photo" : ""}`}
                {...(selectedInterest.imageSrc
                  ? {}
                  : { "aria-label": `${selectedInterest.title} visual`, role: "img" as const })}
              >
                {selectedInterest.imageSrc ? (
                  <img
                    alt={`${selectedInterest.title} visual`}
                    className="interest-preview__photo"
                    height="1200"
                    src={selectedInterest.imageSrc}
                    width="1800"
                  />
                ) : null}
              </div>
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
