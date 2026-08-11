"use client";

import { motion } from "framer-motion";
import ScrollReveal from "@/components/ScrollReveal";
import SectionHeading from "@/components/SectionHeading";
import { HiMail, HiGlobe } from "react-icons/hi";
import { FaGithub, FaWeixin } from "react-icons/fa";
import { SiZhihu } from "react-icons/si";

function BilibiliIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M17.813 4.653h.854c1.51.054 2.769.578 3.773 1.574 1.004.995 1.524 2.249 1.56 3.76v7.36c-.036 1.51-.556 2.769-1.56 3.773s-2.262 1.524-3.773 1.56H5.333c-1.51-.036-2.769-.556-3.773-1.56S.036 18.858 0 17.347v-7.36c.036-1.511.556-2.765 1.56-3.76 1.004-.996 2.262-1.52 3.773-1.574h.774l-1.174-1.12a1.234 1.234 0 0 1-.373-.906c0-.356.124-.658.373-.907l.027-.027c.267-.249.573-.373.92-.373.347 0 .653.124.92.373L9.653 4.44c.071.071.134.142.187.213h4.267a.836.836 0 0 1 .16-.213l2.853-2.747c.267-.249.573-.373.92-.373.347 0 .662.151.929.4.267.249.391.551.391.907 0 .355-.124.657-.373.906L17.813 4.653zM5.333 7.24c-.746.018-1.373.276-1.88.773-.506.498-.769 1.13-.786 1.894v7.52c.017.764.28 1.395.786 1.893.507.498 1.134.756 1.88.773h13.334c.746-.017 1.373-.275 1.88-.773.506-.498.769-1.129.786-1.893v-7.52c-.017-.765-.28-1.396-.786-1.894-.507-.497-1.134-.755-1.88-.773H5.333zM8 11.107c.373 0 .684.124.933.373.25.249.383.569.4.96v1.173c-.017.391-.15.711-.4.96-.249.25-.56.374-.933.374s-.684-.125-.933-.374c-.25-.249-.383-.569-.4-.96V12.44c.017-.391.15-.711.4-.96.249-.249.56-.373.933-.373zm8 0c.373 0 .684.124.933.373.25.249.383.569.4.96v1.173c-.017.391-.15.711-.4.96-.249.25-.56.374-.933.374s-.684-.125-.933-.374c-.25-.249-.383-.569-.4-.96V12.44c.017-.391.15-.711.4-.96.249-.249.56-.373.933-.373z"/>
    </svg>
  );
}

const stats = [
  { num: "5+", label: "年研究经验" },
  { num: "30+", label: "项目交付" },
  { num: "15+", label: "技术文章" },
];

// contactItems 已移除（与 layout 中的 footer 重复，避免重复显示）
// const contactItems = [
//   { icon: HiGlobe, label: "所在地", value: "中国 · 广州" },
//   { icon: HiMail, label: "邮箱", value: "2467708204@qq.com" },
// ];

export default function AboutSection() {
  return (
    <section id="about" className="relative py-24 px-6">
      <div className="max-w-5xl mx-auto">
        <SectionHeading title="关于" accent="我" subtitle="硬件 & 软件 全栈工程师" />

        <div className="grid md:grid-cols-2 gap-10 items-center mb-20">
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

      </div>
    </section>
  );
}
