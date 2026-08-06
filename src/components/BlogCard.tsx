"use client";

import { motion } from "framer-motion";
import { HiCalendar, HiTag, HiFolder } from "react-icons/hi";
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
    <motion.a
      href={`/blog/${slug}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08, duration: 0.4 }}
      whileHover={{ y: -4 }}
      className="glass p-6 block transition-colors hover:border-brand-purple/30 cursor-pointer"
    >
      <h3 className="text-lg font-semibold mb-2 text-gradient">{title}</h3>
      <p className="text-sm text-gray-400 mb-4 line-clamp-2">{description}</p>
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-3 text-xs text-gray-500">
          <div className="flex items-center gap-1.5">
            <HiCalendar size={14} />
            {date}
          </div>
          {category && category !== "default" && (
            <div className="flex items-center gap-1 text-brand-purple">
              <HiFolder size={14} />
              {getCategoryName(category)}
            </div>
          )}
        </div>
        <div className="flex gap-1.5">
          {tags.slice(0, 2).map((tag) => (
            <span
              key={tag}
              className="px-2 py-0.5 text-xs rounded-full bg-brand-purple/10 text-brand-cyan border border-brand-purple/20"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </motion.a>
  );
}
