"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { HiCalendar, HiFolder } from "react-icons/hi";
import { getCategoryName } from "@/lib/categories";

interface BlogCardProps {
  slug: string;
  title: string;
  date: string;
  tags: string[];
  description: string;
  index: number;
  category?: string;
}

export default function BlogCard({ slug, title, date, tags, description, index, category }: BlogCardProps) {
  return (
    <Link href={`/blog/${slug}`} className="block">
      <motion.article
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.06, duration: 0.4 }}
        whileHover={{ y: -4 }}
        className="glass p-6 transition-colors hover:border-brand-purple/30"
      >
        <h3 className="text-lg font-semibold mb-2 text-gradient">{title}</h3>
        <p className="text-sm text-gray-400 mb-4 line-clamp-2">
          {description || "技术实践与学习记录"}
        </p>
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-3 text-xs text-gray-500">
            <div className="flex items-center gap-1.5">
              <HiCalendar size={14} aria-hidden="true" />
              <time dateTime={date}>{date}</time>
            </div>
            {category && category !== "default" && (
              <div className="flex items-center gap-1 text-brand-purple">
                <HiFolder size={14} aria-hidden="true" />
                {getCategoryName(category)}
              </div>
            )}
          </div>
          <ul className="flex gap-1.5" aria-label="文章标签">
            {tags.slice(0, 2).map((tag) => (
              <li
                key={tag}
                className="px-2 py-0.5 text-xs rounded-full bg-brand-purple/10 text-brand-cyan border border-brand-purple/20"
              >
                {tag}
              </li>
            ))}
          </ul>
        </div>
      </motion.article>
    </Link>
  );
}
