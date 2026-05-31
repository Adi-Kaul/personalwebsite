import { useNavigate } from "react-router-dom";
import { recently } from "../../data/recently";

export default function Slide5Recently() {
  const navigate = useNavigate();

  function openRecently() {
    sessionStorage.setItem("lastSlide", "4");
    navigate("/recently");
  }

  return (
    <section className="slide slide--five" aria-label="What I'm Doing Now">
      <div className="slide__inner">
        <div className="slide__content">
          <h1 className="hero-title hero-title--home">
            <span className="hero-title__line hero-title__line--strong">What I'm</span>
            <span className="hero-title__line hero-title__line--strong">Doing Now</span>
          </h1>
          <div className="recent-teasers recent-teasers--deck">
            {recently.slice(0, 3).map((item) => (
              <p key={`${item.category}-${item.text}`}>{item.text}</p>
            ))}
          </div>
          <button className="slide__cta" type="button" onClick={openRecently}>
            More -&gt;
          </button>
        </div>
      </div>
    </section>
  );
}
