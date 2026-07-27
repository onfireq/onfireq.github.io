import { getAllPosts, getAllTags } from "@/lib/blog";
import BlogListPage from "./BlogListPage";

export const metadata = {
  title: "博客 | onfireq",
  description: "偏振控制算法研究与全栈开发的技术博客",
};

export default function Page() {
  const posts = getAllPosts();
  const tags = getAllTags();

  return <BlogListPage posts={posts} tags={tags} />;
}
