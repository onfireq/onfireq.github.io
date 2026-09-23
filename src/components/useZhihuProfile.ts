"use client";

import { useEffect, useState } from "react";
import { zhihuProfileStats } from "@/data/zhihu-profile";
import { zhihuProfileSchema, type ZhihuProfile } from "@/lib/zhihu-profile";

const PROFILE_URL = `${(process.env.NEXT_PUBLIC_ZHIHU_FEED_URL ??
  "https://onfireq-zhihu-sync.2467708204.workers.dev/api/zhihu").replace(/\/$/, "")}/profile`;
const REFRESH_MS = 5 * 60 * 1000;
const FRESH_MS = 15 * 60 * 1000;

export function useZhihuProfile() {
  const [profile, setProfile] = useState<ZhihuProfile>(zhihuProfileStats);
  const [status, setStatus] = useState<"snapshot" | "live" | "stale">("snapshot");

  useEffect(() => {
    let disposed = false;
    let controller: AbortController | null = null;
    let newestTimestamp = Date.parse(zhihuProfileStats.updatedAt);
    const refresh = async () => {
      if (disposed || controller || document.visibilityState === "hidden") return;
      controller = new AbortController();
      const timeout = window.setTimeout(() => controller?.abort(), 5_000);
      try {
        const response = await fetch(PROFILE_URL, {
          headers: { Accept: "application/json" },
          signal: controller.signal,
        });
        if (!response.ok) throw new Error("Profile unavailable");
        const next = zhihuProfileSchema.parse(await response.json());
        const timestamp = Date.parse(next.updatedAt);
        if (!disposed && timestamp >= newestTimestamp) {
          newestTimestamp = timestamp;
          setProfile(next);
          setStatus(Date.now() - timestamp <= FRESH_MS ? "live" : "stale");
        }
      } catch {
        if (!disposed) setStatus("stale");
      } finally {
        window.clearTimeout(timeout);
        controller = null;
      }
    };
    void refresh();
    const interval = window.setInterval(() => void refresh(), REFRESH_MS);
    const onVisibility = () => {
      if (document.visibilityState === "visible") void refresh();
    };
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      disposed = true;
      controller?.abort();
      window.clearInterval(interval);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  return { profile, status };
}
