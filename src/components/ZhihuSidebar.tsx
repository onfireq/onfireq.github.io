"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { HiHeart } from "react-icons/hi";
import { zhihuContents, zhihuStats, type ZhihuContent } from "@/data/zhihu";

interface ZhihuSidebarProps {
  activeFilter: "all" | ZhihuContent["type"];
  onFilterChange: (type: "all" | ZhihuContent["type"]) => void;
}

const filters: Array<{ key: "all" | ZhihuContent["type"]; label: string }> = [
  { key: "all", label: "全部" },
  { key: "answer", label: "回答" },
  { key: "article", label: "文章" },
  { key: "pin", label: "想法" },
];

const typeColors: Record<ZhihuContent["type"], string> = {
  answer: "bg-blue-500/20 text-blue-400",
  article: "bg-pink-500/20 text-pink-400",
  pin: "bg-yellow-500/20 text-yellow-400",
};

const typeLabels: Record<ZhihuContent["type"], string> = {
  answer: "回答",
  article: "文章",
  pin: "想法",
};

function timeAgo(timestamp: number): string {
  if (!timestamp) return "";
  const diff = (Date.now() / 1000) - timestamp;
  if (diff < 86400) return "今天";
  if (diff < 2592000) return `${Math.floor(diff / 86400)}天前`;
  if (diff < 31536000) return `${Math.floor(diff / 2592000)}个月前`;
  return `${Math.floor(diff / 31536000)}年前`;
}

