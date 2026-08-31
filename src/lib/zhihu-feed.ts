import { z } from "zod";

const nonNegativeInteger = z.number().int().nonnegative().finite();

export const zhihuContentTypeSchema = z.enum([
  "answer",
  "article",
  "pin",
  "video",
  "question",
]);

const zhihuUrlSchema = z
  .string()
  .url()
  .refine((value) => {
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
  }, "Expected an HTTPS Zhihu URL");

export const zhihuContentSchema = z.strictObject({
  type: zhihuContentTypeSchema,
  title: z.string().max(500),
  url: zhihuUrlSchema,
  summary: z.string().max(10_000),
  likeCount: nonNegativeInteger,
  commentCount: nonNegativeInteger,
  favoriteCount: nonNegativeInteger,
  createdAt: nonNegativeInteger,
});

export const zhihuStatsSchema = z.strictObject({
  answerCount: nonNegativeInteger,
  articleCount: nonNegativeInteger,
  pinCount: nonNegativeInteger,
  videoCount: nonNegativeInteger,
  questionCount: nonNegativeInteger,
  totalLikes: nonNegativeInteger,
  totalComments: nonNegativeInteger,
  totalFavorites: nonNegativeInteger,
  windowSize: nonNegativeInteger.max(50),
  totalAvailable: nonNegativeInteger,
});

export const zhihuFeedSchema = z
  .strictObject({
    schemaVersion: z.literal(1),
    updatedAt: z.string().datetime({ offset: true }),
    profile: z.strictObject({
      followers: nonNegativeInteger.nullable(),
      followersSource: z.enum(["manual", "unavailable"]),
    }),
    stats: zhihuStatsSchema,
    contents: z.array(zhihuContentSchema).max(50),
  })
  .superRefine((feed, context) => {
    const counts = {
      answerCount: 0,
      articleCount: 0,
      pinCount: 0,
      videoCount: 0,
      questionCount: 0,
    };
    const interactions = {
      totalLikes: 0,
      totalComments: 0,
      totalFavorites: 0,
    };

    for (const item of feed.contents) {
      counts[`${item.type}Count` as keyof typeof counts] += 1;
      interactions.totalLikes += item.likeCount;
      interactions.totalComments += item.commentCount;
      interactions.totalFavorites += item.favoriteCount;
    }

    if (feed.stats.windowSize !== feed.contents.length) {
      context.addIssue({
        code: "custom",
        path: ["stats", "windowSize"],
        message: "windowSize must match contents.length",
      });
    }

    if (feed.stats.totalAvailable < feed.stats.windowSize) {
      context.addIssue({
        code: "custom",
        path: ["stats", "totalAvailable"],
        message: "totalAvailable cannot be smaller than windowSize",
      });
    }

    for (const [key, value] of Object.entries(counts)) {
      if (feed.stats[key as keyof typeof counts] !== value) {
        context.addIssue({
          code: "custom",
          path: ["stats", key],
          message: `${key} must match the contents array`,
        });
      }
    }

    for (const [key, value] of Object.entries(interactions)) {
      if (feed.stats[key as keyof typeof interactions] !== value) {
        context.addIssue({
          code: "custom",
          path: ["stats", key],
          message: `${key} must match the contents array`,
        });
      }
    }
  });

export type ZhihuContentType = z.infer<typeof zhihuContentTypeSchema>;
export type ZhihuContent = z.infer<typeof zhihuContentSchema>;
export type ZhihuStats = z.infer<typeof zhihuStatsSchema>;
export type ZhihuFeed = z.infer<typeof zhihuFeedSchema>;
