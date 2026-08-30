"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import ScrollReveal from "@/components/ScrollReveal";
import SectionHeading from "@/components/SectionHeading";
import { HiMail, HiGlobe } from "react-icons/hi";

const stats = [
  { num: "5+", label: "年研究经验" },
  { num: "30+", label: "项目交付" },
  { num: "15+", label: "技术文章" },
];

const contactItems = [
  { icon: HiGlobe, label: "所在地", value: "中国 · 广州" },
  { icon: HiMail, label: "邮箱", value: "2467708204@qq.com", href: "mailto:2467708204@qq.com" },
];

export default function AboutSection() {
  return (
    <section id="about" className="relative py-24 px-6">
      <div className="max-w-5xl mx-auto">
        <SectionHeading title="关于" accent="我" subtitle="硬件 & 软件 全栈工程师" />

        <div className="grid md:grid-cols-2 gap-10 items-center mb-20">
          <ScrollReveal>
            <div className="relative">
              <div className="w-64 h-64 mx-auto rounded-3xl overflow-hidden shadow-2xl shadow-brand-purple/20">
                <Image
                  src="/images/avatar.jpg"
                  alt="OnfireQ 的头像"
                  width={256}
                  height={256}
                  sizes="256px"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -inset-2 rounded-[30px] border-2 border-brand-purple/20 -z-10" />
            </div>
          </ScrollReveal>

          <ScrollReveal delay={0.15}>
            <div>
              <h3 className="text-2xl font-bold mb-4">创意驱动的跨领域研究者</h3>
              <p className="text-gray-400 mb-4 leading-relaxed">
                研究方向为偏振控制与扰偏算法及其 FPGA 硬件部署，服务于光信息与量子信息领域。
                同时拥有扎实的 硬件 & 软件 全栈开发能力，擅长将复杂技术用优雅的交互呈现。
              </p>
              <p className="text-gray-400 mb-6 leading-relaxed">
                核心技术栈涵盖偏振控制算法、FPGA 部署、
                硬件开发、前端开发等等。
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

        {/* Contact section */}
        <ScrollReveal>
          <h2 className="text-2xl font-bold mb-2 text-center">
            联系<span className="text-gradient">我</span>
          </h2>
          <p className="text-gray-400 text-sm text-center mb-10">有兴趣合作或交流？欢迎联系</p>
        </ScrollReveal>

        <div className="grid gap-4 sm:grid-cols-2">
          {contactItems.map((c, i) => (
            <ScrollReveal key={c.label} delay={i * 0.06}>
              <div className="glass p-5 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-brand-purple/15 flex items-center justify-center text-brand-purple flex-shrink-0">
                  <c.icon size={18} />
                </div>
                <div className="min-w-0">
                  <div className="text-xs text-gray-500">{c.label}</div>
                  {c.href ? (
                    <a href={c.href} className="text-sm hover:text-brand-cyan hover:underline">
                      {c.value}
                    </a>
                  ) : (
                    <div className="text-sm">{c.value}</div>
                  )}
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
