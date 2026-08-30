import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { z } from "zod";
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

export type PostSummary = Omit<Post, "content">;

export interface AdjacentPosts {
  previous: PostSummary | null;
  next: PostSummary | null;
}

export { CATEGORIES, gcn as getCategoryName };

const postsDir = path.join(process.cwd(), "content/blog");

const frontmatterDateSchema = z.preprocess(
  (value) =>
    value instanceof Date && !Number.isNaN(value.valueOf())
      ? value.toISOString().slice(0, 10)
      : value,
  z
    .string()
    .trim()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "日期必须使用 YYYY-MM-DD 格式")
    .refine((value) => {
      const time = Date.parse(`${value}T00:00:00Z`);
      return Number.isFinite(time) && new Date(time).toISOString().slice(0, 10) === value;
    }, "日期无效"),
);

const frontmatterSchema = z
  .object({
    title: z.string().trim().min(1, "标题不能为空").max(120, "标题不能超过 120 个字符"),
    date: frontmatterDateSchema,
    tags: z
      .array(z.string().trim().min(1, "标签不能为空").max(40, "单个标签不能超过 40 个字符"))
      .max(12, "标签不能超过 12 个")
      .transform((tags) => Array.from(new Set(tags))),
    published: z.boolean(),
    description: z.string().trim().max(240, "摘要不能超过 240 个字符"),
    slug: z
      .string()
      .trim()
      .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "slug 只能包含小写字母、数字和连字符")
      .optional(),
    cover: z.preprocess(
      (value) => (value === null || value === "" ? undefined : value),
      z
        .string()
        .trim()
        .refine(
          (value) => value.startsWith("/") || /^https?:\/\//.test(value),
          "封面必须是站内绝对路径或 HTTP(S) 地址",
        )
        .optional(),
    ),
  })
  .strict()
  .superRefine((data, context) => {
    if (!data.published) return;

    if (!data.description) {
      context.addIssue({
        code: "custom",
        path: ["description"],
        message: "公开文章必须填写摘要",
      });
    }

    if (data.tags.length === 0) {
      context.addIssue({
        code: "custom",
        path: ["tags"],
        message: "公开文章至少需要一个标签",
      });
    }
  });

type Frontmatter = z.infer<typeof frontmatterSchema>;

function validateFrontmatter(data: unknown, filePath: string): Frontmatter {
  const result = frontmatterSchema.safeParse(data);
  if (result.success) return result.data;

  const relativePath = path.relative(postsDir, filePath);
  const details = result.error.issues
    .map((issue) => `${issue.path.join(".") || "frontmatter"}: ${issue.message}`)
    .join("; ");
  throw new Error(`博客元数据校验失败（${relativePath}）：${details}`);
}

function parseTexFile(raw: string) {
  const tagsMatch = raw.match(/^%\s*tags?:\s*(.+)$/m);
  const tags = tagsMatch ? tagsMatch[1].split(",").map((tag) => tag.trim()) : undefined;
  const descMatch = raw.match(/^%\s*description?:\s*(.+)$/m);
  const description = descMatch ? descMatch[1].trim() : undefined;
  const pubMatch = raw.match(/^%\s*published?:\s*(true|false)/m);
  const published = pubMatch ? pubMatch[1] === "true" : undefined;
  const titleMatch = raw.match(/\\title\{([^}]+)\}/);
  const dateMatch = raw.match(/\\date\{([^}]+)\}/);
  const title = titleMatch?.[1];
  const date = dateMatch?.[1];
  const content = raw
    .replace(/^\s*%.*$/gm, "")
    .replace(/\\documentclass\{[^}]+\}/g, "")
    .replace(/\\usepackage\{[^}]+\}/g, "")
    .replace(/\\title\{[^}]+\}/g, "")
    .replace(/\\date\{[^}]+\}/g, "")
    .replace(/\\author\{[^}]+\}/g, "")
    .replace(/\\begin\{document\}/g, "")
    .replace(/\\end\{document\}/g, "")
    .replace(/\\maketitle/g, "")
    .trim();

  return {
    data: { title, date, tags, description, published },
    content,
  };
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

function computeSlug(fileName: string, data: Frontmatter, category: string): string {
  let slug = data.slug || fileName;
  if (/[^\x00-\x7F]/.test(slug)) {
    slug = Buffer.from(slug).toString("hex");
  }
  if (category !== "default" && !slug.startsWith(`${category}-`)) {
    slug = `${category}-${slug}`;
  }
  return slug;
}

function parsePostFile(filePath: string): Post {
  const fileName = path.basename(filePath);
  const fileNameSlug = fileName.replace(/\.(md|tex)$/, "");
  const category = getCategoryFromPath(filePath);
  const raw = fs.readFileSync(filePath, "utf-8");
  const isTex = filePath.endsWith(".tex");
  const parsed = isTex ? parseTexFile(raw) : matter(raw);
  const data = validateFrontmatter(parsed.data, filePath);

  return {
    slug: computeSlug(fileNameSlug, data, category),
    originalSlug: data.slug || fileNameSlug,
    title: data.title,
    date: data.date,
    tags: data.tags,
    published: data.published,
    description: data.description,
    cover: data.cover,
    content: parsed.content,
    format: isTex ? "tex" : "md",
    category,
  };
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
    .filter((post) => showAll || post.published)
    .map(toSummary)
    .sort((a, b) => {
      const dateDifference = new Date(b.date).getTime() - new Date(a.date).getTime();
      if (dateDifference) return dateDifference;
      return a.slug < b.slug ? -1 : a.slug > b.slug ? 1 : 0;
    });
}

export function getPostBySlug(slug: string): Post | null {
  if (!fs.existsSync(postsDir)) return null;

  for (const filePath of getAllFiles(postsDir)) {
    const post = parsePostFile(filePath);
    if (post.slug === slug && post.published) return post;
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

export function getAdjacentPosts(slug: string, category: string): AdjacentPosts {
  const posts = getAllPosts().filter((post) => post.category === category);
  const index = posts.findIndex((post) => post.slug === slug);

  if (index === -1) return { previous: null, next: null };

  return {
    previous: posts[index + 1] || null,
    next: posts[index - 1] || null,
  };
}
