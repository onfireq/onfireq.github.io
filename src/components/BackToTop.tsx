"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import styles from "./BackToTop.module.css";

export default function BackToTop() {
  const pathname = usePathname();
  const [scroll, setScroll] = useState({ visible: false, progress: 0 });

  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      const root = document.documentElement;
      const distance = Math.max(0, root.scrollHeight - root.clientHeight);
      const top = Math.max(0, window.scrollY);
      const visible = distance > 0 && top > Math.min(240, distance / 2);
      const progress = distance > 0 ? Math.min(1, top / distance) : 0;
      setScroll((previous) =>
        previous.visible === visible && previous.progress === progress
          ? previous
          : { visible, progress },
      );
    };
    const schedule = () => {
      if (!frame) frame = window.requestAnimationFrame(update);
    };

    schedule();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    window.addEventListener("pageshow", schedule);
    // Images, article rendering and filters can change the page length.
    const observer = new ResizeObserver(schedule);
    observer.observe(document.body);
    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      window.removeEventListener("pageshow", schedule);
      observer.disconnect();
    };
  }, [pathname]);

  if (!scroll.visible) return null;

  const returnToTop = () => {
    document.getElementById("main-content")?.focus({ preventScroll: true });
    window.scrollTo({
      top: 0,
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
        ? "instant"
        : "smooth",
    });
  };
  const isBlogList = pathname.replace(/\/$/, "") === "/blog";

  return (
    <button
      type="button"
      aria-label="返回顶部"
      title="返回顶部"
      onClick={returnToTop}
      className={`${styles.button} ${isBlogList ? styles.aboveZhihu : ""}`}
    >
      <svg className={styles.ring} viewBox="0 0 48 48" fill="none" aria-hidden="true">
        <circle className={styles.track} cx="24" cy="24" r="21" strokeWidth="2" />
        <circle
          cx="24"
          cy="24"
          r="21"
          pathLength="1"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeDasharray="1"
          strokeDashoffset={1 - scroll.progress}
          transform="rotate(-90 24 24)"
        />
      </svg>
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M6 5h12M12 20V9m-6 6 6-6 6 6" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </button>
  );
}
