"use client";

import { useEffect, useRef } from "react";
import type { HeroState, createHeroRenderer } from "@/lib/hero-renderer";

export default function ThreeBackground({ active, onReady, onUnavailable }: {
  active: boolean; onReady: () => void; onUnavailable: () => void;
}) {
  const container = useRef<HTMLDivElement>(null);
  const activeRef = useRef(active);
  const syncRef = useRef<(() => void) | null>(null);
  useEffect(() => { activeRef.current = active; syncRef.current?.(); }, [active]);

  useEffect(() => {
    const host = container.current!;
    let disposed = false, inView = true, fallback = false;
    let worker: Worker | undefined;
    let main: ReturnType<typeof createHeroRenderer> | undefined;
    let startupTimer: ReturnType<typeof setTimeout> | undefined;
    let surface: HTMLCanvasElement;
    const getState = (): HeroState => ({
      width: host.clientWidth, height: host.clientHeight,
      pixelRatio: Math.min(window.devicePixelRatio || 1, 2),
      light: document.documentElement.dataset.theme === "light",
      visible: inView && !document.hidden, active: activeRef.current,
    });
    function freshCanvas() {
      // A transferred canvas cannot be reused, including after StrictMode cleanup.
      surface = document.createElement("canvas");
      surface.style.cssText = "width:100%;height:100%;display:block";
      host.replaceChildren(surface);
    }
    async function startMainThread() {
      if (disposed || fallback) return;
      fallback = true;
      clearTimeout(startupTimer);
      worker?.terminate(); worker = undefined;
      onUnavailable();
      freshCanvas();
      host.dataset.renderThread = "main";
      try {
        // Only load Three.js on the main thread when compatibility requires it.
        const { createHeroRenderer } = await import("@/lib/hero-renderer");
        if (disposed) return;
        main = createHeroRenderer(surface, getState(), { onReady, onUnavailable, onError: onUnavailable });
      } catch { if (!disposed) onUnavailable(); }
    }
    function sync() {
      if (disposed) return;
      const state = getState();
      if (worker) {
        try { worker.postMessage({ type: "state", state }); }
        catch { void startMainThread(); }
      } else main?.update(state);
    }
    syncRef.current = sync;
    freshCanvas();
    if (typeof Worker !== "undefined" && typeof surface!.transferControlToOffscreen === "function") {
      try {
        worker = new Worker(new URL("../lib/hero-worker.ts", import.meta.url), { type: "module" });
        worker.onmessage = (event: MessageEvent<{ type: string }>) => {
          if (disposed || fallback) return;
          if (event.data.type === "initialized") clearTimeout(startupTimer);
          if (event.data.type === "ready") onReady();
          if (event.data.type === "unavailable") onUnavailable();
          if (event.data.type === "error") void startMainThread();
        };
        worker.onerror = () => { void startMainThread(); };
        worker.onmessageerror = () => { void startMainThread(); };
        const offscreen = surface!.transferControlToOffscreen();
        worker.postMessage({ type: "init", canvas: offscreen, state: getState() }, [offscreen]);
        host.dataset.renderThread = "worker";
        // Initialized is sent before playback, so hidden tabs don't time out.
        startupTimer = setTimeout(() => { void startMainThread(); }, 15000);
      } catch { void startMainThread(); }
    } else void startMainThread();

    const sizes = new ResizeObserver(sync);
    sizes.observe(host);
    const visibility = new IntersectionObserver(([entry]) => { inView = entry.isIntersecting; sync(); });
    visibility.observe(host);
    const theme = new MutationObserver(sync);
    theme.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
    document.addEventListener("visibilitychange", sync);
    window.addEventListener("resize", sync);
    return () => {
      disposed = true;
      syncRef.current = null;
      clearTimeout(startupTimer);
      sizes.disconnect(); visibility.disconnect(); theme.disconnect();
      document.removeEventListener("visibilitychange", sync);
      window.removeEventListener("resize", sync);
      worker?.terminate();
      main?.dispose();
      host.replaceChildren();
    };
  }, [onReady, onUnavailable]);

  return <div ref={container} style={{ width: "100%", height: "100%" }} />;
}
