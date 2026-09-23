import snapshot from "../../public/zhihu-profile.json";
import { zhihuProfileSchema } from "@/lib/zhihu-profile";

// All four account totals are generated together by the hourly GitHub workflow.
// Share the same validated snapshot between the first render and browser refresh.
export const zhihuProfileStats = zhihuProfileSchema.parse(snapshot);
