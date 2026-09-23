import { z } from "zod";

export const zhihuProfileSchema = z.strictObject({
  schemaVersion: z.literal(1),
  updatedAt: z.string().datetime({ offset: true }),
  receivedLikes: z.number().int().nonnegative().finite(),
});

export type ZhihuProfile = z.infer<typeof zhihuProfileSchema>;
