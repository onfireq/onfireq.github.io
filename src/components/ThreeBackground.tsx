"use client";

import { useEffect, useRef } from "react";
import { WebGLRenderer } from "three";
import { createHeroScene } from "@/lib/hero-scene";

export default function ThreeBackground({ active, onReady, onUnavailable }: {
  active: boolean; onReady: () => void; onUnavailable: () => void;
}) {
  const canvas = useRef<HTMLCanvasElement>(null);
  const activeRef = useRef(active);
  useEffect(() => { activeRef.current = active; }, [active]);

  useEffect(() => {
    const surface = canvas.current!;
    const host = surface.parentElement!;
    let renderer: WebGLRenderer;
    try {
      renderer = new WebGLRenderer({ canvas: surface, antialias: true, alpha: true });
    } catch {
      onUnavailable();
      return;
    }
    const model = createHeroScene(document.documentElement.dataset.theme === "light");
    renderer.setClearColor(0x000000, 0);
    let elapsed = 0, previous: number | null = null, request: number | null = null;
    let inView = true, contextLost = false;

    function draw() { if (!contextLost) renderer.render(model.scene, model.camera); }
    function resize() {
      const width = host.clientWidth, height = host.clientHeight;
      if (!width || !height || contextLost) return;
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
      renderer.setSize(width, height, false);
      model.camera.aspect = width / height;
      model.camera.updateProjectionMatrix();
      draw();
      onReady();
    }
    function tick(now: number) {
      request = null;
      // Hold the exact initial pose until React has made the WebGL layer visible.
      if (activeRef.current) {
        if (previous !== null) elapsed += Math.min((now - previous)/1000, 0.05);
        previous = now;
        model.setTime(elapsed);
        draw();
      } else previous = null;
      request = requestAnimationFrame(tick);
    }
    function updatePlayback() {
      if (request !== null) cancelAnimationFrame(request);
      request = null;
      previous = null;
      if (inView && !document.hidden && !contextLost) request = requestAnimationFrame(tick);
    }
    function lost(event: Event) {
      event.preventDefault();
      contextLost = true;
      onUnavailable();
      updatePlayback();
    }
    function restored() {
      contextLost = false;
      resize();
      updatePlayback();
    }
    resize();
    const sizes = new ResizeObserver(resize);
    sizes.observe(host);
    const visibility = new IntersectionObserver(([entry]) => {
      inView = entry.isIntersecting;
      updatePlayback();
    });
    visibility.observe(host);
    const theme = new MutationObserver(() => {
      model.setTheme(document.documentElement.dataset.theme === "light");
      draw();
    });
    theme.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
    surface.addEventListener("webglcontextlost", lost);
    surface.addEventListener("webglcontextrestored", restored);
    document.addEventListener("visibilitychange", updatePlayback);
    window.addEventListener("resize", resize);
    updatePlayback();
    return () => {
      if (request !== null) cancelAnimationFrame(request);
      sizes.disconnect(); visibility.disconnect(); theme.disconnect();
      surface.removeEventListener("webglcontextlost", lost);
      surface.removeEventListener("webglcontextrestored", restored);
      document.removeEventListener("visibilitychange", updatePlayback);
      window.removeEventListener("resize", resize);
      model.dispose();
      renderer.dispose();
    };
  }, [onReady, onUnavailable]);

  return <canvas ref={canvas} style={{ width: "100%", height: "100%", display: "block" }} />;
}
