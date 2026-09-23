import type { ZhihuProfile } from "@/lib/zhihu-profile";

// Last successful public profile API response, used until the live cache loads.
// The Worker refreshes thanked_count independently of the content snapshot.
export const zhihuProfileStats = {
  schemaVersion: 1,
  receivedLikes: 47,
  updatedAt: "2026-09-23T15:44:21.948Z",
} satisfies ZhihuProfile;
