import { Suspense } from "react";
import { getAllPosts } from "@/lib/blog";
import BlogListPage from "./BlogListPage";

export const metadata = {
  title: "博客",
  description: "偏振控制算法研究与全栈开发的技术博客",
  alternates: { canonical: "/blog" },
};

export default function Page() {
  const localPosts = getAllPosts();
  return (
    <Suspense fallback={<div className="min-h-screen pt-24 pb-16 px-6"><div className="max-w-3xl mx-auto text-center text-gray-500">加载中...</div></div>}>
      <BlogListPage localPosts={localPosts} />
    </Suspense>
  );
}
