import { useEffect, useRef } from "react";

/**
 * Generative topographic contour backdrop for the About page.
 *
 * A smooth scalar field (sum of drifting sines) is contoured with marching
 * squares each frame, producing elevation lines that slowly morph like a
 * living map. Every few iso-levels gets a brighter "index contour", the way
 * real topo maps emphasize major elevations.
 *
 * Performance: coarse sample grid (~26px cells), capped DPR, ~30fps cap,
 * typed-array field reused across frames, and a single still frame under
 * prefers-reduced-motion.
 */

const CELL = 26;
const LEVELS = [-2.3, -1.8, -1.3, -0.8, -0.3, 0.2, 0.7, 1.2, 1.7, 2.2];
const FRAME_INTERVAL = 1000 / 30;

export default function ContourField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvasEl = canvasRef.current;
    if (!canvasEl) return undefined;
    const context = canvasEl.getContext("2d", { alpha: true });
    if (!context) return undefined;
    const cv = canvasEl;
    const ctx = context;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let width = 0;
    let height = 0;
    let cols = 0;
    let rows = 0;
    let field = new Float32Array(0);
    let raf = 0;
    let lastFrame = 0;

    function fieldValue(x: number, y: number, t: number) {
      return (
        Math.sin(x * 0.0042 + t * 0.00011) +
        Math.sin(y * 0.0051 - t * 0.00009) +
        Math.sin((x + y) * 0.0027 + t * 0.00007) +
        Math.sin(Math.hypot(x - width * 0.7, y - height * 0.35) * 0.0036 - t * 0.00013)
      );
    }

    function build() {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      width = window.innerWidth;
      height = window.innerHeight;
      cols = Math.ceil(width / CELL) + 1;
      rows = Math.ceil(height / CELL) + 1;
      cv.width = Math.floor(width * dpr);
      cv.height = Math.floor(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      field = new Float32Array(cols * rows);
    }

    // Interpolated crossing point along an edge, for one cell side.
    function lerp(a: number, b: number) {
      return a / (a - b);
    }

    function draw(t: number) {
      ctx.clearRect(0, 0, width, height);
      ctx.lineWidth = 1;

      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          field[r * cols + c] = fieldValue(c * CELL, r * CELL, t);
        }
      }

      for (let li = 0; li < LEVELS.length; li++) {
        const level = LEVELS[li];
        const index = li % 3 === 1;
        ctx.strokeStyle = index ? "rgba(120, 220, 235, 0.11)" : "rgba(80, 170, 210, 0.05)";
        ctx.beginPath();

        for (let r = 0; r < rows - 1; r++) {
          for (let c = 0; c < cols - 1; c++) {
            const tl = field[r * cols + c] - level;
            const tr = field[r * cols + c + 1] - level;
            const br = field[(r + 1) * cols + c + 1] - level;
            const bl = field[(r + 1) * cols + c] - level;

            // Skip cells the contour doesn't cross.
            if ((tl > 0) === (tr > 0) && (tr > 0) === (br > 0) && (br > 0) === (bl > 0)) {
              continue;
            }

            const x = c * CELL;
            const y = r * CELL;
            const pts: number[] = [];
            if (tl > 0 !== tr > 0) pts.push(x + lerp(tl, tr) * CELL, y);
            if (tr > 0 !== br > 0) pts.push(x + CELL, y + lerp(tr, br) * CELL);
            if (bl > 0 !== br > 0) pts.push(x + lerp(bl, br) * CELL, y + CELL);
            if (tl > 0 !== bl > 0) pts.push(x, y + lerp(tl, bl) * CELL);

            if (pts.length >= 4) {
              ctx.moveTo(pts[0], pts[1]);
              ctx.lineTo(pts[2], pts[3]);
            }
            if (pts.length === 8) {
              ctx.moveTo(pts[4], pts[5]);
              ctx.lineTo(pts[6], pts[7]);
            }
          }
        }

        ctx.stroke();
      }
    }

    function animate(now: number) {
      raf = requestAnimationFrame(animate);
      if (document.hidden) return;
      if (now - lastFrame < FRAME_INTERVAL) return;
      lastFrame = now;
      draw(now);
    }

    build();

    if (reduceMotion) {
      draw(4000);
    } else {
      raf = requestAnimationFrame(animate);
    }

    let resizeTimer = 0;
    function onResize() {
      window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(() => {
        build();
        if (reduceMotion) draw(4000);
      }, 180);
    }
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(raf);
      window.clearTimeout(resizeTimer);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return <canvas ref={canvasRef} className="ab-contour" aria-hidden="true" />;
}
