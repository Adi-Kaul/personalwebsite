import { CSSProperties, useEffect, useRef } from "react";
import * as THREE from "three";

interface ProjectCubeProps {
  className?: string;
  style?: CSSProperties;
}

export default function ProjectCube({ className, style }: ProjectCubeProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      return undefined;
    }

    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setClearColor(0x000000, 0);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
    camera.position.set(0, 0, 4.85);

    const materials = Array.from(
      { length: 6 },
      () =>
        new THREE.MeshBasicMaterial({
          color: 0xadadad
        })
    );

    const cubeSize = 1.76;
    const cubeGeometry = new THREE.BoxGeometry(cubeSize, cubeSize, cubeSize);
    const cube = new THREE.Mesh(cubeGeometry, materials);
    const gridPositions: number[] = [];
    const half = cubeSize / 2;
    const surfaceOffset = 0.004;
    const gridDivisions = 5;

    const addLine = (from: [number, number, number], to: [number, number, number]) => {
      gridPositions.push(...from, ...to);
    };

    for (let i = 1; i < gridDivisions; i += 1) {
      const value = -half + (cubeSize * i) / gridDivisions;
      const front = half + surfaceOffset;
      const back = -half - surfaceOffset;

      addLine([value, -half, front], [value, half, front]);
      addLine([-half, value, front], [half, value, front]);
      addLine([value, -half, back], [value, half, back]);
      addLine([-half, value, back], [half, value, back]);

      addLine([front, value, -half], [front, value, half]);
      addLine([front, -half, value], [front, half, value]);
      addLine([back, value, -half], [back, value, half]);
      addLine([back, -half, value], [back, half, value]);

      addLine([value, front, -half], [value, front, half]);
      addLine([-half, front, value], [half, front, value]);
      addLine([value, back, -half], [value, back, half]);
      addLine([-half, back, value], [half, back, value]);
    }

    const gridGeometry = new THREE.BufferGeometry();
    gridGeometry.setAttribute("position", new THREE.Float32BufferAttribute(gridPositions, 3));
    const gridMaterial = new THREE.LineBasicMaterial({
      color: 0xfdf0da,
      transparent: true,
      opacity: 0.16
    });
    const faceGrid = new THREE.LineSegments(gridGeometry, gridMaterial);
    const wireGeometry = new THREE.EdgesGeometry(cubeGeometry);
    const wireMaterial = new THREE.LineBasicMaterial({
      color: 0xfdf0da,
      transparent: true,
      opacity: 0.34
    });
    const wireframe = new THREE.LineSegments(wireGeometry, wireMaterial);

    const inner = new THREE.Group();
    inner.rotation.z = Math.PI / 4;
    inner.rotation.x = Math.atan(1 / Math.sqrt(2));
    inner.add(cube);
    inner.add(faceGrid);
    inner.add(wireframe);

    const outer = new THREE.Group();
    outer.add(inner);
    scene.add(outer);

    const glowMaterial = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.07,
      side: THREE.BackSide
    });
    const outerGlowMaterial = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.04,
      side: THREE.BackSide
    });
    inner.add(new THREE.Mesh(new THREE.BoxGeometry(1.7, 1.7, 1.7), glowMaterial));
    inner.add(new THREE.Mesh(new THREE.BoxGeometry(1.92, 1.92, 1.92), outerGlowMaterial));

    let frameId = 0;
    let isDragging = false;
    let previousX = 0;
    let previousY = 0;
    let velocityX = 0;
    let velocityY = 0;
    let lastTime = performance.now();
    let isActiveSlide = document.body.dataset.slide === "1";
    const reduceMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const width = Math.max(1, Math.floor(rect.width));
      const height = Math.max(1, Math.floor(rect.height));
      renderer.setSize(width, height, false);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
    };

    const render = (now: number) => {
      if (!isActiveSlide) {
        return;
      }

      const delta = Math.min((now - lastTime) / 1000, 0.05);
      lastTime = now;

      if (!isDragging && !reduceMotionQuery.matches) {
        velocityX *= 0.88;
        velocityY *= 0.88;
        outer.rotation.x += velocityX;
        outer.rotation.y += velocityY + 0.4 * delta;
      }

      renderer.render(scene, camera);
      frameId = requestAnimationFrame(render);
    };

    const start = () => {
      cancelAnimationFrame(frameId);
      lastTime = performance.now();
      frameId = requestAnimationFrame(render);
    };

    const stop = () => {
      cancelAnimationFrame(frameId);
      isDragging = false;
    };

    const handlePointerDown = (event: PointerEvent) => {
      if (!isActiveSlide) {
        return;
      }

      isDragging = true;
      previousX = event.clientX;
      previousY = event.clientY;
      velocityX = 0;
      velocityY = 0;
      canvas.setPointerCapture(event.pointerId);
    };

    const handlePointerUp = (event: PointerEvent) => {
      isDragging = false;
      if (canvas.hasPointerCapture(event.pointerId)) {
        canvas.releasePointerCapture(event.pointerId);
      }
    };

    const handlePointerMove = (event: PointerEvent) => {
      if (!isDragging) {
        return;
      }

      velocityX = velocityX * 0.4 + (event.clientY - previousY) * 0.008 * 0.6;
      velocityY = velocityY * 0.4 + (event.clientX - previousX) * 0.008 * 0.6;
      outer.rotation.x += velocityX;
      outer.rotation.y += velocityY;
      previousX = event.clientX;
      previousY = event.clientY;
      renderer.render(scene, camera);
    };

    const slideObserver = new MutationObserver(() => {
      const nextActive = document.body.dataset.slide === "1";
      if (nextActive === isActiveSlide) {
        return;
      }

      isActiveSlide = nextActive;
      if (isActiveSlide) {
        start();
      } else {
        stop();
      }
    });

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(canvas);
    slideObserver.observe(document.body, {
      attributes: true,
      attributeFilter: ["data-slide"]
    });
    canvas.addEventListener("pointerdown", handlePointerDown);
    canvas.addEventListener("pointerup", handlePointerUp);
    canvas.addEventListener("pointercancel", handlePointerUp);
    canvas.addEventListener("pointermove", handlePointerMove);

    resize();
    renderer.render(scene, camera);
    if (isActiveSlide) {
      start();
    }

    return () => {
      stop();
      resizeObserver.disconnect();
      slideObserver.disconnect();
      canvas.removeEventListener("pointerdown", handlePointerDown);
      canvas.removeEventListener("pointerup", handlePointerUp);
      canvas.removeEventListener("pointercancel", handlePointerUp);
      canvas.removeEventListener("pointermove", handlePointerMove);
      materials.forEach((material) => material.dispose());
      cubeGeometry.dispose();
      gridGeometry.dispose();
      gridMaterial.dispose();
      wireGeometry.dispose();
      wireMaterial.dispose();
      glowMaterial.dispose();
      outerGlowMaterial.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className={className}
      style={{ display: "block", width: "100%", height: "100%", ...style }}
      aria-label="Interactive rotating cube"
    />
  );
}
