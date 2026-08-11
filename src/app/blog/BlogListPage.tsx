"use client";

import { useState } from "react";
import ScrollReveal from "@/components/ScrollReveal";
import SectionHeading from "@/components/SectionHeading";
import BlogList from "@/components/BlogList";
import Footer from "@/components/Footer";
import { HiPencil } from "react-icons/hi";

interface Post {
  slug: string;
  title: string;
  date: string;
  tags: string[];
  description: string;
  category?: string;
}

interface Category {
  slug: string;
  name: string;
  description?: string;
}

export default function BlogListPage({
  posts,
  tags,
  categories,
}: {
  posts: Post[];
  tags: string[];
  categories: Category[];
}) {
  const [activeCategory, setActiveCategory] = useState<string>("all");

  const filtered = activeCategory === "all"
    ? posts
    : posts.filter(p => p.category === activeCategory);

  // 统计每个分类的文章数
  const countByCategory = posts.reduce((acc, p) => {
    const c = p.category || "default";
    acc[c] = (acc[c] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="min-h-screen pt-24 pb-16 px-6">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-2">
          <div />
          <a
            href="/blog/editor"
            className="flex items-center gap-1.5 px-4 py-2 text-sm rounded-xl bg-brand-purple/10 text-brand-purple hover:bg-brand-purple/20 transition border border-brand-purple/20"
          >
            <HiPencil size={16} /> 打开编辑器
          </a>
        </div>
        <SectionHeading title="技术" accent="博客" subtitle="偏振控制 · FPGA · 全栈开发 · 学习记录" />

        {/* 分类切换 */}
        <div className="mb-6 flex flex-wrap gap-2">
          <button
            onClick={() => setActiveCategory("all")}
            className={`px-4 py-2 text-sm rounded-xl transition-all ${
              activeCategory === "all"
                ? "bg-gradient-to-r from-brand-purple to-brand-cyan text-white shadow-lg shadow-brand-purple/20"
                : "bg-white/5 text-gray-400 hover:bg-white/10 border border-white/10"
            }`}
          >
            全部 ({posts.length})
          </button>
          {categories.map((cat) => {
            const count = countByCategory[cat.slug] || 0;
            if (count === 0) return null;
            return (
              <button
                key={cat.slug}
                onClick={() => setActiveCategory(cat.slug)}
                className={`px-4 py-2 text-sm rounded-xl transition-all ${
                  activeCategory === cat.slug
                    ? "bg-gradient-to-r from-brand-purple to-brand-cyan text-white shadow-lg shadow-brand-purple/20"
                    : "bg-white/5 text-gray-400 hover:bg-white/10 border border-white/10"
                }`}
                title={cat.description}
              >
                {cat.name} ({count})
              </button>
            );
          })}
        </div>

        {/* 分类描述 */}
        {activeCategory !== "all" && (
          <div className="mb-4 text-xs text-gray-500">
            {categories.find(c => c.slug === activeCategory)?.description}
          </div>
        )}

        <BlogList posts={filtered} tags={tags} />
      </div>
      <Footer />
    </div>
  );
}
