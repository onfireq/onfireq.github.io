"use client";

import { Children, isValidElement, useEffect, useState, type ReactNode } from "react";
import { HiCheck, HiClipboardCopy, HiExclamation } from "react-icons/hi";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeHighlight from "rehype-highlight";
import rehypeKatex from "rehype-katex";
import rehypeSlug from "rehype-slug";
import { prepareBlogContent, type BlogFormat } from "@/lib/blog-content";
import rehypeCallouts from "@/lib/rehype-callouts";

type CopyStatus = "idle" | "copied" | "error";

const languageLabels: Record<string, string> = {
  bash: "Bash",
  c: "C",
  console: "终端",
  cpp: "C++",
  css: "CSS",
  html: "HTML",
  javascript: "JavaScript",
  js: "JavaScript",
  json: "JSON",
  jsx: "JSX",
  markdown: "Markdown",
  md: "Markdown",
  powershell: "PowerShell",
  plaintext: "文本",
  python: "Python",
  py: "Python",
  sh: "Shell",
  shell: "Shell",
  terminal: "终端",
  text: "文本",
  ts: "TypeScript",
  tsx: "TSX",
  typescript: "TypeScript",
  verilog: "Verilog",
  yaml: "YAML",
  yml: "YAML",
};

const displayMathOpenMarker = "\uE000BLOG_DISPLAY_MATH_OPEN\uE000";
const displayMathCloseMarker = "\uE000BLOG_DISPLAY_MATH_CLOSE\uE000";

function prepareRenderedContent(content: string, format: BlogFormat): string {
  if (format !== "tex") return prepareBlogContent(content, format);

  const markedContent = content
    .replace(/\\\[/g, displayMathOpenMarker)
    .replace(/\\\]/g, displayMathCloseMarker);

  return prepareBlogContent(markedContent, format)
    .replaceAll(displayMathOpenMarker, () => "$$")
    .replaceAll(displayMathCloseMarker, () => "$$");
}

