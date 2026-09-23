import { z } from "zod";
import {
  zhihuProfileSchema,
  type ZhihuProfile,
} from "../../../src/lib/zhihu-profile";

export const PROFILE_CACHE_KEY = "zhihu:profile:v1";
export const PROFILE_ATTEMPT_KEY = "zhihu:profile:last-attempt";
export const PROFILE_REFRESH_MS = 60 * 60 * 1000;
export const PROFILE_API_URL =
  "https://developer.zhihu.com/api/v1/user/creator_account_stats?ContentType=all";

// The official account API distinguishes LikeCount (likes received) from
// UpvoteCount and CommentCount. Missing fields must never become zero.
const upstreamProfileSchema = z.object({
  Code: z.literal(0),
  Data: z.object({
    ContentType: z.literal("all"),
    Metrics: z.object({ LikeCount: z.number().int().nonnegative().finite() }),
  }),
});

async function readProfileResponse(response: Response): Promise<unknown> {
  if (!response.ok || !response.body) {
    throw new Error(`Zhihu profile request failed (HTTP ${response.status})`);
  }
  const reader = response.body.getReader();
  const chunks: Uint8Array[] = [];
  let size = 0;
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      size += value.byteLength;
      if (size > 64 * 1024) {
        await reader.cancel();
        throw new Error("Zhihu profile response exceeded size limit");
      }
      chunks.push(value);
    }
  } finally {
    reader.releaseLock();
  }
  const bytes = new Uint8Array(size);
  let offset = 0;
  for (const chunk of chunks) {
    bytes.set(chunk, offset);
    offset += chunk.length;
  }
  return JSON.parse(new TextDecoder().decode(bytes));
}

export async function syncZhihuProfile(env: Env): Promise<ZhihuProfile | null> {
  // Account analytics shares a daily quota with other creator APIs. Throttle
  // attempts, including failures, independently of the five-minute feed cron.
  const lastAttempt = await env.ZHIHU_CACHE.get(PROFILE_ATTEMPT_KEY);
  if (lastAttempt !== null && Date.now() - Number(lastAttempt) < PROFILE_REFRESH_MS) return null;
  const accessSecret = env.ZHIHU_ACCESS_SECRET.trim();
  if (!accessSecret) throw new Error("Zhihu access secret is not configured");
  await env.ZHIHU_CACHE.put(PROFILE_ATTEMPT_KEY, String(Date.now()));
  const response = await fetch(PROFILE_API_URL, {
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${accessSecret}`,
      "Content-Type": "application/json",
      "X-Request-Timestamp": String(Math.floor(Date.now() / 1000)),
    },
    redirect: "manual",
    signal: AbortSignal.timeout(10_000),
  });
  const upstream = upstreamProfileSchema.parse(await readProfileResponse(response));
  const profile = zhihuProfileSchema.parse({
    schemaVersion: 1,
    updatedAt: new Date().toISOString(),
    receivedLikes: upstream.Data.Metrics.LikeCount,
  });
  // Write only after successful validation. Failed requests preserve both the
  // previous count and its timestamp, independently of the content feed.
  await env.ZHIHU_CACHE.put(PROFILE_CACHE_KEY, JSON.stringify(profile));
  console.log(JSON.stringify({ message: "zhihu profile sync complete", ...profile }));
  return profile;
}
