"use client";

import { motion } from "framer-motion";

interface BlogCategory {
  slug: string;
  name: string;
}

interface ZhihuProfileProps {
  stats: {
    answerCount: number;
    articleCount: number;
    followerCount: number;
  };
  categories: BlogCategory[];
  activeCategory: string;
  onCategoryChange: (slug: string) => void;
}

export default function ZhihuProfile({
  stats,
  categories,
  activeCategory,
  onCategoryChange,
}: ZhihuProfileProps) {
  return (
    <motion.aside
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
      className="hidden lg:block w-64 flex-shrink-0 sticky top-24 self-start max-h-[calc(100vh-7rem)] overflow-y-auto"
    >
      {/* 关于作者 */}
      <div className="mb-6">
        <h3 className="text-sm font-semibold text-gray-300 mb-3">关于作者</h3>
        <div className="flex items-start gap-3 mb-3">
          <div className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0 bg-gradient-to-br from-blue-500 to-cyan-500">
            <img
              src="/images/avatar.jpg"
              alt="onfireq"
              className="w-full h-full object-cover"
              onError={(e) => {
                const t = e.target as HTMLImageElement;
                t.style.display = "none";
                t.parentElement!.innerHTML = '<div class="w-full h-full flex items-center justify-center text-xl">👨‍💻</div>';
              }}
            />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1">
              <span className="font-semibold text-sm">白日梦游</span>
              <span className="text-blue-400 text-xs">✓</span>
            </div>
            <div className="text-xs text-gray-500 mt-0.5">名不显时心不朽</div>
          </div>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-gray-400 mb-3">
          <span className="px-1 py-0.5 rounded bg-blue-500/20 text-blue-400 text-[10px]">✓</span>
          <span>中山大学 · 光学工程硕士在读</span>
        </div>
        <div className="grid grid-cols-3 gap-2 text-center">
          <div>
            <div className="text-base font-bold text-blue-400">{stats.answerCount}</div>
            <div className="text-[10px] text-gray-500 mt-0.5">回答</div>
          </div>
          <div>
            <div className="text-base font-bold text-pink-400">{stats.articleCount}</div>
            <div className="text-[10px] text-gray-500 mt-0.5">文章</div>
          </div>
          <div>
            <div className="text-base font-bold text-cyan-400">{stats.followerCount}</div>
            <div className="text-[10px] text-gray-500 mt-0.5">关注者</div>
          </div>
        </div>
      </div>

      {/* 大家都在搜 → 博客分类 */}
      <div>
        <div className="flex items-center gap-1.5 mb-3">
          <span className="text-red-400 text-xs">🔥</span>
          <h3 className="text-sm font-semibold text-gray-300">大家都在搜</h3>
        </div>
        <div className="space-y-1.5">
          <button
            onClick={() => onCategoryChange("all")}
            className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all ${
              activeCategory === "all"
                ? "bg-gradient-to-r from-blue-500/20 to-cyan-500/20 text-blue-400 border border-blue-500/30"
                : "hover:bg-white/5 text-gray-400 hover:text-white"
            }`}
          >
            全部
          </button>
          {categories.map((cat) => (
            <button
              key={cat.slug}
              onClick={() => onCategoryChange(cat.slug)}
              className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all ${
                activeCategory === cat.slug
                  ? "bg-gradient-to-r from-blue-500/20 to-cyan-500/20 text-blue-400 border border-blue-500/30"
                  : "hover:bg-white/5 text-gray-400 hover:text-white"
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* 知乎主页链接 */}
      <div className="mt-6 pt-4 border-t border-white/10">
        <a
          href="https://www.zhihu.com/people/bai-ri-meng-you-54-77"
          target="_blank"
          rel="noopener"
          className="flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-gradient-to-r from-blue-500 to-cyan-500 text-white text-sm font-medium hover:opacity-90 transition-opacity"
        >
          <span>访问知乎主页</span>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
            <path d="M14 3v2h3.59l-9.83 9.83 1.41 1.41L19 6.41V10h2V3h-7zM19 19H5V5h7V3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2v-7h-2v7z"/>
          </svg>
        </a>
      </div>
    </motion.aside>
  );
}
