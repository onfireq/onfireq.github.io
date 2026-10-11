import { getAllPosts } from "@/lib/blog";
import BlogListPage from "./BlogListPage";

export const metadata = {
  title: "博客",
  description: "OnfireQ 的技术实践、人文思考与阅读笔记，涵盖偏振控制、FPGA、历史与文化。",
  alternates: {
    canonical: "/blog",
    types: { "application/rss+xml": "/rss.xml" },
  },
};

export default function Page() {
  const localPosts = getAllPosts();
  return <BlogListPage localPosts={localPosts} />;
}
