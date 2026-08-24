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

export { CATEGORIES, gcn as getCategoryName };

const postsDir = path.join(process.cwd(), "content/blog");

// 从 .tex 文件提取 frontmatter 信息
function parseTexFile(raw: string, filename: string) {
  const tagsMatch = raw.match(/^%\s*tags?:\s*(.+)$/m);
  const tags = tagsMatch ? tagsMatch[1].split(",").map(t => t.trim()) : ["LaTeX"];
  const descMatch = raw.match(/^%\s*description?:\s*(.+)$/m);
  const description = descMatch ? descMatch[1].trim() : `LaTeX 文档: ${filename}`;
  const pubMatch = raw.match(/^%\s*published?:\s*(true|false)/m);
  const published = pubMatch ? pubMatch[1] === "true" : true;

  const titleMatch = raw.match(/\\title\{([^}]+)\}/);
  const title = titleMatch ? titleMatch[1] : filename;

  const dateMatch = raw.match(/\\date\{([^}]+)\}/);
  const date = dateMatch ? dateMatch[1] : "2026-01-01";

  let content = raw
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

// 递归获取所有 markdown 和 tex 文件
function getAllFiles(dir: string, baseDir: string = dir): { filePath: string; relativePath: string }[] {
  if (!fs.existsSync(dir)) return [];
  const items = fs.readdirSync(dir, { withFileTypes: true });
  const result: { filePath: string; relativePath: string }[] = [];

  for (const item of items) {
    const fullPath = path.join(dir, item.name);
    if (item.isDirectory()) {
      if (item.name.startsWith("_") || item.name === "node_modules") continue;
      result.push(...getAllFiles(fullPath, baseDir));
    } else if (item.name.endsWith(".md") || item.name.endsWith(".tex")) {
      const rel = path.relative(baseDir, fullPath).replace(/\\/g, "/");
      result.push({ filePath: fullPath, relativePath: rel });
    }
  }
  return result;
}

// 从文件路径推断分类
function getCategoryFromPath(filePath: string): string {
  const rel = path.relative(postsDir, filePath);
  const parts = rel.split(path.sep);
  if (parts.length > 1) {
    const cat = parts[0];
    if (CATEGORIES.find(c => c.slug === cat)) return cat;
  }
  return "default";
}

function parsePostFile(filePath: string): Omit<Post, "content"> | null {
  const fileName = path.basename(filePath);
  const relativePath = path.relative(postsDir, filePath);
  const category = getCategoryFromPath(filePath);

  try {
    const raw = fs.readFileSync(filePath, "utf-8");
    const isTex = filePath.endsWith(".tex");

    let data: any = {};
    let content = "";
    let format: "md" | "tex" = "md";

    if (isTex) {
      const parsed = parseTexFile(raw, filePath.replace(/\.tex$/, ""));
      data = { title: parsed.title, date: parsed.date, tags: parsed.tags, description: parsed.description, published: parsed.published };
      content = parsed.content;
      format = "tex";
    } else {
      const parsed = matter(raw);
      data = parsed.data;
      content = parsed.content;
      format = "md";
    }

    // 优先使用 frontmatter 的 slug，没有就用文件名（不含中文则直接用，含中文则用 hex）
    const fileNameSlug = path.basename(filePath).replace(/\.(md|tex)$/, "");
    let slug = data.slug || fileNameSlug;
    // 如果 slug 包含中文，使用 hex 编码（Next.js 静态导出不支持中文文件名）
    if (/[^\x00-\x7F]/.test(slug)) {
      slug = Buffer.from(slug).toString('hex');
    }
    // 加上分类前缀
    if (category !== "default" && !slug.startsWith(category)) {
      slug = `${category}-${slug}`;
    }
    const originalSlug = data.slug || fileNameSlug;

    return {
      slug,
      originalSlug,
      title: data.title || fileName,
      date: data.date || "2026-01-01",
      tags: data.tags || [],
      published: data.published !== false,
      description: data.description || "",
      cover: data.cover,
      category,
      format,
    };
  } catch (e) {
    return null;
  }
}

export function getAllPosts(showAll = false): Omit<Post, "content">[] {
  if (!fs.existsSync(postsDir)) return [];

  const files = getAllFiles(postsDir);
  const posts: Omit<Post, "content">[] = [];

  for (const { filePath } of files) {
    const post = parsePostFile(filePath);
    if (post && (showAll || post.published)) {
      posts.push(post);
    }
  }

  return posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export function getPostBySlug(slug: string): Post | null {
  if (!fs.existsSync(postsDir)) return null;

  const files = getAllFiles(postsDir);
  for (const { filePath, relativePath } of files) {
    const s = relativePath.replace(/\.(md|tex)$/, "").replace(/\//g, "-");
    if (s === slug) {
      const meta = parsePostFile(filePath);
      if (!meta) continue;

      const isTex = filePath.endsWith(".tex");
      const raw = fs.readFileSync(filePath, "utf-8");
      let data: any = {};
      let content = "";

      if (isTex) {
        const parsed = parseTexFile(raw, slug);
        data = { title: parsed.title, date: parsed.date, tags: parsed.tags, description: parsed.description, published: parsed.published };
        content = parsed.content;
      } else {
        const parsed = matter(raw);
        data = parsed.data;
        content = parsed.content;
      }

      return {
        ...meta,
        title: data.title || meta.title,
        date: data.date || meta.date,
        tags: data.tags || meta.tags,
        description: data.description || meta.description,
        content,
      };
    }
  }
  return null;
}

export function getAllTags(): string[] {
  const posts = getAllPosts();
  const tagSet = new Set<string>();
  posts.forEach((p) => p.tags.forEach((t) => tagSet.add(t)));
  return Array.from(tagSet).sort();
}

export function getPostsByCategory(category: string): Omit<Post, "content">[] {
  return getAllPosts().filter(p => p.category === category);
}
