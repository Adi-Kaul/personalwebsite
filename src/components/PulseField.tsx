import { useEffect, useRef } from "react";
import gsap from "gsap";

/**
 * "Pulse field" backdrop for the Projects page.
 *
 * A fine blueprint lattice of "+" ticks floats over deep-purple breathing
 * glows, and the cursor carries a soft lens that brightens and gently parts
 * the ticks around it.
 *
 * GSAP drives all the motion: quickTo smooths the cursor lens and tweened
 * proxies breathe the glows.
 *
 * Performance: one 2D canvas, ~500 ticks per frame, capped DPR, rendering
 * via gsap.ticker (paused while the tab is hidden), and a single still
 * frame under prefers-reduced-motion.
 */

const GRID = 56;
const TICK_ARM = 3.2;
const LENS_RADIUS = 230;
const LENS_PUSH = 7;

export default function PulseField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvasEl = canvasRef.current;
    if (!canvasEl) return undefined;
    const context = canvasEl.getContext("2d", { alpha: false });
    if (!context) return undefined;
    const cv = canvasEl;
    const ctx = context;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let width = 0;
    let height = 0;

    // Lens starts parked off-screen so nothing reacts until the mouse moves.
    const lens = { x: -2000, y: -2000, strength: 0 };
    const glow = { a: 0.55, b: 0.4 };

    function build() {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      width = window.innerWidth;
      height = window.innerHeight;
      cv.width = Math.floor(width * dpr);
      cv.height = Math.floor(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    function drawBase() {
      const sky = ctx.createLinearGradient(0, 0, 0, height);
      sky.addColorStop(0, "#170b29");
      sky.addColorStop(1, "#0d0618");
      ctx.fillStyle = sky;
      ctx.fillRect(0, 0, width, height);

      const ga = ctx.createRadialGradient(
        width * 0.82, height * 0.12, 0,
        width * 0.82, height * 0.12, Math.max(width, height) * 0.7
      );
      ga.addColorStop(0, `rgba(91, 44, 165, ${0.20 * glow.a})`);
      ga.addColorStop(1, "rgba(91, 44, 165, 0)");
      ctx.fillStyle = ga;
      ctx.fillRect(0, 0, width, height);

      const gb = ctx.createRadialGradient(
        width * 0.08, height * 0.92, 0,
        width * 0.08, height * 0.92, Math.max(width, height) * 0.6
      );
      gb.addColorStop(0, `rgba(141, 51, 124, ${0.13 * glow.b})`);
      gb.addColorStop(1, "rgba(141, 51, 124, 0)");
      ctx.fillStyle = gb;
      ctx.fillRect(0, 0, width, height);
    }

    function drawTicks() {
      const lensR2 = LENS_RADIUS * LENS_RADIUS;

      for (let y = GRID; y < height; y += GRID) {
        for (let x = GRID; x < width; x += GRID) {
          const dx = x - lens.x;
          const dy = y - lens.y;
          const d2 = dx * dx + dy * dy;

          let px = x;
          let py = y;
          let alpha = 0.18;

          if (d2 < lensR2 && lens.strength > 0.001) {
            const d = Math.sqrt(d2) || 1;
            // Smooth falloff: 1 at the cursor, 0 at the lens edge.
            const fall = 1 - d / LENS_RADIUS;
            const ease = fall * fall * (3 - 2 * fall) * lens.strength;
            px += (dx / d) * LENS_PUSH * ease;
            py += (dy / d) * LENS_PUSH * ease;
            alpha += 0.3 * ease;
          }

          ctx.strokeStyle = `rgba(205, 185, 250, ${alpha})`;
          ctx.beginPath();
          ctx.moveTo(px - TICK_ARM, py);
          ctx.lineTo(px + TICK_ARM, py);
          ctx.moveTo(px, py - TICK_ARM);
          ctx.lineTo(px, py + TICK_ARM);
          ctx.stroke();
        }
      }
    }

    function render() {
      drawBase();
      drawTicks();
    }

    build();

    if (reduceMotion) {
      render();
      const onResizeStill = () => {
        build();
        render();
      };
      window.addEventListener("resize", onResizeStill);
      return () => window.removeEventListener("resize", onResizeStill);
    }

    const lensX = gsap.quickTo(lens, "x", { duration: 0.55, ease: "power3.out" });
    const lensY = gsap.quickTo(lens, "y", { duration: 0.55, ease: "power3.out" });

    function onPointerMove(event: PointerEvent) {
      lensX(event.clientX);
      lensY(event.clientY);
      gsap.to(lens, { strength: 1, duration: 0.6, ease: "power2.out", overwrite: "auto" });
    }

    function onPointerLeave() {
      gsap.to(lens, { strength: 0, duration: 0.8, ease: "power2.out", overwrite: "auto" });
    }

    const glowTweenA = gsap.to(glow, { a: 1, duration: 8, ease: "sine.inOut", repeat: -1, yoyo: true });
    const glowTweenB = gsap.to(glow, { b: 1, duration: 11, ease: "sine.inOut", repeat: -1, yoyo: true, delay: 2 });

    function tick() {
      if (document.hidden) return;
      render();
    }
    gsap.ticker.add(tick);

    let resizeTimer = 0;
    function onResize() {
      window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(build, 160);
    }

    window.addEventListener("pointermove", onPointerMove);
    document.documentElement.addEventListener("pointerleave", onPointerLeave);
    window.addEventListener("resize", onResize);

    return () => {
      gsap.ticker.remove(tick);
      glowTweenA.kill();
      glowTweenB.kill();
      gsap.killTweensOf(lens);
      window.clearTimeout(resizeTimer);
      window.removeEventListener("pointermove", onPointerMove);
      document.documentElement.removeEventListener("pointerleave", onPointerLeave);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return <canvas ref={canvasRef} className="projects-bg" aria-hidden="true" />;
}
