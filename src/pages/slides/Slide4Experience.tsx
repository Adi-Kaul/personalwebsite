import { useNavigate } from "react-router-dom";
import { experience } from "../../data/experience";

export default function Slide4Experience() {
  const navigate = useNavigate();
  const roles = experience.slice(0, 2);

  function openExperience() {
    sessionStorage.setItem("lastSlide", "3");
    navigate("/experience");
  }

  return (
    <section className="slide slide--four" aria-label="Experience">
      <div className="slide__inner">
        <div className="slide__content">
          <h1 className="hero-title">
            <span className="hero-title__line hero-title__line--strong">The path.</span>
          </h1>
          <div className="role-teasers">
            {roles.map((role) => (
              <p key={`${role.company}-${role.period}`}>
                {role.company} · {role.title}
              </p>
            ))}
          </div>
          <button className="slide__cta" type="button" onClick={openExperience}>
            Full timeline -&gt;
          </button>
        </div>
      </div>
    </section>
  );
}
