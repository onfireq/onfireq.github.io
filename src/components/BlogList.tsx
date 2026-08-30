"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { HiSearch } from "react-icons/hi";
import BlogCard from "@/components/BlogCard";
import type { Post } from "@/lib/blog";

export default function BlogList({ posts, tags }: { posts: Omit<Post, "content">[]; tags: string[] }) {
  const [search, setSearch] = useState("");
  const [activeTag, setActiveTag] = useState<string | null>(null);

  const filtered = posts.filter((p) => {
    const matchSearch = !search || p.title.includes(search) || p.description.includes(search);
    const matchTag = !activeTag || p.tags.includes(activeTag);
    return matchSearch && matchTag;
  });

  return (
    <div>
      {/* Search */}
      <div className="relative mb-6">
        <HiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
        <input
          type="text"
          placeholder="搜索文章..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-11 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-sm focus:border-brand-purple outline-none transition-colors"
        />
      </div>

      {/* Tags */}
      <div className="flex flex-wrap gap-2 mb-8">
        <button
          onClick={() => setActiveTag(null)}
          className={`px-3 py-1.5 text-xs rounded-full transition-all ${
            !activeTag
              ? "bg-brand-purple text-white"
              : "bg-white/5 text-gray-400 hover:bg-white/10"
          }`}
        >
          全部
        </button>
        {tags.map((tag) => (
          <button
            key={tag}
            onClick={() => setActiveTag(activeTag === tag ? null : tag)}
            className={`px-3 py-1.5 text-xs rounded-full transition-all ${
              activeTag === tag
                ? "bg-brand-purple text-white"
                : "bg-white/5 text-gray-400 hover:bg-white/10"
            }`}
          >
            {tag}
          </button>
        ))}
      </div>

      {/* Post list */}
      <div className="space-y-4">
        <AnimatePresence mode="popLayout">
          {filtered.length > 0 ? (
            filtered.map((post, i) => (
              <BlogCard key={post.slug} {...post} index={i} />
            ))
          ) : (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center text-gray-500 py-12"
            >
              没有找到匹配的文章
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
