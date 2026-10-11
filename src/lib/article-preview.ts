import { JSON_SCHEMA, load } from "js-yaml";

export interface ArticlePreview {
  title: string;
  description: string;
  date: string;
  tags: string[];
  content: string;
  error?: string;
}

export function parseArticlePreview(source: string): ArticlePreview {
  const match = source.match(/^\uFEFF?---[\t ]*\r?\n([\s\S]*?)\r?\n---[\t ]*(?:\r?\n|$)/);
  const preview: ArticlePreview = {
    title: "未命名文章",
    description: "",
    date: "",
    tags: [],
    content: match ? source.slice(match[0].length) : source,
  };

  if (!match) return preview;

  try {
    const data: unknown = load(match[1], { schema: JSON_SCHEMA });
    if (!data || typeof data !== "object" || Array.isArray(data)) {
      throw new Error("Expected article metadata");
    }
    const fields = data as Record<string, unknown>;
    return {
      ...preview,
      title: typeof fields.title === "string" && fields.title.trim() ? fields.title.trim() : preview.title,
      description: typeof fields.description === "string" ? fields.description.trim() : "",
      date: typeof fields.date === "string" ? fields.date : "",
      tags: Array.isArray(fields.tags)
        ? [...new Set(fields.tags.filter((tag): tag is string => typeof tag === "string" && Boolean(tag.trim())).map((tag) => tag.trim()))]
        : [],
    };
  } catch {
    return { ...preview, error: "文章信息暂时无法解析，请检查标题、摘要等字段的引号和缩进。正文仍可预览。" };
  }
}
