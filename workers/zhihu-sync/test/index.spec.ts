import { env } from "cloudflare:workers";
import { beforeEach, describe, expect, it } from "vitest";
import type { ZhihuFeed } from "../../../src/lib/zhihu-feed";
import worker, { assertSafeFeedUpdate, createZhihuApiUrl } from "../src/index";

declare module "cloudflare:workers" {
  // Cloudflare's test runtime uses interface augmentation to expose generated Env bindings.
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  interface ProvidedEnv extends Env {}
}

const CACHE_KEY = "zhihu:feed:v1";
const IncomingRequest = Request<unknown, IncomingRequestCfProperties>;

function makeFeed(): ZhihuFeed {
  return {
    schemaVersion: 1,
    updatedAt: "2026-08-31T00:00:00.000Z",
    profile: {
      followers: 18,
      followersSource: "manual",
    },
    stats: {
      answerCount: 1,
      articleCount: 0,
      pinCount: 0,
      videoCount: 0,
      questionCount: 0,
      totalLikes: 2,
      totalComments: 1,
      totalFavorites: 3,
      windowSize: 1,
      totalAvailable: 1,
    },
    contents: [
      {
        type: "answer",
        title: "测试内容",
        url: "https://www.zhihu.com/answer/123",
        summary: "用于 Worker 测试",
        likeCount: 2,
        commentCount: 1,
        favoriteCount: 3,
        createdAt: 1_788_134_400,
      },
    ],
  };
}

async function seedFeed(etag = '"test-etag"'): Promise<ZhihuFeed> {
  const feed = makeFeed();
  await env.ZHIHU_CACHE.put(CACHE_KEY, JSON.stringify(feed), {
    metadata: { etag, updatedAt: feed.updatedAt },
  });
  return feed;
}

beforeEach(async () => {
  await env.ZHIHU_CACHE.delete(CACHE_KEY);
});

describe("official Zhihu API allowlist", () => {
  it("builds the fixed official contents request", () => {
    const url = createZhihuApiUrl("https://developer.zhihu.com/api/v1/user/contents");

    expect(url.origin).toBe("https://developer.zhihu.com");
    expect(url.pathname).toBe("/api/v1/user/contents");
    expect(url.searchParams.get("ContentType")).toBe("all");
    expect(url.searchParams.get("Limit")).toBe("50");
  });

  it.each([
    "http://developer.zhihu.com/api/v1/user/contents",
    "https://example.com/api/v1/user/contents",
    "https://developer.zhihu.com/api/v1/user/profile",
    "https://user:password@developer.zhihu.com/api/v1/user/contents",
    "https://developer.zhihu.com:8443/api/v1/user/contents",
  ])("rejects a non-allowlisted endpoint: %s", (configuredUrl) => {
    expect(() => createZhihuApiUrl(configuredUrl)).toThrow(
      "Zhihu API URL is not an allowed official endpoint",
    );
  });
});

describe("last-known-good feed protection", () => {
  it("rejects an empty replacement", () => {
    expect(() => assertSafeFeedUpdate(0, 39)).toThrow("empty snapshot");
  });

  it("rejects a replacement that loses more than half the previous items", () => {
    expect(() => assertSafeFeedUpdate(19, 39)).toThrow("suspicious Zhihu feed drop");
  });

  it("accepts a non-empty first snapshot and a bounded count change", () => {
    expect(() => assertSafeFeedUpdate(1, null)).not.toThrow();
    expect(() => assertSafeFeedUpdate(20, 39)).not.toThrow();
  });
});

describe("public feed endpoint", () => {
  it("returns 503 without a last-known-good snapshot", async () => {
    const request = new IncomingRequest("https://worker.example/api/zhihu");
    const response = await worker.fetch(request, env);

    expect(response.status).toBe(503);
    await expect(response.json()).resolves.toEqual({ error: "feed_not_ready" });
  });

  it("serves a validated KV snapshot with CORS and cache headers", async () => {
    const feed = await seedFeed();
    const request = new IncomingRequest("https://worker.example/api/zhihu", {
      headers: { Origin: "https://onfireq.github.io" },
    });
    const response = await worker.fetch(request, env);

    expect(response.status).toBe(200);
    expect(response.headers.get("Access-Control-Allow-Origin")).toBe("https://onfireq.github.io");
    expect(response.headers.get("ETag")).toBe('"test-etag"');
    expect(response.headers.get("X-Zhihu-Updated-At")).toBe(feed.updatedAt);
    await expect(response.json()).resolves.toEqual(feed);
  });

  it("returns 304 when the ETag matches", async () => {
    await seedFeed();
    const request = new IncomingRequest("https://worker.example/api/zhihu", {
      headers: { "If-None-Match": '"test-etag"' },
    });
    const response = await worker.fetch(request, env);

    expect(response.status).toBe(304);
    expect(await response.text()).toBe("");
  });

  it("rejects disallowed browser origins", async () => {
    await seedFeed();
    const request = new IncomingRequest("https://worker.example/api/zhihu", {
      headers: { Origin: "https://attacker.example" },
    });
    const response = await worker.fetch(request, env);

    expect(response.status).toBe(403);
    await expect(response.json()).resolves.toEqual({ error: "origin_not_allowed" });
  });

  it("fails closed when the cached payload is corrupt", async () => {
    await env.ZHIHU_CACHE.put(CACHE_KEY, "not-json", {
      metadata: { etag: '"bad"', updatedAt: "2026-08-31T00:00:00.000Z" },
    });
    const request = new IncomingRequest("https://worker.example/api/zhihu");
    const response = await worker.fetch(request, env);

    expect(response.status).toBe(503);
    await expect(response.json()).resolves.toEqual({ error: "feed_invalid" });
  });
});
