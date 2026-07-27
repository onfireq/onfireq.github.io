"use client";

import { motion } from "framer-motion";
import ScrollReveal from "./ScrollReveal";
import SectionHeading from "./SectionHeading";

const stats = [
  { num: "5+", label: "年研究经验" },
  { num: "30+", label: "项目交付" },
  { num: "15+", label: "技术文章" },
];

export default function AboutSection() {
  return (
    <section id="about" className="relative py-24 px-6">
      <div className="max-w-5xl mx-auto">
        <SectionHeading title="关于" accent="我" subtitle="偏振控制研究者 × 全栈工程师" />

        <div className="grid md:grid-cols-2 gap-10 items-center">
          <ScrollReveal>
            <div className="relative">
              <div className="w-64 h-64 mx-auto rounded-3xl overflow-hidden shadow-2xl shadow-brand-purple/20">
                <img
                  src="/images/avatar.jpg"
                  alt="onfireq"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = "none";
                    target.parentElement!.classList.add("bg-gradient-to-br", "from-brand-purple", "to-brand-cyan", "flex", "items-center", "justify-center");
                    target.parentElement!.innerHTML = '<span class="text-7xl">👨‍💻</span>';
                  }}
                />
              </div>
              <div className="absolute -inset-2 rounded-[30px] border-2 border-brand-purple/20 -z-10" />
            </div>
          </ScrollReveal>

          <ScrollReveal delay={0.15}>
            <div>
              <h3 className="text-2xl font-bold mb-4">创意驱动的跨领域研究者</h3>
              <p className="text-gray-400 mb-4 leading-relaxed">
                研究方向为偏振控制与扰偏算法及其 FPGA 硬件部署，服务于光纤通信与量子通信领域。
                同时拥有扎实的 Web 全栈开发能力，擅长将复杂技术用优雅的交互呈现。
              </p>
              <p className="text-gray-400 mb-6 leading-relaxed">
                核心技术栈涵盖偏振控制算法（AdamSPGD / 动量梯度下降 / 几何 / MPC）、FPGA 定点化实现、
                前端开发（React / Next.js / Vue）及后端服务（Node.js / Python）。
              </p>
              <div className="flex gap-8">
                {stats.map((s, i) => (
                  <motion.div
                    key={s.label}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3 + i * 0.1 }}
                    className="text-center"
                  >
                    <div className="text-3xl font-bold text-gradient">{s.num}</div>
                    <div className="text-xs text-gray-500 mt-1">{s.label}</div>
                  </motion.div>
                ))}
              </div>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
