export interface Role {
  company: string;
  title: string;
  period: string;
  description: string;
  highlights: string[];
  type: "work" | "education" | "project";
}

export const experience: Role[] = [
  {
    // TODO: replace with real role.
    company: "Independent",
    title: "Designer and Developer",
    period: "2025 - Present",
    description: "Building small, useful interfaces across web, automation, and creative tools.",
    highlights: [
      "Designed and shipped React prototypes with a focus on speed and polish.",
      "Created reusable systems for project pages, notes, and personal publishing."
    ],
    type: "work"
  },
  {
    // TODO: replace with real role.
    company: "Studio Project",
    title: "Product Builder",
    period: "2024 - 2025",
    description: "Explored product ideas from sketches through working front-end prototypes.",
    highlights: [
      "Turned fuzzy ideas into testable workflows.",
      "Balanced visual design, code quality, and practical shipping constraints."
    ],
    type: "project"
  },
  {
    // TODO: replace with real education entry.
    company: "Learning Track",
    title: "Computer Science and Design",
    period: "2023 - 2024",
    description: "Focused on interface design, software fundamentals, and product thinking.",
    highlights: ["Studied front-end systems, visual hierarchy, and interaction patterns."],
    type: "education"
  }
];
