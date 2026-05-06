import { useNavigate } from "react-router-dom";

export default function Slide3About() {
  const navigate = useNavigate();

  function openAbout() {
    sessionStorage.setItem("lastSlide", "2");
    navigate("/about");
  }

  return (
    <section className="slide slide--three" aria-label="About">
      <div className="slide__inner">
        <div className="slide__content">
          <h1 className="hero-title">
            <span className="hero-title__line hero-title__line--strong">The story.</span>
          </h1>
          <p className="slide__kicker">Design, code, and the space between.</p>
          <button className="slide__cta" type="button" onClick={openAbout}>
            Read more -&gt;
          </button>
        </div>
      </div>
    </section>
  );
}
