import { MouseEvent } from "react";
import { Link, useNavigate } from "react-router-dom";

interface LandingBackLinkProps {
  slideIndex: number;
}

export default function LandingBackLink({ slideIndex }: LandingBackLinkProps) {
  const navigate = useNavigate();

  function handleClick(event: MouseEvent<HTMLAnchorElement>) {
    event.preventDefault();
    sessionStorage.setItem("lastSlide", String(slideIndex));
    sessionStorage.setItem("landingReturnAnimation", "true");
    document.body.dataset.landingReturning = "true";
    window.dispatchEvent(new CustomEvent("landing:returning"));
    window.setTimeout(() => {
      delete document.body.dataset.landingReturning;
    }, 620);
    window.dispatchEvent(new CustomEvent("slide:setImmediate", { detail: slideIndex }));
    navigate("/");
  }

  return (
    <Link className="back-link" onClick={handleClick} to="/">
      &lt;- Adi Kaul
    </Link>
  );
}
