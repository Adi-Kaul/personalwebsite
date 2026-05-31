import { RefObject, useCallback, useEffect, useRef, useState } from "react";

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

function offsetForVisualIndex(visualIndex: number) {
  return -(visualIndex * window.innerWidth);
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

function cssEaseFor(ease: string) {
  if (ease === "power2.inOut") {
    return "cubic-bezier(0.45, 0, 0.15, 1)";
  }

  return ease;
}

function setTrackOffset(track: HTMLElement, visualIndex: number, animate: boolean) {
  const duration = animate ? readDuration() : 0;
  track.style.transition = animate ? `transform ${duration}s ${cssEaseFor(readEase())}` : "none";
  track.style.transform = `translate3d(${offsetForVisualIndex(visualIndex)}px, 0, 0)`;
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
  const animationTimeoutRef = useRef<number | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const setBodySlide = useCallback((index: number) => {
    document.body.dataset.slide = String(index);
    sessionStorage.setItem("lastSlide", String(index));
  }, []);

  const setEdgeSlides = useCallback((leftIndex: number, rightIndex = leftIndex) => {
    document.body.dataset.edgeLeftSlide = String(leftIndex);
    document.body.dataset.edgeRightSlide = String(rightIndex);
  }, []);

  const jumpTo = useCallback(
    (index: number) => {
      const nextIndex = wrapIndex(index, slideCount);
      const track = document.querySelector<HTMLElement>("#slides-track");

      if (animationTimeoutRef.current !== null) {
        window.clearTimeout(animationTimeoutRef.current);
        animationTimeoutRef.current = null;
      }

      isAnimatingRef.current = false;
      currentIndexRef.current = nextIndex;
      setCurrentIndex(nextIndex);
      setBodySlide(nextIndex);
      setEdgeSlides(nextIndex);

      if (track) {
        setTrackOffset(track, visualIndexFor(nextIndex), false);
      }
    },
    [setBodySlide, setEdgeSlides, slideCount]
  );

  const animateTo = useCallback(
    (index: number) => {
      const nextIndex = wrapIndex(index, slideCount);
      const previousIndex = currentIndexRef.current;
      const visualIndex =
        index < 0 ? 0 : index >= slideCount ? slideCount + 1 : visualIndexFor(nextIndex);
      const visualDirection = visualIndex - visualIndexFor(previousIndex);

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
        setTrackOffset(track, visualIndexFor(nextIndex), false);
        setEdgeSlides(nextIndex);
        isAnimatingRef.current = false;
        return;
      }

      setEdgeSlides(
        visualDirection < 0 ? nextIndex : previousIndex,
        visualDirection > 0 ? nextIndex : previousIndex
      );
      setTrackOffset(track, visualIndex, true);

      if (animationTimeoutRef.current !== null) {
        window.clearTimeout(animationTimeoutRef.current);
      }

      animationTimeoutRef.current = window.setTimeout(() => {
        if (index < 0 || index >= slideCount) {
          setTrackOffset(track, visualIndexFor(nextIndex), false);
        }

        setEdgeSlides(nextIndex);
        isAnimatingRef.current = false;
        animationTimeoutRef.current = null;
      }, readDuration() * 1000 + 60);
    },
    [setBodySlide, setEdgeSlides, slideCount]
  );

  useEffect(() => {
    const initialIndex = readStoredIndex(slideCount);
    const track = document.querySelector<HTMLElement>("#slides-track");

    currentIndexRef.current = initialIndex;
    setCurrentIndex(initialIndex);
    setBodySlide(initialIndex);
    setEdgeSlides(initialIndex);

    if (track) {
      setTrackOffset(track, visualIndexFor(initialIndex), false);
    }

    return () => {
      if (animationTimeoutRef.current !== null) {
        window.clearTimeout(animationTimeoutRef.current);
      }
    };
  }, [setBodySlide, setEdgeSlides, slideCount]);

  useEffect(() => {
    function handleResize() {
      const track = document.querySelector<HTMLElement>("#slides-track");
      if (!track || isAnimatingRef.current) {
        return;
      }

      setTrackOffset(track, visualIndexFor(currentIndexRef.current), false);
    }

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

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

    function handleExternalImmediateJump(event: Event) {
      const customEvent = event as CustomEvent<number>;
      jumpTo(customEvent.detail);
    }

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("slide:goTo", handleExternalJump);
    window.addEventListener("slide:setImmediate", handleExternalImmediateJump);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("slide:goTo", handleExternalJump);
      window.removeEventListener("slide:setImmediate", handleExternalImmediateJump);
    };
  }, [animateTo, jumpTo]);

  return {
    containerRef,
    currentIndex,
    goToSlide: animateTo
  };
}
