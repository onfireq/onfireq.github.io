import { z } from "zod";
import {
  ZHIHU_PROFILE_TOKEN,
  zhihuProfileSchema,
  type ZhihuProfile,
} from "../../../src/lib/zhihu-profile";

export const PROFILE_CACHE_KEY = "zhihu:profile:v1";
export const PROFILE_API_URL =
  `https://www.zhihu.com/api/v4/members/${ZHIHU_PROFILE_TOKEN}?include=thanked_count`;

// Zhihu's public profile calls likes received "thanked_count". It is distinct
// from content voteups, comments, and favorites. Missing fields must not become 0.
const upstreamProfileSchema = z.object({
  url_token: z.literal(ZHIHU_PROFILE_TOKEN),
  thanked_count: z.number().int().nonnegative().finite(),
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

export async function syncZhihuProfile(env: Env): Promise<ZhihuProfile> {
  // This is a public endpoint: never forward the developer API access secret.
  const response = await fetch(PROFILE_API_URL, {
    headers: { Accept: "application/json" },
    redirect: "manual",
    signal: AbortSignal.timeout(10_000),
  });
  const upstream = upstreamProfileSchema.parse(await readProfileResponse(response));
  const profile = zhihuProfileSchema.parse({
    schemaVersion: 1,
    updatedAt: new Date().toISOString(),
    receivedLikes: upstream.thanked_count,
  });
  // Write only after successful validation. Failed requests preserve both the
  // previous count and its timestamp, independently of the content feed.
  await env.ZHIHU_CACHE.put(PROFILE_CACHE_KEY, JSON.stringify(profile));
  console.log(JSON.stringify({ message: "zhihu profile sync complete", ...profile }));
  return profile;
}
