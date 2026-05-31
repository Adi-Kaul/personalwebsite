import { CSSProperties, useEffect, useRef } from "react";

const PRESET = {
  bg: [5, 35, 55],
  stops: [
    [5, 35, 55],
    [8, 55, 85],
    [15, 90, 130],
    [20, 130, 170],
    [30, 165, 200],
    [60, 195, 220],
    [120, 220, 235]
  ],
  speed: 0.91,
  scale: 1.4,
  voids: 0.05,
  grain: 0.7
};

const FRAME_INTERVAL = 1000 / 24;
const DESKTOP_STEP = 8;
const MOBILE_STEP = 10;

const sharedGradientClock = {
  time: 0,
  lastAdvanceAt: 0
};

function seededRandom(seed: number) {
  const next = Math.sin(seed) * 10000;
  return next - Math.floor(next);
}

function createPermutation() {
  const permutation = new Uint8Array(512);
  const shuffled = new Uint8Array(256);
  for (let i = 0; i < 256; i += 1) {
    shuffled[i] = i;
  }

  for (let i = 255; i > 0; i -= 1) {
    const j = (seededRandom(i * 17.17) * (i + 1)) | 0;
    const tmp = shuffled[i];
    shuffled[i] = shuffled[j];
    shuffled[j] = tmp;
  }

  for (let i = 0; i < 512; i += 1) {
    permutation[i] = shuffled[i & 255];
  }

  return permutation;
}

const PERMUTATION = createPermutation();

interface SilkGradientProps {
  className?: string;
  style?: CSSProperties;
}

