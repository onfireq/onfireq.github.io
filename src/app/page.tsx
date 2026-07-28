"use client";

import HeroSection from "@/components/HeroSection";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <HeroSection />

      <section className="py-24 px-6">
        <div className="max-w-4xl mx-auto grid md:grid-cols-3 gap-6">
          {[
            { href: "/projects", title: "项目经历", desc: "从算法到部署的完整链路", icon: "🚀" },
            { href: "/blog", title: "技术博客", desc: "深度思考与学习记录", icon: "✍️" },
            { href: "/about", title: "关于我", desc: "硬件 & 软件 全栈工程师", icon: "👨‍💻" },
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

      <Footer />
    </>
  );
}
