"use client";

import { useMemo, useState, useSyncExternalStore } from "react";
import type { MouseEvent } from "react";
import Link from "next/link";
import { HiArrowLeft, HiPencil, HiSearch } from "react-icons/hi";
import BlogCard from "@/components/BlogCard";
import { CATEGORIES } from "@/lib/categories";
import type { Post } from "@/lib/blog";

type PostSummary = Omit<Post, "content">;

const CATEGORY_CHANGE_EVENT = "blog-category-change";

const FOLDER_STYLES: Record<string, { color: string; icon: string }> = {
  tech: { color: "#3b82f6", icon: "💻" },
  timing: { color: "#06b6d4", icon: "⏱️" },
  guide: { color: "#ec4899", icon: "📚" },
  libo: { color: "#8b5cf6", icon: "📝" },
  default: { color: "#64748b", icon: "📁" },
};

function subscribeToCategory(callback: () => void) {
  window.addEventListener("popstate", callback);
  window.addEventListener(CATEGORY_CHANGE_EVENT, callback);

  return () => {
    window.removeEventListener("popstate", callback);
    window.removeEventListener(CATEGORY_CHANGE_EVENT, callback);
  };
}

function getCategorySnapshot() {
  return new URLSearchParams(window.location.search).get("category") || "";
}

function getServerCategorySnapshot() {
  return "";
}

function isPlainLeftClick(event: MouseEvent<HTMLAnchorElement>) {
  return (
    event.button === 0 &&
    !event.defaultPrevented &&
    !event.metaKey &&
    !event.ctrlKey &&
    !event.shiftKey &&
    !event.altKey
  );
}