export default function ZhihuSidebar({ activeFilter, onFilterChange }: ZhihuSidebarProps) {
  const profileUrl = "https://www.zhihu.com/people/bai-ri-meng-you-54-77";
  const zhihuHome = "https://www.zhihu.com/";

  // 从数据中统计
  const counts = useMemo(() => ({
    answer: zhihuContents.filter((c) => c.type === "answer").length,
    article: zhihuContents.filter((c) => c.type === "article").length,
    pin: zhihuContents.filter((c) => c.type === "pin").length,
  }), []);

  // 显示统计：优先用 zhihuStats（包含命令行的赞同/喜欢/收藏），否则用本地计数
  const stats = {
    answer: zhihuStats?.answerCount ?? counts.answer,
    article: zhihuStats?.articleCount ?? counts.article,
    pin: zhihuStats?.pinCount ?? counts.pin,
    likes: zhihuStats?.likes ?? 0,
    thanks: zhihuStats?.thanks ?? 0,
    favorites: zhihuStats?.favorites ?? 0,
  };

  const allItems = useMemo(() => {
    return [...zhihuContents].sort((a, b) => b.createdAt - a.createdAt);
  }, []);

  const filteredItems = useMemo(() => {
    if (activeFilter === "all") return allItems;
    return allItems.filter((c) => c.type === activeFilter);
  }, [allItems, activeFilter]);

  return (
    <motion.aside
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
      className="hidden lg:block w-60 flex-shrink-0 sticky top-24 self-start max-h-[calc(100vh-7rem)] overflow-y-auto pr-2"
    >
      <div className="glass p-4">
        {/* 知乎图标 → 跳转到 zhihu.com 知乎首页 */}
        <a
          href={zhihuHome}
          target="_blank"
          rel="noopener"
          className="flex items-center gap-2 mb-3 group"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" className="text-blue-400 group-hover:text-blue-300">
            <path d="M5.721 0C2.251 0 0 2.25 0 5.719V18.28C0 21.75 2.251 24 5.721 24h12.56C21.751 24 24 21.75 24 18.281V5.72C24 2.249 21.751 0 18.281 0H5.721zM3.6 5.4h1.8v6c0 1.657 1.343 3 3 3s3-1.343 3-3V5.4h1.8v6c0 2.652-2.148 4.8-4.8 4.8S3.6 14.052 3.6 11.4V5.4zm10.8 0h1.8v3.6h-1.8V5.4zm-3.6 0h1.8v3.6h-1.8V5.4zm-3.6 0h1.8v3.6h-1.8V5.4zM14.4 11.4h1.8v3.6c0 .5.4.9.9.9h2.7v1.8h-2.7c-1.5 0-2.7-1.2-2.7-2.7V11.4z" />
          </svg>
          <h3 className="text-sm font-semibold group-hover:text-blue-400 transition-colors">知乎</h3>
        </a>

        {/* 作者信息（可点击 → 知乎个人主页） */}
        <a
          href={profileUrl}
          target="_blank"
          rel="noopener"
          className="flex items-center gap-2.5 mb-3 -m-1 p-1 rounded-lg hover:bg-white/5 transition-colors"
        >
          <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0 bg-gradient-to-br from-blue-500 to-cyan-500">
            <img
              src="/images/avatar.jpg"
              alt="onfireq"
              className="w-full h-full object-cover"
              onError={(e) => {
                const t = e.target as HTMLImageElement;
                t.style.display = "none";
                t.parentElement!.innerHTML = '<div class="w-full h-full flex items-center justify-center text-base">👨‍💻</div>';
              }}
            />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1">
              <span className="font-medium text-sm">白日梦游</span>
              <span className="text-blue-400 text-xs">✓</span>
            </div>
            <div className="text-[10px] text-gray-500">光学工程硕士在读</div>
          </div>
        </a>

        {/* 统计（可点击） */}
        <div className="grid grid-cols-3 gap-1 text-center mb-3 pb-3 border-b border-white/10">
          <a href={`${profileUrl}/answers`} target="_blank" rel="noopener" className="block py-1 rounded hover:bg-white/5 transition-colors">
            <div className="text-sm font-bold text-blue-400">{stats.answer}</div>
            <div className="text-[9px] text-gray-500">回答</div>
          </a>
          <a href={`${profileUrl}/posts`} target="_blank" rel="noopener" className="block py-1 rounded hover:bg-white/5 transition-colors">
            <div className="text-sm font-bold text-pink-400">{stats.article}</div>
            <div className="text-[9px] text-gray-500">文章</div>
          </a>
          <a href={profileUrl} target="_blank" rel="noopener" className="block py-1 rounded hover:bg-white/5 transition-colors">
            <div className="text-sm font-bold text-cyan-400">{stats.likes}</div>
            <div className="text-[9px] text-gray-500">关注者</div>
          </a>
        </div>

        {/* 汇总信息（无链接，显示互动数据） */}
        {(stats.likes > 0 || stats.thanks > 0 || stats.favorites > 0) && (
          <div className="mb-3 pb-3 border-b border-white/10 text-xs text-gray-400 space-y-1.5">
            {stats.likes > 0 && (
              <div className="flex items-center gap-1.5">
                <span className="text-gray-500">▲</span>
                <span>获得 <span className="text-blue-400 font-semibold">{stats.likes}</span> 次赞同</span>
              </div>
            )}
            {stats.thanks > 0 && (
              <div className="flex items-center gap-1.5">
                <span className="text-gray-500">♥</span>
                <span>获得 <span className="text-pink-400 font-semibold">{stats.thanks}</span> 次喜欢</span>
              </div>
            )}
            {stats.favorites > 0 && (
              <div className="flex items-center gap-1.5">
                <span className="text-gray-500">★</span>
                <span>获得 <span className="text-yellow-400 font-semibold">{stats.favorites}</span> 次收藏</span>
              </div>
            )}
          </div>
        )}

        {/* 分类筛选 → 联动下方作品列表 */}
        <div className="space-y-0.5 mb-3">
          {filters.map((f) => {
            const count = f.key === "answer" ? counts.answer : f.key === "article" ? counts.article : f.key === "pin" ? counts.pin : counts.answer + counts.article + counts.pin;
            if (count === 0) return null;
            return (
              <button
                key={f.key}
                onClick={() => onFilterChange(f.key)}
                className={`w-full text-left px-2.5 py-1.5 rounded text-xs transition-all ${
                  activeFilter === f.key
                    ? "bg-gradient-to-r from-blue-500/20 to-cyan-500/20 text-blue-400"
                    : "hover:bg-white/5 text-gray-400 hover:text-white"
                }`}
              >
                <span className="flex items-center justify-between">
                  <span>{f.label}</span>
                  <span className="text-[10px] opacity-60">{count}</span>
                </span>
              </button>
            );
          })}
        </div>

        {/* 作品列表（跟着筛选走） */}
        {filteredItems.length === 0 ? (
          <div className="text-center text-gray-500 text-xs py-4">暂无内容</div>
        ) : (
          <div className="space-y-2">
            {filteredItems.map((item) => (
              <a
                key={item.url}
                href={item.url}
                target="_blank"
                rel="noopener"
                className="block group p-2 rounded-lg hover:bg-white/5 transition-colors"
              >
                <div className="flex items-center gap-1.5 mb-1">
                  <span className={`px-1.5 py-0.5 text-[9px] rounded ${typeColors[item.type]}`}>
                    {typeLabels[item.type]}
                  </span>
                  <span className="text-[10px] text-gray-500">{timeAgo(item.createdAt)}</span>
                </div>
                <div className="text-xs font-medium line-clamp-2 group-hover:text-blue-400 transition-colors">
                  {item.title}
                </div>
                {item.likeCount > 0 && (
                  <div className="flex items-center gap-0.5 text-[10px] text-pink-400 mt-0.5">
                    <HiHeart size={9} /> {item.likeCount}
                  </div>
                )}
              </a>
            ))}
          </div>
        )}
      </div>
    </motion.aside>
  );
}
