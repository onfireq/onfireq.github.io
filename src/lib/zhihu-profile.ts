import { z } from "zod";

export const zhihuProfileSchema = z.strictObject({
  schemaVersion: z.literal(2),
  updatedAt: z.string().datetime({ offset: true }),
  followers: z.number().int().nonnegative().finite(),
  receivedVotes: z.number().int().nonnegative().finite(),
  receivedLikes: z.number().int().nonnegative().finite(),
  receivedFavorites: z.number().int().nonnegative().finite(),
});

export type ZhihuProfile = z.infer<typeof zhihuProfileSchema>;
