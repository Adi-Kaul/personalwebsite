import { useEffect, useRef } from "react";

const FS = 11; // grid step + font size in px
const N_BUCKETS = 8; // opacity levels per color direction

// Deterministic 0/1 per cell — never changes between frames, no GC.
function cellChar(col: number, row: number): string {
  return ((col * 2654435761) ^ (row * 2246822519)) & 1 ? "1" : "0";
}

// Pre-built bucket arrays reused every frame — no allocation in the hot path.
type Cell = { x: number; y: number; ch: string };
const lightBuckets: Cell[][] = Array.from({ length: N_BUCKETS }, () => []);
const darkBuckets: Cell[][] = Array.from({ length: N_BUCKETS }, () => []);

// Pre-built fillStyle strings so no string work happens inside the draw loop.
const LIGHT_STYLES = Array.from({ length: N_BUCKETS }, (_, b) => {
  const a = ((b + 0.5) / N_BUCKETS) * 0.20;
  return `rgba(252,240,218,${a.toFixed(3)})`;
});
const DARK_STYLES = Array.from({ length: N_BUCKETS }, (_, b) => {
  const a = ((b + 0.5) / N_BUCKETS) * 0.26;
  return `rgba(0,0,0,${a.toFixed(3)})`;
});

export default function BinaryShade() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const cv = canvas;
    const cx = ctx;
    let w = 0, h = 0, cols = 0, rows = 0;
    let raf: number;

    function resize() {
      w = cv.width = window.innerWidth;
      h = cv.height = window.innerHeight;
      cols = Math.ceil(w / FS) + 1;
      rows = Math.ceil(h / FS) + 1;
    }

    resize();
    window.addEventListener("resize", resize);

    cx.font = `${FS}px monospace`;
    cx.textBaseline = "top";

    let lastT = 0;
    let startT = -1;
    const FILL_DURATION = 2200; // ms — how long the diagonal sweep takes

    function draw(t: number) {
      raf = requestAnimationFrame(draw);
      // ~12 fps — the waves are slow, nobody notices the difference.
      if (t - lastT < 82) return;
      lastT = t;

      if (startT < 0) startT = t;
      const progress = Math.min(1, (t - startT) / FILL_DURATION);

      cx.clearRect(0, 0, w, h);
      cx.font = `${FS}px monospace`;
      cx.textBaseline = "top";

      const ts = t * 0.00022;

      // --- Pass 1: compute waves, slot cells into buckets (no fillStyle calls) ---
      for (let r = 0; r < rows; r++) {
        const ny = r / rows;
        for (let c = 0; c < cols; c++) {
          const nx = c / cols;

          // Diagonal fill-in: soft edge sweeps top-left → bottom-right.
          // reveal=0 (not yet reached) → 1 (fully in) over a 0.18-wide frontier.
          const diag = (nx + ny) / 2;
          const reveal = progress >= 1 ? 1 : Math.max(0, Math.min(1, (progress - diag) / 0.06 + 1));
          if (reveal === 0) continue;

          const wave =
            Math.sin(nx * 3.1 + ts * 0.9) * 0.28 +
            Math.sin(ny * 2.7 - ts * 0.7) * 0.28 +
            Math.sin((nx + ny) * 4.4 + ts * 0.4) * 0.22 +
            Math.sin((nx * 1.6 - ny * 2.3) * 3.2 - ts * 0.5) * 0.22;

          const w = wave * reveal;
          if (w > 0.08) {
            const bi = Math.min(N_BUCKETS - 1, Math.floor((w - 0.08) / 0.92 * N_BUCKETS));
            lightBuckets[bi].push({ x: c * FS, y: r * FS, ch: cellChar(c, r) });
          } else if (w < -0.08) {
            const bi = Math.min(N_BUCKETS - 1, Math.floor((-w - 0.08) / 0.92 * N_BUCKETS));
            darkBuckets[bi].push({ x: c * FS, y: r * FS, ch: cellChar(c, r) });
          }
        }
      }

      // --- Pass 2: draw each bucket with a single fillStyle change per bucket ---
      for (let b = 0; b < N_BUCKETS; b++) {
        const lb = lightBuckets[b];
        if (lb.length) {
          cx.fillStyle = LIGHT_STYLES[b];
          for (let i = 0; i < lb.length; i++) cx.fillText(lb[i].ch, lb[i].x, lb[i].y);
          lb.length = 0;
        }
        const db = darkBuckets[b];
        if (db.length) {
          cx.fillStyle = DARK_STYLES[b];
          for (let i = 0; i < db.length; i++) cx.fillText(db[i].ch, db[i].x, db[i].y);
          db.length = 0;
        }
      }
    }

    raf = requestAnimationFrame(draw);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return <canvas ref={canvasRef} className="xp-binary" aria-hidden="true" />;
}
