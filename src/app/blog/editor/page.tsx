"use client";

import { useState, useEffect } from "react";
import { HiDownload, HiPlus, HiTrash } from "react-icons/hi";
import BlogContent from "@/components/BlogContent";

const DEFAULT_TEMPLATE = `---
title: "文章标题"
date: "${new Date().toISOString().slice(0, 10)}"
tags: ["标签"]
description: "文章摘要"
published: true
---

在这里开始写作...

> [!tip]
> 这是一个提示框，支持 tip / info / warning / danger 四种类型
`;

interface Draft {
  id: string;
  filename: string;
  content: string;
  updatedAt: number;
}

function loadDrafts(): Draft[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem("blog-drafts") || "[]");
  } catch {
    return [];
  }
}

function saveDrafts(drafts: Draft[]) {
  localStorage.setItem("blog-drafts", JSON.stringify(drafts));
}

export default function BlogEditor() {
  const [drafts, setDrafts] = useState<Draft[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [content, setContent] = useState(DEFAULT_TEMPLATE);
  const [filename, setFilename] = useState("my-new-post.md");

  useEffect(() => {
    const saved = loadDrafts();
    let cancelled = false;
    queueMicrotask(() => {
      if (cancelled) return;
      setDrafts(saved);
      if (saved.length > 0) {
        setActiveId(saved[0].id);
        setContent(saved[0].content);
        setFilename(saved[0].filename);
      }
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const updateDraft = (newContent: string, newFilename?: string) => {
    setContent(newContent);
    if (newFilename !== undefined) setFilename(newFilename);
    if (activeId) {
      const updated = drafts.map((d) =>
        d.id === activeId
          ? { ...d, content: newContent, filename: newFilename ?? d.filename, updatedAt: Date.now() }
          : d
      );
      setDrafts(updated);
      saveDrafts(updated);
    }
  };

  const createDraft = () => {
    const id = Date.now().toString();
    const newDraft: Draft = { id, filename: `post-${id}.md`, content: DEFAULT_TEMPLATE, updatedAt: Date.now() };
    const updated = [newDraft, ...drafts];
    setDrafts(updated);
    saveDrafts(updated);
    setActiveId(id);
    setContent(newDraft.content);
    setFilename(newDraft.filename);
  };

  const deleteDraft = (id: string) => {
    const updated = drafts.filter((d) => d.id !== id);
    setDrafts(updated);
    saveDrafts(updated);
    if (activeId === id) {
      if (updated.length > 0) {
        setActiveId(updated[0].id);
        setContent(updated[0].content);
        setFilename(updated[0].filename);
      } else {
        setActiveId(null);
        setContent(DEFAULT_TEMPLATE);
        setFilename("my-new-post.md");
      }
    }
  };

  const downloadFile = () => {
    const blob = new Blob([content], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(content);
    alert("已复制到剪贴板！直接粘贴到 content/blog/ 目录即可");
  };

  // Strip frontmatter for preview
  const previewContent = content.replace(/^---[\s\S]*?---\n?/, "");

  return (
    <div className="pt-20 pb-4 px-4 min-h-screen flex flex-col">
      <div className="max-w-[1600px] w-full mx-auto flex-1 flex flex-col min-h-0">
        {/* Header */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-3 flex-shrink-0">
          <h1 className="text-xl font-bold">
            ✍️ <span className="text-gradient">博客编辑器</span>
          </h1>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={createDraft}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-lg bg-brand-purple/10 text-brand-purple hover:bg-brand-purple/20 transition"
            >
              <HiPlus size={14} /> 新建
            </button>
            <button onClick={copyToClipboard} className="px-3 py-1.5 text-xs rounded-lg bg-white/5 text-gray-400 hover:bg-white/10 transition">
              📋 复制
            </button>
            <button
              onClick={downloadFile}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-lg bg-brand-cyan/10 text-brand-cyan hover:bg-brand-cyan/20 transition"
            >
              <HiDownload size={14} /> 下载
            </button>
          </div>
        </div>

        {/* Draft tabs */}
        <div className="flex items-center gap-1 mb-2 flex-shrink-0 overflow-x-auto">
          {drafts.map((d) => (
            <div
              key={d.id}
              onClick={() => { setActiveId(d.id); setContent(d.content); setFilename(d.filename); }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs cursor-pointer transition-all flex-shrink-0 ${
                activeId === d.id ? "bg-brand-purple/15 text-brand-purple border border-brand-purple/30" : "text-gray-500 hover:bg-white/5 border border-transparent"
              }`}
            >
              <span className="truncate max-w-[120px]">{d.filename}</span>
              <button onClick={(e) => { e.stopPropagation(); deleteDraft(d.id); }} className="text-gray-600 hover:text-red-400">
                <HiTrash size={12} />
              </button>
            </div>
          ))}
        </div>

        {/* Filename */}
        <div className="flex flex-col gap-2 mb-2 flex-shrink-0 sm:flex-row sm:items-center">
          <input
            aria-label="Markdown 文件名"
            type="text"
            value={filename}
            onChange={(e) => updateDraft(content, e.target.value)}
            className="w-full px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-sm focus:border-brand-purple outline-none sm:w-64"
            placeholder="文件名"
          />
          <span className="text-xs text-gray-600">自动保存 · 下载后放到 content/blog/ 目录 git push 上线</span>
        </div>

        {/* Split view: Editor + Preview */}
        <div className="flex-1 flex flex-col gap-3 min-h-0 lg:flex-row">
          {/* Left: Editor */}
          <div className="flex min-h-[24rem] min-w-0 flex-1 flex-col lg:min-h-0">
            <div className="text-xs text-gray-500 mb-1.5 px-1 flex-shrink-0">📝 Markdown 编辑</div>
            <textarea
              value={content}
              onChange={(e) => updateDraft(e.target.value)}
              className="flex-1 w-full p-4 rounded-xl bg-surface-950 border border-white/10 text-sm font-mono text-gray-300 focus:border-brand-purple outline-none resize-none leading-relaxed overflow-y-auto"
              placeholder="用 Markdown 写作..."
              spellCheck={false}
            />
          </div>

          {/* Right: Live Preview */}
          <div className="flex min-h-[24rem] min-w-0 flex-1 flex-col lg:min-h-0">
            <div className="text-xs text-gray-500 mb-1.5 px-1 flex-shrink-0">👁️ 实时预览</div>
            <div className="flex-1 overflow-y-auto glass p-6 min-h-0">
              {previewContent.trim() ? (
                <BlogContent content={previewContent} />
              ) : (
                <p className="text-gray-600 text-sm">在左侧编辑器输入内容，这里实时显示效果...</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
