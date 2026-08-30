"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeHighlight from "rehype-highlight";
import rehypeKatex from "rehype-katex";
import rehypeSlug from "rehype-slug";
import { prepareBlogContent, type BlogFormat } from "@/lib/blog-content";
import rehypeCallouts from "@/lib/rehype-callouts";

export default function BlogContent({
  content,
  format = "md",
}: {
  content: string;
  format?: BlogFormat;
}) {
  const preparedContent = prepareBlogContent(content, format);

  return (
    <div className="prose prose-invert prose-lg max-w-none">
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
                className="text-brand-cyan hover:underline"
                target={external ? "_blank" : undefined}
                rel={external ? "noopener noreferrer" : undefined}
              >
                {children}
              </a>
            );
          },
          ul: ({ children }) => (
            <ul className="list-disc list-inside text-gray-300 mb-4 space-y-1">{children}</ul>
          ),
          ol: ({ children }) => (
            <ol className="list-decimal list-inside text-gray-300 mb-4 space-y-1">{children}</ol>
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
          pre: ({ children }) => (
            <pre className="bg-surface-950 border border-white/10 rounded-xl p-4 overflow-x-auto mb-4 text-sm">
              {children}
            </pre>
          ),
          table: ({ children }) => (
            <div className="overflow-x-auto mb-4">
              <table className="w-full text-sm border-collapse">{children}</table>
            </div>
          ),
          th: ({ children }) => (
            <th className="border border-white/10 px-4 py-2 text-left bg-white/5 font-medium">{children}</th>
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
