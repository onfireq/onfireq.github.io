import { createHeroRenderer, type HeroState } from "./hero-renderer";

type Message = { type: "init"; canvas: OffscreenCanvas; state: HeroState }
  | { type: "state"; state: HeroState };

let renderer: ReturnType<typeof createHeroRenderer> | undefined;
const send = (type: "ready" | "unavailable" | "error" | "initialized") => self.postMessage({ type });

self.onmessage = (event: MessageEvent<Message>) => {
  try {
    if (event.data.type === "init") {
      if (typeof requestAnimationFrame !== "function") throw new Error("Worker animation frames unavailable");
      renderer = createHeroRenderer(event.data.canvas, event.data.state, {
        onReady: () => send("ready"),
        onUnavailable: () => send("unavailable"),
        onError: () => send("error"),
      });
      send("initialized");
    } else renderer?.update(event.data.state);
  } catch { send("error"); }
};
