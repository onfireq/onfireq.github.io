import type { PostSummary } from "./blog";

export function compareNoteOrder(a: PostSummary, b: PostSummary): number {
  if (a.order !== undefined || b.order !== undefined) {
    const difference = (a.order ?? Infinity) - (b.order ?? Infinity);
    if (difference) return difference;
  }

  if (a.category === "libo" && b.category === "libo") {
    const aParts = a.originalSlug?.match(/^(\d+(?:\.\d+)*)/)?.[1].split(".").map(Number);
    const bParts = b.originalSlug?.match(/^(\d+(?:\.\d+)*)/)?.[1].split(".").map(Number);
    if (aParts && bParts) {
      for (let i = 0; i < Math.max(aParts.length, bParts.length); i++) {
        const difference = (aParts[i] ?? 0) - (bParts[i] ?? 0);
        if (difference) return difference;
      }
    } else if (aParts) return -1;
    else if (bParts) return 1;
  }

  const dateDifference = Date.parse(a.date) - Date.parse(b.date);
  if (dateDifference) return dateDifference;
  return (a.originalSlug || a.title).localeCompare(b.originalSlug || b.title, "zh-CN", { numeric: true });
}
