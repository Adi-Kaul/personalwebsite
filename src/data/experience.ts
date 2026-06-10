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
    period: "February 2026 – May 2026",
    description: "Developed a multi-page React website for a maritime stealth startup, leveraging Framer Motion for scroll-driven animations and Three.js to render interactive 3D vessel models.\n\nResearched competitors and the startup's goals exiting stealth and key target audience to establish a cohesive visual identity, including typography, a color scheme, and a logo.",
    highlights: [],
    type: "work",
    image: "/images/stepai-1-homescreen.png",
    bg: "#25212e",
    fg: "#fcf0da"
  },
  {
    // TODO: replace with real role.
    company: "Ross Tech + Consulting",
    title: "Technical Analyst",
    period: "October 2025 – December 2025",
    description: "Built out the functionality of a UI wireframe for a prototype streaming platform, enabling the startup to go to market. Migrated 50+ videos to MUX and integrated the API for ad-free streaming.\n\n Implemented a Firebase-powered feedback loop for user content. Redesigned front-end sections using HTML and Tailwind CSS and resolved visual bugs to streamline the overall experience.",
    highlights: [],
    type: "project",
    // TODO: replace with a real image for this experience.
    image: "/images/scopeplus-home-page.png",
    bg: "#480208",
    fg: "#fcf0da"
  },
  {
    // TODO: replace with real education entry.
    company: "Arizon Systems",
    title: "Research Intern",
    period: "January 2024 – April 2024",
    description: "Researched AI implementations for pharmaceutical shop floor production and enterprise software. Analyzed and cross-compared competing enterprise and shop floor applications through written reports. Produced digital visuals and graphics outlining the defining characteristics of competing software.",
    highlights: [],
    type: "education",
    // TODO: replace with a real image for this experience.
    image: "/images/personalwebsite-1.png",
    bg: "#245a52",
    fg: "#d1e5e3"
  }
];
