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
  images?: string[];
  readme: string;
  year: number;
}

export const projects: Project[] = [
  {
    slug: "step-ai",
    name: "Step.ai",
    description: "An AI career-search agent that turns a user's resume, goals, job list, and networking contacts into ranked opportunities and prioritized next steps. Step.ai parses resume PDFs with a Llama-backed JSON extractor, generates Cohere embeddings through Oracle Generative AI, stores career data in an Oracle AI-enabled database, and uses semantic matching plus pacing logic to recommend applications, outreach, follow-ups, and insights in real time.",
    language: "Next.js / Oracle 23ai / AI Agents",
    languageColor: "#3178c6",
    stars: 0,
    forks: 0,
    topics: ["Next.js", "TypeScript", "Tailwind CSS", "Oracle 23ai", "Oracle Generative AI", "Cohere Embeddings", "Llama", "Zustand"],
    githubUrl: "https://github.com/Adi-Kaul/StepAI",
    images: [
      "/images/stepai-1-homescreen.png",
      "/images/stepai-2-resumeparsing.png",
      "/images/stepai-3-jobinterests.png",
      "/images/stepai-4-loadingpage.png",
      "/images/stepai-9.png",
      "/images/stepai-10.png",
      "/images/stepai-12.png",
      "/images/stepai-13.png",
      "/images/stepai-16.png",
    ],
    readme: `# Step.ai

Step.ai is an AI-powered career strategy platform built around a background agent loop.

The app starts with onboarding: users upload a resume, define target roles, set recruiting goals, and track jobs, applications, people, and outreach. Resume PDFs are parsed into structured profile data with a Llama-backed JSON extractor, with a regex parser as a fallback.

The agent then generates Cohere embeddings through Oracle Generative AI for resumes, jobs, and contacts. Those embeddings are stored against Oracle database records and used for semantic matching across jobs and people. The system combines vector similarity with career-specific signals like alumni/network leverage, timing, deadlines, seniority, shared background, and weekly application or outreach targets.

The main agent loop collects user data, generates missing embeddings, ranks jobs and people, evaluates progress against recruiting capacity, creates prioritized action items, and generates strategic insights. Results are persisted to Oracle tables for action items, agent runs, agent events, and insights, then streamed back to the UI through Server-Sent Events so the dashboard can update while the agent is working.

## Stack

- Next.js 14
- React
- TypeScript
- Oracle Autonomous Database / Oracle 23ai
- Oracle Generative AI
- Cohere embed-english-v3.0
- Llama chat model for structured resume parsing
- Vector similarity search and cosine scoring
- Server-Sent Events
- Zustand
- Tailwind CSS
`,
    year: 2026
  },
  {
    slug: "scopeplus",
    name: "ScopePlus",
    description: "An AI-powered Gradescope companion that uses a Chrome extension to scan assignments and generate targeted feedback, paired with a React/Firebase dashboard for reviewing submissions, asking tutor-style questions, and turning feedback into guided study support.",
    language: "React Dashboard / Chrome Extension",
    languageColor: "#f1e05a",
    stars: 0,
    forks: 0,
    topics: ["React", "Firebase Auth", "Firestore", "Manifest V3", "Tailwind CSS", "Groq API", "Claude API"],
    githubUrl: "https://github.com/Adi-Kaul/ScopePlus",
    images: [
      "/images/scopeplus-gradescope-scan.png",
      "/images/scopeplus-feedback-summary.png",
      "/images/scopeplus-practice-free-response.png",
      "/images/scopeplus-home-page.png"
    ],
    readme: `# ScopePlus

ScopePlus is an AI-powered feedback and tutoring system built around Gradescope assignments.

The Chrome extension connects directly to Gradescope assignment pages, scans assignment context, and helps generate targeted AI feedback. The tandem React/Firebase web app turns that feedback into a more complete student dashboard, where users can review submissions, ask tutor-style questions, generate practice questions, and keep assignment support organized across classes.

## Stack

- JavaScript
- Chrome Extension Manifest V3
- React
- Firebase
- Vite
- Tailwind CSS
- Groq API
- Claude API
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
