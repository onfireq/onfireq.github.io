"use client";

import { useState, useMemo } from "react";
import SectionHeading from "@/components/SectionHeading";
import BlogCard from "@/components/BlogCard";
import ZhihuSidebar from "@/components/ZhihuSidebar";
import { HiPencil, HiSearch } from "react-icons/hi";
import { zhihuContents, type ZhihuContent } from "@/data/zhihu";
import Link from "next/link";

type FilterType = "all" | ZhihuContent["type"];

export default function BlogListPage({ localPosts }: { localPosts: any[] }) {
  const [activeFilter, setActiveFilter] = useState<FilterType>("all");
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<string>("all");

  // 本地博客（主区只显示这些）
  const localFormatted = useMemo(() => {
    return localPosts.map((p: any) => ({
      slug: p.slug,
      title: p.title,
      date: p.date,
      tags: p.tags,
      description: p.description,
      category: p.category,
      categoryName: p.category === "tech" ? "技术" : p.category === "timing" ? "时序" : p.category === "guide" ? "攻略" : p.category === "libo" ? "李博笔记" : "其他",
    }));
  }, [localPosts]);

  // 获取所有分类及文章数
  const categoryStats = useMemo(() => {
    const stats: Record<string, number> = { all: localFormatted.length };
    localFormatted.forEach((p) => {
      stats[p.category] = (stats[p.category] || 0) + 1;
    });
    return stats;
  }, [localFormatted]);

  const filtered = useMemo(() => {
    let list = localFormatted;
    if (activeCategory !== "all") {
      list = list.filter((p) => p.category === activeCategory);
    }
    if (search) {
      list = list.filter((p) => p.title.includes(search) || p.description.includes(search));
    }
    return list;
  }, [localFormatted, search, activeCategory]);

  return (
    <div className="min-h-screen pt-24 pb-16 px-6">
      <div className="max-w-6xl mx-auto flex gap-8">
        {/* 左侧：知乎作品摘要（侧边栏内上下联动） */}
        <ZhihuSidebar activeFilter={activeFilter} onFilterChange={setActiveFilter} />

        {/* 主内容：只显示本地博客 */}
        <div className="flex-1 min-w-0 max-w-3xl mx-auto">
          {/* 搜索框（暂隐藏，逻辑保留以便未来使用）*/}
          {false && (
            <div className="relative flex-1 max-w-sm">
              <HiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="搜索文章..."
                className="w-full pl-9 pr-3 py-2 rounded-xl bg-white/5 border border-white/10 text-sm focus:border-brand-purple outline-none"
              />
            </div>
          )}
          <div className="flex items-center justify-end mb-2 gap-3 flex-wrap">
            <a
              href="/blog/editor"
              className="flex items-center gap-1.5 px-4 py-2 text-sm rounded-xl bg-brand-purple/10 text-brand-purple hover:bg-brand-purple/20 transition border border-brand-purple/20"
            >
              <HiPencil size={16} /> 写文章
            </a>
          </div>

          {/* 分类筛选 */}
          <div className="flex flex-wrap gap-2 mb-6">
            <button
              onClick={() => setActiveCategory("all")}
              className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                activeCategory === "all"
                  ? "bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg shadow-blue-500/30"
                  : "bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white"
              }`}
            >
              全部 <span className="opacity-70">{categoryStats.all || 0}</span>
            </button>
            {Object.entries(categoryStats).map(([cat, count]) => {
              if (cat === "all") return null;
              if (count === 0) return null;
              const name = cat === "tech" ? "技术" : cat === "timing" ? "时序" : cat === "guide" ? "攻略" : cat === "libo" ? "李博笔记" : cat;
              return (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                    activeCategory === cat
                      ? "bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg shadow-blue-500/30"
                      : "bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  {name} <span className="opacity-70">{count}</span>
                </button>
              );
            })}
          </div>
          <SectionHeading title="技术" accent="博客" subtitle="偏振控制 · FPGA · 全栈开发 · 学习记录" />

          {filtered.length === 0 ? (
            <div className="glass p-12 text-center text-gray-500">
              {search ? "没有匹配的文章" : "暂无文章"}
            </div>
          ) : (
            <div className="space-y-4">
              {filtered.map((post, i) => (
                <Link key={post.slug} href={`/blog/${post.slug}`} className="block">
                  <BlogCard {...post} index={i} category={post.categoryName} />
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
