"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { HiArrowLeft, HiArrowRight, HiCalendar, HiFolder, HiTag } from "react-icons/hi";
import BlogContent from "@/components/BlogContent";
import TableOfContents from "@/components/TableOfContents";
import { getCategoryName } from "@/lib/categories";
import type { PostSummary } from "@/lib/blog";
import type { BlogHeading } from "@/lib/blog-headings";

interface Post {
  slug: string;
  title: string;
  date: string;
  tags: string[];
  description: string;
  content: string;
  format?: "md" | "tex";
  category?: string;
}

function ArticleNavigation({
  previousPost,
  nextPost,
}: {
  previousPost: PostSummary | null;
  nextPost: PostSummary | null;
}) {
  if (!previousPost && !nextPost) return null;

  return (
    <nav
      aria-label="文章导航"
      className="mt-8 grid gap-4 border-0 bg-transparent backdrop-blur-none sm:grid-cols-2"
    >
      {previousPost && (
        <Link
          href={`/blog/${previousPost.slug}`}
          rel="prev"
          className="glass group flex min-h-28 flex-col justify-between p-5 transition-colors hover:border-brand-purple/30"
        >
          <span className="flex items-center gap-1.5 text-xs text-gray-500">
            <HiArrowLeft size={15} aria-hidden="true" /> 上一篇
          </span>
          <span className="mt-3 font-medium leading-6 transition-colors group-hover:text-brand-cyan">
            {previousPost.title}
          </span>
        </Link>
      )}

      {nextPost && (
        <Link
          href={`/blog/${nextPost.slug}`}
          rel="next"
          className={`glass group flex min-h-28 flex-col items-end justify-between p-5 text-right transition-colors hover:border-brand-purple/30 ${
            previousPost ? "" : "sm:col-start-2"
          }`}
        >
          <span className="flex items-center gap-1.5 text-xs text-gray-500">
            下一篇 <HiArrowRight size={15} aria-hidden="true" />
          </span>
          <span className="mt-3 font-medium leading-6 transition-colors group-hover:text-brand-cyan">
            {nextPost.title}
          </span>
        </Link>
      )}
    </nav>
  );
}

export default function BlogPostPage({
  post,
  headings,
  previousPost,
  nextPost,
}: {
  post: Post;
  headings: BlogHeading[];
  previousPost: PostSummary | null;
  nextPost: PostSummary | null;
}) {
  const hasTableOfContents = headings.length > 0;

  return (
    <div className="min-h-screen px-6 pb-16 pt-24">
      <div
        className={`mx-auto ${
          hasTableOfContents ? "max-w-6xl" : "max-w-3xl"
        }`}
      >
        <article className="min-w-0">
          <div className={hasTableOfContents ? "max-w-3xl" : undefined}>
            <motion.nav
              aria-label="面包屑"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="mb-6 flex items-center gap-2 border-0 bg-transparent text-sm text-gray-500 backdrop-blur-none"
            >
              <Link
                href={`/blog?category=${post.category || "default"}`}
                className="flex items-center gap-1.5 transition-colors hover:text-brand-purple"
              >
                <HiArrowLeft size={16} aria-hidden="true" />
                {post.category && post.category !== "default" ? getCategoryName(post.category) : "博客"}
              </Link>
            </motion.nav>

            <motion.header
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8"
            >
              <h1 className="mb-4 text-pretty text-3xl font-bold leading-tight md:text-4xl">{post.title}</h1>
              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                <div className="flex items-center gap-1.5">
                  <HiCalendar size={16} aria-hidden="true" />
                  <time dateTime={post.date}>{post.date}</time>
                </div>
                {post.category && post.category !== "default" && (
                  <div className="flex items-center gap-1.5 text-brand-purple">
                    <HiFolder size={16} aria-hidden="true" />
                    {getCategoryName(post.category)}
                  </div>
                )}
                {post.tags.length > 0 && (
                  <div className="flex flex-wrap items-center gap-2">
                    <HiTag size={16} aria-hidden="true" />
                    {post.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full border border-brand-purple/20 bg-brand-purple/10 px-2 py-0.5 text-xs text-brand-cyan"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </motion.header>
          </div>

          <div
            className={
              hasTableOfContents
                ? "lg:grid lg:grid-cols-[minmax(0,48rem)_14rem] lg:gap-10"
                : undefined
            }
          >
            <TableOfContents headings={headings} variant="desktop" />
            <div className="min-w-0 lg:col-start-1 lg:row-start-1">
              <TableOfContents headings={headings} variant="mobile" />

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="glass p-5 sm:p-8 md:p-10"
              >
                <BlogContent content={post.content} format={post.format} />
              </motion.div>

              <ArticleNavigation previousPost={previousPost} nextPost={nextPost} />
            </div>
          </div>
        </article>
      </div>
    </div>
  );
}
