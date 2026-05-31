import { useNavigate } from "react-router-dom";

export default function Slide4Experience() {
  const navigate = useNavigate();

  function openInterests() {
    sessionStorage.setItem("lastSlide", "3");
    navigate("/about");
  }

  return (
    <section className="slide slide--four" aria-label="Interests">
      <div className="slide__inner">
        <div className="slide__content">
          <h1 className="hero-title hero-title--home">
            <span className="hero-title__line hero-title__line--strong">Interests</span>
          </h1>
          <p className="slide__kicker slide__kicker--home">
            Interfaces, systems, product thinking, and creative tools.
          </p>
          <button className="slide__cta" type="button" onClick={openInterests}>
            Read more -&gt;
          </button>
        </div>
      </div>
    </section>
  );
}
