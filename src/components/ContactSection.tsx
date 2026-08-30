"use client";

import type { FormEvent } from "react";
import { HiMail, HiGlobe } from "react-icons/hi";
import ScrollReveal from "./ScrollReveal";
import SectionHeading from "./SectionHeading";

const contacts = [
  { icon: HiGlobe, label: "所在地", value: "中国 · 广州" },
  { icon: HiMail, label: "邮箱", value: "2467708204@qq.com" },
];

export default function ContactSection() {
  const openEmailDraft = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const name = String(data.get("name") || "").trim();
    const email = String(data.get("email") || "").trim();
    const subject = String(data.get("subject") || "技术交流").trim();
    const message = String(data.get("message") || "").trim();
    const body = [`你好，我是 ${name}。`, `联系邮箱：${email}`, "", message].join("\n");

    window.location.href = `mailto:2467708204@qq.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

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
                    {c.label === "邮箱" ? (
                      <a href="mailto:2467708204@qq.com" className="text-sm text-gray-400 hover:text-brand-cyan hover:underline">
                        {c.value}
                      </a>
                    ) : (
                      <div className="text-sm text-gray-400">{c.value}</div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </ScrollReveal>

          {/* Form */}
          <ScrollReveal delay={0.15}>
            <form onSubmit={openEmailDraft} className="space-y-4" aria-describedby="contact-form-note">
              <label className="block text-sm font-medium">
                姓名
                <input
                  name="name"
                  type="text"
                  autoComplete="name"
                  required
                  className="mt-2 w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-sm focus:border-brand-purple outline-none transition-colors"
                />
              </label>
              <label className="block text-sm font-medium">
                邮箱
                <input
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="mt-2 w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-sm focus:border-brand-purple outline-none transition-colors"
                />
              </label>
              <label className="block text-sm font-medium">
                主题
                <input
                  name="subject"
                  type="text"
                  defaultValue="技术交流"
                  className="mt-2 w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-sm focus:border-brand-purple outline-none transition-colors"
                />
              </label>
              <label className="block text-sm font-medium">
                消息
                <textarea
                  name="message"
                  required
                  rows={4}
                  className="mt-2 w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-sm focus:border-brand-purple outline-none transition-colors resize-none"
                />
              </label>
              <button
                type="submit"
                className="px-6 py-3 rounded-full font-semibold text-sm bg-gradient-to-r from-brand-purple to-brand-cyan text-white hover:shadow-lg hover:shadow-brand-purple/25 transition-all"
              >
                打开邮件并发送
              </button>
              <p id="contact-form-note" className="text-xs leading-relaxed text-gray-500">
                点击后会调用你设备上的默认邮件应用；本站不会收集或保存表单内容。
              </p>
            </form>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