export default function SilkGradient({ style, className }: SilkGradientProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      return undefined;
    }

    const ctx = canvas.getContext("2d");
    if (!ctx) {
      return undefined;
    }

    let width = 1;
    let height = 1;
    let dpr = 1;
    let noiseCanvas: HTMLCanvasElement;
    let offscreenCanvas: HTMLCanvasElement;
    let offscreenContext: CanvasRenderingContext2D | null = null;
    let imageData: ImageData | null = null;
    let frameId = 0;
    let lastFrameTime = 0;
    let hasDrawnFirstFrame = false;
    let isActiveSlide = document.body.dataset.slide !== undefined ? document.body.dataset.slide === "0" : true;
    const reduceMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

    const fade = (value: number) => value * value * value * (value * (value * 6 - 15) + 10);
    const lerp = (a: number, b: number, value: number) => a + (b - a) * value;
    const grad = (hash: number, x: number, y: number) => {
      const variant = hash & 3;
      const u = variant < 2 ? x : y;
      const v = variant < 2 ? y : x;
      return (hash & 1 ? -u : u) + (hash & 2 ? -v : v);
    };

    const noise = (xValue: number, yValue: number) => {
      const xIndex = Math.floor(xValue) & 255;
      const yIndex = Math.floor(yValue) & 255;
      const x = xValue - Math.floor(xValue);
      const y = yValue - Math.floor(yValue);
      const u = fade(x);
      const v = fade(y);
      const a = PERMUTATION[xIndex] + yIndex;
      const b = PERMUTATION[xIndex + 1] + yIndex;

      return lerp(
        lerp(grad(PERMUTATION[a], x, y), grad(PERMUTATION[b], x - 1, y), u),
        lerp(
          grad(PERMUTATION[a + 1], x, y - 1),
          grad(PERMUTATION[b + 1], x - 1, y - 1),
          u
        ),
        v
      );
    };

    const fbm = (x: number, y: number, octaves = 4) => {
      let value = 0;
      let amplitude = 0.5;
      let frequency = 1;
      let max = 0;

      for (let i = 0; i < octaves; i += 1) {
        value += noise(x * frequency, y * frequency) * amplitude;
        max += amplitude;
        amplitude *= 0.5;
        frequency *= 2.1;
      }

      return value / max;
    };

    const lerpColor = (stops: number[][], value: number) => {
      const normalized = Math.max(0, Math.min(1, value));
      const scaled = normalized * (stops.length - 1);
      const index = Math.min(Math.floor(scaled), stops.length - 2);
      const fraction = scaled - index;
      const start = stops[index];
      const end = stops[index + 1];

      return [
        lerp(start[0], end[0], fraction),
        lerp(start[1], end[1], fraction),
        lerp(start[2], end[2], fraction)
      ];
    };

    const buildNoise = () => {
      noiseCanvas = document.createElement("canvas");
      noiseCanvas.width = width;
      noiseCanvas.height = height;

      const noiseContext = noiseCanvas.getContext("2d");
      if (!noiseContext) {
        return;
      }

      const image = noiseContext.createImageData(width, height);
      for (let i = 0; i < image.data.length; i += 4) {
        const pixel = i / 4;
        const x = pixel % width;
        const y = Math.floor(pixel / width);
        const value = (seededRandom((x + 1) * 12.9898 + (y + 1) * 78.233) * 255) | 0;
        image.data[i] = value;
        image.data[i + 1] = value;
        image.data[i + 2] = value;
        image.data[i + 3] = 255;
      }
      noiseContext.putImageData(image, 0, 0);
    };

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      const rect = canvas.getBoundingClientRect();
      width = Math.max(1, Math.floor(rect.width));
      height = Math.max(1, Math.floor(rect.height));
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const step = width < 768 ? MOBILE_STEP : DESKTOP_STEP;
      offscreenCanvas = document.createElement("canvas");
      offscreenCanvas.width = Math.ceil(width / step);
      offscreenCanvas.height = Math.ceil(height / step);
      offscreenContext = offscreenCanvas.getContext("2d");
      imageData = offscreenContext?.createImageData(offscreenCanvas.width, offscreenCanvas.height) ?? null;
      buildNoise();
    };

    const draw = (now = 0) => {
      if (!isActiveSlide) {
        frameId = requestAnimationFrame(draw);
        return;
      }

      if (now - lastFrameTime < FRAME_INTERVAL) {
        frameId = requestAnimationFrame(draw);
        return;
      }
      lastFrameTime = now;

      if (!reduceMotionQuery.matches && now - sharedGradientClock.lastAdvanceAt >= FRAME_INTERVAL) {
        sharedGradientClock.time += 0.007 * PRESET.speed;
        sharedGradientClock.lastAdvanceAt = now;
      }

      if (!offscreenContext || !noiseCanvas || !imageData) {
        frameId = requestAnimationFrame(draw);
        return;
      }

      const time = sharedGradientClock.time;
      const scale = PRESET.scale;
      const imageWidth = offscreenCanvas.width;
      const imageHeight = offscreenCanvas.height;
      const data = imageData.data;
      const bg = PRESET.bg;

      for (let py = 0; py < imageHeight; py += 1) {
        for (let px = 0; px < imageWidth; px += 1) {
          const nx = px / imageWidth;
          const ny = py / imageHeight;
          let cx = 0;
          let cy = 0;

          cx += noise(nx * scale + time * 0.3, ny * scale + time * 0.2) * 1;
          cx += noise(nx * scale * 2 + time * 0.5 + 3.1, ny * scale * 2 - time * 0.3 + 1.7) * 0.5;
          cx += noise(nx * scale * 4 - time * 0.4 + 7.3, ny * scale * 4 + time * 0.35 + 2.9) * 0.25;
          cy += noise(nx * scale + 1.7 + time * 0.25, ny * scale + 9.3 - time * 0.2) * 1;
          cy += noise(nx * scale * 2 + 8.1 - time * 0.4, ny * scale * 2 + 4.2 + time * 0.3) * 0.5;
          cy += noise(nx * scale * 4 + 5.7 + time * 0.35, ny * scale * 4 - 2.1 - time * 0.4) * 0.25;

          const bandValue = fbm(nx + cx * 0.55 + time * 0.12, ny + cy * 0.55 + time * 0.1);
          const value = bandValue * 0.5 + 0.5;
          const voidNoise = noise(nx * scale * 1.5 + time * 0.18 + 13.7, ny * scale * 1.5 - time * 0.14 + 6.2);
          const darkness = Math.max(0, -voidNoise - 0.3) * PRESET.voids * 2.5;
          const brightness = 1 - darkness;
          const color = lerpColor(PRESET.stops, value);
          const index = (py * imageWidth + px) * 4;

          data[index] = Math.min(255, color[0] * brightness + bg[0] * (1 - brightness)) | 0;
          data[index + 1] = Math.min(255, color[1] * brightness + bg[1] * (1 - brightness)) | 0;
          data[index + 2] = Math.min(255, color[2] * brightness + bg[2] * (1 - brightness)) | 0;
          data[index + 3] = 255;
        }
      }

      offscreenContext.putImageData(imageData, 0, 0);
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = "medium";
      ctx.drawImage(offscreenCanvas, 0, 0, width, height);
      ctx.globalAlpha = PRESET.grain * 0.18;
      ctx.drawImage(noiseCanvas, 0, 0);
      ctx.globalAlpha = 1;

      if (!hasDrawnFirstFrame) {
        hasDrawnFirstFrame = true;
        canvas.classList.add("is-ready");
        window.dispatchEvent(new Event("silk-gradient:ready"));
      }

      frameId = requestAnimationFrame(draw);
    };

    resize();
    const slideObserver = new MutationObserver(() => {
      isActiveSlide = document.body.dataset.slide === "0";
      lastFrameTime = 0;
    });
    slideObserver.observe(document.body, {
      attributes: true,
      attributeFilter: ["data-slide"]
    });
    draw(FRAME_INTERVAL);
    window.addEventListener("resize", resize);

    return () => {
      cancelAnimationFrame(frameId);
      slideObserver.disconnect();
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className={className}
      style={{ display: "block", width: "100%", height: "100%", ...style }}
      aria-hidden="true"
    />
  );
}
