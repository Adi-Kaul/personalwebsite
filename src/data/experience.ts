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
    // TODO: replace with real role.
    company: "Independent",
    title: "Designer and Developer",
    period: "2025 - Present",
    description: "Building small, useful interfaces across web, automation, and creative tools. Designed and shipped React prototypes with a focus on speed and polish. Created reusable systems for project pages, notes, and personal publishing.",
    highlights: [],
    type: "work",
    // TODO: replace with a real image for this experience.
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
