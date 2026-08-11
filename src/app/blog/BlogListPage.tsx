"use client";

import { useState, useMemo } from "react";
import SectionHeading from "@/components/SectionHeading";
import BlogCard from "@/components/BlogCard";
import ZhihuSidebar from "@/components/ZhihuSidebar";
import Footer from "@/components/Footer";
import { HiPencil, HiSearch } from "react-icons/hi";
import { zhihuContents, type ZhihuContent } from "@/data/zhihu";
import Link from "next/link";

type FilterType = "all" | ZhihuContent["type"];

export default function BlogListPage({ localPosts }: { localPosts: any[] }) {
  const [activeFilter, setActiveFilter] = useState<FilterType>("all");
  const [search, setSearch] = useState("");

  // 知乎作品
  const zhihuPosts = useMemo(() => {
    return [...zhihuContents]
      .sort((a, b) => b.createdAt - a.createdAt)
      .map((c) => ({
        slug: `zhihu-${c.createdAt}`,
        title: c.title,
        date: new Date(c.createdAt * 1000).toISOString().slice(0, 10),
        tags: [c.type === "answer" ? "回答" : c.type === "article" ? "文章" : "想法"],
        description: c.summary,
        category: "知乎",
        url: c.url,
        type: c.type,
        likeCount: c.likeCount,
        createdAt: c.createdAt,
      }));
  }, []);

  // 根据筛选显示知乎作品
  const filteredZhihu = useMemo(() => {
    if (activeFilter === "all") return zhihuPosts;
    return zhihuPosts.filter((p) => p.type === activeFilter);
  }, [zhihuPosts, activeFilter]);

  // 本地文章
  const localFormatted = useMemo(() => {
    return localPosts.map((p: any) => ({
      slug: p.slug,
      title: p.title,
      date: p.date,
      tags: p.tags,
      description: p.description,
      category: p.category === "tech" ? "技术" : p.category === "timing" ? "时序" : p.category === "guide" ? "攻略" : "其他",
    }));
  }, [localPosts]);

  // 搜索过滤
  const matchSearch = (p: { title: string; description: string }) =>
    !search || p.title.includes(search) || p.description.includes(search);

  return (
    <div className="min-h-screen pt-24 pb-16 px-6">
      <div className="max-w-6xl mx-auto flex gap-8">
        {/* 左侧：知乎作品摘要（联动主区） */}
        <ZhihuSidebar activeFilter={activeFilter} onFilterChange={setActiveFilter} />

        {/* 主内容 */}
        <div className="flex-1 min-w-0 max-w-3xl mx-auto">
          <div className="flex items-center justify-between mb-2 gap-3 flex-wrap">
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
            <a
              href="/blog/editor"
              className="flex items-center gap-1.5 px-4 py-2 text-sm rounded-xl bg-brand-purple/10 text-brand-purple hover:bg-brand-purple/20 transition border border-brand-purple/20"
            >
              <HiPencil size={16} /> 写文章
            </a>
          </div>
          <SectionHeading title="技术" accent="博客" subtitle="偏振控制 · FPGA · 全栈开发 · 学习记录" />

          {/* 知乎作品区域 - 跟着侧边栏筛选变化 */}
          <h3 className="text-sm font-semibold text-gray-400 mb-3 flex items-center gap-2">
            <span>📘 知乎作品</span>
            <span className="text-xs text-gray-600">({filteredZhihu.length})</span>
          </h3>
          {filteredZhihu.length === 0 ? (
            <div className="glass p-8 text-center text-gray-500 text-sm mb-8">
              该分类下暂无内容
            </div>
          ) : (
            <div className="space-y-3 mb-8">
              {filteredZhihu.filter(matchSearch).map((post, i) => (
                <a
                  key={post.slug}
                  href={post.url}
                  target="_blank"
                  rel="noopener"
                  className="block"
                >
                  <BlogCard {...post} index={i} category="知乎" />
                </a>
              ))}
            </div>
          )}

          {/* 本地博客区域 */}
          {localFormatted.length > 0 && (
            <>
              <h3 className="text-sm font-semibold text-gray-400 mb-3 flex items-center gap-2">
                <span>📚 技术博客</span>
                <span className="text-xs text-gray-600">({localFormatted.length})</span>
              </h3>
              <div className="space-y-3">
                {localFormatted.filter(matchSearch).map((post, i) => (
                  <Link key={post.slug} href={`/blog/${post.slug}`} className="block">
                    <BlogCard {...post} index={i} category={post.category} />
                  </Link>
                ))}
              </div>
            </>
          )}

          {filteredZhihu.length === 0 && localFormatted.length === 0 && (
            <div className="glass p-12 text-center text-gray-500">
              没有匹配的内容
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}
