import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import LandingBackLink from "../components/LandingBackLink";
import ContourField from "../components/ContourField";

gsap.registerPlugin(ScrollTrigger);

const heroPhotos = [
  {
    className: "ab-card--headshot",
    label: "Adi Kaul headshot",
    src: "/images/adi-headshot.jpg",
    depth: 34,
    rotate: -5,
    float: { y: 12, duration: 5.4 }
  },
  {
    className: "ab-card--stadium",
    label: "Michigan Stadium photo",
    src: "/images/umich-football.jpg",
    depth: 44,
    rotate: 4,
    float: { y: 9, duration: 4.4 }
  },
  {
    className: "ab-card--jelly",
    label: "Jellyfish aquarium photo",
    src: "/images/jelly.jpg",
    depth: 18,
    rotate: -3,
    float: { y: 14, duration: 6.2 }
  },
  {
    className: "ab-card--sea",
    label: "Rocky sea coast photo",
    src: "/images/the-sea.jpg",
    depth: 24,
    rotate: 3,
    float: { y: 10, duration: 4.9 }
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
    description:
      "A final client presentation with my Tech Plus Consulting team at UofM, where I served as Senior Technical Analyst.",
    imageSrc: "/images/interest-consulting.png"
  },
  {
    title: "Snowboarding",
    description:
      "Growing up around Vancouver spoiled me with mountains to choose from; Cypress is still my favorite.",
    imageSrc: "/images/interest-snowboarding.jpg"
  },
  {
    title: "Bouldering",
    description:
      "I usually climb indoors, but this was my first time trying outdoor bouldering in Squamish.",
    imageSrc: "/images/interest-bouldering.jpg"
  },
  {
    title: "Photography",
    description:
      "This is a yellow eyelash viper I photographed at the San Diego Zoo. I shoot with a Nikon D5600.",
    imageSrc: "/images/interest-photography.jpg"
  }
];

const TITLE = "I'm Adi.";

function SplitTitle() {
  return (
    <h1 className="ab-title" aria-label={TITLE}>
      {TITLE.split(" ").map((word) => (
        <span className="ab-title__word" aria-hidden="true" key={word}>
          {Array.from(word).map((char, charIndex) => (
            <span className="ab-title__mask" key={`${word}-${charIndex}`}>
              <span className={`ab-title__char${char === "." ? " ab-title__char--accent" : ""}`}>
                {char}
              </span>
            </span>
          ))}
        </span>
      ))}
    </h1>
  );
}

function ScrubParagraph({ text }: { text: string }) {
  return (
    <p className="ab-build__para">
      {text.split(" ").map((word, index) => (
        <span className="ab-word" key={`${word}-${index}`}>
          {word}
          {index < text.split(" ").length - 1 ? " " : ""}
        </span>
      ))}
    </p>
  );
}

const BUILD_PARAGRAPHS = [
  "I like building things that start from real problems, especially the small frustrations people run into every day. Recently, I have been especially drawn to products centered around AI, not just AI added onto existing software. I am interested in exploring how AI can reshape the way people learn, work, create, and solve everyday problems.",
  "Ultimately, what I care about most is building with purpose. I want the things I make to feel thoughtful, practical, and genuinely useful, while pushing toward a future where software makes people more capable."
];

