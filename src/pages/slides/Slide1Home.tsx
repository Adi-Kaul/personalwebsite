import ScrollHint from "../../components/ScrollHint";

export default function Slide1Home() {
  return (
    <section className="slide slide--one" aria-label="Home">
      <div className="slide__inner">
        <div className="slide__content">
          <h1 className="hero-title">
            <span className="hero-title__line">The work</span>
            <span className="hero-rule" aria-hidden="true" />
            <span className="hero-title__line hero-title__line--strong">I love.</span>
          </h1>
          <p className="slide__kicker">Designer / Developer / Builder</p>
        </div>
      </div>
      <ScrollHint />
    </section>
  );
}
