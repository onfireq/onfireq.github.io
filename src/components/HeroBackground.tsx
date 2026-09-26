"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { sceneFrame, type Point } from "@/lib/hero-scene";
import styles from "./HeroBackground.module.css";

export default function HeroBackground({ children }: { children: ReactNode }) {
  const container = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const host = container.current!;
    const surface = canvas.current!;
    const context = surface.getContext("2d");
    if (!context) return; // Keep the exported first frame if Canvas is unavailable.
    const ctx = context;
    let width = 0, height = 0, ratio = 1, elapsed = 0;
    let previous: number | null = null, request: number | null = null;
    let inView = true;
    let palette: string[] = [];

    function readPalette() {
      const css = getComputedStyle(host);
      palette = ["particles", "wire", "ring-0", "ring-1", "ring-2", "ring-3"].map(name => css.getPropertyValue(`--hero-${name}`).trim());
    }

    function path(points: Point[], close = false) {
      points.forEach(([x,y], i) => i ? ctx.lineTo(x,y) : ctx.moveTo(x,y));
      if (close) ctx.closePath();
    }

    function draw() {
      if (!width || !height) return;
      ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
      ctx.clearRect(0, 0, width, height);
      ctx.translate(width/2, height/2);
      ctx.scale(height/1000, height/1000);
      const frame = sceneFrame(elapsed);
      ctx.fillStyle = palette[0];
      ctx.beginPath();
      for (const { point: [x,y], radius } of frame.particles) {
        ctx.moveTo(x + radius, y);
        ctx.arc(x, y, radius, 0, Math.PI*2);
      }
      ctx.fill();
      // Keep a full CSS pixel of coverage, even on shorter viewports.
      // Match the SVG's non-scaling stroke so startup has no thickness change.
      ctx.lineWidth = 1000 / height;
      ctx.strokeStyle = palette[1];
      ctx.beginPath();
      frame.edges.forEach(edge => path(edge));
      ctx.stroke();
      frame.rings.forEach((points, i) => {
        ctx.strokeStyle = palette[i+2];
        ctx.beginPath();
        path(points, true);
        ctx.stroke();
      });
    }

    function resize() {
      width = host.clientWidth;
      height = host.clientHeight;
      ratio = Math.min(window.devicePixelRatio || 1, 2);
      surface.width = Math.round(width * ratio);
      surface.height = Math.round(height * ratio);
      draw(); // Redraw at the same phase; resizing must not restart rotation.
      if (width && height) host.dataset.ready = "true";
    }

    function tick(now: number) {
      request = null;
      if (previous !== null) elapsed += Math.min((now - previous)/1000, 0.05);
      previous = now;
      draw();
      request = requestAnimationFrame(tick);
    }

    function updatePlayback() {
      if (request !== null) cancelAnimationFrame(request);
      request = null;
      previous = null;
      // Resume from the last drawn pose, without counting time spent hidden.
      if (inView && !document.hidden) request = requestAnimationFrame(tick);
    }

    readPalette();
    resize();
    const sizeObserver = new ResizeObserver(resize);
    sizeObserver.observe(host);
    const visibilityObserver = new IntersectionObserver(([entry]) => {
      inView = entry.isIntersecting;
      updatePlayback();
    });
    visibilityObserver.observe(host);
    const themeObserver = new MutationObserver(() => { readPalette(); draw(); });
    themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
    document.addEventListener("visibilitychange", updatePlayback);
    window.addEventListener("resize", resize);
    updatePlayback();
    return () => {
      if (request !== null) cancelAnimationFrame(request);
      sizeObserver.disconnect();
      visibilityObserver.disconnect();
      themeObserver.disconnect();
      document.removeEventListener("visibilitychange", updatePlayback);
      window.removeEventListener("resize", resize);
      delete host.dataset.ready;
    };
  }, []);

  return (
    <div ref={container} className={styles.background} aria-hidden="true">
      <div className={styles.preview}>{children}</div>
      <canvas ref={canvas} className={styles.canvas} />
    </div>
  );
}
