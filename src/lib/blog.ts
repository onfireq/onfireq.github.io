import fs from "fs";
import path from "path";
import matter from "gray-matter";

export interface Post {
  slug: string;
  title: string;
  date: string;
  tags: string[];
  published: boolean;
  description: string;
  cover?: string;
  content: string;
  format: "md" | "tex";
}

const postsDir = path.join(process.cwd(), "content/blog");

// 从 .tex 文件提取 frontmatter 信息
function parseTexFile(raw: string, filename: string) {
  // 尝试提取 \title{}
  const titleMatch = raw.match(/\\title\{([^}]+)\}/);
  const title = titleMatch ? titleMatch[1] : filename;

  // 尝试提取 \date{}
  const dateMatch = raw.match(/\\date\{([^}]+)\}/);
  const date = dateMatch ? dateMatch[1] : "2026-01-01";

  // 移除 LaTeX 文档结构命令，保留内容
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

  // 保留数学公式环境原样，由 KaTeX 在渲染时处理
  // 不在此处转换，避免破坏矩阵等复杂环境

  return { title, date, content, tags: ["LaTeX"], description: `LaTeX 文档: ${title}` };
}

export function getAllPosts(showAll = false): Omit<Post, "content">[] {
  if (!fs.existsSync(postsDir)) return [];

  const files = fs.readdirSync(postsDir).filter((f) => f.endsWith(".md") || f.endsWith(".tex"));

  return files
    .map((file) => {
      const raw = fs.readFileSync(path.join(postsDir, file), "utf-8");
      const isTex = file.endsWith(".tex");
      
      let data: any = {};
      let content = "";
      let format: "md" | "tex" = "md";

      if (isTex) {
        const parsed = parseTexFile(raw, file.replace(/\.tex$/, ""));
        data = { title: parsed.title, date: parsed.date, tags: parsed.tags, description: parsed.description };
        content = parsed.content;
        format = "tex";
      } else {
        const parsed = matter(raw);
        data = parsed.data;
        content = parsed.content;
        format = "md";
      }

      const slug = file.replace(/\.(md|tex)$/, "");
      return {
        slug,
        title: data.title || slug,
        date: data.date || "2026-01-01",
        tags: data.tags || [],
        published: data.published !== false,
        description: data.description || "",
        cover: data.cover,
        content,
        format,
      };
    })
    .filter((post) => showAll || post.published)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export function getPostBySlug(slug: string): Post | null {
  // 尝试 .md 和 .tex
  for (const ext of [".md", ".tex"]) {
    const filePath = path.join(postsDir, `${slug}${ext}`);
    if (fs.existsSync(filePath)) {
      const raw = fs.readFileSync(filePath, "utf-8");
      const isTex = ext === ".tex";

      let data: any = {};
      let content = "";
      let format: "md" | "tex" = "md";

      if (isTex) {
        const parsed = parseTexFile(raw, slug);
        data = { title: parsed.title, date: parsed.date, tags: parsed.tags, description: parsed.description };
        content = parsed.content;
        format = "tex";
      } else {
        const parsed = matter(raw);
        data = parsed.data;
        content = parsed.content;
        format = "md";
      }

      return {
        slug,
        title: data.title || slug,
        date: data.date || "2026-01-01",
        tags: data.tags || [],
        published: data.published !== false,
        description: data.description || "",
        cover: data.cover,
        content,
        format,
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
