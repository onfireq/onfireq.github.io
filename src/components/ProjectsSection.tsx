"use client";

import { motion } from "framer-motion";
import ScrollReveal from "./ScrollReveal";
import SectionHeading from "./SectionHeading";
import { projects } from "@/data/projects";

export default function ProjectsSection() {
  return (
    <section id="projects" className="relative py-24 px-6">
      <div className="max-w-5xl mx-auto">
        <SectionHeading title="精选" accent="项目" subtitle="每一个项目都是对未知的探索" />

        <div className="grid md:grid-cols-2 gap-5">
          {projects.map((p, i) => (
            <ScrollReveal key={p.slug} delay={i * 0.1}>
              <motion.article
                whileHover={{ y: -6 }}
                className="glass h-full overflow-hidden group transition-colors hover:border-brand-purple/30"
              >
                {/* Image area */}
                <div
                  className="h-44 flex items-center justify-center text-6xl relative overflow-hidden"
                  style={{
                    background: `linear-gradient(135deg, ${p.color}33 0%, ${p.color}11 100%)`,
                  }}
                >
                  <motion.span
                    aria-hidden="true"
                    whileHover={{ scale: 1.15 }}
                    transition={{ type: "spring" }}
                  >
                    {p.icon}
                  </motion.span>
                  <div className="absolute inset-0 bg-gradient-to-t from-surface-900/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                    <span className="text-sm text-brand-cyan">研究与工程实践</span>
                  </div>
                </div>

                <div className="p-5">
                  <h4 className="font-semibold text-lg mb-2">{p.title}</h4>
                  <p className="text-sm text-gray-400 mb-4 leading-relaxed">
                    {p.description}
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {p.tags.map((t) => (
                      <span
                        key={t}
                        className="px-2.5 py-0.5 text-xs rounded-full bg-brand-purple/15 text-brand-cyan border border-brand-purple/20"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.article>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
