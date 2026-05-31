import { Link } from "react-router-dom";
import ScrollHint from "../../components/ScrollHint";
import SilkGradient from "../../components/SilkGradient";

export default function Slide1Home() {
  return (
    <section className="slide slide--one" aria-label="Home">
      <SilkGradient className="silk-gradient" />
      <div className="slide__inner">
        <div className="slide__content">
          <Link className="hero-name-link" to="/about" aria-label="Read more about Adi Kaul">
            <h1 className="hero-title hero-title--home">
              <span className="hero-title__line hero-title__line--strong">Adi Kaul</span>
            </h1>
          </Link>
          <p className="slide__kicker slide__kicker--home">
            Computer Science Major / Developer / Builder
          </p>
        </div>
      </div>
      <ScrollHint />
    </section>
  );
}
