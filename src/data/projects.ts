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
    // TODO: replace with real project details.
    slug: "step-ai",
    name: "Step.ai",
    description: "An AI-centered product concept focused on helping people move through tasks one clear step at a time.",
    language: "Python",
    languageColor: "#3572A5",
    stars: 0,
    forks: 0,
    topics: ["ai", "product", "workflow"],
    githubUrl: "https://github.com/Adi-Kaul/step-ai",
    readme: `# Step.ai

TODO: replace this README with real project notes.

Step.ai is an AI-centered product concept focused on making complex work feel clearer, more guided, and easier to act on.
`,
    year: 2026
  },
  {
    // TODO: replace with real project details.
    slug: "scopeplus",
    name: "ScopePlus",
    description: "A practical tool concept for scoping projects, clarifying requirements, and keeping teams aligned.",
    language: "TypeScript",
    languageColor: "#3178c6",
    stars: 0,
    forks: 0,
    topics: ["planning", "product", "teams"],
    githubUrl: "https://github.com/Adi-Kaul/scopeplus",
    readme: `# ScopePlus

TODO: replace this README with real project notes.

ScopePlus explores how lightweight software can help projects start with clearer goals, constraints, and decisions.
`,
    year: 2026
  },
  {
    // TODO: replace with real project details.
    slug: "frattrack",
    name: "FratTrack",
    description: "A campus-focused app concept for organizing fraternity events, communication, and member workflows.",
    language: "Dart",
    languageColor: "#00B4AB",
    stars: 0,
    forks: 0,
    topics: ["flutter", "firebase", "campus"],
    githubUrl: "https://github.com/Adi-Kaul/frattrack",
    readme: `# FratTrack

TODO: replace this README with real project notes.

FratTrack is a mobile-first concept for making fraternity logistics easier to manage and easier for members to follow.
`,
    year: 2026
  },
  {
    // TODO: replace with real project details.
    slug: "personalwebsite",
    name: "Personal Website",
    description: "A horizontal portfolio built with React, animated routing, and a quiet editorial system.",
    language: "TypeScript",
    languageColor: "#3178c6",
    stars: 4,
    forks: 1,
    topics: ["portfolio", "react", "motion"],
    githubUrl: "https://github.com/Adi-Kaul/personalwebsite",
    demoUrl: "https://adi-kaul.dev",
    readme: `# Personal Website

TODO: replace this README with real project notes.

This project is the home base for Adi Kaul's work, experiments, and current interests.

## Stack

- React 18
- TypeScript
- Framer Motion
- Three.js
`,
    year: 2026
  }
];
