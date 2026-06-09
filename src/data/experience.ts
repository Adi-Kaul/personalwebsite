export interface Role {
  company: string;
  title: string;
  period: string;
  description: string;
  highlights: string[];
  type: "work" | "education" | "project";
  /** Image shown beside this experience.
   * Put files in /public/images and reference them as "/images/<file>". */
  image: string;
  /** Panel background color for this experience (the page fades to it). */
  bg: string;
  /** Text color used on top of `bg` (pick something readable on it). */
  fg: string;
}

export const experience: Role[] = [
  {
    company: "JustAir",
    title: "Software Engineer",
    period: "June 2026 – Present",
    description: "Prototyping a Next.js mobile application that surfaces real-time weather and air quality data through an interactive map interface. Designing custom condition visuals that translate raw environmental data into clear, readable displays for everyday users.",
    highlights: [],
    type: "work",
    image: "/images/stepai-1-homescreen.png",
    bg: "#25212e",
    fg: "#fcf0da"
  },
  {
    company: "Ross Tech + Consulting",
    title: "Senior Technical Analyst",
    period: "2025 - Present",
    description: "Developed a multi-page React website for a maritime stealth startup, leveraging Framer Motion for scroll-driven animations and Three.js to render interactive 3D vessel models.\n\nResearched competitors and the startup's goals exiting stealth and key target audience to establish a cohesive visual identity, including typography, a color scheme, and a logo.",
    highlights: [],
    type: "work",
    image: "/images/stepai-1-homescreen.png",
    bg: "#25212e",
    fg: "#fcf0da"
  },
  {
    // TODO: replace with real role.
    company: "Studio Project",
    title: "Product Builder",
    period: "2024 - 2025",
    description: "Explored product ideas from sketches through working front-end prototypes. Turned fuzzy ideas into testable workflows, balancing visual design, code quality, and practical shipping constraints.",
    highlights: [],
    type: "project",
    // TODO: replace with a real image for this experience.
    image: "/images/scopeplus-home-page.png",
    bg: "#480208",
    fg: "#fcf0da"
  },
  {
    // TODO: replace with real education entry.
    company: "Learning Track",
    title: "Computer Science and Design",
    period: "2023 - 2024",
    description: "Focused on interface design, software fundamentals, and product thinking. Studied front-end systems, visual hierarchy, and interaction patterns that now inform every project I ship.",
    highlights: [],
    type: "education",
    // TODO: replace with a real image for this experience.
    image: "/images/personalwebsite-1.png",
    bg: "#245a52",
    fg: "#d1e5e3"
  }
];
