"use client";

import JSON5 from "json5";
import { useMemo } from "react";
import WaveDrom, { type WaveDromSource } from "wavedrom";
import darkSkin from "wavedrom/skins/dark.js";
import { useTheme } from "@/components/ThemeProvider";

function parseWaveDromSource(source: string): WaveDromSource {
  const parsed: unknown = JSON5.parse(source);

  if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
    throw new Error("WaveJSON 顶层必须是一个对象");
  }

  const diagram = parsed as WaveDromSource;
  if (!("signal" in diagram) && !("assign" in diagram) && !("reg" in diagram)) {
    throw new Error("需要提供 signal、assign 或 reg 数据");
  }
  if ("signal" in diagram && !Array.isArray(diagram.signal)) {
    throw new Error("signal 必须是一个数组");
  }
  if ("assign" in diagram && !Array.isArray(diagram.assign)) {
    throw new Error("assign 必须是一个数组");
  }

  return diagram;
}

function renderWaveDrom(source: string, theme: "dark" | "light") {
  const diagram = parseWaveDromSource(source);
  const skin = theme === "dark" ? darkSkin : WaveDrom.waveSkin;
  const tree = WaveDrom.renderAny(0, diagram, skin);
  const svg = WaveDrom.onml
    .stringify(tree)
    .replace(
      'style="stroke:none;fill:white"',
      theme === "dark"
        ? 'style="stroke:none;fill:#020617"'
        : 'style="stroke:none;fill:white"',
    );
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

export default function WaveDromDiagram({ source }: { source: string }) {
  const { theme } = useTheme();

  const result = useMemo(() => {
    try {
      return { imageUrl: renderWaveDrom(source, theme), error: "" };
    } catch (error) {
      return {
        imageUrl: "",
        error: error instanceof Error ? error.message : "无法解析这段 WaveJSON",
      };
    }
  }, [source, theme]);

  if (result.error) {
    return (
      <figure className="blog-wavedrom blog-wavedrom-error mb-5 overflow-hidden rounded-xl border">
        <figcaption className="blog-wavedrom-header border-b px-4 py-2 text-xs font-medium">
          WaveDrom 渲染失败
        </figcaption>
        <div className="p-4">
          <p className="mb-3 text-sm">{result.error}</p>
          <pre className="overflow-x-auto rounded-lg bg-black/25 p-3 text-xs">
            <code>{source}</code>
          </pre>
        </div>
      </figure>
    );
  }

  return (
    <figure className="blog-wavedrom mb-5 overflow-hidden rounded-xl border">
      <figcaption className="blog-wavedrom-header flex items-center justify-between gap-3 border-b px-4 py-2 text-xs font-medium">
        <span>WaveDrom 时序图</span>
        <span className="opacity-60">WaveJSON</span>
      </figcaption>
      <div
        role="region"
        aria-label="WaveDrom 时序图，可横向滚动"
        tabIndex={0}
        className="blog-wavedrom-canvas overflow-x-auto p-4 focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-brand-cyan sm:p-6"
      >
        <div className="w-max min-w-full">
          {/* The SVG is isolated as an image so WaveJSON cannot inject page markup or styles. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={result.imageUrl}
            alt="WaveDrom 时序图"
            className="blog-wavedrom-image mx-auto block h-auto max-w-none"
          />
        </div>
      </div>
    </figure>
  );
}
