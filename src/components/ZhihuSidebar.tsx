"use client";

import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import { HiArrowUp, HiChatAlt2, HiSparkles, HiStar, HiUserAdd } from "react-icons/hi";
import { zhihuContents, zhihuSnapshotUpdatedAt, zhihuStats } from "@/data/zhihu";
import {
  zhihuFeedSchema,
  type ZhihuContent,
  type ZhihuFeed,
} from "@/lib/zhihu-feed";

interface ZhihuSidebarProps {
  activeFilter: "all" | ZhihuContent["type"];
  onFilterChange: (type: "all" | ZhihuContent["type"]) => void;
}

type SyncMode = "snapshot" | "live" | "stale";

const FEED_URL =
  process.env.NEXT_PUBLIC_ZHIHU_FEED_URL ??
  "https://onfireq-zhihu-sync.2467708204.workers.dev/api/zhihu";
const REFRESH_INTERVAL_MS = 2 * 60 * 1000;
const REQUEST_TIMEOUT_MS = 5_000;
const FRESH_FOR_MS = 15 * 60 * 1000;

const filters: Array<{ key: "all" | ZhihuContent["type"]; label: string }> = [
  { key: "all", label: "全部" },
  { key: "answer", label: "回答" },
  { key: "article", label: "文章" },
  { key: "pin", label: "想法" },
  { key: "video", label: "视频" },
  { key: "question", label: "提问" },
];

const typeColors: Record<ZhihuContent["type"], { bg: string; text: string }> = {
  answer: { bg: "bg-blue-500/15", text: "text-blue-400" },
  article: { bg: "bg-pink-500/15", text: "text-pink-400" },
  pin: { bg: "bg-yellow-500/15", text: "text-yellow-400" },
  video: { bg: "bg-red-500/15", text: "text-red-400" },
  question: { bg: "bg-purple-500/15", text: "text-purple-400" },
};

const typeLabels: Record<ZhihuContent["type"], string> = {
  answer: "回答",
  article: "文章",
  pin: "想法",
  video: "视频",
  question: "提问",
};

const staticFeed = zhihuFeedSchema.parse({
  schemaVersion: 1,
  updatedAt: zhihuSnapshotUpdatedAt,
  profile: {
    followers: 18,
    followersSource: "manual",
  },
  stats: {
    answerCount: zhihuStats.answerCount,
    articleCount: zhihuStats.articleCount,
    pinCount: zhihuStats.pinCount,
    videoCount: zhihuStats.videoCount,
    questionCount: zhihuStats.questionCount,
    totalLikes: zhihuStats.totalLikes,
    totalComments: zhihuStats.totalComments,
    totalFavorites: zhihuStats.totalFavorites,
    windowSize: zhihuContents.length,
    totalAvailable: Math.max(zhihuStats.totals, zhihuContents.length),
  },
  contents: zhihuContents.map((item) => ({
    type: item.type,
    title: item.title,
    url: item.url,
    summary: item.summary,
    likeCount: item.likeCount,
    commentCount: item.commentCount,
    favoriteCount: item.favoriteCount,
    createdAt: toEpochSeconds(item.createdAt),
  })),
});

function toEpochSeconds(timestamp: number | string): number {
  if (typeof timestamp === "number") {
    return Math.floor(timestamp > 10_000_000_000 ? timestamp / 1000 : timestamp);
  }

  const numeric = Number(timestamp);
  if (Number.isFinite(numeric)) {
    return Math.floor(numeric > 10_000_000_000 ? numeric / 1000 : numeric);
  }

  const parsed = Date.parse(timestamp);
  return Number.isFinite(parsed) ? Math.floor(parsed / 1000) : 0;
}

function timeAgo(timestamp: number | string): string {
  const time = toEpochSeconds(timestamp);
  if (!time) return "";

  const diff = Math.max(0, Date.now() / 1000 - time);
  if (diff < 60) return "刚刚";
  if (diff < 3600) return `${Math.floor(diff / 60)}分钟前`;
  if (diff < 86_400) return `${Math.floor(diff / 3600)}小时前`;
  if (diff < 2_592_000) return `${Math.floor(diff / 86_400)}天前`;
  if (diff < 31_536_000) return `${Math.floor(diff / 2_592_000)}个月前`;
  return `${Math.floor(diff / 31_536_000)}年前`;
}

