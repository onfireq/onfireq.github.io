import snapshot from "../../public/zhihu-profile.json";
import { zhihuProfileSchema } from "@/lib/zhihu-profile";

// Generated hourly from the public profile's cumulative thanked_count.
// Share the same validated snapshot between the first render and browser refresh.
export const zhihuProfileStats = zhihuProfileSchema.parse(snapshot);