export default function BlogExplorer({ localPosts }: { localPosts: PostSummary[] }) {
  const [search, setSearch] = useState("");
  const requestedCategory = useSyncExternalStore(
    subscribeToCategory,
    getCategorySnapshot,
    getServerCategorySnapshot,
  );
  const activeCategory = CATEGORIES.some((category) => category.slug === requestedCategory)
    ? requestedCategory
    : "";

  const folders = useMemo(() => {
    const counts = localPosts.reduce<Record<string, number>>((result, post) => {
      result[post.category] = (result[post.category] || 0) + 1;
      return result;
    }, {});

    return CATEGORIES.filter((category) => counts[category.slug] > 0).map((category) => ({
      ...category,
      count: counts[category.slug],
      ...FOLDER_STYLES[category.slug],
    }));
  }, [localPosts]);

  const filteredPosts = useMemo(() => {
    const query = search.trim().toLocaleLowerCase("zh-CN");
    return localPosts.filter((post) => {
      const matchesCategory = !activeCategory || post.category === activeCategory;
      const searchableText = [post.title, post.description, ...post.tags]
        .join(" ")
        .toLocaleLowerCase("zh-CN");
      return matchesCategory && (!query || searchableText.includes(query));
    });
  }, [activeCategory, localPosts, search]);

  const showPosts = Boolean(activeCategory || search.trim());
  const currentCategory = CATEGORIES.find((category) => category.slug === activeCategory);
  const recentPosts = localPosts.slice(0, 6);

  const setCategory = (category: string) => {
    const url = new URL(window.location.href);
    if (category) url.searchParams.set("category", category);
    else url.searchParams.delete("category");

    window.history.pushState(null, "", `${url.pathname}${url.search}${url.hash}`);
    window.dispatchEvent(new Event(CATEGORY_CHANGE_EVENT));
  };

  const handleCategoryLink = (event: MouseEvent<HTMLAnchorElement>, category: string) => {
    if (!isPlainLeftClick(event)) return;
    event.preventDefault();
    setSearch("");
    setCategory(category);
  };

  return (
    <>
      <div className="mb-8 flex flex-col gap-3 sm:flex-row">
        <label className="relative flex-1">
          <span className="sr-only">搜索文章</span>
          <HiSearch
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
            size={17}
            aria-hidden="true"
          />
          <input
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="搜索标题、摘要或标签"
            className="min-h-11 w-full rounded-xl border border-white/10 bg-white/5 py-2.5 pl-10 pr-3 text-sm outline-none transition focus:border-brand-purple"
          />
        </label>
        <Link
          href="/blog/editor"
          className="inline-flex min-h-11 items-center justify-center gap-1.5 rounded-xl border border-brand-purple/20 bg-brand-purple/10 px-4 py-2.5 text-sm text-brand-purple transition hover:bg-brand-purple/20"
        >
          <HiPencil size={16} aria-hidden="true" /> Markdown 编辑器
        </Link>
      </div>

      {showPosts ? (
        <section aria-labelledby="post-list-heading">
          {activeCategory ? (
            <div className="sticky top-20 z-30 mb-6 py-2">
              <div className="glass grid min-h-14 grid-cols-[auto_1px_minmax(0,1fr)_auto] items-center gap-3 px-3 py-2 shadow-lg shadow-black/20 sm:px-4">
                <Link
                  href="/blog"
                  onClick={(event) => handleCategoryLink(event, "")}
                  aria-label="返回全部博客分类"
                  className="blog-return-link flex min-h-11 items-center gap-2 rounded-xl px-2.5 py-2 text-sm font-medium text-gray-300 transition-colors hover:bg-brand-purple/10"
                >
                  <HiArrowLeft size={16} aria-hidden="true" />
                  <span className="hidden sm:inline">返回全部分类</span>
                  <span className="sm:hidden">返回</span>
                </Link>
                <span className="h-7 w-px bg-gray-500/20" aria-hidden="true" />
                <h2
                  id="post-list-heading"
                  className="min-w-0 truncate text-lg font-semibold text-brand-purple"
                >
                  {currentCategory?.name}
                </h2>
                <p aria-live="polite" className="whitespace-nowrap text-xs text-gray-500 sm:text-sm">
                  共 {filteredPosts.length} 篇
                </p>
              </div>
            </div>
          ) : (
            <div className="mb-6">
              <h2 id="post-list-heading" className="text-2xl font-bold">
                搜索结果
              </h2>
              <p aria-live="polite" className="mt-2 text-sm text-gray-500">
                共 {filteredPosts.length} 篇文章
              </p>
            </div>
          )}

          {filteredPosts.length > 0 ? (
            <div className="space-y-4">
              {filteredPosts.map((post, index) => (
                <BlogCard key={post.slug} {...post} index={index} />
              ))}
            </div>
          ) : (
            <div className="glass p-10 text-center text-sm text-gray-400">
              没有找到匹配的文章，试试更短的关键词。
            </div>
          )}
        </section>
      ) : (
        <>
          <section aria-labelledby="category-heading">
            <div className="mb-6">
              <h2 id="category-heading" className="text-2xl font-bold">
                按主题浏览
              </h2>
              <p className="mt-2 text-sm text-gray-500">选择一个主题，进入对应的文章集合。</p>
            </div>
            <div className="grid gap-5 md:grid-cols-2">
              {folders.map((folder) => (
                <Link
                  key={folder.slug}
                  href={`/blog?category=${encodeURIComponent(folder.slug)}`}
                  onClick={(event) => handleCategoryLink(event, folder.slug)}
                  className="w-full text-left"
                >
                  <div
                    className="glass group overflow-hidden transition-all hover:border-brand-purple/30"
                  >
                    <div
                      className="relative flex h-28 items-center justify-center overflow-hidden text-5xl"
                      style={{
                        background: `linear-gradient(135deg, ${folder.color}33 0%, ${folder.color}0d 100%)`,
                      }}
                    >
                      <span
                        aria-hidden="true"
                        className="transition-transform group-hover:scale-110 motion-reduce:transform-none"
                      >
                        {folder.icon}
                      </span>
                    </div>
                    <div className="p-5">
                      <div className="mb-2 flex items-center justify-between gap-3">
                        <h3 className="text-lg font-semibold">{folder.name}</h3>
                        <span className="text-xs text-gray-500">{folder.count} 篇</span>
                      </div>
                      <p className="text-sm leading-relaxed text-gray-400">{folder.description}</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>

          {recentPosts.length > 0 && (
            <section aria-labelledby="recent-posts-heading" className="mt-12">
              <div className="mb-6">
                <h2 id="recent-posts-heading" className="text-2xl font-bold">
                  最新文章
                </h2>
                <p className="mt-2 text-sm text-gray-500">最近更新的技术笔记与学习记录。</p>
              </div>
              <div className="space-y-4">
                {recentPosts.map((post, index) => (
                  <BlogCard key={post.slug} {...post} index={index} />
                ))}
              </div>
            </section>
          )}
        </>
      )}
    </>
  );
}
