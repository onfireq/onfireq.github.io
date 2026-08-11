"use client";

import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { HiX, HiExternalLink, HiHeart, HiChatAlt2 } from "react-icons/hi";
import { zhihuContents, type ZhihuContent } from "@/data/zhihu";

const typeConfig: Record<string, { label: string; color: string; icon: string }> = {
  answer: { label: "回答", color: "from-blue-500 to-cyan-500", icon: "💬" },
  article: { label: "文章", color: "from-purple-500 to-pink-500", icon: "📄" },
  pin: { label: "想法", color: "from-yellow-500 to-orange-500", icon: "💡" },
  video: { label: "视频", color: "from-red-500 to-pink-500", icon: "🎬" },
  question: { label: "提问", color: "from-purple-500 to-indigo-500", icon: "❓" },
};

function formatDate(timestamp: number | string): string {
  if (!timestamp) return "";
  const time = typeof timestamp === 'string' ? new Date(timestamp).getTime() / 1000 : timestamp;
  const date = new Date(time * 1000);
  const now = new Date();
  const diff = (now.getTime() - date.getTime()) / 1000;
  if (diff < 60) return "刚刚";
  if (diff < 3600) return `${Math.floor(diff / 60)}分钟前`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}小时前`;
  if (diff < 2592000) return `${Math.floor(diff / 86400)}天前`;
  return date.toLocaleDateString("zh-CN", { month: "2-digit", day: "2-digit" });
}

function stripImageMarkers(text: string): string {
  // 去掉知乎内容里的 [图片] 标记
  return text.replace(/\[图片\]/g, "").trim();
}

export default function ZhihuFloating() {
  const [open, setOpen] = useState(false);
  const [filter, setFilter] = useState<"all" | ZhihuContent["type"]>("all");

  const stats = useMemo(() => {
    const typeCount: Record<string, number> = { answer: 0, article: 0, pin: 0 };
    let totalLikes = 0;
    zhihuContents.forEach((c) => {
      typeCount[c.type] = (typeCount[c.type] || 0) + 1;
      totalLikes += c.likeCount;
    });
    return { typeCount, totalLikes, total: zhihuContents.length };
  }, []);

  const filtered = useMemo(() => {
    let list = [...zhihuContents].sort((a, b) => {
      // 处理两种可能的 createdAt 类型：string（ISO 格式）或 number（时间戳）
      const aTime = typeof a.createdAt === 'string' ? new Date(a.createdAt).getTime() : a.createdAt;
      const bTime = typeof b.createdAt === 'string' ? new Date(b.createdAt).getTime() : b.createdAt;
      return bTime - aTime;
    });
    if (filter !== "all") {
      list = list.filter((c) => c.type === filter);
    }
    return list;
  }, [filter]);

  // 浮动按钮位置
  return (
    <>
      {/* 浮动按钮 */}
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 1, type: "spring" }}
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 z-40 w-14 h-14 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg shadow-blue-500/30 flex items-center justify-center hover:scale-110 transition-transform"
        title="知乎创作"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
          <path d="M5.721 0C2.251 0 0 2.25 0 5.719V18.28C0 21.75 2.251 24 5.721 24h12.56C21.751 24 24 21.75 24 18.281V5.72C24 2.249 21.751 0 18.281 0H5.721zM3.6 5.4h1.8v6c0 1.657 1.343 3 3 3s3-1.343 3-3V5.4h1.8v6c0 2.652-2.148 4.8-4.8 4.8S3.6 14.052 3.6 11.4V5.4zm10.8 0h1.8v3.6h-1.8V5.4zm-3.6 0h1.8v3.6h-1.8V5.4zm-3.6 0h1.8v3.6h-1.8V5.4zM14.4 11.4h1.8v3.6c0 .5.4.9.9.9h2.7v1.8h-2.7c-1.5 0-2.7-1.2-2.7-2.7V11.4z" />
        </svg>
        {stats.total > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-red-500 text-white text-xs flex items-center justify-center font-medium">
            {stats.total}
          </span>
        )}
      </motion.button>

      {/* 弹窗 */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(false)}
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-end md:items-center justify-end md:justify-end p-0 md:p-6"
          >
            <motion.div
              initial={{ x: 400, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 400, opacity: 0 }}
              transition={{ type: "spring", damping: 25 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full md:w-[480px] h-screen md:h-[85vh] md:rounded-2xl bg-surface-900 md:border border-white/10 flex flex-col"
            >
              {/* 头部 */}
              <div className="flex items-center justify-between p-4 border-b border-white/10">
                <div>
                  <h3 className="font-bold text-lg flex items-center gap-2">
                    <span className="text-blue-400">知乎</span>
                    <span className="text-gray-400 text-sm">创作</span>
                  </h3>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {stats.total} 个内容 · {stats.totalLikes} 获赞
                  </p>
                </div>
                <button
                  onClick={() => setOpen(false)}
                  className="p-2 rounded-full hover:bg-white/10 transition"
                >
                  <HiX size={20} />
                </button>
              </div>

              {/* 筛选 */}
              <div className="flex gap-2 px-4 py-3 border-b border-white/10">
                {(["all", "answer", "article", "pin", "video", "question"] as const).map((t) => (
                  <button
                    key={t}
                    onClick={() => setFilter(t)}
                    className={`px-3 py-1 text-xs rounded-full transition ${
                      filter === t
                        ? "bg-gradient-to-r from-blue-500 to-cyan-500 text-white"
                        : "bg-white/5 text-gray-400 hover:bg-white/10"
                    }`}
                  >
                    {t === "all" ? "全部" : typeConfig[t].label}
                    {t !== "all" && stats.typeCount[t] > 0 && ` (${stats.typeCount[t]})`}
                  </button>
                ))}
              </div>

              {/* 关于作者 */}
              <div className="px-4 py-4 border-b border-white/10 bg-white/[0.02]">
                <h4 className="text-xs text-gray-500 mb-2.5">关于作者</h4>
                <div className="flex items-center gap-3 mb-3">
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
                    <div className="font-semibold text-sm">白日梦游</div>
                    <div className="text-xs text-gray-500">名不显时心不朽</div>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-gray-400 mb-3">
                  <span className="px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-400">✓</span>
                  <span>中山大学 · 光学工程硕士在读</span>
                </div>
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div>
                    <div className="text-base font-bold text-blue-400">{stats.typeCount.answer || 0}</div>
                    <div className="text-[10px] text-gray-500 mt-0.5">回答</div>
                  </div>
                  <div>
                    <div className="text-base font-bold text-pink-400">{stats.typeCount.article || 0}</div>
                    <div className="text-[10px] text-gray-500 mt-0.5">文章</div>
                  </div>
                  <div>
                    <div className="text-base font-bold text-cyan-400">{stats.totalLikes}</div>
                    <div className="text-[10px] text-gray-500 mt-0.5">关注者</div>
                  </div>
                </div>
              </div>

              {/* 列表 */}
              <div className="flex-1 overflow-y-auto p-3 space-y-2">
                {filtered.length === 0 ? (
                  <div className="text-center py-12 text-gray-500 text-sm">
                    {stats.total === 0 ? "还没有数据" : "该分类下无内容"}
                  </div>
                ) : (
                  filtered.map((item) => {
                    const config = typeConfig[item.type] || typeConfig.answer;
                    return (
                      <a
                        key={item.url}
                        href={item.url}
                        target="_blank"
                        rel="noopener"
                        className="block p-3 rounded-lg bg-white/[0.03] hover:bg-white/[0.08] border border-white/5 hover:border-white/20 transition-all group"
                      >
                        <div className="flex items-start gap-2.5">
                          <div className={`w-9 h-9 rounded-lg bg-gradient-to-br ${config.color} flex items-center justify-center text-base flex-shrink-0`}>
                            {config.icon}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-1.5 mb-1">
                              <span className="text-xs text-blue-400">{config.label}</span>
                              <span className="text-xs text-gray-500">·</span>
                              <span className="text-xs text-gray-500">{formatDate(item.createdAt)}</span>
                            </div>
                            <h4 className="text-sm font-medium mb-1 line-clamp-2 group-hover:text-blue-400 transition-colors">
                              {item.title}
                            </h4>
                            {item.summary && (
                              <p className="text-xs text-gray-400 line-clamp-2 mb-1">
                                {stripImageMarkers(item.summary)}
                              </p>
                            )}
                            {item.likeCount > 0 && (
                              <span className="text-xs text-pink-400 flex items-center gap-1">
                                <HiHeart size={11} /> {item.likeCount}
                              </span>
                            )}
                          </div>
                          <HiExternalLink size={12} className="text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
                        </div>
                      </a>
                    );
                  })
                )}
              </div>

              {/* 底部 */}
              <div className="p-3 border-t border-white/10 text-center">
                <a
                  href="https://www.zhihu.com/people/bai-ri-meng-you-54-77"
                  target="_blank"
                  rel="noopener"
                  className="inline-flex items-center gap-1 text-xs text-blue-400 hover:underline"
                >
                  访问知乎主页 <HiExternalLink size={12} />
                </a>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
