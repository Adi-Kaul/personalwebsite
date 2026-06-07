import { useNavigate } from "react-router-dom";
import SilkGradient, { SilkPreset } from "../../components/SilkGradient";

const CRIMSON_PRESET: SilkPreset = {
  bg: [72, 2, 8],
  stops: [
    [72, 2, 8],
    [110, 4, 14],
    [155, 10, 28],
    [190, 38, 52],
    [212, 78, 85],
    [228, 132, 134],
    [242, 186, 182]
  ],
  speed: 0.91,
  scale: 1.4,
  voids: 0.05,
  grain: 0.7
};

export default function Slide3About() {
  const navigate = useNavigate();

  function openExperience() {
    sessionStorage.setItem("lastSlide", "2");
    navigate("/experience");
  }

  return (
    <section className="slide slide--three" aria-label="Experience">
      <SilkGradient className="silk-gradient" preset={CRIMSON_PRESET} slideDataValue="2" />
      <div className="slide__inner">
        <div className="slide__content">
          <button className="experience-title-button" type="button" onClick={openExperience}>
            <h1 className="hero-title hero-title--home">
              <span className="hero-title__line hero-title__line--strong">Experience</span>
            </h1>
          </button>
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
