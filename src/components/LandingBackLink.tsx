import { MouseEvent } from "react";
import { Link, useNavigate } from "react-router-dom";

interface LandingBackLinkProps {
  slideIndex: number;
}

export default function LandingBackLink({ slideIndex }: LandingBackLinkProps) {
  const navigate = useNavigate();

  function handleClick(event: MouseEvent<HTMLAnchorElement>) {
    event.preventDefault();

    // Pin the exiting subpage to where it currently sits on screen so it fades
    // out in place. Without this, returning to the landing un-parks it at the
    // top of the document and the browser snaps scroll back to 0 mid-exit,
    // producing a "jump to top then fade" instead of a clean crossfade.
    const subpage = event.currentTarget.closest<HTMLElement>(".subpage");
    if (subpage) {
      const scrollY = window.scrollY;
      subpage.style.position = "fixed";
      subpage.style.top = `${-scrollY}px`;
      subpage.style.left = "0";
      subpage.style.right = "0";
      window.scrollTo(0, 0);
    }

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
