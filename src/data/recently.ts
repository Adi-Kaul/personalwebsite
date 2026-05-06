export interface RecentItem {
  category: "building" | "reading" | "thinking" | "listening";
  text: string;
  link?: string;
  date: string;
}

export const recently: RecentItem[] = [
  {
    // TODO: replace with current item.
    category: "building",
    text: "A cleaner way to keep personal projects, notes, and experiments in one place.",
    date: "May 2026"
  },
  {
    // TODO: replace with current item.
    category: "reading",
    text: "Essays on taste, craft, and how teams decide what good means.",
    link: "https://example.com",
    date: "May 2026"
  },
  {
    // TODO: replace with current item.
    category: "thinking",
    text: "How small tools can feel personal without becoming precious.",
    date: "May 2026"
  },
  {
    // TODO: replace with current item.
    category: "listening",
    text: "Long-form conversations with founders, designers, and engineers.",
    date: "May 2026"
  }
];
