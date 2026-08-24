"use client";

import { useState, useMemo, useEffect } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import SectionHeading from "@/components/SectionHeading";
import BlogCard from "@/components/BlogCard";
import ZhihuSidebar from "@/components/ZhihuSidebar";
import { HiPencil, HiSearch, HiFolder, HiArrowLeft } from "react-icons/hi";
import { zhihuContents, type ZhihuContent } from "@/data/zhihu";
import Link from "next/link";
import { motion } from "framer-motion";

type FilterType = "all" | ZhihuContent["type"];

interface FolderInfo {
  slug: string;
  name: string;
  description: string;
  count: number;
  color: string;
  icon: string;
}

const FOLDER_CONFIG: Record<string, { name: string; description: string; color: string; icon: string }> = {
  tech: { name: "技术", description: "偏振控制、FPGA、全栈开发等技术笔记", color: "blue", icon: "💻" },
  timing: { name: "时序", description: "FPGA 时序约束、CDC、DAC/ADC 调试", color: "cyan", icon: "⏱️" },
  guide: { name: "攻略", description: "工具使用、教程、生活经验", color: "pink", icon: "📚" },
  libo: { name: "李博笔记", description: "李博的学习笔记", color: "purple", icon: "📝" },
  default: { name: "其他", description: "未分类", color: "gray", icon: "📁" },
};

export default function BlogListPage({ localPosts }: { localPosts: any[] }) {
  const [activeFilter, setActiveFilter] = useState<FilterType>("all");
  const [search, setSearch] = useState("");
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  
  // 从 URL 读取分类（这样返回时不会丢）
  const activeCategory = searchParams.get("category") || "";
  
  // 同步客户端水合（避免 hydration mismatch）
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);
  
  const setCategory = (cat: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (cat === "") {
      params.delete("category");
    } else {
      params.set("category", cat);
    }
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  // 本地博客（主区只显示这些）
  const localFormatted = useMemo(() => {
    return localPosts.map((p: any) => ({
      slug: p.slug,
      title: p.title,
      date: p.date,
      tags: p.tags,
      description: p.description,
      category: p.category,
      categoryName: FOLDER_CONFIG[p.category]?.name || "其他",
    }));
  }, [localPosts]);

  // 按分类分组，只保留有文章的分类
  const folders = useMemo(() => {
    const stats: Record<string, number> = {};
    localFormatted.forEach((p) => {
      stats[p.category] = (stats[p.category] || 0) + 1;
    });
    
    return Object.entries(stats)
      .filter(([cat, count]) => count > 0)
      .map(([cat, count]) => ({
        slug: cat,
        name: FOLDER_CONFIG[cat]?.name || cat,
        description: FOLDER_CONFIG[cat]?.description || "",
        count,
        color: FOLDER_CONFIG[cat]?.color || "gray",
        icon: FOLDER_CONFIG[cat]?.icon || "📁",
      }));
  }, [localFormatted]);

  const filtered = useMemo(() => {
    let list = localFormatted;
    if (activeCategory) {
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
          {mounted && (
          <div className="mb-6">
            {activeCategory ? (
              // 显示当前分类的文章列表
              <div>
                <button
                  onClick={() => setCategory("")}
                  className="flex items-center gap-2 text-sm text-gray-400 hover:text-white mb-4 transition-colors"
                >
                  <HiArrowLeft size={16} />
                  返回文件夹
                </button>
                <SectionHeading
                  title={FOLDER_CONFIG[activeCategory]?.name || activeCategory}
                  accent=""
                  subtitle={FOLDER_CONFIG[activeCategory]?.description || ""}
                />
                <div className="space-y-4 mt-6">
                  {filtered.map((post, i) => (
                    <Link key={post.slug} href={`/blog/${post.slug}`} className="block">
                      <BlogCard {...post} index={i} category={post.categoryName} />
                    </Link>
                  ))}
                </div>
              </div>
            ) : (
              // 显示文件夹卡片
              <div>
                <SectionHeading title="博客" accent="分类" subtitle="按文件夹浏览文章" />
                <div className="grid md:grid-cols-2 gap-5 mt-6">
                  {folders.map((folder, i) => (
                    <motion.button
                      key={folder.slug}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.1 }}
                      onClick={() => setCategory(folder.slug)}
                      className="glass overflow-hidden group cursor-pointer transition-all hover:border-brand-purple/30 text-left"
                    >
                      {/* 顶部图标区 */}
                      <div
                        className="h-32 flex items-center justify-center text-6xl relative overflow-hidden"
                        style={{
                          background: `linear-gradient(135deg, var(--color-${folder.color}-500)33 0%, var(--color-${folder.color}-500)11 100%)`,
                        }}
                      >
                        <motion.span
                          whileHover={{ scale: 1.15 }}
                          transition={{ type: "spring" }}
                        >
                          {folder.icon}
                        </motion.span>
                        <div className="absolute inset-0 bg-gradient-to-t from-surface-900/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                          <span className="text-sm text-brand-cyan">查看 {folder.count} 篇文章 →</span>
                        </div>
                      </div>

                      {/* 内容区 */}
                      <div className="p-5">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-semibold text-lg">{folder.name}</h4>
                          <span className="text-xs text-gray-500">{folder.count} 篇</span>
                        </div>
                        <p className="text-sm text-gray-400 leading-relaxed">
                          {folder.description}
                        </p>
                      </div>
                    </motion.button>
                  ))}
                </div>
              </div>
            )}
          </div>
          )}
        </div>
      </div>
    </div>
  );
}
