"use client";

import dynamic from "next/dynamic";
import { Component, useCallback, useEffect, useState, type ReactNode } from "react";
import styles from "./HeroBackground.module.css";

const ThreeBackground = dynamic(() => import("./ThreeBackground"), { ssr: false });

class BackgroundBoundary extends Component<{ children: ReactNode; onUnavailable: () => void }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  componentDidCatch() { this.props.onUnavailable(); }
  render() { return this.state.failed ? null : this.props.children; }
}

export default function HeroBackground({ children }: { children: ReactNode }) {
  const [enabled, setEnabled] = useState(false);
  const [ready, setReady] = useState(false);
  const onReady = useCallback(() => setReady(true), []);
  const onUnavailable = useCallback(() => setReady(false), []);
  useEffect(() => {
    if ("requestIdleCallback" in window) {
      const idle = window.requestIdleCallback(() => setEnabled(true), { timeout: 1000 });
      return () => window.cancelIdleCallback(idle);
    }
    const timer = setTimeout(() => setEnabled(true), 0);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className={styles.background} data-renderer="three" data-ready={ready} aria-hidden="true">
      <div className={styles.preview}>{children}</div>
      <div className={styles.scene}>
        {enabled && <BackgroundBoundary onUnavailable={onUnavailable}>
          <ThreeBackground active={ready} onReady={onReady} onUnavailable={onUnavailable} />
        </BackgroundBoundary>}
      </div>
    </div>
  );
}
