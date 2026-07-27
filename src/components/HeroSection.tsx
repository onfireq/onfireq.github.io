"use client";

import { motion } from "framer-motion";
import { HiArrowDown } from "react-icons/hi";
import ThreeBackground from "./ThreeBackground";

export default function HeroSection() {
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
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <span className="inline-block px-4 py-1.5 mb-6 text-sm text-brand-purple border border-brand-purple/30 rounded-full bg-brand-purple/10">
            👋 欢迎来到我的主页
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.15 }}
          className="text-4xl md:text-6xl lg:text-7xl font-extrabold leading-tight mb-6"
        >
          你好，我是
          <br />
          <span className="text-gradient">onfireq</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="text-gray-400 text-base md:text-lg max-w-xl mb-10 leading-relaxed"
        >
          偏振控制算法研究者 & Web 全栈工程师。
          专注于偏振控制与扰偏算法的 FPGA 部署，同时热衷于用现代技术构建优雅的数字体验。
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.45 }}
          className="flex gap-4 flex-wrap"
        >
          <a
            href="/projects"
            className="px-6 py-3 rounded-full font-semibold text-sm bg-gradient-to-r from-brand-purple to-brand-cyan text-white hover:shadow-lg hover:shadow-brand-purple/25 transition-all"
          >
            查看项目
          </a>
          <a
            href="/contact"
            className="px-6 py-3 rounded-full font-semibold text-sm border border-brand-purple text-brand-purple hover:bg-brand-purple/10 transition-all"
          >
            联系我
          </a>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <HiArrowDown className="text-brand-purple animate-bounce" size={24} />
      </motion.div>
    </section>
  );
}
