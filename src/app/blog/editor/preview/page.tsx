import fs from "node:fs";
import path from "node:path";
import Link from "next/link";
import HumanitiesArticle from "@/components/HumanitiesArticle";
import { parseArticlePreview } from "@/lib/article-preview";

export const metadata = {
  title: "人文模板排版示例",
};

export default function HumanitiesPreviewPage() {
  const source = fs.readFileSync(path.join(process.cwd(), "content/templates/humanities-example.md"), "utf8");
  const article = parseArticlePreview(source);

  return (
    <div className="mx-auto max-w-3xl px-4 pb-16 pt-24 sm:px-6">
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3 text-sm">
        <Link href="/blog/editor" className="min-h-11 content-center text-brand-purple hover:underline">← 返回编辑器</Link>
        <p className="text-gray-400">排版示例 · 可通过顶部按钮切换亮暗主题</p>
      </div>
      <HumanitiesArticle {...article} />
    </div>
  );
}
