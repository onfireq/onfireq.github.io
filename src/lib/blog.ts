import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { CATEGORIES, getCategoryName as gcn, type Category } from "./categories";

export type { Category };

export interface Post {
  slug: string;
  originalSlug?: string;
  title: string;
  date: string;
  tags: string[];
  published: boolean;
  description: string;
  cover?: string;
  content: string;
  format: "md" | "tex";
  category: string;
}

type PostSummary = Omit<Post, "content">;
type Frontmatter = Record<string, unknown>;

export { CATEGORIES, gcn as getCategoryName };

const postsDir = path.join(process.cwd(), "content/blog");

function parseTexFile(raw: string, filename: string) {
  const tagsMatch = raw.match(/^%\s*tags?:\s*(.+)$/m);
  const tags = tagsMatch ? tagsMatch[1].split(",").map((tag) => tag.trim()) : ["LaTeX"];
  const descMatch = raw.match(/^%\s*description?:\s*(.+)$/m);
  const description = descMatch ? descMatch[1].trim() : `LaTeX 文档: ${filename}`;
  const pubMatch = raw.match(/^%\s*published?:\s*(true|false)/m);
  const published = pubMatch ? pubMatch[1] === "true" : true;
  const titleMatch = raw.match(/\\title\{([^}]+)\}/);
  const dateMatch = raw.match(/\\date\{([^}]+)\}/);
  const title = titleMatch ? titleMatch[1] : filename;
  const date = dateMatch ? dateMatch[1] : "2026-01-01";
  const content = raw
    .replace(/\\documentclass\{[^}]+\}/g, "")
    .replace(/\\usepackage\{[^}]+\}/g, "")
    .replace(/\\title\{[^}]+\}/g, "")
    .replace(/\\date\{[^}]+\}/g, "")
    .replace(/\\author\{[^}]+\}/g, "")
    .replace(/\\begin\{document\}/g, "")
    .replace(/\\end\{document\}/g, "")
    .replace(/\\maketitle/g, "")
    .trim();

  return { title, date, content, tags, description, published };
}

function getAllFiles(dir: string): string[] {
  if (!fs.existsSync(dir)) return [];

  const result: string[] = [];
  for (const item of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, item.name);
    if (item.isDirectory()) {
      if (!item.name.startsWith("_") && item.name !== "node_modules") {
        result.push(...getAllFiles(fullPath));
      }
    } else if (item.name.endsWith(".md") || item.name.endsWith(".tex")) {
      result.push(fullPath);
    }
  }
  return result;
}

function getCategoryFromPath(filePath: string): string {
  const [category] = path.relative(postsDir, filePath).split(path.sep);
  return CATEGORIES.some((candidate) => candidate.slug === category) ? category : "default";
}

function getString(data: Frontmatter, key: string, fallback: string): string {
  const value = data[key];
  if (value instanceof Date) return value.toISOString().slice(0, 10);
  return typeof value === "string" && value.trim() ? value.trim() : fallback;
}

function getOptionalString(data: Frontmatter, key: string): string | undefined {
  const value = data[key];
  return typeof value === "string" && value.trim() ? value.trim() : undefined;
}

function getTags(data: Frontmatter): string[] {
  const value = data.tags;
  if (Array.isArray(value)) {
    return value.filter((tag): tag is string => typeof tag === "string" && Boolean(tag.trim()));
  }
  if (typeof value === "string") {
    return value.split(",").map((tag) => tag.trim()).filter(Boolean);
  }
  return [];
}

function computeSlug(fileName: string, data: Frontmatter, category: string): string {
  let slug = getString(data, "slug", fileName);
  if (/[^\x00-\x7F]/.test(slug)) {
    slug = Buffer.from(slug).toString("hex");
  }
  if (category !== "default" && !slug.startsWith(`${category}-`)) {
    slug = `${category}-${slug}`;
  }
  return slug;
}

function parsePostFile(filePath: string): Post | null {
  const fileName = path.basename(filePath);
  const fileNameSlug = fileName.replace(/\.(md|tex)$/, "");
  const category = getCategoryFromPath(filePath);

  try {
    const raw = fs.readFileSync(filePath, "utf-8");
    const isTex = filePath.endsWith(".tex");
    let data: Frontmatter;
    let content: string;

    if (isTex) {
      const parsed = parseTexFile(raw, fileNameSlug);
      data = parsed;
      content = parsed.content;
    } else {
      const parsed = matter(raw);
      data = parsed.data as Frontmatter;
      content = parsed.content;
    }

    return {
      slug: computeSlug(fileNameSlug, data, category),
      originalSlug: getString(data, "slug", fileNameSlug),
      title: getString(data, "title", fileNameSlug),
      date: getString(data, "date", "2026-01-01"),
      tags: getTags(data),
      published: data.published !== false,
      description: getString(data, "description", ""),
      cover: getOptionalString(data, "cover"),
      content,
      format: isTex ? "tex" : "md",
      category,
    };
  } catch (error) {
    const relativePath = path.relative(postsDir, filePath);
    const reason = error instanceof Error ? error.message : "unknown parse error";
    console.warn(`Skipping blog post ${relativePath}: ${reason}`);
    return null;
  }
}

function toSummary(post: Post): PostSummary {
  return {
    slug: post.slug,
    originalSlug: post.originalSlug,
    title: post.title,
    date: post.date,
    tags: post.tags,
    published: post.published,
    description: post.description,
    cover: post.cover,
    format: post.format,
    category: post.category,
  };
}

export function getAllPosts(showAll = false): PostSummary[] {
  if (!fs.existsSync(postsDir)) return [];

  return getAllFiles(postsDir)
    .map(parsePostFile)
    .filter((post): post is Post => post !== null && (showAll || post.published))
    .map(toSummary)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export function getPostBySlug(slug: string): Post | null {
  if (!fs.existsSync(postsDir)) return null;

  for (const filePath of getAllFiles(postsDir)) {
    const post = parsePostFile(filePath);
    if (post?.slug === slug && post.published) return post;
  }
  return null;
}

export function getAllTags(): string[] {
  const tagSet = new Set<string>();
  getAllPosts().forEach((post) => post.tags.forEach((tag) => tagSet.add(tag)));
  return Array.from(tagSet).sort();
}

export function getPostsByCategory(category: string): PostSummary[] {
  return getAllPosts().filter((post) => post.category === category);
}
