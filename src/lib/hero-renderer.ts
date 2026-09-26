import { WebGLRenderer } from "three";
import { createHeroScene } from "./hero-scene";

export interface HeroState {
  width: number;
  height: number;
  pixelRatio: number;
  light: boolean;
  visible: boolean;
  active: boolean;
}

export interface HeroCallbacks {
  onReady: () => void;
  onUnavailable: () => void;
  onError: () => void;
}

// Shared by the worker and compatibility path. No DOM/React work or messages
// are needed on each animation frame.
export function createHeroRenderer(canvas: HTMLCanvasElement | OffscreenCanvas, initial: HeroState, callbacks: HeroCallbacks) {
  const renderer = new WebGLRenderer({ canvas, antialias: true, alpha: true });
  const model = createHeroScene(initial.light);
  renderer.setClearColor(0x000000, 0);
  let state = { ...initial };
  let elapsed = 0, previous: number | null = null, request: number | null = null;
  let disposed = false, contextLost = false, failed = false;
  let compiled = false, warmed = false, revealed = false;
  let generation = 0, pendingCompiles = 0;

  function draw() { renderer.render(model.scene, model.camera); }
  function resize() {
    if (state.width <= 0 || state.height <= 0 || contextLost) return;
    renderer.setDrawingBufferSize(state.width, state.height, state.pixelRatio);
    model.camera.aspect = state.width / state.height;
    model.camera.updateProjectionMatrix();
  }
  function fail() {
    failed = true;
    updatePlayback();
    callbacks.onError();
  }
  function tick(now: number) {
    request = null;
    try {
      if (!warmed) {
        draw();
        warmed = true;
      } else {
        if (!revealed) { revealed = true; callbacks.onReady(); }
        if (state.active) {
          if (previous !== null) elapsed += Math.min((now - previous) / 1000, 0.05);
          previous = now;
          model.setTime(elapsed);
          draw();
        } else previous = null;
      }
      request = requestAnimationFrame(tick);
    } catch { fail(); }
  }
  function updatePlayback() {
    if (request !== null) cancelAnimationFrame(request);
    request = null;
    previous = null;
    if (compiled && state.width > 0 && state.height > 0 && state.visible && !contextLost && !disposed && !failed) {
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
      if (!disposed && current === generation) fail();
    } finally {
      pendingCompiles--;
      // compileAsync polls Three's program cache; release it after polling ends.
      if (disposed && pendingCompiles === 0) disposeResources();
    }
  }
  function lost(event: Event) {
    event.preventDefault();
    contextLost = true;
    compiled = false; warmed = false; revealed = false;
    generation++;
    callbacks.onUnavailable();
    updatePlayback();
  }
  function restored() {
    contextLost = false;
    resize();
    void prepare();
  }
  // WebGL uses these events on both HTMLCanvasElement and OffscreenCanvas.
  const lostEvent = "webglcontextlost";
  const restoredEvent = "webglcontextrestored";
  canvas.addEventListener(lostEvent, lost);
  canvas.addEventListener(restoredEvent, restored);
  resize();
  void prepare();

  return {
    update(next: HeroState) {
      if (disposed || failed) return;
      const sizeChanged = state.width !== next.width || state.height !== next.height || state.pixelRatio !== next.pixelRatio;
      const themeChanged = state.light !== next.light;
      const playbackChanged = state.visible !== next.visible || state.active !== next.active || sizeChanged;
      state = { ...next };
      try {
        if (sizeChanged) resize();
        if (themeChanged) model.setTheme(state.light);
        if ((sizeChanged || themeChanged) && compiled && warmed && !contextLost) draw();
        if (playbackChanged) updatePlayback();
      } catch { fail(); }
    },
    dispose() {
      if (disposed) return;
      disposed = true;
      generation++;
      updatePlayback();
      canvas.removeEventListener(lostEvent, lost);
      canvas.removeEventListener(restoredEvent, restored);
      if (pendingCompiles === 0) disposeResources();
    },
  };
}
