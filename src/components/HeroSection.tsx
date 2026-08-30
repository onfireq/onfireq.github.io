"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { HiArrowDown, HiArrowRight, HiBookOpen } from "react-icons/hi";

const ThreeBackground = dynamic(() => import("./ThreeBackground"), {
  ssr: false,
  loading: () => (
    <div
      aria-hidden="true"
      className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_70%_35%,rgba(108,99,255,0.12),transparent_38%)]"
    />
  ),
});

export default function HeroSection() {
  const reduceMotion = useReducedMotion();

  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center overflow-hidden"
    >
      <ThreeBackground />

      {/* Gradient overlays */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full bg-brand-purple/10 blur-[120px]" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full bg-brand-cyan/8 blur-[100px]" />

      <div className="relative max-w-6xl mx-auto px-6 z-10 w-full">
        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <span className="inline-block px-4 py-1.5 mb-6 text-sm text-brand-purple border border-brand-purple/30 rounded-full bg-brand-purple/10">
            光学算法 × FPGA × 产品工程
          </span>
        </motion.div>

        <motion.h1
          initial={reduceMotion ? false : { opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.15 }}
          className="max-w-4xl text-4xl md:text-6xl lg:text-7xl font-extrabold leading-[1.08] mb-6"
        >
          让偏振控制算法，
          <br className="hidden sm:block" />
          <span className="text-gradient">从仿真真正跑进 FPGA</span>
        </motion.h1>

        <motion.p
          initial={reduceMotion ? false : { opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="text-gray-400 text-base md:text-lg max-w-2xl mb-8 leading-relaxed"
        >
          你好，我是 OnfireQ。我研究偏振控制与扰偏算法，关注定点化、时序与实时部署，
          也用 Next.js、Python 等工具把复杂技术变成可复现的项目与文章。
        </motion.p>

        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.42 }}
          className="flex flex-col sm:flex-row gap-3 mb-10"
        >
          <Link
            href="/projects"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-brand-purple to-brand-cyan px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-brand-purple/20 transition-transform hover:-translate-y-0.5"
          >
            查看代表项目 <HiArrowRight aria-hidden="true" />
          </Link>
          <Link
            href="/blog"
            className="inline-flex items-center justify-center gap-2 rounded-full border border-white/10 bg-white/5 px-6 py-3 text-sm font-semibold text-gray-300 transition-colors hover:border-brand-cyan/30 hover:text-white"
          >
            <HiBookOpen aria-hidden="true" /> 阅读技术博客
          </Link>
        </motion.div>

        <motion.ul
          initial={reduceMotion ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.62 }}
          className="flex flex-wrap gap-x-6 gap-y-2 text-xs text-gray-500"
          aria-label="核心工作链路"
        >
          {["算法建模", "定点化验证", "FPGA 部署", "全栈呈现"].map((item) => (
            <li key={item} className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-brand-cyan" aria-hidden="true" />
              {item}
            </li>
          ))}
        </motion.ul>
      </div>

      {/* Scroll indicator */}
      <motion.a
        href="#home-overview"
        aria-label="继续浏览"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 rounded-full p-2"
      >
        <HiArrowDown className="text-brand-purple animate-bounce" size={24} aria-hidden="true" />
      </motion.a>
    </section>
  );
}
