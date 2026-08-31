"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { HiArrowLeft, HiPencil, HiRss, HiSearch } from "react-icons/hi";
import BlogCard from "@/components/BlogCard";
import ZhihuSidebar from "@/components/ZhihuSidebar";
import { CATEGORIES } from "@/lib/categories";
import type { Post } from "@/lib/blog";
import type { ZhihuContent } from "@/lib/zhihu-feed";

type FilterType = "all" | ZhihuContent["type"];
type PostSummary = Omit<Post, "content">;

const FOLDER_STYLES: Record<string, { color: string; icon: string }> = {
  tech: { color: "#3b82f6", icon: "💻" },
  timing: { color: "#06b6d4", icon: "⏱️" },
  guide: { color: "#ec4899", icon: "📚" },
  libo: { color: "#8b5cf6", icon: "📝" },
  default: { color: "#64748b", icon: "📁" },
};

export default function BlogListPage({ localPosts }: { localPosts: PostSummary[] }) {
  const [activeFilter, setActiveFilter] = useState<FilterType>("all");
  const [search, setSearch] = useState("");
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const requestedCategory = searchParams.get("category") || "";
  const activeCategory = CATEGORIES.some((category) => category.slug === requestedCategory)
    ? requestedCategory
    : "";

  const setCategory = (category: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (category) params.set("category", category);
    else params.delete("category");

    const query = params.toString();
    router.push(query ? `${pathname}?${query}` : pathname, { scroll: false });
  };

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

  return (
    <div className="min-h-screen px-6 pb-16 pt-24">
      <div className="mx-auto flex max-w-6xl gap-8">
        <ZhihuSidebar activeFilter={activeFilter} onFilterChange={setActiveFilter} />

        <div className="mx-auto min-w-0 max-w-3xl flex-1">
          <header className="mb-8">
            <p className="mb-3 text-sm font-semibold tracking-[0.18em] text-brand-cyan">NOTES & WRITING</p>
            <h1 className="text-3xl font-bold md:text-4xl">技术博客</h1>
            <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
              <p className="text-sm leading-relaxed text-gray-400">
                偏振控制、FPGA 时序、全栈开发与持续学习的实践记录。
              </p>
              <a
                href="/rss.xml"
                className="inline-flex min-h-11 items-center gap-1.5 rounded-xl px-3 text-sm text-gray-400 transition-colors hover:bg-brand-purple/10 hover:text-brand-cyan"
              >
                <HiRss size={16} aria-hidden="true" /> RSS 订阅
              </a>
            </div>
          </header>

          <div className="mb-8 flex flex-col gap-3 sm:flex-row">
            <label className="relative flex-1">
              <span className="sr-only">搜索文章</span>
              <HiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={17} aria-hidden="true" />
              <input
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="搜索标题、摘要或标签"
                className="w-full rounded-xl border border-white/10 bg-white/5 py-2.5 pl-10 pr-3 text-sm outline-none transition focus:border-brand-purple"
              />
            </label>
            <Link
              href="/blog/editor"
              className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-brand-purple/20 bg-brand-purple/10 px-4 py-2.5 text-sm text-brand-purple transition hover:bg-brand-purple/20"
            >
              <HiPencil size={16} aria-hidden="true" /> Markdown 编辑器
            </Link>
          </div>

          {showPosts ? (
            <section aria-labelledby="post-list-heading">
              {activeCategory ? (
                <div className="sticky top-20 z-30 mb-6 py-2">
                  <div className="glass grid min-h-14 grid-cols-[auto_1px_minmax(0,1fr)_auto] items-center gap-3 px-3 py-2 shadow-lg shadow-black/20 sm:px-4">
                    <button
                      type="button"
                      onClick={() => {
                        setSearch("");
                        setCategory("");
                      }}
                      aria-label="返回全部博客分类"
                      className="flex min-h-11 items-center gap-2 rounded-xl px-2.5 py-2 text-sm font-medium text-gray-300 transition-colors hover:bg-brand-purple/10 hover:text-brand-cyan"
                    >
                      <HiArrowLeft size={16} aria-hidden="true" />
                      <span className="hidden sm:inline">返回全部分类</span>
                      <span className="sm:hidden">返回</span>
                    </button>
                    <span className="h-7 w-px bg-gray-500/20" aria-hidden="true" />
                    <h2
                      id="post-list-heading"
                      className="min-w-0 truncate text-lg font-semibold text-brand-purple"
                    >
                      {currentCategory?.name}
                    </h2>
                    <p className="whitespace-nowrap text-xs text-gray-500 sm:text-sm">
                      共 {filteredPosts.length} 篇
                    </p>
                  </div>
                </div>
              ) : (
                <div className="mb-6">
                  <h2 id="post-list-heading" className="text-2xl font-bold">
                    搜索结果
                  </h2>
                  <p className="mt-2 text-sm text-gray-500">共 {filteredPosts.length} 篇文章</p>
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
            <section aria-labelledby="category-heading">
              <div className="mb-6">
                <h2 id="category-heading" className="text-2xl font-bold">按主题浏览</h2>
                <p className="mt-2 text-sm text-gray-500">选择一个主题，进入对应的文章集合。</p>
              </div>
              <div className="grid gap-5 md:grid-cols-2">
                {folders.map((folder, index) => (
                  <button
                    key={folder.slug}
                    type="button"
                    onClick={() => setCategory(folder.slug)}
                    className="w-full text-left"
                  >
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.07 }}
                      className="glass group overflow-hidden transition-all hover:border-brand-purple/30"
                    >
                      <div
                        className="relative flex h-28 items-center justify-center overflow-hidden text-5xl"
                        style={{
                          background: `linear-gradient(135deg, ${folder.color}33 0%, ${folder.color}0d 100%)`,
                        }}
                      >
                        <motion.span aria-hidden="true" whileHover={{ scale: 1.12 }}>
                          {folder.icon}
                        </motion.span>
                      </div>
                      <div className="p-5">
                        <div className="mb-2 flex items-center justify-between gap-3">
                          <h3 className="text-lg font-semibold">{folder.name}</h3>
                          <span className="text-xs text-gray-500">{folder.count} 篇</span>
                        </div>
                        <p className="text-sm leading-relaxed text-gray-400">{folder.description}</p>
                      </div>
                    </motion.div>
                  </button>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
}
