import { HiRss } from "react-icons/hi";
import type { Post } from "@/lib/blog";
import BlogExplorer from "./BlogExplorer";
import ZhihuSidebarPanel from "./ZhihuSidebarPanel";

type PostSummary = Omit<Post, "content">;

export default function BlogListPage({ localPosts }: { localPosts: PostSummary[] }) {
  return (
    <div className="min-h-screen px-6 pb-16 pt-24">
      <div className="mx-auto flex max-w-6xl gap-8">
        <ZhihuSidebarPanel />

        <div className="mx-auto min-w-0 max-w-3xl flex-1">
          <header className="mb-8">
            <p className="mb-3 text-sm font-semibold tracking-[0.18em] text-brand-cyan">NOTES & WRITING</p>
            <h1 className="text-3xl font-bold md:text-4xl">技术博客</h1>
            <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
              <p className="text-sm leading-relaxed text-gray-400">
                偏振控制、FPGA 时序、全栈开发与持续学习的实践记录。
              </p>
              <a
                href="/rss.xml"
                className="inline-flex min-h-11 items-center gap-1.5 rounded-xl px-3 text-sm text-gray-400 transition-colors hover:bg-brand-purple/10 hover:text-brand-cyan"
              >
                <HiRss size={16} aria-hidden="true" /> RSS 订阅
              </a>
            </div>
          </header>
          <BlogExplorer localPosts={localPosts} />
        </div>
      </div>
    </div>
  );
}
