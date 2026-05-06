import { useLocation, useNavigate } from "react-router-dom";

export default function Wordmark() {
  const navigate = useNavigate();
  const location = useLocation();

  function handleClick() {
    sessionStorage.setItem("lastSlide", "0");
    window.dispatchEvent(new CustomEvent<number>("slide:goTo", { detail: 0 }));

    if (location.pathname !== "/") {
      navigate("/");
    }
  }

  return (
    <button className="wordmark" type="button" onClick={handleClick}>
      Adi Kaul
    </button>
  );
}