export default function AboutPage() {
  const reducedMotion = useReducedMotion();
  const [activeInterest, setActiveInterest] = useState(0);
  const [displayedInterest, setDisplayedInterest] = useState(0);
  const mainRef = useRef<HTMLElement | null>(null);
  const heroRef = useRef<HTMLElement | null>(null);
  const imageRefs = useRef<Array<HTMLImageElement | null>>([]);
  const captionRef = useRef<HTMLParagraphElement | null>(null);
  const prevInterestRef = useRef(0);

  useEffect(() => {
    document.body.dataset.slide = "-1";
  }, []);

  useLayoutEffect(() => {
    if (reducedMotion) {
      return undefined;
    }

    const hero = heroRef.current;
    const ctx = gsap.context(() => {
      // --- Hero entrance -------------------------------------------------
      gsap.from(".ab-eyebrow", { opacity: 0, y: 14, duration: 0.6, ease: "power2.out", delay: 0.1 });
      gsap.from(".ab-title__char", {
        yPercent: 112,
        duration: 1.05,
        ease: "power4.out",
        stagger: 0.045,
        delay: 0.18
      });
      gsap.from(".ab-intro", { opacity: 0, y: 26, duration: 0.85, ease: "power3.out", delay: 0.6 });
      gsap.from(".ab-cue", { opacity: 0, duration: 0.7, ease: "power2.out", delay: 1.35 });
      gsap.to(".ab-cue__arrow", { y: 7, repeat: -1, yoyo: true, duration: 0.9, ease: "sine.inOut" });
      gsap.to(".ab-cue", {
        opacity: 0,
        ease: "none",
        scrollTrigger: { start: 30, end: 200, scrub: 0.3 }
      });

      // --- Ambient backdrop orbs -----------------------------------------
      gsap.to(".ab-orb--1", { xPercent: 9, yPercent: 12, rotation: 18, duration: 34, repeat: -1, yoyo: true, ease: "sine.inOut" });
      gsap.to(".ab-orb--2", { xPercent: -12, yPercent: -8, rotation: -14, duration: 28, repeat: -1, yoyo: true, ease: "sine.inOut" });
      gsap.to(".ab-orb--3", { xPercent: 7, yPercent: -10, scale: 1.12, duration: 40, repeat: -1, yoyo: true, ease: "sine.inOut" });

      // --- Floating photo constellation ----------------------------------
      const cards = gsap.utils.toArray<HTMLElement>(".ab-card");
      cards.forEach((card, index) => {
        const config = heroPhotos[index];
        gsap.set(card, { rotation: config.rotate });
        gsap.from(card, {
          opacity: 0,
          y: 56,
          rotation: config.rotate + (index % 2 ? 7 : -7),
          scale: 0.9,
          duration: 1.15,
          ease: "power3.out",
          delay: 0.4 + index * 0.12
        });
        gsap.to(card.querySelector(".ab-card__float"), {
          y: config.float.y,
          duration: config.float.duration,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut"
        });
        gsap.to(card, {
          yPercent: -(12 + config.depth * 0.55),
          ease: "none",
          scrollTrigger: { trigger: hero, start: "top top", end: "bottom top", scrub: 0.6 }
        });
      });

      // --- Section heading reveals ----------------------------------------
      gsap.utils.toArray<HTMLElement>(".ab-h2").forEach((heading) => {
        gsap.from(heading, {
          y: 64,
          opacity: 0,
          duration: 0.9,
          ease: "power3.out",
          scrollTrigger: { trigger: heading, start: "top 86%", once: true }
        });
      });

      // --- "What I like building": word-by-word scrub reveal --------------
      gsap.utils.toArray<HTMLElement>(".ab-build__para").forEach((para) => {
        gsap.fromTo(
          para.querySelectorAll(".ab-word"),
          { opacity: 0.14 },
          {
            opacity: 1,
            stagger: 0.06,
            ease: "none",
            scrollTrigger: { trigger: para, start: "top 80%", end: "bottom 52%", scrub: 0.5 }
          }
        );
      });

      // --- Skills rows -----------------------------------------------------
      gsap.utils.toArray<HTMLElement>(".ab-skill").forEach((row) => {
        gsap.from(row.querySelector(".ab-skill__inner"), {
          y: 46,
          opacity: 0,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: { trigger: row, start: "top 90%", once: true }
        });
        gsap.from(row.querySelector(".ab-skill__line"), {
          scaleX: 0,
          duration: 1.1,
          ease: "power3.inOut",
          scrollTrigger: { trigger: row, start: "top 92%", once: true }
        });
      });

      // --- Interests entrance ----------------------------------------------
      gsap.from(".ab-int__item", {
        y: 36,
        opacity: 0,
        stagger: 0.09,
        duration: 0.7,
        ease: "power3.out",
        scrollTrigger: { trigger: ".ab-int__list", start: "top 84%", once: true }
      });
      gsap.from(".ab-int__frame", {
        clipPath: "inset(14% 14% 14% 14%)",
        opacity: 0,
        duration: 1.1,
        ease: "power3.out",
        scrollTrigger: { trigger: ".ab-int__frame", start: "top 82%", once: true }
      });
    }, mainRef);

    // Mouse parallax on the photo field, throttled through quickTo tweens.
    const cards = gsap.utils.toArray<HTMLElement>(".ab-card");
    const xTos = cards.map((card) =>
      gsap.quickTo(card.querySelector(".ab-card__par"), "x", { duration: 0.9, ease: "power3.out" })
    );
    const yTos = cards.map((card) =>
      gsap.quickTo(card.querySelector(".ab-card__par"), "y", { duration: 0.9, ease: "power3.out" })
    );

    function handleMove(event: MouseEvent) {
      const nx = event.clientX / window.innerWidth - 0.5;
      const ny = event.clientY / window.innerHeight - 0.5;
      heroPhotos.forEach((config, index) => {
        xTos[index](nx * -config.depth);
        yTos[index](ny * -config.depth);
      });
    }

    hero?.addEventListener("mousemove", handleMove, { passive: true });

    return () => {
      hero?.removeEventListener("mousemove", handleMove);
      ctx.revert();
    };
  }, [reducedMotion]);

  // Clip-path wipe between interest images.
  useEffect(() => {
    if (prevInterestRef.current === activeInterest) {
      return;
    }
    const previous = prevInterestRef.current;
    prevInterestRef.current = activeInterest;
    const incoming = imageRefs.current[activeInterest];
    const outgoing = imageRefs.current[previous];
    if (!incoming) {
      return;
    }

    if (reducedMotion) {
      imageRefs.current.forEach((img, index) => {
        if (img) {
          img.style.clipPath = index === activeInterest ? "inset(0% 0% 0% 0%)" : "inset(0% 0% 100% 0%)";
          img.style.zIndex = index === activeInterest ? "2" : "1";
        }
      });
      setDisplayedInterest(activeInterest);
      return;
    }

    gsap.set(incoming, { zIndex: 3 });
    if (outgoing) {
      gsap.set(outgoing, { zIndex: 2 });
    }
    gsap.fromTo(
      incoming,
      { clipPath: "inset(0% 0% 100% 0%)", scale: 1.07 },
      {
        clipPath: "inset(0% 0% 0% 0%)",
        scale: 1,
        duration: 0.75,
        ease: "power3.inOut",
        onComplete: () => {
          imageRefs.current.forEach((img, index) => {
            if (img) {
              gsap.set(img, {
                zIndex: index === activeInterest ? 2 : 1,
                clipPath: index === activeInterest ? "inset(0% 0% 0% 0%)" : "inset(0% 0% 100% 0%)"
              });
            }
          });
        }
      }
    );

    if (captionRef.current) {
      if (reducedMotion) {
        setDisplayedInterest(activeInterest);
      } else {
        // Fade the old description out, swap the text at the midpoint, fade in.
        gsap
          .timeline()
          .to(captionRef.current, {
            opacity: 0,
            y: -8,
            duration: 0.28,
            ease: "power2.in",
            onComplete: () => setDisplayedInterest(activeInterest)
          })
          .fromTo(
            captionRef.current,
            { opacity: 0, y: 12 },
            { opacity: 1, y: 0, duration: 0.4, ease: "power2.out" }
          );
      }
    }
  }, [activeInterest, reducedMotion]);

  const selectedInterest = interests[displayedInterest];

  return (
    <motion.main
      animate={{ opacity: 1 }}
      className="subpage subpage--about"
      exit={reducedMotion ? { opacity: 1 } : { opacity: 0 }}
      initial={reducedMotion ? { opacity: 1 } : { opacity: 0 }}
      transition={{ duration: reducedMotion ? 0 : 0.24, ease: "easeOut" }}
      ref={mainRef}
    >
      <div className="ab-backdrop" aria-hidden="true">
        <span className="ab-orb ab-orb--1" />
        <span className="ab-orb ab-orb--2" />
        <span className="ab-orb ab-orb--3" />
        <ContourField />
        <span className="ab-vignette" />
        <span className="ab-grain" />
      </div>

      <LandingBackLink slideIndex={0} />

      <header className="ab-hero" ref={heroRef}>
        <div className="ab-field" aria-label="Photo collage for Adi Kaul">
          {heroPhotos.map((photo, index) => (
            <div className={`ab-card ${photo.className}`} key={photo.className}>
              <div className="ab-card__par">
                <div className="ab-card__float">
                  <img
                    alt={photo.label}
                    className="ab-card__image"
                    height="1200"
                    loading={index < 2 ? "eager" : "lazy"}
                    src={photo.src}
                    width="900"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="ab-hero__copy">
          <p className="ab-eyebrow">About</p>
          <SplitTitle />
          <p className="ab-intro">
            I am a Computer Science major at the University of Michigan interested in building
            purposeful software that blends human-centered design with AI to improve people's lives.
          </p>
        </div>

        <div className="ab-cue" aria-hidden="true">
          <span className="ab-cue__label">More about me</span>
          <svg className="ab-cue__arrow" width="22" height="22" viewBox="0 0 24 24" fill="none">
            <path d="M12 4v15M6 13l6 6 6-6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="square" />
          </svg>
        </div>
      </header>

      <section className="ab-build">
        <h2 className="ab-h2">What I like building</h2>
        <div className="ab-build__copy">
          {BUILD_PARAGRAPHS.map((paragraph) => (
            <ScrubParagraph key={paragraph.slice(0, 24)} text={paragraph} />
          ))}
        </div>
      </section>

      <section className="ab-skills">
        <h2 className="ab-h2">Skills</h2>
        <ol className="ab-skills__list">
          {strengths.map((strength, index) => (
            <li className="ab-skill" key={strength}>
              <span className="ab-skill__line" aria-hidden="true" />
              <div className="ab-skill__inner">
                <span className="ab-skill__index">{String(index + 1).padStart(2, "0")}</span>
                <span className="ab-skill__name">{strength}</span>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <section className="ab-int">
        <div className="ab-int__side">
          <h2 className="ab-h2">Other Interests</h2>
          <ul className="ab-int__list" aria-label="Interest image selector">
            {interests.map((interest, index) => (
              <li className="ab-int__item" key={interest.title}>
                <button
                  aria-pressed={activeInterest === index}
                  className="ab-int__button"
                  type="button"
                  onClick={() => setActiveInterest(index)}
                >
                  <span className="ab-int__num">{String(index + 1).padStart(2, "0")}</span>
                  <span className="ab-int__name">{interest.title}</span>
                </button>
              </li>
            ))}
          </ul>
          <div className="ab-int__caption">
            <span className="ab-int__counter">
              {String(activeInterest + 1).padStart(2, "0")} / {String(interests.length).padStart(2, "0")}
            </span>
            <p className="ab-int__desc" ref={captionRef}>
              {selectedInterest.description}
            </p>
          </div>
        </div>

        <figure className="ab-int__frame">
          {interests.map((interest, index) => (
            <img
              alt={`${interest.title} visual`}
              className="ab-int__img"
              key={interest.title}
              loading="lazy"
              ref={(node) => {
                imageRefs.current[index] = node;
              }}
              src={interest.imageSrc}
              style={{
                clipPath: index === 0 ? "inset(0% 0% 0% 0%)" : "inset(0% 0% 100% 0%)",
                zIndex: index === 0 ? 2 : 1
              }}
            />
          ))}
        </figure>
      </section>
    </motion.main>
  );
}