function useZhihuFeed(): { feed: ZhihuFeed; mode: SyncMode } {
  const [feed, setFeed] = useState<ZhihuFeed>(staticFeed);
  const [mode, setMode] = useState<SyncMode>("snapshot");
  const newestTimestamp = useRef(Date.parse(staticFeed.updatedAt));

  useEffect(() => {
    let disposed = false;
    let inFlight = false;
    let activeController: AbortController | null = null;
    const desktopQuery = window.matchMedia("(min-width: 64rem)");

    const refresh = async () => {
      if (
        disposed ||
        inFlight ||
        !desktopQuery.matches ||
        document.visibilityState === "hidden"
      ) {
        return;
      }

      inFlight = true;
      const controller = new AbortController();
      activeController = controller;
      const timeout = window.setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

      try {
        const response = await fetch(FEED_URL, {
          headers: { Accept: "application/json" },
          signal: controller.signal,
        });
        if (!response.ok) throw new Error(`Zhihu feed returned ${response.status}`);

        const result = zhihuFeedSchema.safeParse(await response.json());
        if (!result.success) throw new Error("Zhihu feed did not match the expected schema");

        const timestamp = Date.parse(result.data.updatedAt);
        if (!disposed && timestamp >= newestTimestamp.current) {
          newestTimestamp.current = timestamp;
          setFeed(result.data);
          setMode(Date.now() - timestamp <= FRESH_FOR_MS ? "live" : "stale");
        }
      } catch {
        if (!disposed) {
          setMode((current) => (current === "live" ? "stale" : current));
        }
      } finally {
        window.clearTimeout(timeout);
        if (activeController === controller) activeController = null;
        inFlight = false;
      }
    };

    void refresh();
    const interval = window.setInterval(() => void refresh(), REFRESH_INTERVAL_MS);
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") void refresh();
    };
    const handleViewportChange = (event: MediaQueryListEvent) => {
      if (event.matches) void refresh();
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);
    desktopQuery.addEventListener("change", handleViewportChange);

    return () => {
      disposed = true;
      activeController?.abort();
      window.clearInterval(interval);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      desktopQuery.removeEventListener("change", handleViewportChange);
    };
  }, []);

  return { feed, mode };
}

