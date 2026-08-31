import { z } from "zod";
import {
  zhihuFeedSchema,
  type ZhihuContent,
  type ZhihuContentType,
  type ZhihuFeed,
} from "../../../src/lib/zhihu-feed";

const CACHE_KEY = "zhihu:feed:v1";
const UPSTREAM_TIMEOUT_MS = 10_000;
const MIN_RETAIN_RATIO = 0.5;
const ZHIHU_API_ORIGIN = "https://developer.zhihu.com";
const ALLOWED_ZHIHU_API_PATHS = new Set(["/api/v1/user/contents"]);

const optionalText = z
  .string()
  .nullable()
  .optional()
  .transform((value) => value ?? "");

const optionalCount = z
  .number()
  .int()
  .nonnegative()
  .nullable()
  .optional()
  .transform((value) => value ?? 0);

const upstreamContentSchema = z.object({
  ContentType: z.enum(["answer", "article", "pin", "video", "zvideo", "question"]),
  Title: optionalText,
  Url: z.string().url(),
  Summary: optionalText,
  LikeCount: optionalCount,
  CommentCount: optionalCount,
  FavoriteCount: optionalCount,
  CreatedAt: z.union([z.number(), z.string()]),
});

const upstreamResponseSchema = z.object({
  Code: z.number().int(),
  Message: z.string().nullable().optional(),
  Data: z
    .object({
      Items: z.array(upstreamContentSchema).max(50),
      Paging: z.object({
        Totals: z.union([z.number(), z.string()]),
      }),
    })
    .nullable()
    .optional(),
});

interface CacheMetadata {
  etag: string;
  updatedAt: string;
}

function normalizeCreatedAt(value: number | string): number {
  if (typeof value === "number") {
    return Math.floor(value > 10_000_000_000 ? value / 1000 : value);
  }

  const numeric = Number(value);
  if (Number.isFinite(numeric)) {
    return Math.floor(numeric > 10_000_000_000 ? numeric / 1000 : numeric);
  }

  const timestamp = Date.parse(value);
  if (!Number.isFinite(timestamp)) {
    throw new Error("Zhihu returned an invalid CreatedAt value");
  }

  return Math.floor(timestamp / 1000);
}

function normalizeContentType(type: string): ZhihuContentType {
  return type === "zvideo" ? "video" : (type as ZhihuContentType);
}

function isZhihuUrl(value: string): boolean {
  try {
    const url = new URL(value);
    return (
      url.protocol === "https:" &&
      url.username === "" &&
      url.password === "" &&
      url.port === "" &&
      (url.hostname === "zhihu.com" || url.hostname.endsWith(".zhihu.com"))
    );
  } catch {
    return false;
  }
}

function makeStats(contents: ZhihuContent[], totalAvailable: number): ZhihuFeed["stats"] {
  const stats: ZhihuFeed["stats"] = {
    answerCount: 0,
    articleCount: 0,
    pinCount: 0,
    videoCount: 0,
    questionCount: 0,
    totalLikes: 0,
    totalComments: 0,
    totalFavorites: 0,
    windowSize: contents.length,
    totalAvailable: Math.max(totalAvailable, contents.length),
  };

  for (const item of contents) {
    stats[`${item.type}Count`] += 1;
    stats.totalLikes += item.likeCount;
    stats.totalComments += item.commentCount;
    stats.totalFavorites += item.favoriteCount;
  }

  return stats;
}

function parseFollowerCount(value: string): number | null {
  const count = Number(value);
  return Number.isInteger(count) && count >= 0 ? count : null;
}

async function createEtag(value: string): Promise<string> {
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(value));
  const hex = Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, "0")).join("");
  return `"${hex}"`;
}

