"use client";

import { HiMail, HiGlobe } from "react-icons/hi";
import ScrollReveal from "./ScrollReveal";
import SectionHeading from "./SectionHeading";

const contacts = [
  { icon: HiGlobe, label: "所在地", value: "中国 · 广州" },
  { icon: HiMail, label: "邮箱", value: "2467708204@qq.com" },
];

export default function ContactSection() {
  return (
    <section id="contact" className="relative py-24 px-6">
      <div className="max-w-5xl mx-auto">
        <SectionHeading title="联系" accent="我" subtitle="有兴趣合作或交流？欢迎联系" />

        <div className="grid md:grid-cols-2 gap-10">
          {/* Contact info */}
          <ScrollReveal>
            <div className="space-y-5">
              {contacts.map((c) => (
                <div key={c.label} className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-brand-purple/15 flex items-center justify-center text-brand-purple">
                    <c.icon size={20} />
                  </div>
                  <div>
                    <div className="text-sm font-medium">{c.label}</div>
                    <div className="text-sm text-gray-400">{c.value}</div>
                  </div>
                </div>
              ))}
            </div>
          </ScrollReveal>

          {/* Form */}
          <ScrollReveal delay={0.15}>
            <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
              <input
                type="text"
                placeholder="你的姓名"
                required
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-sm focus:border-brand-purple outline-none transition-colors"
              />
              <input
                type="email"
                placeholder="你的邮箱"
                required
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-sm focus:border-brand-purple outline-none transition-colors"
              />
              <input
                type="text"
                placeholder="主题"
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-sm focus:border-brand-purple outline-none transition-colors"
              />
              <textarea
                placeholder="写下你的消息..."
                required
                rows={4}
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-sm focus:border-brand-purple outline-none transition-colors resize-none"
              />
              <button
                type="submit"
                className="px-6 py-3 rounded-full font-semibold text-sm bg-gradient-to-r from-brand-purple to-brand-cyan text-white hover:shadow-lg hover:shadow-brand-purple/25 transition-all"
              >
                发送消息
              </button>
            </form>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
