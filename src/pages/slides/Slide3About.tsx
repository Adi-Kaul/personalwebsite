import { useNavigate } from "react-router-dom";

export default function Slide3About() {
  const navigate = useNavigate();

  function openExperience() {
    sessionStorage.setItem("lastSlide", "2");
    navigate("/experience");
  }

  return (
    <section className="slide slide--three" aria-label="Experience">
      <div className="slide__inner">
        <div className="slide__content">
          <h1 className="hero-title hero-title--home">
            <span className="hero-title__line hero-title__line--strong">Experience</span>
          </h1>
          <p className="slide__kicker slide__kicker--home">
            Roles, projects, and the path that shaped my work.
          </p>
          <button className="slide__cta" type="button" onClick={openExperience}>
            Full timeline -&gt;
          </button>
        </div>
      </div>
    </section>
  );
}
