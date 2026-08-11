"use client";

import { useState, useMemo, useEffect } from "react";
import { motion } from "framer-motion";
import { HiHeart, HiStar, HiArrowUp, HiUserAdd, HiSparkles } from "react-icons/hi";
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

const typeColors: Record<ZhihuContent["type"], { bg: string; text: string }> = {
  answer: { bg: "bg-blue-500/15", text: "text-blue-400" },
  article: { bg: "bg-pink-500/15", text: "text-pink-400" },
  pin: { bg: "bg-yellow-500/15", text: "text-yellow-400" },
};

const typeLabels: Record<ZhihuContent["type"], string> = {
  answer: "回答",
  article: "文章",
  pin: "想法",
};

function timeAgo(timestamp: number): string {
  if (!timestamp) return "";
  const diff = (Date.now() / 1000) - timestamp;
  if (diff < 60) return "刚刚";
  if (diff < 3600) return `${Math.floor(diff / 60)}分钟前`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}小时前`;
  if (diff < 2592000) return `${Math.floor(diff / 86400)}天前`;
  if (diff < 31536000) return `${Math.floor(diff / 2592000)}个月前`;
  return `${Math.floor(diff / 31536000)}年前`;
}

export default function ZhihuSidebar({ activeFilter, onFilterChange }: ZhihuSidebarProps) {
  const profileUrl = "https://www.zhihu.com/people/bai-ri-meng-you-54-77";
  const zhihuHome = "https://www.zhihu.com/";

  // 尝试从 public 加载自动抓取的数据
  const [liveStats, setLiveStats] = useState<{ followers?: number; updated?: string } | null>(null);
  useEffect(() => {
    fetch("/zhihu.json", { cache: "no-store" })
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (data) setLiveStats({ followers: data.followers, updated: data.updated });
      })
      .catch(() => {});
  }, []);

  // 从数据中统计
  const counts = useMemo(() => ({
    answer: zhihuContents.filter((c) => c.type === "answer").length,
    article: zhihuContents.filter((c) => c.type === "article").length,
    pin: zhihuContents.filter((c) => c.type === "pin").length,
  }), []);

  // 显示统计
  const stats = {
    answer: zhihuStats?.answerCount || counts.answer || 17,
    article: zhihuStats?.articleCount || counts.article || 2,
    pin: zhihuStats?.pinCount || counts.pin || 0,
    likes: zhihuStats?.likes || 0,
    thanks: zhihuStats?.thanks || 0,
    favorites: zhihuStats?.favorites || 0,
    followers: liveStats?.followers ?? 18, // 默认 18
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
      className="hidden lg:block w-64 flex-shrink-0 sticky top-24 self-start max-h-[calc(100vh-7rem)] overflow-y-auto pr-1"
    >
      {/* 装饰渐变卡片 */}
      <div className="relative group">
        {/* 背景光晕 */}
        <div className="absolute -inset-1 bg-gradient-to-r from-blue-500/20 via-cyan-500/20 to-pink-500/20 rounded-2xl blur opacity-50 group-hover:opacity-70 transition-opacity" />

        <div className="relative glass rounded-2xl overflow-hidden">
          {/* 顶部装饰条 */}
          <div className="h-1 bg-gradient-to-r from-blue-500 via-cyan-400 to-pink-500" />

          <div className="p-4">
            {/* 知乎标题（跳首页） */}
            <a
              href={zhihuHome}
              target="_blank"
              rel="noopener"
              className="flex items-center justify-between mb-3 group/title"
            >
              <div className="flex items-center gap-2">
                <div className="relative">
                  <div className="absolute inset-0 bg-blue-500/30 rounded blur-md" />
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" className="relative text-blue-400 group-hover/title:text-blue-300 transition-colors">
                    <path d="M5.721 0C2.251 0 0 2.25 0 5.719V18.28C0 21.75 2.251 24 5.721 24h12.56C21.751 24 24 21.75 24 18.281V5.72C24 2.249 21.751 0 18.281 0H5.721zM3.6 5.4h1.8v6c0 1.657 1.343 3 3 3s3-1.343 3-3V5.4h1.8v6c0 2.652-2.148 4.8-4.8 4.8S3.6 14.052 3.6 11.4V5.4zm10.8 0h1.8v3.6h-1.8V5.4zm-3.6 0h1.8v3.6h-1.8V5.4zm-3.6 0h1.8v3.6h-1.8V5.4zM14.4 11.4h1.8v3.6c0 .5.4.9.9.9h2.7v1.8h-2.7c-1.5 0-2.7-1.2-2.7-2.7V11.4z" />
                  </svg>
                </div>
                <h3 className="text-base font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                  知乎
                </h3>
              </div>
              <HiSparkles className="text-yellow-400/60" size={14} />
            </a>

            {/* 作者信息（跳个人主页） */}
            <a
              href={profileUrl}
              target="_blank"
              rel="noopener"
              className="flex items-center gap-3 mb-4 p-2 -m-2 rounded-xl hover:bg-white/5 transition-all"
            >
              {/* 头像带光晕 */}
              <div className="relative flex-shrink-0">
                <div className="absolute -inset-0.5 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full blur opacity-60" />
                <div className="relative w-12 h-12 rounded-full overflow-hidden bg-gradient-to-br from-blue-500 to-cyan-500 ring-2 ring-white/10">
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
                {/* 在线点 */}
                <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full ring-2 ring-gray-900" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1">
                  <span className="font-semibold text-sm">白日梦游</span>
                  <span className="text-blue-400 text-xs">✓</span>
                </div>
                <div className="text-[10px] text-gray-400 mt-0.5">中山大学 · 光学工程硕士在读</div>
              </div>
            </a>

            {/* 三个统计卡片（带渐变和悬停） */}
            <div className="grid grid-cols-3 gap-1.5 mb-3">
              <a
                href={`${profileUrl}/answers`}
                target="_blank"
                rel="noopener"
                className="relative overflow-hidden rounded-lg p-2 text-center bg-gradient-to-br from-blue-500/10 to-blue-500/5 ring-1 ring-blue-500/20 hover:ring-blue-400/50 transition-all"
              >
                <div className="text-lg font-bold text-blue-400">{stats.answer}</div>
                <div className="text-[10px] text-gray-400 mt-0.5">回答</div>
              </a>
              <a
                href={`${profileUrl}/posts`}
                target="_blank"
                rel="noopener"
                className="relative overflow-hidden rounded-lg p-2 text-center bg-gradient-to-br from-pink-500/10 to-pink-500/5 ring-1 ring-pink-500/20 hover:ring-pink-400/50 transition-all"
              >
                <div className="text-lg font-bold text-pink-400">{stats.article}</div>
                <div className="text-[10px] text-gray-400 mt-0.5">文章</div>
              </a>
              <a
                href={profileUrl}
                target="_blank"
                rel="noopener"
                className="relative overflow-hidden rounded-lg p-2 text-center bg-gradient-to-br from-cyan-500/10 to-cyan-500/5 ring-1 ring-cyan-500/20 hover:ring-cyan-400/50 transition-all"
                title={liveStats?.updated ? `自动更新: ${liveStats.updated}` : "暂无自动数据"}
              >
                <div className="text-lg font-bold text-cyan-400 flex items-center justify-center gap-0.5">
                  <HiUserAdd size={11} className="opacity-70" />
                  {stats.followers}
                </div>
                <div className="text-[10px] text-gray-400 mt-0.5">关注者</div>
              </a>
            </div>

            {/* 互动统计（无链接，知乎风格） */}
            {(stats.likes > 0 || stats.thanks > 0 || stats.favorites > 0) && (
              <div className="mb-3 pb-3 border-b border-white/10 text-xs space-y-1.5">
                {stats.likes > 0 && (
                  <div className="flex items-center gap-2 px-1">
                    <HiArrowUp className="text-blue-400 flex-shrink-0" size={12} />
                    <span className="text-gray-400">获得 <span className="text-blue-300 font-semibold">{stats.likes}</span> 次赞同</span>
                  </div>
                )}
                {stats.thanks > 0 && (
                  <div className="flex items-center gap-2 px-1">
                    <HiHeart className="text-pink-400 flex-shrink-0" size={12} />
                    <span className="text-gray-400">获得 <span className="text-pink-300 font-semibold">{stats.thanks}</span> 次喜欢</span>
                  </div>
                )}
                {stats.favorites > 0 && (
                  <div className="flex items-center gap-2 px-1">
                    <HiStar className="text-yellow-400 flex-shrink-0" size={12} />
                    <span className="text-gray-400">获得 <span className="text-yellow-300 font-semibold">{stats.favorites}</span> 次收藏</span>
                  </div>
                )}
              </div>
            )}

            {/* 分类筛选（知乎风格，胶囊形） */}
            <div className="flex flex-wrap gap-1.5 mb-3">
              {filters.map((f) => {
                const count = f.key === "answer" ? counts.answer : f.key === "article" ? counts.article : f.key === "pin" ? counts.pin : counts.answer + counts.article + counts.pin;
                if (count === 0) return null;
                return (
                  <button
                    key={f.key}
                    onClick={() => onFilterChange(f.key)}
                    className={`px-2.5 py-1 rounded-full text-[11px] font-medium transition-all ${
                      activeFilter === f.key
                        ? "bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg shadow-blue-500/30"
                        : "bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white"
                    }`}
                  >
                    {f.label} <span className="opacity-70">{count}</span>
                  </button>
                );
              })}
            </div>

            {/* 作品列表 */}
            {filteredItems.length === 0 ? (
              <div className="text-center text-gray-500 text-xs py-6">
                <div className="opacity-50 text-2xl mb-1">📭</div>
                暂无内容
              </div>
            ) : (
              <div className="space-y-2 max-h-96 overflow-y-auto pr-1 -mr-1">
                {filteredItems.map((item, i) => (
                  <motion.a
                    key={item.url}
                    href={item.url}
                    target="_blank"
                    rel="noopener"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="block group/item p-2.5 rounded-xl bg-white/5 hover:bg-white/10 ring-1 ring-white/5 hover:ring-blue-400/30 transition-all"
                  >
                    <div className="flex items-center gap-1.5 mb-1">
                      <span className={`px-1.5 py-0.5 text-[9px] font-medium rounded ${typeColors[item.type].bg} ${typeColors[item.type].text}`}>
                        {typeLabels[item.type]}
                      </span>
                      <span className="text-[10px] text-gray-500">{timeAgo(item.createdAt)}</span>
                    </div>
                    <div className="text-xs font-medium leading-relaxed line-clamp-2 group-hover/item:text-blue-400 transition-colors">
                      {item.title}
                    </div>
                    {item.likeCount > 0 && (
                      <div className="flex items-center gap-0.5 text-[10px] text-pink-400 mt-1">
                        <HiHeart size={9} /> {item.likeCount}
                      </div>
                    )}
                  </motion.a>
                ))}
              </div>
            )}

            {/* 底部时间戳 */}
            {liveStats?.updated && (
              <div className="mt-3 pt-2 border-t border-white/5 text-[9px] text-gray-500 text-center flex items-center justify-center gap-1">
                <span className="w-1 h-1 rounded-full bg-green-500 animate-pulse" />
                自动更新于 {liveStats.updated}
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.aside>
  );
}