function getTextContent(node: ReactNode): string {
  if (typeof node === "string" || typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(getTextContent).join("");
  if (isValidElement<{ children?: ReactNode }>(node)) return getTextContent(node.props.children);
  return "";
}

function getCodeLanguage(children: ReactNode): string {
  const codeElement = Children.toArray(children).find((child) =>
    isValidElement<{ className?: string }>(child),
  );
  if (!isValidElement<{ className?: string }>(codeElement)) return "";

  return codeElement.props.className?.match(/(?:^|\s)language-([\w+-]+)/)?.[1].toLowerCase() ?? "";
}

function CodeBlock({ children }: { children: ReactNode }) {
  const [copyStatus, setCopyStatus] = useState<CopyStatus>("idle");
  const language = getCodeLanguage(children);
  const languageLabel = languageLabels[language] ?? (language ? language.toUpperCase() : "代码");
  const code = getTextContent(children).replace(/\n$/, "");

  useEffect(() => {
    if (copyStatus === "idle") return;
    const timeout = window.setTimeout(() => setCopyStatus("idle"), 2_000);
    return () => window.clearTimeout(timeout);
  }, [copyStatus]);

  const copyCode = async () => {
    try {
      if (!navigator.clipboard) throw new Error("Clipboard API is unavailable");
      await navigator.clipboard.writeText(code);
      setCopyStatus("copied");
    } catch {
      setCopyStatus("error");
    }
  };

  const statusLabel =
    copyStatus === "copied" ? "已复制" : copyStatus === "error" ? "复制失败" : "复制";

  return (
    <div className="blog-code-block mb-4 overflow-hidden rounded-xl border border-white/10 bg-surface-950">
      <div className="flex min-h-10 items-center justify-between gap-3 border-b border-white/10 bg-white/[0.04] px-3">
        <span className="text-xs font-medium text-gray-400">{languageLabel}</span>
        <button
          type="button"
          onClick={copyCode}
          aria-label={`${statusLabel}${languageLabel}代码`}
          className="inline-flex min-h-9 items-center gap-1.5 rounded-lg px-2.5 text-xs text-gray-300 transition-colors hover:bg-white/10 hover:text-white"
        >
          {copyStatus === "copied" ? (
            <HiCheck size={15} aria-hidden="true" />
          ) : copyStatus === "error" ? (
            <HiExclamation size={15} aria-hidden="true" />
          ) : (
            <HiClipboardCopy size={15} aria-hidden="true" />
          )}
          <span aria-live="polite">{statusLabel}</span>
        </button>
      </div>
      <pre
        tabIndex={0}
        aria-label={`${languageLabel}代码块，可横向滚动`}
        className="overflow-x-auto p-4 text-sm"
      >
        {children}
      </pre>
    </div>
  );
}

export default function BlogContent({
  content,
  format = "md",
}: {
  content: string;
  format?: BlogFormat;
}) {
  const preparedContent = prepareRenderedContent(content, format);

  return (
    <div className="blog-reader prose prose-invert prose-lg max-w-none">
      <ReactMarkdown
        remarkPlugins={[remarkGfm, remarkMath]}
        rehypePlugins={[rehypeSlug, rehypeCallouts, rehypeKatex, rehypeHighlight]}
        components={{
          h1: ({ children, id }) => (
            <h1 id={id} className="scroll-mt-24 text-3xl font-bold mt-8 mb-4 text-gradient">
              {children}
            </h1>
          ),
          h2: ({ children, id }) => (
            <h2
              id={id}
              className="scroll-mt-24 text-2xl font-bold mt-8 mb-3 border-b border-white/10 pb-2"
            >
              {children}
            </h2>
          ),
          h3: ({ children, id }) => (
            <h3 id={id} className="scroll-mt-24 text-xl font-semibold mt-6 mb-2">
              {children}
            </h3>
          ),
          p: ({ children }) => <p className="text-gray-300 leading-relaxed mb-4">{children}</p>,
          a: ({ href, children }) => {
            const external = href?.startsWith("http://") || href?.startsWith("https://");
            return (
              <a
                href={href}
                className="blog-link font-medium underline decoration-current/45 underline-offset-4 transition-colors hover:decoration-current"
                target={external ? "_blank" : undefined}
                rel={external ? "noopener noreferrer" : undefined}
              >
                {children}
                {external && <span className="sr-only">（在新标签页打开）</span>}
              </a>
            );
          },
          ul: ({ children }) => (
            <ul className="mb-4 list-outside list-disc space-y-1 pl-6 text-gray-300">{children}</ul>
          ),
          ol: ({ children }) => (
            <ol className="mb-4 list-outside list-decimal space-y-1 pl-6 text-gray-300">{children}</ol>
          ),
          li: ({ children }) => <li className="text-gray-300">{children}</li>,
          blockquote: ({ children, node }) => {
            const value = node?.properties?.calloutType;
            const calloutType = typeof value === "string" ? value : "";

            const calloutStyles: Record<string, { bg: string; border: string; icon: string }> = {
              tip: { bg: "bg-green-500/10", border: "border-green-500/30", icon: "💡" },
              info: { bg: "bg-blue-500/10", border: "border-blue-500/30", icon: "ℹ️" },
              warning: { bg: "bg-yellow-500/10", border: "border-yellow-500/30", icon: "⚠️" },
              danger: { bg: "bg-red-500/10", border: "border-red-500/30", icon: "🚨" },
              note: { bg: "bg-purple-500/10", border: "border-purple-500/30", icon: "📝" },
            };

            if (calloutType && calloutStyles[calloutType]) {
              const style = calloutStyles[calloutType];
              return (
                <div className={`${style.bg} border ${style.border} rounded-xl p-4 my-4`}>
                  <div className="flex items-start gap-2">
                    <span className="text-lg mt-0.5" aria-hidden="true">
                      {style.icon}
                    </span>
                    <div className="text-sm text-gray-300 [&>p:last-child]:mb-0">{children}</div>
                  </div>
                </div>
              );
            }

            return (
              <blockquote className="border-l-4 border-brand-purple/40 pl-4 my-4 text-gray-400 italic">
                {children}
              </blockquote>
            );
          },
          code: ({ className, children, ...props }) => {
            const isInline = !className;
            if (isInline) {
              return (
                <code className="bg-white/10 px-1.5 py-0.5 rounded text-brand-cyan text-sm" {...props}>
                  {children}
                </code>
              );
            }
            return (
              <code className={className} {...props}>
                {children}
              </code>
            );
          },
          pre: ({ children }) => <CodeBlock>{children}</CodeBlock>,
          table: ({ children }) => (
            <div
              role="region"
              aria-label="数据表，可横向滚动"
              tabIndex={0}
              className="mb-4 overflow-x-auto rounded-lg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-cyan"
            >
              <table className="w-full text-sm border-collapse">{children}</table>
            </div>
          ),
          th: ({ children }) => (
            <th scope="col" className="border border-white/10 px-4 py-2 text-left bg-white/5 font-medium">
              {children}
            </th>
          ),
          td: ({ children }) => <td className="border border-white/10 px-4 py-2 text-gray-300">{children}</td>,
          hr: () => <hr className="border-white/10 my-8" />,
          strong: ({ children }) => <strong className="text-white font-semibold">{children}</strong>,
          em: ({ children }) => <em className="text-gray-300 italic">{children}</em>,
        }}
      >
        {preparedContent}
      </ReactMarkdown>
    </div>
  );
}
