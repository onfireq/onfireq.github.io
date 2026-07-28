"use client";

import ScrollReveal from "@/components/ScrollReveal";
import SectionHeading from "@/components/SectionHeading";
import BlogList from "@/components/BlogList";
import { HiPencil } from "react-icons/hi";

export default function BlogListPage({
  posts,
  tags,
}: {
  posts: { slug: string; title: string; date: string; tags: string[]; description: string; format?: "md" | "tex" }[];
  tags: string[];
}) {
  return (
    <div className="min-h-screen pt-24 pb-16 px-6">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-2">
          <div />
          <a
            href="/blog/editor"
            className="flex items-center gap-1.5 px-4 py-2 text-sm rounded-xl bg-brand-purple/10 text-brand-purple hover:bg-brand-purple/20 transition border border-brand-purple/20"
          >
            <HiPencil size={16} /> 打开编辑器
          </a>
        </div>
        <SectionHeading title="技术" accent="博客" subtitle="偏振控制 · FPGA · 全栈开发 · 学习记录" />
        <BlogList posts={posts} tags={tags} />
      </div>
    </div>
  );
}
