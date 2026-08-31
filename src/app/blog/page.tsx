import { getAllPosts } from "@/lib/blog";
import BlogListPage from "./BlogListPage";

export const metadata = {
  title: "博客",
  description: "偏振控制算法研究与全栈开发的技术博客",
  alternates: {
    canonical: "/blog",
    types: { "application/rss+xml": "/rss.xml" },
  },
};

export default function Page() {
  const localPosts = getAllPosts();
  return <BlogListPage localPosts={localPosts} />;
}
