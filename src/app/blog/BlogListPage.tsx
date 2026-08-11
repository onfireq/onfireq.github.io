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

  const filtered = useMemo(() => {
    let list = localFormatted;
    if (search) {
      list = list.filter((p) => p.title.includes(search) || p.description.includes(search));
    }
    return list;
  }, [localFormatted, search]);

  return (
    <div className="min-h-screen pt-24 pb-16 px-6">
      <div className="max-w-6xl mx-auto flex gap-8">
        {/* 左侧：知乎作品摘要 */}
        <ZhihuSidebar activeFilter={activeFilter} onFilterChange={setActiveFilter} />

        {/* 主内容：本地文章 */}
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

          {filtered.length === 0 ? (
            <div className="glass p-12 text-center text-gray-500">
              {search ? "没有匹配的文章" : "暂无文章"}
            </div>
          ) : (
            <div className="space-y-4">
              {filtered.map((post, i) => (
                <Link key={post.slug} href={`/blog/${post.slug}`} className="block">
                  <BlogCard {...post} index={i} category={post.category} />
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}
