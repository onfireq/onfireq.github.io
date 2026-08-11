"use client";

import { motion } from "framer-motion";
import { HiExternalLink, HiHeart } from "react-icons/hi";
import { zhihuContents, type ZhihuContent } from "@/data/zhihu";

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
  const stats = {
    answer: zhihuContents.filter((c) => c.type === "answer").length,
    article: zhihuContents.filter((c) => c.type === "article").length,
    pin: zhihuContents.filter((c) => c.type === "pin").length,
    likes: zhihuContents.reduce((s, c) => s + c.likeCount, 0),
  };

  const profileUrl = "https://www.zhihu.com/people/bai-ri-meng-you-54-77";
  const urlFor = (type: ZhihuContent["type"]) => {
    const map: Record<ZhihuContent["type"], string> = {
      answer: `${profileUrl}/answers`,
      article: `${profileUrl}/posts`,
      pin: `${profileUrl}/pins`,
    };
    return map[type];
  };

  // 侧边栏显示前 3 条
  const topItems = [...zhihuContents]
    .sort((a, b) => b.createdAt - a.createdAt)
    .slice(0, 3);

  return (
    <motion.aside
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
      className="hidden lg:block w-60 flex-shrink-0 sticky top-24 self-start max-h-[calc(100vh-7rem)] overflow-y-auto pr-2"
    >
      <div className="glass p-4">
        {/* 标题 */}
        <a
          href={profileUrl}
          target="_blank"
          rel="noopener"
          className="flex items-center gap-2 mb-4 group"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="text-blue-400">
            <path d="M5.721 0C2.251 0 0 2.25 0 5.719V18.28C0 21.75 2.251 24 5.721 24h12.56C21.751 24 24 21.75 24 18.281V5.72C24 2.249 21.751 0 18.281 0H5.721zM3.6 5.4h1.8v6c0 1.657 1.343 3 3 3s3-1.343 3-3V5.4h1.8v6c0 2.652-2.148 4.8-4.8 4.8S3.6 14.052 3.6 11.4V5.4zm10.8 0h1.8v3.6h-1.8V5.4zm-3.6 0h1.8v3.6h-1.8V5.4zm-3.6 0h1.8v3.6h-1.8V5.4zM14.4 11.4h1.8v3.6c0 .5.4.9.9.9h2.7v1.8h-2.7c-1.5 0-2.7-1.2-2.7-2.7V11.4z" />
          </svg>
          <h3 className="text-sm font-semibold group-hover:text-blue-400 transition-colors">知乎</h3>
        </a>

        {/* 作者信息（可点击） */}
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
        <div className="grid grid-cols-3 gap-1 text-center mb-3">
          <a href={urlFor("answer")} target="_blank" rel="noopener" className="block py-1 rounded hover:bg-white/5 transition-colors">
            <div className="text-sm font-bold text-blue-400">{stats.answer}</div>
            <div className="text-[9px] text-gray-500">回答</div>
          </a>
          <a href={urlFor("article")} target="_blank" rel="noopener" className="block py-1 rounded hover:bg-white/5 transition-colors">
            <div className="text-sm font-bold text-pink-400">{stats.article}</div>
            <div className="text-[9px] text-gray-500">文章</div>
          </a>
          <a href={profileUrl} target="_blank" rel="noopener" className="block py-1 rounded hover:bg-white/5 transition-colors">
            <div className="text-sm font-bold text-cyan-400">{stats.likes}</div>
            <div className="text-[9px] text-gray-500">获赞</div>
          </a>
        </div>

        {/* 分类筛选 */}
        <div className="space-y-0.5 mb-3 pb-3 border-b border-white/10">
          {filters.map((f) => (
            <button
              key={f.key}
              onClick={() => onFilterChange(f.key)}
              className={`w-full text-left px-2.5 py-1.5 rounded text-xs transition-all ${
                activeFilter === f.key
                  ? "bg-gradient-to-r from-blue-500/20 to-cyan-500/20 text-blue-400"
                  : "hover:bg-white/5 text-gray-400 hover:text-white"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* 作品摘要（前 3 条） */}
        <div className="space-y-2">
          {topItems.map((item) => (
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

        {/* 查看更多 */}
        <a
          href={urlFor(activeFilter === "all" ? "answer" : activeFilter)}
          target="_blank"
          rel="noopener"
          className="flex items-center justify-center gap-1 mt-3 py-1.5 text-xs text-blue-400 hover:text-blue-300 transition-colors"
        >
          查看更多 <HiExternalLink size={10} />
        </a>
      </div>
    </motion.aside>
  );
}