export default function ZhihuSidebar({ activeFilter, onFilterChange }: ZhihuSidebarProps) {
  const profileUrl = "https://www.zhihu.com/people/bai-ri-meng-you-54-77";
  const { feed, mode } = useZhihuFeed();

  const counts = useMemo(
    () => ({
      answer: feed.contents.filter((item) => item.type === "answer").length,
      article: feed.contents.filter((item) => item.type === "article").length,
      pin: feed.contents.filter((item) => item.type === "pin").length,
      video: feed.contents.filter((item) => item.type === "video").length,
      question: feed.contents.filter((item) => item.type === "question").length,
    }),
    [feed.contents],
  );

  const allItems = useMemo(
    () => [...feed.contents].sort((left, right) => right.createdAt - left.createdAt),
    [feed.contents],
  );

  const filteredItems = useMemo(
    () =>
      activeFilter === "all"
        ? allItems
        : allItems.filter((item) => item.type === activeFilter),
    [activeFilter, allItems],
  );

  const effectiveMode = mode;
  const syncLabel =
    effectiveMode === "live"
      ? `已同步 · ${timeAgo(feed.updatedAt)}`
      : effectiveMode === "stale"
        ? `同步较旧 · ${timeAgo(feed.updatedAt)}`
        : `静态快照 · ${timeAgo(feed.updatedAt)}`;
  const dotColor =
    effectiveMode === "live"
      ? "bg-green-500"
      : effectiveMode === "stale"
        ? "bg-amber-400"
        : "bg-gray-500";
  const statsTitle = `最近 ${feed.stats.windowSize} 条内容合计`;

  return (
    <motion.aside
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
      className="zhihu-sidebar-scroll hidden max-h-[calc(100vh-7rem)] w-64 flex-shrink-0 self-start overflow-y-auto pr-1 lg:sticky lg:top-24 lg:block"
    >
      <div className="glass overflow-hidden rounded-2xl">
        <div className="h-1 bg-gradient-to-r from-blue-500 via-cyan-400 to-pink-500" />

        <div className="p-4">
          <a
            href="https://www.zhihu.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="group/title mb-3 flex items-center justify-between"
          >
            <div className="flex items-center gap-2">
              <div className="relative">
                <div className="absolute inset-0 rounded bg-blue-500/30 blur-md" />
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  aria-hidden="true"
                  className="relative text-blue-400 transition-colors group-hover/title:text-blue-300"
                >
                  <path d="M5.721 0C2.251 0 0 2.25 0 5.719V18.28C0 21.75 2.251 24 5.721 24h12.56C21.751 24 24 21.75 24 18.281V5.72C24 2.249 21.751 0 18.281 0H5.721zM3.6 5.4h1.8v6c0 1.657 1.343 3 3 3s3-1.343 3-3V5.4h1.8v6c0 2.652-2.148 4.8-4.8 4.8S3.6 14.052 3.6 11.4V5.4zm10.8 0h1.8v3.6h-1.8V5.4zm-3.6 0h1.8v3.6h-1.8V5.4zm-3.6 0h1.8v3.6h-1.8V5.4zM14.4 11.4h1.8v3.6c0 .5.4.9.9.9h2.7v1.8h-2.7c-1.5 0-2.7-1.2-2.7-2.7V11.4z" />
                </svg>
              </div>
              <h3 className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-base font-bold text-transparent">
                知乎
              </h3>
            </div>
            <HiSparkles className="text-yellow-400/60" size={14} aria-hidden="true" />
          </a>

          <a
            href={profileUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="-m-2 mb-4 flex items-center gap-3 rounded-xl p-2 transition-all hover:bg-white/5"
          >
            <div className="relative flex-shrink-0">
              <div className="absolute -inset-0.5 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 opacity-60 blur" />
              <div className="relative h-12 w-12 overflow-hidden rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 ring-2 ring-white/10">
                <Image
                  src="/images/avatar.jpg"
                  alt="OnfireQ 的头像"
                  width={48}
                  height={48}
                  sizes="48px"
                  className="h-full w-full object-cover"
                />
              </div>
              <span
                className={`absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full ring-2 ring-gray-900 ${dotColor}`}
                title={syncLabel}
                aria-label={syncLabel}
              />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1">
                <span className="text-sm font-semibold">白日梦游</span>
                <span className="text-xs text-blue-400">✓</span>
              </div>
              <div className="mt-0.5 text-[10px] text-gray-400">中山大学 · 光学工程硕士在读</div>
            </div>
          </a>

          <div className="mb-3 grid grid-cols-4 gap-1.5">
            <div
              className="relative overflow-hidden rounded-lg bg-gradient-to-br from-cyan-500/10 to-cyan-500/5 p-2 text-center ring-1 ring-cyan-500/20"
              title="粉丝数由手动维护，知乎开放接口暂不提供此数据"
            >
              <div className="flex items-center justify-center gap-0.5 text-lg font-bold text-cyan-400">
                <HiUserAdd size={11} className="opacity-70" aria-hidden="true" />
                {feed.profile.followers ?? "—"}
              </div>
              <div className="mt-0.5 text-[10px] text-gray-400">关注者</div>
            </div>
            <div
              className="relative overflow-hidden rounded-lg bg-gradient-to-br from-blue-500/10 to-blue-500/5 p-2 text-center ring-1 ring-blue-500/20"
              title={statsTitle}
            >
              <div className="flex items-center justify-center gap-0.5 text-lg font-bold text-blue-400">
                <HiArrowUp size={11} className="opacity-70" aria-hidden="true" />
                {feed.stats.totalLikes}
              </div>
              <div className="mt-0.5 text-[10px] text-gray-400">赞同</div>
            </div>
            <div
              className="relative overflow-hidden rounded-lg bg-gradient-to-br from-pink-500/10 to-pink-500/5 p-2 text-center ring-1 ring-pink-500/20"
              title={statsTitle}
            >
              <div className="flex items-center justify-center gap-0.5 text-lg font-bold text-pink-400">
                <HiChatAlt2 size={11} className="opacity-70" aria-hidden="true" />
                {feed.stats.totalComments}
              </div>
              <div className="mt-0.5 text-[10px] text-gray-400">评论</div>
            </div>
            <div
              className="relative overflow-hidden rounded-lg bg-gradient-to-br from-yellow-500/10 to-yellow-500/5 p-2 text-center ring-1 ring-yellow-500/20"
              title={statsTitle}
            >
              <div className="flex items-center justify-center gap-0.5 text-lg font-bold text-yellow-400">
                <HiStar size={11} className="opacity-70" aria-hidden="true" />
                {feed.stats.totalFavorites}
              </div>
              <div className="mt-0.5 text-[10px] text-gray-400">收藏</div>
            </div>
          </div>

          <div className="mb-3 flex flex-wrap gap-1.5" aria-label="筛选知乎内容">
            {filters.map((filter) => {
              const count =
                filter.key === "all"
                  ? feed.contents.length
                  : counts[filter.key];
              if (count === 0) return null;

              return (
                <button
                  key={filter.key}
                  type="button"
                  onClick={() => onFilterChange(filter.key)}
                  className={`rounded-full px-2.5 py-1 text-[11px] font-medium transition-all ${
                    activeFilter === filter.key
                      ? "bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg shadow-blue-500/30"
                      : "bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  {filter.label} <span className="opacity-70">{count}</span>
                </button>
              );
            })}
          </div>

          {filteredItems.length === 0 ? (
            <div className="py-6 text-center text-xs text-gray-500">
              <div className="mb-1 text-2xl opacity-50">📭</div>
              暂无内容
            </div>
          ) : (
            <div className="-mr-1 max-h-96 space-y-2 overflow-y-auto pr-1">
              {filteredItems.map((item, index) => (
                <motion.a
                  key={`${item.type}-${item.url}`}
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: Math.min(index * 0.03, 0.3) }}
                  className="group/item block rounded-xl bg-white/5 p-2.5 ring-1 ring-white/5 transition-all hover:bg-white/10 hover:ring-blue-400/30"
                >
                  <div className="mb-1 flex items-center gap-1.5">
                    <span
                      className={`rounded px-1.5 py-0.5 text-[9px] font-medium ${typeColors[item.type].bg} ${typeColors[item.type].text}`}
                    >
                      {typeLabels[item.type]}
                    </span>
                    <span className="text-[10px] text-gray-500">{timeAgo(item.createdAt)}</span>
                  </div>
                  <div className="line-clamp-2 text-xs font-medium leading-relaxed transition-colors group-hover/item:text-blue-400">
                    {item.title || item.summary || "未命名内容"}
                  </div>
                  {item.likeCount > 0 && (
                    <div className="mt-1 flex items-center gap-0.5 text-[10px] text-blue-400">
                      <HiArrowUp size={9} aria-hidden="true" /> {item.likeCount}
                    </div>
                  )}
                </motion.a>
              ))}
            </div>
          )}

          <div
            className="mt-3 flex items-center justify-center gap-1 border-t border-white/5 pt-2 text-center text-[9px] text-gray-500"
            title={`${new Date(feed.updatedAt).toLocaleString("zh-CN")}；作品与互动数据每 5 分钟同步一次`}
          >
            <span className={`h-1 w-1 rounded-full ${dotColor}`} aria-hidden="true" />
            {syncLabel} · 最近 {feed.stats.windowSize} 条
          </div>
        </div>
      </div>
    </motion.aside>
  );
}
