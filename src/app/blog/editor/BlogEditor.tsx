"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { HiDownload, HiPlus, HiTrash } from "react-icons/hi";
import BlogContent from "@/components/BlogContent";
import HumanitiesArticle from "@/components/HumanitiesArticle";
import { parseArticlePreview } from "@/lib/article-preview";

const DEFAULT_TEMPLATE = `---
title: "文章标题"
date: "${new Date().toISOString().slice(0, 10)}"
tags: ["标签"]
description: "文章摘要"
published: false
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
  category?: "humanities";
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
  try {
    localStorage.setItem("blog-drafts", JSON.stringify(drafts));
    return true;
  } catch {
    return false;
  }
}

function today() {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
}

export default function BlogEditor({ humanitiesTemplate }: { humanitiesTemplate: string }) {
  const [drafts, setDrafts] = useState<Draft[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [content, setContent] = useState(DEFAULT_TEMPLATE);
  const [filename, setFilename] = useState("my-new-post.md");
  const [status, setStatus] = useState("");
  const activeDraft = drafts.find((draft) => draft.id === activeId);
  const outputDirectory = activeDraft?.category === "humanities" ? "content/blog/humanities/" : "content/blog/<分类>/";

  const persistDrafts = (updated: Draft[]) => {
    setDrafts(updated);
    setStatus(saveDrafts(updated)
      ? "草稿已保存在当前浏览器"
      : "当前浏览器无法保存草稿，请下载备份");
  };

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
      persistDrafts(updated);
    } else {
      const newDraft: Draft = {
        id: crypto.randomUUID(),
        filename: newFilename ?? filename,
        content: newContent,
        updatedAt: Date.now(),
      };
      persistDrafts([newDraft, ...drafts]);
      setActiveId(newDraft.id);
    }
  };

  const createDraft = (useHumanitiesTemplate = false) => {
    const id = crypto.randomUUID();
    const template = useHumanitiesTemplate ? humanitiesTemplate : DEFAULT_TEMPLATE;
    const newDraft: Draft = {
      id,
      filename: `${useHumanitiesTemplate ? "humanities" : "post"}-${today()}-${id.slice(0, 8)}.md`,
      content: template.replace(/^date:.*$/m, `date: "${today()}"`),
      updatedAt: Date.now(),
      ...(useHumanitiesTemplate ? { category: "humanities" as const } : {}),
    };
    const updated = [newDraft, ...drafts];
    persistDrafts(updated);
    setActiveId(id);
    setContent(newDraft.content);
    setFilename(newDraft.filename);
  };

  const deleteDraft = (id: string) => {
    const updated = drafts.filter((d) => d.id !== id);
    persistDrafts(updated);
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

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(content);
      setStatus("已复制 Markdown 内容");
    } catch {
      setStatus("复制未成功，请下载 Markdown 文件或手动复制正文");
    }
  };

  const preview = useMemo(() => parseArticlePreview(content), [content]);
  const isHumanities = activeDraft?.category === "humanities";

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
              type="button"
              onClick={() => createDraft()}
              className="flex min-h-11 items-center gap-1.5 px-3 py-1.5 text-xs rounded-lg bg-brand-purple/10 text-brand-purple hover:bg-brand-purple/20 transition"
            >
              <HiPlus size={14} aria-hidden="true" /> 新建文章
            </button>
            <button
              type="button"
              onClick={() => createDraft(true)}
              className="flex min-h-11 items-center gap-1.5 rounded-lg border border-brand-purple/20 bg-brand-purple/10 px-3 py-1.5 text-xs text-brand-purple transition hover:bg-brand-purple/20"
            >
              <HiPlus size={14} aria-hidden="true" /> 人文模板
            </button>
            <button type="button" onClick={copyToClipboard} className="min-h-11 px-3 py-1.5 text-xs rounded-lg bg-white/5 text-gray-400 hover:bg-white/10 transition">
              📋 复制
            </button>
            <button
              type="button"
              onClick={downloadFile}
              className="flex min-h-11 items-center gap-1.5 px-3 py-1.5 text-xs rounded-lg bg-brand-cyan/10 text-brand-cyan hover:bg-brand-cyan/20 transition"
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
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs cursor-pointer transition-all flex-shrink-0 ${
                activeId === d.id ? "bg-brand-purple/15 text-brand-purple border border-brand-purple/30" : "text-gray-500 hover:bg-white/5 border border-transparent"
              }`}
            >
              <button
                type="button"
                aria-pressed={activeId === d.id}
                onClick={() => { setActiveId(d.id); setContent(d.content); setFilename(d.filename); }}
                className="min-h-9 max-w-[160px] truncate text-left"
              >
                {d.filename}
              </button>
              <button type="button" aria-label={`删除草稿 ${d.filename}`} onClick={() => deleteDraft(d.id)} className="inline-flex min-h-9 min-w-9 items-center justify-center text-gray-500 hover:text-red-400">
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
          <span className="text-xs text-gray-500">下载后放到 {outputDirectory}；完成后将 published 改为 true 再提交发布。</span>
        </div>

        <p className="mb-3 text-xs leading-relaxed text-gray-500">
          人文模板适合历史、文化与读书笔记，可以删去不需要的章节。新建时会保留已有草稿，草稿仅保存在当前浏览器。
          {" "}<Link href="/blog/editor/preview" target="_blank" rel="noopener noreferrer" className="inline-flex min-h-9 items-center text-brand-purple underline underline-offset-4">查看排版示例<span className="sr-only">（在新标签页打开）</span></Link>
        </p>
        <p role="status" aria-live="polite" className="mb-3 min-h-4 text-xs text-gray-400">{status}</p>

        {/* Split view: Editor + Preview */}
        <div className="flex-1 flex flex-col gap-3 min-h-0 lg:flex-row">
          {/* Left: Editor */}
          <div className="flex min-h-[24rem] min-w-0 flex-1 flex-col lg:min-h-0">
            <div className="text-xs text-gray-500 mb-1.5 px-1 flex-shrink-0">📝 Markdown 编辑</div>
            <textarea
              aria-label="文章 Markdown 内容"
              value={content}
              onChange={(e) => updateDraft(e.target.value)}
              className="flex-1 w-full p-4 rounded-xl bg-surface-950 border border-white/10 text-sm font-mono text-gray-300 focus:border-brand-purple outline-none resize-none leading-relaxed overflow-y-auto"
              placeholder="用 Markdown 写作..."
              spellCheck={false}
            />
          </div>

          {/* Right: Live Preview */}
          <div className="flex min-h-[24rem] min-w-0 flex-1 flex-col lg:min-h-0">
            <div className="text-xs text-gray-500 mb-1.5 px-1 flex-shrink-0">
              阅读预览{isHumanities ? " · 人文书页" : ""}
            </div>
            {preview.error && <p role="status" className="mb-3 rounded-lg border border-brand-purple/20 bg-brand-purple/10 p-3 text-sm text-brand-purple">{preview.error}</p>}
            <div className={`flex-1 overflow-y-auto min-h-0 ${isHumanities ? "" : "glass p-6"}`}>
              {isHumanities ? (
                <HumanitiesArticle {...preview} headingLevel={2} />
              ) : preview.content.trim() ? (
                <>
                  <header className="mb-8 border-b border-white/10 pb-6">
                    <h2 className="mb-3 text-2xl font-bold">{preview.title}</h2>
                    {preview.description && <p className="mb-3 text-sm leading-relaxed text-gray-400">{preview.description}</p>}
                    <p className="text-xs text-gray-500">{[preview.date, ...preview.tags].filter(Boolean).join(" · ")}</p>
                  </header>
                  <BlogContent content={preview.content} />
                </>
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
