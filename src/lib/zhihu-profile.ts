import { z } from "zod";

export const ZHIHU_PROFILE_TOKEN = "bai-ri-meng-you-54-77";

export const zhihuProfileSchema = z.strictObject({
  schemaVersion: z.literal(1),
  updatedAt: z.string().datetime({ offset: true }),
  receivedLikes: z.number().int().nonnegative().finite(),
});

export type ZhihuProfile = z.infer<typeof zhihuProfileSchema>;
