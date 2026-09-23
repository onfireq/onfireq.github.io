import { env } from "cloudflare:workers";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { ZHIHU_PROFILE_TOKEN } from "../../../src/lib/zhihu-profile";
import worker from "../src/index";
import { PROFILE_API_URL, PROFILE_CACHE_KEY, syncZhihuProfile } from "../src/profile";

const previous = {
  schemaVersion: 1,
  receivedLikes: 47,
  updatedAt: "2026-09-23T00:00:00.000Z",
};
const IncomingRequest = Request<unknown, IncomingRequestCfProperties>;

beforeEach(async () => {
  await env.ZHIHU_CACHE.put(PROFILE_CACHE_KEY, JSON.stringify(previous));
});
afterEach(() => vi.unstubAllGlobals());

describe("profile likes automatic synchronization", () => {
  it("updates from thanked_count, independently of comments and voteups", async () => {
    const fetchMock = vi.fn().mockResolvedValue(Response.json({
      url_token: ZHIHU_PROFILE_TOKEN,
      thanked_count: 48,
      voteup_count: 93,
      comment_count: 9,
    }));
    vi.stubGlobal("fetch", fetchMock);
    const next = await syncZhihuProfile(env);
    expect(next.receivedLikes).toBe(48);
    expect(fetchMock.mock.calls[0][0]).toBe(PROFILE_API_URL);
    expect(fetchMock.mock.calls[0][1].headers).toEqual({ Accept: "application/json" });
    const response = await worker.fetch(new IncomingRequest("https://worker.example/api/zhihu/profile", {
      headers: { Origin: "https://onfireq.github.io" },
    }), env);
    expect(response.status).toBe(200);
    expect(response.headers.get("Access-Control-Allow-Origin")).toBe("https://onfireq.github.io");
    expect(await response.json()).toEqual(next);
  });

  it.each([
    { url_token: ZHIHU_PROFILE_TOKEN },
    { url_token: ZHIHU_PROFILE_TOKEN, thanked_count: null },
    { url_token: ZHIHU_PROFILE_TOKEN, thanked_count: -1 },
    { url_token: "another-person", thanked_count: 100 },
  ])("preserves cached data and timestamp for invalid upstream data: %j", async (body) => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(Response.json(body)));
    await expect(syncZhihuProfile(env)).rejects.toThrow();
    expect(await env.ZHIHU_CACHE.get(PROFILE_CACHE_KEY, "json")).toEqual(previous);
  });

  it("accepts a genuine zero instead of treating it as missing", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(Response.json({
      url_token: ZHIHU_PROFILE_TOKEN, thanked_count: 0,
    })));
    expect((await syncZhihuProfile(env)).receivedLikes).toBe(0);
  });

  it.each([403, 429, 500])("retains last successful value after HTTP %s", async (status) => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response("unavailable", { status })));
    await expect(syncZhihuProfile(env)).rejects.toThrow();
    expect(await env.ZHIHU_CACHE.get(PROFILE_CACHE_KEY, "json")).toEqual(previous);
  });

  it("retains the previous value on a timeout", async () => {
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new DOMException("Timed out", "TimeoutError")));
    await expect(syncZhihuProfile(env)).rejects.toThrow();
    expect(await env.ZHIHU_CACHE.get(PROFILE_CACHE_KEY, "json")).toEqual(previous);
  });

  it("rejects oversized responses without replacing the cache", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response("x".repeat(65 * 1024))));
    await expect(syncZhihuProfile(env)).rejects.toThrow("size limit");
    expect(await env.ZHIHU_CACHE.get(PROFILE_CACHE_KEY, "json")).toEqual(previous);
  });

  it("still syncs profile likes when the content feed fails", async () => {
    vi.stubGlobal("fetch", vi.fn(async (url: string | URL) => {
      if (String(url) === PROFILE_API_URL) {
        return Response.json({ url_token: ZHIHU_PROFILE_TOKEN, thanked_count: 49 });
      }
      return Response.json({}, { status: 500 });
    }));
    const controller = { scheduledTime: Date.now(), cron: "*/5 * * * *", noRetry() {} };
    await expect(worker.scheduled(controller, env)).rejects.toThrow();
    expect(await env.ZHIHU_CACHE.get(PROFILE_CACHE_KEY, "json")).toMatchObject({ receivedLikes: 49 });
  });

  it("returns unavailable until the first successful sync", async () => {
    await env.ZHIHU_CACHE.delete(PROFILE_CACHE_KEY);
    const response = await worker.fetch(new IncomingRequest("https://worker.example/api/zhihu/profile"), env);
    expect(response.status).toBe(503);
  });
});
