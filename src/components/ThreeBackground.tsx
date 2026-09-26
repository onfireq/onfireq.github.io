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
    let inView = true, contextLost = false, disposed = false;
    let compiled = false, warmed = false, revealed = false;
    let width = 0, height = 0, pixelRatio = 0, generation = 0, pendingCompiles = 0;

    function draw() { if (!contextLost && !disposed) renderer.render(model.scene, model.camera); }
    function resize() {
      const nextWidth = host.clientWidth, nextHeight = host.clientHeight;
      const nextRatio = Math.min(window.devicePixelRatio || 1, 2);
      if (!nextWidth || !nextHeight || contextLost || disposed) return;
      if (width === nextWidth && height === nextHeight && pixelRatio === nextRatio) return;
      width = nextWidth; height = nextHeight; pixelRatio = nextRatio;
      // One drawing-buffer allocation, rather than setPixelRatio() followed by
      // setSize(), which each resize the underlying canvas.
      renderer.setDrawingBufferSize(width, height, pixelRatio);
      model.camera.aspect = width / height;
      model.camera.updateProjectionMatrix();
      if (compiled && warmed) draw();
      updatePlayback();
    }
    function tick(now: number) {
      request = null;
      // Compile first, then upload geometry/draw while the matching still is
      // visible. Reveal on the following frame, before advancing the clock.
      if (!warmed) {
        draw();
        warmed = true;
        request = requestAnimationFrame(tick);
        return;
      }
      if (!revealed) { revealed = true; onReady(); }
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
      if (compiled && width && height && inView && !document.hidden && !contextLost && !disposed) {
        request = requestAnimationFrame(tick);
      }
    }
    function disposeResources() { model.dispose(); renderer.dispose(); }
    async function prepare() {
      const current = ++generation;
      compiled = false; warmed = false; revealed = false;
      updatePlayback();
      pendingCompiles++;
      try {
        await renderer.compileAsync(model.scene, model.camera);
        if (disposed || contextLost || current !== generation) return;
        compiled = true;
        updatePlayback();
      } catch {
        if (!disposed && current === generation) onUnavailable();
      } finally {
        pendingCompiles--;
        // Three's async compiler still accesses its material/program cache
        // while polling. Don't destroy that cache until it has settled.
        if (disposed && pendingCompiles === 0) disposeResources();
      }
    }
    function lost(event: Event) {
      event.preventDefault();
      contextLost = true;
      compiled = false; warmed = false; revealed = false;
      generation++;
      onUnavailable();
      updatePlayback();
    }
    function restored() {
      contextLost = false;
      width = 0; height = 0; pixelRatio = 0;
      resize();
      void prepare();
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
      if (compiled && warmed) draw();
    });
    theme.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
    surface.addEventListener("webglcontextlost", lost);
    surface.addEventListener("webglcontextrestored", restored);
    document.addEventListener("visibilitychange", updatePlayback);
    window.addEventListener("resize", resize);
    void prepare();
    return () => {
      disposed = true;
      generation++;
      if (request !== null) cancelAnimationFrame(request);
      sizes.disconnect(); visibility.disconnect(); theme.disconnect();
      surface.removeEventListener("webglcontextlost", lost);
      surface.removeEventListener("webglcontextrestored", restored);
      document.removeEventListener("visibilitychange", updatePlayback);
      window.removeEventListener("resize", resize);
      if (pendingCompiles === 0) disposeResources();
    };
  }, [onReady, onUnavailable]);

  return <canvas ref={canvas} style={{ width: "100%", height: "100%", display: "block" }} />;
}
