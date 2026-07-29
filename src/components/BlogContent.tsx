"use client";

import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeRaw from "rehype-raw";
import rehypeKatex from "rehype-katex";

export default function BlogContent({ content, format = "md" }: { content: string; format?: "md" | "tex" }) {
  // .tex 文件：将内容包裹在 LaTeX 渲染环境中
  if (format === "tex") {
    // 将 \( \) 转为 $ $，\[ \] 转为 $$ $$
    let texContent = content
      .replace(/\\\(/g, "$")
      .replace(/\\\)/g, "$")
      .replace(/\\\[/g, "$$")
      .replace(/\\\]/g, "$$");
    
    // 将普通文本段落包裹在 Markdown 格式中以便渲染
    // 注意：\begin{pmatrix} 等数学环境保持原样，让 KaTeX 渲染
    texContent = texContent
      .replace(/\\section\{([^}]+)\}/g, "\n## $1\n")
      .replace(/\\subsection\{([^}]+)\}/g, "\n### $1\n")
      .replace(/\\textbf\{([^}]+)\}/g, "**$1**")
      .replace(/\\textit\{([^}]+)\}/g, "*$1*")
      .replace(/\\emph\{([^}]+)\}/g, "*$1*")
      .replace(/\\begin\{itemize\}/g, "")
      .replace(/\\end\{itemize\}/g, "")
      .replace(/\\begin\{enumerate\}/g, "")
      .replace(/\\end\{enumerate\}/g, "")
      .replace(/\\item\s*/g, "- ")
      .replace(/\\\\/g, "\n")
      .replace(/\\newline/g, "\n")
      .replace(/\n{3,}/g, "\n\n")
      .trim();
    
    return (
      <div className="prose prose-invert prose-lg max-w-none">
        <ReactMarkdown
          remarkPlugins={[remarkGfm, remarkMath]}
          rehypePlugins={[rehypeRaw, rehypeKatex]}
          components={{
            h1: ({ children }) => <h1 className="text-3xl font-bold mt-8 mb-4 text-gradient">{children}</h1>,
            h2: ({ children }) => <h2 className="text-2xl font-bold mt-8 mb-3 border-b border-white/10 pb-2">{children}</h2>,
            h3: ({ children }) => <h3 className="text-xl font-semibold mt-6 mb-2">{children}</h3>,
            p: ({ children }) => <p className="text-gray-300 leading-relaxed mb-4">{children}</p>,
            li: ({ children }) => <li className="text-gray-300">{children}</li>,
            code: ({ className, children, ...props }) => {
              const isInline = !className;
              if (isInline) {
                return <code className="bg-white/10 px-1.5 py-0.5 rounded text-brand-cyan text-sm" {...props}>{children}</code>;
              }
              return <code className={className} {...props}>{children}</code>;
            },
            pre: ({ children }) => (
              <pre className="bg-surface-950 border border-white/10 rounded-xl p-4 overflow-x-auto mb-4 text-sm">{children}</pre>
            ),
          }}
        >
          {texContent}
        </ReactMarkdown>
      </div>
    );
  }

  // .md 文件：正常 Markdown 渲染
  return (
    <div className="prose prose-invert prose-lg max-w-none">
      <ReactMarkdown
        remarkPlugins={[remarkGfm, remarkMath]}
        rehypePlugins={[rehypeRaw, rehypeKatex]}
        components={{
          h1: ({ children }) => (
            <h1 className="text-3xl font-bold mt-8 mb-4 text-gradient">{children}</h1>
          ),
          h2: ({ children }) => (
            <h2 className="text-2xl font-bold mt-8 mb-3 border-b border-white/10 pb-2">{children}</h2>
          ),
          h3: ({ children }) => (
            <h3 className="text-xl font-semibold mt-6 mb-2">{children}</h3>
          ),
          p: ({ children }) => (
            <p className="text-gray-300 leading-relaxed mb-4">{children}</p>
          ),
          a: ({ href, children }) => (
            <a href={href} className="text-brand-cyan hover:underline" target="_blank" rel="noopener">
              {children}
            </a>
          ),
          ul: ({ children }) => (
            <ul className="list-disc list-inside text-gray-300 mb-4 space-y-1">{children}</ul>
          ),
          ol: ({ children }) => (
            <ol className="list-decimal list-inside text-gray-300 mb-4 space-y-1">{children}</ol>
          ),
          li: ({ children }) => <li className="text-gray-300">{children}</li>,
          blockquote: ({ children, className, ...props }) => {
            // Parse callout syntax: > [!type]
            const childArray = React.Children.toArray(children);
            let calloutType = "";
            let calloutContent = children;

            if (Array.isArray(childArray) && childArray.length > 0) {
              const firstChild = childArray[0] as React.ReactElement<{ children?: React.ReactNode }>;
              if (firstChild?.props?.children) {
                const text = String(firstChild.props.children);
                const match = text.match(/^\[!(\w+)\]/);
                if (match) {
                  calloutType = match[1].toLowerCase();
                  // Remove the [!type] marker from the first line
                  const remaining = text.replace(/^\[!\w+\]\n?/, "").trim();
                  calloutContent = (
                    <>
                      {remaining && <p className="text-gray-300">{remaining}</p>}
                      {childArray.slice(1)}
                    </>
                  );
                }
              }
            }

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
                    <span className="text-lg mt-0.5">{style.icon}</span>
                    <div className="text-sm text-gray-300">{calloutContent}</div>
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
          td: ({ children }) => (
            <td className="border border-white/10 px-4 py-2 text-gray-300">{children}</td>
          ),
          hr: () => <hr className="border-white/10 my-8" />,
          strong: ({ children }) => (
            <strong className="text-white font-semibold">{children}</strong>
          ),
          em: ({ children }) => (
            <em className="text-gray-300 italic">{children}</em>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
