"use client";

import { motion } from "framer-motion";
import HeroSection from "@/components/HeroSection";
import ScrollReveal from "@/components/ScrollReveal";
import Footer from "@/components/Footer";
import { HiMail, HiGlobe } from "react-icons/hi";
import { FaGithub, FaWeixin } from "react-icons/fa";
import { SiZhihu } from "react-icons/si";

function BilibiliIcon({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M17.813 4.653h.854c1.51.054 2.769.578 3.773 1.574 1.004.995 1.524 2.249 1.56 3.76v7.36c-.036 1.51-.556 2.769-1.56 3.773s-2.262 1.524-3.773 1.56H5.333c-1.51-.036-2.769-.556-3.773-1.56S.036 18.858 0 17.347v-7.36c.036-1.511.556-2.765 1.56-3.76 1.004-.996 2.262-1.52 3.773-1.574h.774l-1.174-1.12a1.234 1.234 0 0 1-.373-.906c0-.356.124-.658.373-.907l.027-.027c.267-.249.573-.373.92-.373.347 0 .653.124.92.373L9.653 4.44c.071.071.134.142.187.213h4.267a.836.836 0 0 1 .16-.213l2.853-2.747c.267-.249.573-.373.92-.373.347 0 .662.151.929.4.267.249.391.551.391.907 0 .355-.124.657-.373.906L17.813 4.653zM5.333 7.24c-.746.018-1.373.276-1.88.773-.506.498-.769 1.13-.786 1.894v7.52c.017.764.28 1.395.786 1.893.507.498 1.134.756 1.88.773h13.334c.746-.017 1.373-.275 1.88-.773.506-.498.769-1.129.786-1.893v-7.52c-.017-.765-.28-1.396-.786-1.894-.507-.497-1.134-.755-1.88-.773H5.333zM8 11.107c.373 0 .684.124.933.373.25.249.383.569.4.96v1.173c-.017.391-.15.711-.4.96-.249.25-.56.374-.933.374s-.684-.125-.933-.374c-.25-.249-.383-.569-.4-.96V12.44c.017-.391.15-.711.4-.96.249-.249.56-.373.933-.373zm8 0c.373 0 .684.124.933.373.25.249.383.569.4.96v1.173c-.017.391-.15.711-.4.96-.249.25-.56.374-.933.374s-.684-.125-.933-.374c-.25-.249-.383-.569-.4-.96V12.44c.017-.391.15-.711.4-.96.249-.249.56-.373.933-.373z"/>
    </svg>
  );
}

const contactItems = [
  { icon: HiMail, label: "邮箱", value: "2467708204@qq.com" },
  { icon: FaWeixin, label: "微信", value: "onfireq" },
  { icon: FaGithub, label: "GitHub", value: "github.com/onfireq", href: "https://github.com/onfireq" },
  { icon: SiZhihu, label: "知乎", value: "bai-ri-meng-you-54-77", href: "https://www.zhihu.com/people/bai-ri-meng-you-54-77" },
  { icon: BilibiliIcon, label: "B站", value: "447249116", href: "https://space.bilibili.com/447249116" },
  { icon: HiGlobe, label: "所在地", value: "中国 · 广州" },
];

export default function Home() {
  return (
    <>
      <HeroSection />

      {/* Quick links */}
      <section className="py-24 px-6">
        <div className="max-w-4xl mx-auto grid md:grid-cols-3 gap-6">
          {[
            { href: "/projects", title: "项目经历", desc: "从算法到部署的完整链路", icon: "🚀" },
            { href: "/blog", title: "技术博客", desc: "深度思考与学习记录", icon: "✍️" },
            { href: "/about", title: "关于我", desc: "偏振控制研究者 × 全栈工程师", icon: "👨‍💻" },
          ].map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="glass p-8 text-center hover:border-brand-purple/30 transition-all group"
            >
              <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">{item.icon}</div>
              <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
              <p className="text-sm text-gray-400">{item.desc}</p>
            </a>
          ))}
        </div>
      </section>

      {/* Contact section on homepage */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <ScrollReveal>
            <h2 className="text-2xl font-bold mb-2 text-center">
              联系<span className="text-gradient">我</span>
            </h2>
            <p className="text-gray-400 text-sm text-center mb-10">有兴趣合作或交流？欢迎联系</p>
          </ScrollReveal>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {contactItems.map((c, i) => (
              <ScrollReveal key={c.label} delay={i * 0.06}>
                <a
                  href={c.href || "#"}
                  target={c.href ? "_blank" : undefined}
                  rel={c.href ? "noopener" : undefined}
                  className="glass p-5 flex items-center gap-3 hover:border-brand-purple/30 transition-all block"
                >
                  <div className="w-10 h-10 rounded-xl bg-brand-purple/15 flex items-center justify-center text-brand-purple flex-shrink-0">
                    <c.icon size={18} />
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs text-gray-500">{c.label}</div>
                    <div className="text-sm truncate">{c.value}</div>
                  </div>
                </a>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
