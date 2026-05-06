export interface Project {
  slug: string;
  name: string;
  description: string;
  language: string;
  languageColor: string;
  stars: number;
  forks: number;
  topics: string[];
  githubUrl: string;
  demoUrl?: string;
  readme: string;
  year: number;
}

export const projects: Project[] = [
  {
    // TODO: replace with a real project.
    slug: "personalwebsite",
    name: "personalwebsite",
    description: "A horizontal portfolio built with React, GSAP, and a quiet editorial system.",
    language: "TypeScript",
    languageColor: "#3178c6",
    stars: 4,
    forks: 1,
    topics: ["portfolio", "react", "gsap"],
    githubUrl: "https://github.com/Adi-Kaul/personalwebsite",
    demoUrl: "https://adi-kaul.dev",
    readme: `# personalwebsite

TODO: replace this README with real project notes.

This project is the home base for Adi Kaul's work, experiments, and current interests.

## Stack

- React 18
- TypeScript
- GSAP
- Framer Motion
`,
    year: 2026
  },
  {
    // TODO: replace with a real project.
    slug: "studio-board",
    name: "studio-board",
    description: "A lightweight planning surface for shipping creative and technical work.",
    language: "TypeScript",
    languageColor: "#3178c6",
    stars: 8,
    forks: 2,
    topics: ["planning", "product", "ui"],
    githubUrl: "https://github.com/Adi-Kaul/studio-board",
    readme: `# studio-board

TODO: replace this README with real project notes.

A compact dashboard concept for organizing active builds, next actions, and creative notes.
`,
    year: 2026
  },
  {
    // TODO: replace with a real project.
    slug: "signal-notes",
    name: "signal-notes",
    description: "An experiment in turning scattered notes into useful weekly signals.",
    language: "JavaScript",
    languageColor: "#f1e05a",
    stars: 6,
    forks: 0,
    topics: ["notes", "automation", "writing"],
    githubUrl: "https://github.com/Adi-Kaul/signal-notes",
    demoUrl: "https://example.com",
    readme: `# signal-notes

TODO: replace this README with real project notes.

Signal Notes explores how lightweight automation can make thinking visible without making it noisy.
`,
    year: 2025
  }
];
