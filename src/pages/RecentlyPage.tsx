import { useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";
import { RecentItem, recently } from "../data/recently";

const categories: RecentItem["category"][] = ["building", "reading", "thinking", "listening"];

export default function RecentlyPage() {
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    document.body.dataset.slide = "4";
  }, []);

  return (
    <motion.main
      animate={{ opacity: 1, y: 0 }}
      className="subpage subpage--recently"
      exit={reducedMotion ? { opacity: 1 } : { opacity: 0, y: -12 }}
      initial={reducedMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
      transition={{ duration: reducedMotion ? 0 : 0.5, ease: "easeOut" }}
    >
      <Link className="back-link" to="/">
        &lt;- Adi Kaul
      </Link>
      <header className="page-header">
        <h1>Right now.</h1>
        <p>Updated May 2026</p>
      </header>
      <section className="recent-groups" aria-label="Recently">
        {categories.map((category) => {
          const items = recently.filter((item) => item.category === category);
          if (items.length === 0) {
            return null;
          }

          return (
            <div className="recent-group" key={category}>
              <h2>{category}</h2>
              {items.map((item) => (
                <article className="recent-item" key={`${item.category}-${item.text}`}>
                  {item.link ? (
                    <a href={item.link} rel="noreferrer" target="_blank">
                      {item.text}
                    </a>
                  ) : (
                    <p>{item.text}</p>
                  )}
                  <span className="recent-item__date">{item.date}</span>
                </article>
              ))}
            </div>
          );
        })}
      </section>
    </motion.main>
  );
}
