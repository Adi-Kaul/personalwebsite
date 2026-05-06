import { RefObject, useCallback, useEffect, useRef, useState } from "react";
import gsap from "gsap";

interface UseSlideManagerOptions {
  slideCount: number;
}

interface UseSlideManagerResult {
  containerRef: RefObject<HTMLDivElement>;
  currentIndex: number;
  goToSlide: (index: number) => void;
}

const WHEEL_DEBOUNCE_MS = 60;
const SWIPE_THRESHOLD_PX = 50;

function clampIndex(index: number, slideCount: number) {
  return Math.min(Math.max(index, 0), slideCount - 1);
}

function wrapIndex(index: number, slideCount: number) {
  return ((index % slideCount) + slideCount) % slideCount;
}

function visualIndexFor(logicalIndex: number) {
  return logicalIndex + 1;
}

function readDuration() {
  const raw = getComputedStyle(document.documentElement)
    .getPropertyValue("--slide-transition-duration")
    .trim();
  const parsed = Number.parseFloat(raw);

  return Number.isFinite(parsed) ? parsed : 0.8;
}

function readEase() {
  const raw = getComputedStyle(document.documentElement)
    .getPropertyValue("--slide-transition-ease")
    .trim();

  return raw || "power2.inOut";
}

function readStoredIndex(slideCount: number) {
  const stored = Number.parseInt(sessionStorage.getItem("lastSlide") ?? "0", 10);
  return Number.isFinite(stored) ? clampIndex(stored, slideCount) : 0;
}

export function useSlideManager({ slideCount }: UseSlideManagerOptions): UseSlideManagerResult {
  const containerRef = useRef<HTMLDivElement>(null);
  const currentIndexRef = useRef(0);
  const isAnimatingRef = useRef(false);
  const touchStartXRef = useRef<number | null>(null);
  const lastWheelAtRef = useRef(0);
  const [currentIndex, setCurrentIndex] = useState(0);

  const setBodySlide = useCallback((index: number) => {
    document.body.dataset.slide = String(index);
    sessionStorage.setItem("lastSlide", String(index));
  }, []);

  const animateTo = useCallback(
    (index: number) => {
      const nextIndex = wrapIndex(index, slideCount);
      const visualIndex =
        index < 0 ? 0 : index >= slideCount ? slideCount + 1 : visualIndexFor(nextIndex);

      if (nextIndex === currentIndexRef.current || isAnimatingRef.current) {
        return;
      }

      const track = document.querySelector<HTMLElement>("#slides-track");
      if (!track) {
        return;
      }

      const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      isAnimatingRef.current = true;
      currentIndexRef.current = nextIndex;
      setCurrentIndex(nextIndex);
      setBodySlide(nextIndex);

      if (prefersReducedMotion) {
        gsap.set(track, { x: `${-(visualIndexFor(nextIndex) * 100)}vw` });
        isAnimatingRef.current = false;
        return;
      }

      gsap.to(track, {
        x: `${-(visualIndex * 100)}vw`,
        duration: readDuration(),
        ease: readEase(),
        overwrite: "auto",
        onComplete: () => {
          if (index < 0 || index >= slideCount) {
            gsap.set(track, { x: `${-(visualIndexFor(nextIndex) * 100)}vw` });
          }

          isAnimatingRef.current = false;
        }
      });
    },
    [setBodySlide, slideCount]
  );

  useEffect(() => {
    const initialIndex = readStoredIndex(slideCount);
    const track = document.querySelector<HTMLElement>("#slides-track");

    currentIndexRef.current = initialIndex;
    setCurrentIndex(initialIndex);
    setBodySlide(initialIndex);

    if (track) {
      gsap.set(track, { x: `${-(visualIndexFor(initialIndex) * 100)}vw` });
    }
  }, [setBodySlide, slideCount]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) {
      return undefined;
    }

    function handleWheel(event: WheelEvent) {
      event.preventDefault();

      const now = window.performance.now();
      if (now - lastWheelAtRef.current < WHEEL_DEBOUNCE_MS) {
        return;
      }

      lastWheelAtRef.current = now;
      const direction = Math.abs(event.deltaX) > Math.abs(event.deltaY) ? event.deltaX : event.deltaY;

      if (direction > 0) {
        animateTo(currentIndexRef.current + 1);
      } else if (direction < 0) {
        animateTo(currentIndexRef.current - 1);
      }
    }

    function handleTouchStart(event: TouchEvent) {
      touchStartXRef.current = event.touches[0]?.clientX ?? null;
    }

    function handleTouchEnd(event: TouchEvent) {
      const startX = touchStartXRef.current;
      const endX = event.changedTouches[0]?.clientX;
      touchStartXRef.current = null;

      if (startX === null || endX === undefined) {
        return;
      }

      const delta = startX - endX;
      if (Math.abs(delta) <= SWIPE_THRESHOLD_PX) {
        return;
      }

      animateTo(currentIndexRef.current + (delta > 0 ? 1 : -1));
    }

    container.addEventListener("wheel", handleWheel, { passive: false });
    container.addEventListener("touchstart", handleTouchStart, { passive: true });
    container.addEventListener("touchend", handleTouchEnd, { passive: true });

    return () => {
      container.removeEventListener("wheel", handleWheel);
      container.removeEventListener("touchstart", handleTouchStart);
      container.removeEventListener("touchend", handleTouchEnd);
    };
  }, [animateTo]);

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "ArrowRight") {
        event.preventDefault();
        animateTo(currentIndexRef.current + 1);
      }

      if (event.key === "ArrowLeft") {
        event.preventDefault();
        animateTo(currentIndexRef.current - 1);
      }
    }

    function handleExternalJump(event: Event) {
      const customEvent = event as CustomEvent<number>;
      animateTo(customEvent.detail);
    }

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("slide:goTo", handleExternalJump);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("slide:goTo", handleExternalJump);
    };
  }, [animateTo]);

  return {
    containerRef,
    currentIndex,
    goToSlide: animateTo
  };
}
