// Auto-discover FratTrack phone screenshots: drop any number of image files
// into src/assets/frattrack/ and they appear in the carousel, ordered by the
// number in their filename (frattrack-1, frattrack-2, ... frattrack-10, ...).
const frattrackScreens = import.meta.glob(
  "../assets/frattrack/*.{png,jpg,jpeg,webp}",
  { eager: true, as: "url" }
) as Record<string, string>;

const frattrackImages = Object.entries(frattrackScreens)
  .sort(([a], [b]) => {
    const numberOf = (path: string) => Number(path.match(/(\d+)(?=\.\w+$)/)?.[1] ?? 0);
    return numberOf(a) - numberOf(b);
  })
  .map(([, url]) => url);

export interface Project {
  slug: string;
  name: string;
  /** Very succinct statement of what the software is, shown above the title. */
  tagline: string;
  description: string;
  language: string;
  languageColor: string;
  stars: number;
  forks: number;
  topics: string[];
  githubUrl?: string;
  /** Repo is private: render a "Private Repo" indicator instead of a GitHub link. */
  isPrivate?: boolean;
  /** Short development-stage label shown beside the name, e.g. "Mid Development". */
  status?: string;
  demoUrl?: string;
  images?: string[];
  /** How `images` are displayed in the carousel. "phone" shows portrait
   * iPhone-framed screenshots, multiple at a time. Defaults to landscape. */
  media?: "landscape" | "phone";
  readme: string;
}

export const projects: Project[] = [
  {
    slug: "step-ai",
    name: "Step.ai",
    tagline: "AI agent for the job search",
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
`
  },
  {
    slug: "scopeplus",
    name: "ScopePlus",
    tagline: "Gradescope feedback generator and AI tutor",
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
`
  },
  {
    slug: "frattrack",
    name: "FratTrack",
    status: "Mid Development",
    isPrivate: true,
    tagline: "Campus nightlife, mapped and managed",
    description: "FratTrack is a campus social app built to make University of Michigan nightlife easier to keep up with. On the member side, you get a live map of parties happening around campus, a friends system, stories and memories, a feed, and a personal QR code that gets you in the door. The fraternity side is for the people running events, giving them a place to create and post parties, manage their member roster, scan guests in at the door, and see how a party actually turned out. Underneath, it runs on Firebase for auth and data, with email and OTP verification during onboarding and Riverpod handling app state.",
    language: "Flutter / Firebase / Mapbox",
    languageColor: "#00B4AB",
    stars: 0,
    forks: 0,
    topics: ["Flutter", "Dart", "Firebase Auth", "Cloud Firestore", "Cloud Functions", "Riverpod", "Mapbox"],
    media: "phone",
    images: frattrackImages,
    readme: `# FratTrack

FratTrack is a campus social app aimed at streamlining University of Michigan social life, making it easier to find what's happening, see who's going, and figure out how to get in.

The app has two connected sides. The **member side** is a social home built around a live Mapbox map of parties and events across campus, a friends system, stories and memories, a posts feed, profiles, and a personal QR code used for event entry. Direct messaging keeps conversations in one place.

The **fraternity side** is an organizer toolkit: create and publish parties and events, manage member rosters, scan guests in at the door with QR check-in, and review party analytics to understand turnout.

Authentication runs through Firebase with email/OTP verification and a multi-step onboarding flow. App data is stored in Cloud Firestore, Cloud Functions handle backend logic, and Riverpod manages client state.

> Status: actively in development.

## Stack

- Flutter
- Dart
- Firebase Authentication
- Cloud Firestore
- Cloud Functions
- Riverpod (flutter_riverpod)
- Mapbox (mapbox_maps_flutter)
- Geolocator
- qr_flutter
- Google Fonts
`
  },
  {
    slug: "personalwebsite",
    name: "Personal Website",
    tagline: "The site you're looking at right now",
    description: "Yes, this one. Built to feel like me: clean, direct, and a little unconventional. A horizontal carousel of slides instead of a scrolling page, animated routing between sections, and a design that tries to say something without saying too much. Built with React, TypeScript, Framer Motion, and Three.js.",
    language: "TypeScript / React / Framer Motion",
    languageColor: "#3178c6",
    stars: 4,
    forks: 1,
    topics: ["React", "TypeScript", "Framer Motion", "Vite", "Three.js", "React Router"],
    githubUrl: "https://github.com/Adi-Kaul/personalwebsite",
    demoUrl: "https://adi-kaul.dev",
    images: [
      "/images/personalwebsite-1.png",
      "/images/personalwebsite-2.png",
      "/images/personalwebsite-3.png",
      "/images/personalwebsite-4.png",
      "/images/personalwebsite-5.png"
    ],
    readme: `# Personal Website

Yes, this one. The site you are currently reading this on is itself one of the projects.

The structure is a horizontal carousel of full-viewport slides rather than a standard scrolling page. Each slide is its own section — home, projects, about — and navigating between them uses a custom slide manager that handles snapping, touch, and keyboard input. Clicking into a project or section triggers an animated route transition, with each subpage entering and exiting independently using Framer Motion.

The projects section, about page, and experience timeline are all driven by data files, so adding or updating content doesn't require touching layout code. The phone-frame carousel for FratTrack, for instance, auto-discovers screenshots from a folder and pages them in batches.

## Stack

- React 18
- TypeScript
- Vite
- Framer Motion
- Three.js
- React Router v6
- CSS custom properties for theming
`
  }
];
