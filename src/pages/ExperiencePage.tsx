import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import LandingBackLink from "../components/LandingBackLink";
import ExperienceTitle from "../components/ExperienceTitle";
import BinaryShade from "../components/BinaryShade";
import { experience } from "../data/experience";

export default function ExperiencePage() {
  const reducedMotion = useReducedMotion();
  const [activeIndex, setActiveIndex] = useState(-1);
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const timelineRef = useRef<HTMLDivElement | null>(null);
  const panelRefs = useRef<Array<HTMLElement | null>>([]);
  const fillRef = useRef<HTMLSpanElement | null>(null);
  const frame = useRef<number | null>(null);
  const lastIndex = useRef(-1);

  useEffect(() => {
    document.body.dataset.slide = "3";
  }, []);

  // Drive the timeline from scroll position, measured from real element
  // geometry (so rows can be any height). The continuous fill is written
  // straight to the DOM; we only setState when the active role changes.
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    function update() {
      frame.current = null;
      const node = scrollRef.current;
      const tl = timelineRef.current;
      if (!node || !tl) return;
      const cRect = node.getBoundingClientRect();
      const mid = cRect.top + cRect.height / 2; // viewport middle

      // Active = the last role whose top has crossed the viewport middle.
      let idx = -1;
      for (let i = 0; i < panelRefs.current.length - 1; i++) {
        const row = panelRefs.current[i + 1];
        if (row && row.getBoundingClientRect().top <= mid) idx = i;
      }
      if (idx !== lastIndex.current) {
        lastIndex.current = idx;
        setActiveIndex(idx);
      }

      const tlRect = tl.getBoundingClientRect();
      const p = Math.min(1, Math.max(0, (mid - tlRect.top) / tlRect.height));
      if (fillRef.current) fillRef.current.style.setProperty("--xp-fill", String(p));
    }

    function onScroll() {
      if (frame.current != null) return;
      frame.current = requestAnimationFrame(update);
    }

    update();
    el.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      el.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", update);
      if (frame.current != null) cancelAnimationFrame(frame.current);
    };
  }, []);

  function goTo(index: number) {
    panelRefs.current[index + 1]?.scrollIntoView({
      behavior: reducedMotion ? "auto" : "smooth"
    });
  }

  return (
    <motion.main
      animate={{ opacity: 1 }}
      className="subpage subpage--experience"
      exit={reducedMotion ? {} : { opacity: 0 }}
      initial={reducedMotion ? {} : { opacity: 0 }}
      transition={{ duration: reducedMotion ? 0 : 0.18, ease: "easeOut" }}
    >
      <div className="xp-backdrop" aria-hidden="true">
        <span className="xp-grain" />
        <BinaryShade />
      </div>

      <LandingBackLink slideIndex={2} />

      <div className="xp" ref={scrollRef}>
        <section
          className="xp-panel xp-panel--intro"
          ref={(node) => {
            panelRefs.current[0] = node;
          }}
        >
          <div className="xp-intro">
            <ExperienceTitle />
            <motion.span
              className="xp-intro__cue"
              aria-hidden="true"
              initial={reducedMotion ? {} : { opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: reducedMotion ? 0 : 0.6, delay: reducedMotion ? 0 : 1.4, ease: "easeOut" }}
            >
              Scroll down
              <svg width="14" height="20" viewBox="0 0 14 20" fill="none">
                <path d="M7 1v16M1 12l6 6 6-6" stroke="currentColor" strokeWidth="1.4" strokeLinecap="square" />
              </svg>
            </motion.span>
          </div>
        </section>

        <div className="xp-timeline" ref={timelineRef}>
          <span className="xp-timeline__line" aria-hidden="true" />
          <span className="xp-timeline__fill" aria-hidden="true" ref={fillRef} />

          {experience.map((role, index) => (
            <section
              className={`xp-row${index % 2 === 1 ? " xp-row--flip" : ""}`}
              key={`${role.company}-${role.period}`}
              ref={(node) => {
                panelRefs.current[index + 1] = node;
              }}
            >
              <button
                type="button"
                className="xp-node"
                data-passed={index <= activeIndex}
                aria-current={index === activeIndex ? "true" : undefined}
                aria-label={`Jump to ${role.company}, ${role.period}`}
                onClick={() => goTo(index)}
              >
                <span className="xp-node__initial" aria-hidden="true">
                  {role.company.trim().charAt(0).toUpperCase()}
                </span>
              </button>

              <motion.div
                className="xp-panel__text"
                initial={reducedMotion ? {} : { opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ root: scrollRef, amount: 0.4, once: true }}
                transition={{ duration: reducedMotion ? 0 : 0.5, ease: "easeOut" }}
              >
                <span className="xp-panel__index" aria-hidden="true">
                  {String(index + 1).padStart(2, "0")} / {String(experience.length).padStart(2, "0")}
                </span>
                <h2 className="xp-panel__role">{role.title}</h2>
                <p className="xp-panel__company">{role.company}</p>
                <p className="xp-panel__date">{role.period}</p>
                <p className="xp-panel__desc body-copy">{role.description}</p>
                {role.highlights.length > 0 && (
                  <ul className="xp-panel__highlights">
                    {role.highlights.map((highlight) => (
                      <li key={highlight}>{highlight}</li>
                    ))}
                  </ul>
                )}
              </motion.div>

              <motion.figure
                className="xp-panel__media"
                initial={reducedMotion ? {} : { opacity: 0, scale: 1.04 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ root: scrollRef, amount: 0.4, once: true }}
                transition={{ duration: reducedMotion ? 0 : 0.6, ease: "easeOut" }}
              >
                <div className="xp-frame">
                  <div className="xp-frame__screen">
                    <img src={role.image} alt={`${role.company} — ${role.title}`} loading="lazy" />
                  </div>
                </div>
              </motion.figure>
            </section>
          ))}
        </div>

        <div className="xp-end" aria-hidden="true">
          <svg className="xp-end__svg" viewBox="0 0 1000 300" preserveAspectRatio="none">
            <text x="0" y="300" textLength="1000" lengthAdjust="spacingAndGlyphs">
              THE END
            </text>
          </svg>
        </div>
      </div>
    </motion.main>
  );
}
