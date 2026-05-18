import { CSSProperties, useEffect, useRef } from "react";

const PRESET = {
  bg: [28, 10, 52],
  ringColor: [220, 100, 200],
  speed: 0.25,
  scale: 1.4,
  grain: 0.7,
  ringFreq: 2.8,
  ringWidth: 0.55,
  warpAmt: 0.18
};

const AMBIENT = [
  { x: 0.25, y: 0.3, phase: 0 },
  { x: 0.75, y: 0.25, phase: 2.2 },
  { x: 0.2, y: 0.75, phase: 4.1 },
  { x: 0.78, y: 0.72, phase: 1.4 }
];

const FRAME_INTERVAL = 1000 / 12;
const DESKTOP_STEP = 18;
const MOBILE_STEP = 20;

const sharedRingsClock = {
  time: 0,
  lastAdvanceAt: 0
};

function seededRandom(seed: number) {
  const next = Math.sin(seed) * 10000;
  return next - Math.floor(next);
}

function createPermutation(seedOffset: number) {
  const permutation = new Uint8Array(512);
  const shuffled = new Uint8Array(256);
  for (let i = 0; i < 256; i += 1) {
    shuffled[i] = i;
  }

  for (let i = 255; i > 0; i -= 1) {
    const j = (seededRandom(i * 23.37 + seedOffset) * (i + 1)) | 0;
    const tmp = shuffled[i];
    shuffled[i] = shuffled[j];
    shuffled[j] = tmp;
  }

  for (let i = 0; i < 512; i += 1) {
    permutation[i] = shuffled[i & 255];
  }

  return permutation;
}

const PERMUTATION = createPermutation(91.4);

interface SilkRingsInteractiveProps {
  className?: string;
  style?: CSSProperties;
}

export default function SilkRingsInteractive({ className, style }: SilkRingsInteractiveProps) {
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
    let noiseCanvas: HTMLCanvasElement;
    let offscreenCanvas: HTMLCanvasElement;
    let offscreenContext: CanvasRenderingContext2D | null = null;
    let imageData: ImageData | null = null;
    let frameId = 0;
    let lastFrameAt = 0;
    let isRunning = false;
    let isActiveSlide = document.body.dataset.slide === "1";
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
        const value = (seededRandom((x + 1) * 36.17 + (y + 1) * 81.91) * 255) | 0;
        image.data[i] = value;
        image.data[i + 1] = value;
        image.data[i + 2] = value;
        image.data[i + 3] = 255;
      }
      noiseContext.putImageData(image, 0, 0);
    };

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
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
      lastFrameAt = 0;
    };

    const drawFrame = (now = 0) => {
      if (!isActiveSlide || !isRunning) {
        return;
      }

      if (now - lastFrameAt < FRAME_INTERVAL) {
        frameId = requestAnimationFrame(drawFrame);
        return;
      }
      lastFrameAt = now;

      if (!offscreenContext || !noiseCanvas || !imageData) {
        frameId = requestAnimationFrame(drawFrame);
        return;
      }

      if (!reduceMotionQuery.matches && now - sharedRingsClock.lastAdvanceAt >= FRAME_INTERVAL) {
        sharedRingsClock.time += 0.008 * PRESET.speed;
        sharedRingsClock.lastAdvanceAt = now;
      }

      const time = sharedRingsClock.time;
      const scale = PRESET.scale;
      const imageWidth = offscreenCanvas.width;
      const imageHeight = offscreenCanvas.height;
      const data = imageData.data;
      const bg = PRESET.bg;
      const ringColor = PRESET.ringColor;

      for (let py = 0; py < imageHeight; py += 1) {
        for (let px = 0; px < imageWidth; px += 1) {
          const nx = px / imageWidth;
          const ny = py / imageHeight;
          let wx =
            noise(nx * scale + time * 0.3, ny * scale + time * 0.2) +
            noise(nx * scale * 2 + time * 0.5 + 3.1, ny * scale * 2 - time * 0.3 + 1.7) * 0.5 +
            noise(nx * scale * 4 - time * 0.4 + 7.3, ny * scale * 4 + time * 0.35 + 2.9) * 0.25;
          let wy =
            noise(nx * scale + 1.7 + time * 0.25, ny * scale + 9.3 - time * 0.2) +
            noise(nx * scale * 2 + 8.1 - time * 0.4, ny * scale * 2 + 4.2 + time * 0.3) * 0.5 +
            noise(nx * scale * 4 + 5.7 + time * 0.35, ny * scale * 4 - 2.1 - time * 0.4) * 0.25;

          const warpedX = nx + wx * PRESET.warpAmt;
          const warpedY = ny + wy * PRESET.warpAmt;
          let alpha = 0;

          for (let i = 0; i < AMBIENT.length; i += 1) {
            const source = AMBIENT[i];
            const dx = warpedX - source.x;
            const dy = warpedY - source.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            const atten = Math.max(0, 1 - distance * 1.1);
            const raw =
              Math.sin((distance * PRESET.ringFreq - time + source.phase) * Math.PI * 2) * 0.5 + 0.5;
            const ring = Math.pow(raw, 1 / PRESET.ringWidth) * atten;
            alpha = Math.min(1, alpha + ring * 0.65);
          }

          const index = (py * imageWidth + px) * 4;
          data[index] = (bg[0] + (ringColor[0] - bg[0]) * alpha) | 0;
          data[index + 1] = (bg[1] + (ringColor[1] - bg[1]) * alpha) | 0;
          data[index + 2] = (bg[2] + (ringColor[2] - bg[2]) * alpha) | 0;
          data[index + 3] = 255;
        }
      }

      offscreenContext.putImageData(imageData, 0, 0);
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = "medium";
      ctx.drawImage(offscreenCanvas, 0, 0, width, height);
      ctx.globalAlpha = PRESET.grain * 0.16;
      ctx.drawImage(noiseCanvas, 0, 0);
      ctx.globalAlpha = 1;

      if (reduceMotionQuery.matches) {
        isRunning = false;
        return;
      }

      frameId = requestAnimationFrame(drawFrame);
    };

    const start = () => {
      if (isRunning) {
        return;
      }

      isRunning = true;
      frameId = requestAnimationFrame(drawFrame);
    };

    const stop = () => {
      isRunning = false;
      cancelAnimationFrame(frameId);
    };

    resize();
    if (isActiveSlide) {
      start();
    }

    const slideObserver = new MutationObserver(() => {
      const nextActive = document.body.dataset.slide === "1";
      if (nextActive === isActiveSlide) {
        return;
      }

      isActiveSlide = nextActive;
      lastFrameAt = 0;
      if (isActiveSlide) {
        start();
      } else {
        stop();
      }
    });

    slideObserver.observe(document.body, {
      attributes: true,
      attributeFilter: ["data-slide"]
    });
    window.addEventListener("resize", resize);

    return () => {
      stop();
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
