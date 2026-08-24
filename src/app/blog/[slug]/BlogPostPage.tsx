"use client";

import { motion } from "framer-motion";
import { HiCalendar, HiTag, HiArrowLeft, HiFolder } from "react-icons/hi";
import BlogContent from "@/components/BlogContent";
import { getCategoryName } from "@/lib/categories";

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

export default function BlogPostPage({ post }: { post: Post }) {
  return (
    <div className="min-h-screen pt-24 pb-16 px-6">
      <article className="max-w-3xl mx-auto">
        {/* Breadcrumb */}
        <motion.nav
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-2 text-sm text-gray-500 mb-6"
        >
          <a href={`/blog?category=${post.category || 'all'}`} className="hover:text-brand-purple transition-colors flex items-center gap-1.5">
            <HiArrowLeft size={16} />
            {post.category && post.category !== "default" ? getCategoryName(post.category) : "博客"}
          </a>
        </motion.nav>

        {/* Header */}
        <motion.header
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10"
        >
          <h1 className="text-3xl md:text-4xl font-bold mb-4">{post.title}</h1>
          <div className="flex items-center gap-4 text-sm text-gray-500 flex-wrap">
            <div className="flex items-center gap-1.5">
              <HiCalendar size={16} />
              {post.date}
            </div>
            {post.category && post.category !== "default" && (
              <div className="flex items-center gap-1.5 text-brand-purple">
                <HiFolder size={16} />
                {getCategoryName(post.category)}
              </div>
            )}
            {post.tags && post.tags.length > 0 && (
              <div className="flex items-center gap-2">
                <HiTag size={16} />
                {post.tags.map((t) => (
                  <span
                    key={t}
                    className="px-2 py-0.5 text-xs rounded-full bg-brand-purple/10 text-brand-cyan border border-brand-purple/20"
                  >
                    {t}
                  </span>
                ))}
              </div>
            )}
          </div>
        </motion.header>

        {/* Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass p-8 md:p-10"
        >
          <BlogContent content={post.content} format={post.format} />
        </motion.div>
      </article>
    </div>
  );
}