export function createZhihuApiUrl(configuredUrl: string): URL {
  let url: URL;
  try {
    url = new URL(configuredUrl);
  } catch {
    throw new Error("Zhihu API URL is invalid");
  }

  if (
    url.origin !== ZHIHU_API_ORIGIN ||
    url.protocol !== "https:" ||
    url.hostname !== "developer.zhihu.com" ||
    url.port !== "" ||
    url.username !== "" ||
    url.password !== "" ||
    !ALLOWED_ZHIHU_API_PATHS.has(url.pathname) ||
    url.hash !== ""
  ) {
    throw new Error("Zhihu API URL is not an allowed official endpoint");
  }

  url.search = new URLSearchParams({
    ContentType: "all",
    SortField: "ts",
    SortOrder: "desc",
    Offset: "0",
    Limit: "50",
  }).toString();
  return url;
}

async function fetchZhihuFeed(env: Env): Promise<ZhihuFeed> {
  const url = createZhihuApiUrl(env.ZHIHU_API_URL);
  const accessSecret = env.ZHIHU_ACCESS_SECRET.trim();
  if (!accessSecret) {
    throw new Error("Zhihu access secret is not configured");
  }

  const response = await fetch(url, {
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${accessSecret}`,
      "Content-Type": "application/json",
      "X-Request-Timestamp": String(Math.floor(Date.now() / 1000)),
    },
    redirect: "error",
    signal: AbortSignal.timeout(UPSTREAM_TIMEOUT_MS),
  });

  const raw: unknown = await response.json();
  const parsed = upstreamResponseSchema.safeParse(raw);

  if (!response.ok || !parsed.success) {
    throw new Error(`Zhihu response was invalid (HTTP ${response.status})`);
  }

  if (parsed.data.Code !== 0 || !parsed.data.Data) {
    throw new Error(`Zhihu API rejected the request (code ${parsed.data.Code})`);
  }

  const contents = parsed.data.Data.Items.map((item): ZhihuContent => {
    if (!isZhihuUrl(item.Url)) {
      throw new Error("Zhihu returned a non-Zhihu content URL");
    }

    return {
      type: normalizeContentType(item.ContentType),
      title: item.Title.slice(0, 500),
      url: item.Url,
      summary: item.Summary.slice(0, 10_000),
      likeCount: item.LikeCount,
      commentCount: item.CommentCount,
      favoriteCount: item.FavoriteCount,
      createdAt: normalizeCreatedAt(item.CreatedAt),
    };
  });

  const totalAvailable = Number(parsed.data.Data.Paging.Totals);
  if (!Number.isInteger(totalAvailable) || totalAvailable < 0) {
    throw new Error("Zhihu returned an invalid total count");
  }

  const followers = parseFollowerCount(env.FOLLOWER_COUNT);
  return zhihuFeedSchema.parse({
    schemaVersion: 1,
    updatedAt: new Date().toISOString(),
    profile: {
      followers,
      followersSource: followers === null ? "unavailable" : "manual",
    },
    stats: makeStats(contents, totalAvailable),
    contents,
  });
}

async function getPreviousContentCount(env: Env): Promise<number | null> {
  const cached = await env.ZHIHU_CACHE.get(CACHE_KEY, { type: "text", cacheTtl: 60 });
  if (!cached) return null;

  try {
    const parsed = zhihuFeedSchema.safeParse(JSON.parse(cached));
    return parsed.success ? parsed.data.contents.length : null;
  } catch {
    return null;
  }
}

export function assertSafeFeedUpdate(nextCount: number, previousCount: number | null): void {
  if (!Number.isInteger(nextCount) || nextCount <= 0) {
    throw new Error("Refusing to replace the Zhihu feed with an empty snapshot");
  }

  if (previousCount === null || previousCount <= 0) return;

  const minimumCount = Math.ceil(previousCount * MIN_RETAIN_RATIO);
  if (nextCount < minimumCount) {
    throw new Error(
      `Refusing a suspicious Zhihu feed drop (${previousCount} to ${nextCount}; minimum ${minimumCount})`,
    );
  }
}

async function syncZhihuFeed(env: Env): Promise<ZhihuFeed> {
  const feed = await fetchZhihuFeed(env);
  const previousCount = await getPreviousContentCount(env);
  assertSafeFeedUpdate(feed.contents.length, previousCount);
  const serialized = JSON.stringify(feed);
  const metadata: CacheMetadata = {
    etag: await createEtag(serialized),
    updatedAt: feed.updatedAt,
  };

  await env.ZHIHU_CACHE.put(CACHE_KEY, serialized, { metadata });

  console.log(
    JSON.stringify({
      message: "zhihu sync complete",
      updatedAt: feed.updatedAt,
      itemCount: feed.contents.length,
      totalAvailable: feed.stats.totalAvailable,
    }),
  );

  return feed;
}

function allowedOrigin(request: Request, env: Env): string | null {
  const origin = request.headers.get("Origin");
  if (!origin) return null;

  const origins = env.ALLOWED_ORIGINS.split(",").map((value) => value.trim());
  return origins.includes(origin) ? origin : "";
}

function corsHeaders(origin: string | null): Headers {
  const headers = new Headers({ Vary: "Origin" });
  if (origin) {
    headers.set("Access-Control-Allow-Origin", origin);
    headers.set("Access-Control-Allow-Methods", "GET, OPTIONS");
    headers.set("Access-Control-Allow-Headers", "Accept, If-None-Match");
    headers.set("Access-Control-Max-Age", "86400");
  }
  return headers;
}

function jsonError(message: string, status: number, origin: string | null): Response {
  const headers = corsHeaders(origin);
  headers.set("Cache-Control", "no-store");
  headers.set("Content-Type", "application/json; charset=utf-8");
  return new Response(JSON.stringify({ error: message }), { status, headers });
}

async function serveFeed(request: Request, env: Env, origin: string | null): Promise<Response> {
  const result = await env.ZHIHU_CACHE.getWithMetadata<CacheMetadata>(CACHE_KEY, {
    type: "text",
    cacheTtl: 60,
  });

  if (!result.value || !result.metadata) {
    return jsonError("feed_not_ready", 503, origin);
  }

  let raw: unknown;
  try {
    raw = JSON.parse(result.value);
  } catch {
    return jsonError("feed_invalid", 503, origin);
  }

  const feed = zhihuFeedSchema.safeParse(raw);
  if (!feed.success) {
    return jsonError("feed_invalid", 503, origin);
  }

  const headers = corsHeaders(origin);
  headers.set("Cache-Control", "public, max-age=60, stale-while-revalidate=300");
  headers.set("Content-Type", "application/json; charset=utf-8");
  headers.set("ETag", result.metadata.etag);
  headers.set("X-Zhihu-Updated-At", result.metadata.updatedAt);

  if (request.headers.get("If-None-Match") === result.metadata.etag) {
    return new Response(null, { status: 304, headers });
  }

  return new Response(JSON.stringify(feed.data), { status: 200, headers });
}

export default {
  async fetch(request, env): Promise<Response> {
    const url = new URL(request.url);
    const origin = allowedOrigin(request, env);

    if (origin === "") {
      return jsonError("origin_not_allowed", 403, null);
    }

    if (url.pathname !== "/api/zhihu") {
      return jsonError("not_found", 404, origin);
    }

    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: corsHeaders(origin) });
    }

    if (request.method !== "GET") {
      const response = jsonError("method_not_allowed", 405, origin);
      response.headers.set("Allow", "GET, OPTIONS");
      return response;
    }

    try {
      return await serveFeed(request, env, origin);
    } catch (error) {
      console.error(
        JSON.stringify({
          message: "failed to serve zhihu feed",
          error: error instanceof Error ? error.message : String(error),
          path: url.pathname,
        }),
      );
      return jsonError("internal_error", 500, origin);
    }
  },

  async scheduled(_controller, env): Promise<void> {
    try {
      await syncZhihuFeed(env);
    } catch (error) {
      console.error(
        JSON.stringify({
          message: "zhihu sync failed",
          error: error instanceof Error ? error.message : String(error),
        }),
      );
      throw error;
    }
  },
} satisfies ExportedHandler<Env>;
