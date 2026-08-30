import GithubSlugger from "github-slugger";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import remarkParse from "remark-parse";
import { unified } from "unified";
import { prepareBlogContent, type BlogFormat } from "./blog-content";

export interface BlogHeading {
  id: string;
  text: string;
  level: 2 | 3;
}

interface MarkdownNode {
  type: string;
  depth?: number;
  value?: string;
  children?: MarkdownNode[];
}

function getNodeText(node: MarkdownNode): string {
  if (typeof node.value === "string") return node.value;
  return node.children?.map(getNodeText).join("") || "";
}

export function getBlogHeadings(content: string, format: BlogFormat): BlogHeading[] {
  const tree = unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkMath)
    .parse(prepareBlogContent(content, format)) as MarkdownNode;
  const slugger = new GithubSlugger();
  const headings: BlogHeading[] = [];

  const visit = (node: MarkdownNode) => {
    if (node.type === "heading" && node.depth) {
      const text = getNodeText(node).trim();
      const id = slugger.slug(text);

      if (node.depth === 2 || node.depth === 3) {
        headings.push({ id, text, level: node.depth });
      }
    }

    node.children?.forEach(visit);
  };

  visit(tree);
  return headings;
}
