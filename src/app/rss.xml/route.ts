import { getAllPosts } from "@/lib/blog";
import { getCategoryName } from "@/lib/categories";

export const dynamic = "force-static";

const siteUrl = "https://onfireq.github.io";
const feedUrl = `${siteUrl}/rss.xml`;

function escapeXml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function articleUrl(slug: string): string {
  return `${siteUrl}/blog/${encodeURIComponent(slug)}/`;
}

function toRfc822Date(date: string): string {
  return new Date(`${date}T00:00:00Z`).toUTCString();
}

export function GET() {
  const posts = getAllPosts();
  const lastBuildDate = posts[0] ? toRfc822Date(posts[0].date) : toRfc822Date("2026-01-01");
  const items = posts
    .map((post) => {
      const url = articleUrl(post.slug);
      const categories = [getCategoryName(post.category), ...post.tags]
        .map((category) => `      <category>${escapeXml(category)}</category>`)
        .join("\n");

      return `    <item>
      <title>${escapeXml(post.title)}</title>
      <link>${escapeXml(url)}</link>
      <guid isPermaLink="true">${escapeXml(url)}</guid>
      <pubDate>${toRfc822Date(post.date)}</pubDate>
      <description>${escapeXml(post.description)}</description>
${categories}
    </item>`;
    })
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>OnfireQ 的博客</title>
    <link>${siteUrl}/blog/</link>
    <description>偏振控制、FPGA、全栈开发与持续学习的实践记录。</description>
    <language>zh-CN</language>
    <lastBuildDate>${lastBuildDate}</lastBuildDate>
    <atom:link href="${feedUrl}" rel="self" type="application/rss+xml" />
${items}
  </channel>
</rss>
`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
    },
  });
}
