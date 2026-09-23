"use client";

import dynamic from "next/dynamic";
import { Component, useCallback, useEffect, useState, type ReactNode } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { HiArrowDown } from "react-icons/hi";

const ThreeBackground = dynamic(() => import("./ThreeBackground"), {
  ssr: false,
  loading: () => null,
});

class BackgroundBoundary extends Component<
  { children: ReactNode; onUnavailable: () => void },
  { failed: boolean }
> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  componentDidCatch() {
    this.props.onUnavailable();
  }

  render() {
    return this.state.failed ? null : this.props.children;
  }
}

export default function HeroSection() {
  const reduceMotion = useReducedMotion();
  const [background, setBackground] = useState<"loading" | "ready" | "fallback">("loading");
  const onReady = useCallback(() => {
    setBackground((current) => current === "loading" ? "ready" : current);
  }, []);
  const onUnavailable = useCallback(() => setBackground("fallback"), []);

  useEffect(() => {
    if (background !== "loading") return;
    // Slow downloads or unavailable WebGL must not leave the introduction hidden.
    // Stop mounting the scene on timeout so it cannot pop in after the text.
    const timeout = window.setTimeout(onUnavailable, 5000);
    return () => window.clearTimeout(timeout);
  }, [background, onUnavailable]);

  return (
    <>
      <noscript><style>{"#hero { opacity: 1 !important; }"}</style></noscript>
      <motion.section
        id="hero"
        data-background-state={background}
        initial={{ opacity: 0 }}
        animate={{ opacity: background === "loading" ? 0 : 1 }}
        transition={{ duration: reduceMotion ? 0 : 0.65 }}
        className="relative isolate min-h-screen flex items-center overflow-hidden"
      >
        {background !== "fallback" && (
          <BackgroundBoundary onUnavailable={onUnavailable}>
            <ThreeBackground onReady={onReady} />
          </BackgroundBoundary>
        )}

        {/* Gradient overlays */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full bg-brand-purple/10 blur-[120px]" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full bg-brand-cyan/8 blur-[100px]" />

        <div className="relative max-w-6xl mx-auto px-6 z-10 w-full">
          <div>
            <span className="inline-block px-4 py-1.5 mb-6 text-sm text-brand-purple border border-brand-purple/30 rounded-full bg-brand-purple/10">
              👋 欢迎来到我的主页
            </span>
          </div>

          <h1
            className="text-4xl md:text-6xl lg:text-7xl font-extrabold leading-tight mb-6"
          >
            Hi，我是
            <br />
            <span className="text-gradient">onfireq</span>
          </h1>

          <p
            className="text-gray-400 text-base md:text-lg max-w-xl mb-10 leading-relaxed"
          >
            这里记录我的项目、技术笔记和踩坑过程。
          </p>
        </div>

        {/* Scroll indicator */}
        <a
          href="#home-links"
          aria-label="继续浏览"
          className="absolute bottom-8 left-1/2 -translate-x-1/2 rounded-full p-2"
        >
          <HiArrowDown className="text-brand-purple animate-bounce" size={24} aria-hidden="true" />
        </a>
      </motion.section>
    </>
  );
}
