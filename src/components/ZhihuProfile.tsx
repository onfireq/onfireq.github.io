"use client";

import { motion } from "framer-motion";
import { zhihuContents, type ZhihuContent } from "@/data/zhihu";

interface BlogCategory {
  slug: string;
  name: string;
}

interface ZhihuProfileProps {
  activeFilter: "all" | ZhihuContent["type"];
  onFilterChange: (type: "all" | ZhihuContent["type"]) => void;
}

const filters: Array<{ key: "all" | ZhihuContent["type"]; label: string }> = [
  { key: "all", label: "全部" },
  { key: "answer", label: "回答" },
  { key: "article", label: "文章" },
  { key: "pin", label: "想法" },
];

export default function ZhihuProfile({ activeFilter, onFilterChange }: ZhihuProfileProps) {
  const stats = {
    answer: zhihuContents.filter((c) => c.type === "answer").length,
    article: zhihuContents.filter((c) => c.type === "article").length,
    pin: zhihuContents.filter((c) => c.type === "pin").length,
    video: zhihuContents.filter((c) => c.type === "video").length,
    question: zhihuContents.filter((c) => c.type === "question").length,
    likes: zhihuContents.reduce((s, c) => s + c.likeCount, 0),
  };

  const profileUrl = "https://www.zhihu.com/people/bai-ri-meng-you-54-77";
  const urlFor = (type: ZhihuContent["type"]) => {
    const map: Record<ZhihuContent["type"], string> = {
      answer: `${profileUrl}/answers`,
      article: `${profileUrl}/posts`,
      pin: `${profileUrl}/pins`,
      video: `${profileUrl}/zvideo`,
      question: `${profileUrl}/asks`,
    };
    return map[type];
  };

  return (
    <motion.aside
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
      className="hidden lg:block w-60 flex-shrink-0 sticky top-24 self-start max-h-[calc(100vh-7rem)] overflow-y-auto pr-2"
    >
      <div className="glass p-5">
        {/* 标题：知乎 + 图标 */}
        <div className="flex items-center gap-2 mb-4">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" className="text-blue-400">
            <path d="M5.721 0C2.251 0 0 2.25 0 5.719V18.28C0 21.75 2.251 24 5.721 24h12.56C21.751 24 24 21.75 24 18.281V5.72C24 2.249 21.751 0 18.281 0H5.721zM3.6 5.4h1.8v6c0 1.657 1.343 3 3 3s3-1.343 3-3V5.4h1.8v6c0 2.652-2.148 4.8-4.8 4.8S3.6 14.052 3.6 11.4V5.4zm10.8 0h1.8v3.6h-1.8V5.4zm-3.6 0h1.8v3.6h-1.8V5.4zm-3.6 0h1.8v3.6h-1.8V5.4zM14.4 11.4h1.8v3.6c0 .5.4.9.9.9h2.7v1.8h-2.7c-1.5 0-2.7-1.2-2.7-2.7V11.4z" />
          </svg>
          <h3 className="text-base font-semibold">知乎</h3>
        </div>

        {/* 关于作者（可点击头像+名字进入主页） */}
        <a
          href={profileUrl}
          target="_blank"
          rel="noopener"
          className="flex items-start gap-3 mb-4 -m-1 p-1 rounded-lg hover:bg-white/5 transition-colors"
        >
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
            <div className="flex items-center gap-1 text-xs text-gray-400 mt-1">
              <span className="px-1 py-0.5 rounded bg-blue-500/20 text-blue-400 text-[10px]">✓</span>
              <span>中山大学·光学工程硕士</span>
            </div>
          </div>
        </a>

        {/* 统计（可点击） */}
        <div className="grid grid-cols-3 gap-2 text-center mb-4 pb-4 border-b border-white/10">
          <a
            href={urlFor("answer")}
            target="_blank"
            rel="noopener"
            className="block py-1 rounded-lg hover:bg-white/5 transition-colors"
          >
            <div className="text-lg font-bold text-blue-400">{stats.answer}</div>
            <div className="text-[10px] text-gray-500 mt-0.5">回答</div>
          </a>
          <a
            href={urlFor("article")}
            target="_blank"
            rel="noopener"
            className="block py-1 rounded-lg hover:bg-white/5 transition-colors"
          >
            <div className="text-lg font-bold text-pink-400">{stats.article}</div>
            <div className="text-[10px] text-gray-500 mt-0.5">文章</div>
          </a>
          <a
            href={profileUrl}
            target="_blank"
            rel="noopener"
            className="block py-1 rounded-lg hover:bg-white/5 transition-colors"
          >
            <div className="text-lg font-bold text-cyan-400">{stats.likes}</div>
            <div className="text-[10px] text-gray-500 mt-0.5">获赞</div>
          </a>
        </div>

        {/* 知乎作品分类（原"大家都在搜"位置） */}
        <div className="space-y-1">
          {filters.map((f) => (
            <button
              key={f.key}
              onClick={() => onFilterChange(f.key)}
              className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all ${
                activeFilter === f.key
                  ? "bg-gradient-to-r from-blue-500/20 to-cyan-500/20 text-blue-400 border border-blue-500/30"
                  : "hover:bg-white/5 text-gray-400 hover:text-white"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>
    </motion.aside>
  );
}
