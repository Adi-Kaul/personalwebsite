interface DotNavProps {
  currentIndex: number;
  slideCount: number;
  goToSlide: (index: number) => void;
}

export default function DotNav({ currentIndex, slideCount, goToSlide }: DotNavProps) {
  return (
    <nav className="dot-nav" aria-label="Slide navigation">
      {Array.from({ length: slideCount }, (_, index) => (
        <button
          aria-current={currentIndex === index}
          aria-label={`Go to slide ${index + 1}`}
          className="dot-nav__button"
          key={index}
          type="button"
          onClick={() => goToSlide(index)}
        >
          <span className="dot-nav__dot" />
        </button>
      ))}
    </nav>
  );
}
