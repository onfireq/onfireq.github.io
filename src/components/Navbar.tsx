"use client";

import Link from "next/link";
import { useState } from "react";
import type { SVGProps } from "react";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { useTheme } from "./ThemeProvider";
import { HiMenu, HiX, HiSun, HiMoon } from "react-icons/hi";
import { FaGithub } from "react-icons/fa";
import { SiZhihu } from "react-icons/si";

const links = [
  { href: "/", label: "首页" },
  { href: "/projects", label: "项目" },
  { href: "/blog", label: "博客" },
  { href: "/about", label: "关于" },
];

const socials = [
  { href: "https://github.com/onfireq", icon: FaGithub, label: "GitHub" },
  { href: "https://www.zhihu.com/people/bai-ri-meng-you-54-77", icon: SiZhihu, label: "知乎" },
  { href: "https://space.bilibili.com/447249116", icon: BilibiliIcon, label: "B站" },
];

function BilibiliIcon({
  size = 18,
  ...props
}: { size?: number } & SVGProps<SVGSVGElement>) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M17.813 4.653h.854c1.51.054 2.769.578 3.773 1.574 1.004.995 1.524 2.249 1.56 3.76v7.36c-.036 1.51-.556 2.769-1.56 3.773s-2.262 1.524-3.773 1.56H5.333c-1.51-.036-2.769-.556-3.773-1.56S.036 18.858 0 17.347v-7.36c.036-1.511.556-2.765 1.56-3.76 1.004-.996 2.262-1.52 3.773-1.574h.774l-1.174-1.12a1.234 1.234 0 0 1-.373-.906c0-.356.124-.658.373-.907l.027-.027c.267-.249.573-.373.92-.373.347 0 .653.124.92.373L9.653 4.44c.071.071.134.142.187.213h4.267a.836.836 0 0 1 .16-.213l2.853-2.747c.267-.249.573-.373.92-.373.347 0 .662.151.929.4.267.249.391.551.391.907 0 .355-.124.657-.373.906L17.813 4.653zM5.333 7.24c-.746.018-1.373.276-1.88.773-.506.498-.769 1.13-.786 1.894v7.52c.017.764.28 1.395.786 1.893.507.498 1.134.756 1.88.773h13.334c.746-.017 1.373-.275 1.88-.773.506-.498.769-1.129.786-1.893v-7.52c-.017-.765-.28-1.396-.786-1.894-.507-.497-1.134-.755-1.88-.773H5.333zM8 11.107c.373 0 .684.124.933.373.25.249.383.569.4.96v1.173c-.017.391-.15.711-.4.96-.249.25-.56.374-.933.374s-.684-.125-.933-.374c-.25-.249-.383-.569-.4-.96V12.44c.017-.391.15-.711.4-.96.249-.249.56-.373.933-.373zm8 0c.373 0 .684.124.933.373.25.249.383.569.4.96v1.173c-.017.391-.15.711-.4.96-.249.25-.56.374-.933.374s-.684-.125-.933-.374c-.25-.249-.383-.569-.4-.96V12.44c.017-.391.15-.711.4-.96.249-.249.56-.373.933-.373z"/>
    </svg>
  );
}

export default function Navbar() {
  const { theme, toggle } = useTheme();
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const reduceMotion = useReducedMotion();

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  return (
    <motion.nav
      initial={reduceMotion ? false : { y: -80 }}
      animate={{ y: 0 }}
      aria-label="主导航"
      className="site-nav fixed top-0 w-full z-50 glass rounded-none border-b border-white/5"
    >
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="text-xl font-bold text-gradient" aria-label="OnfireQ 首页">
          OnfireQ
        </Link>

        {/* Desktop */}
        <div className="hidden md:flex items-center gap-1">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              aria-current={isActive(l.href) ? "page" : undefined}
              className={`px-3 py-1.5 text-sm rounded-lg transition-all ${
                isActive(l.href)
                  ? "text-brand-purple bg-brand-purple/10 font-medium"
                  : "text-gray-400 hover:text-white hover:bg-white/5"
              }`}
            >
              {l.label}
            </Link>
          ))}

          {/* Divider */}
          <div className="nav-divider w-px h-5 bg-white/10 mx-1" />

          {/* Social icons */}
          {socials.map((s) => (
            <a
              key={s.label}
              href={s.href}
              target="_blank"
              rel="noopener noreferrer"
              title={s.label}
              aria-label={`访问 ${s.label}`}
              className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition"
            >
              <s.icon size={18} aria-hidden="true" focusable="false" />
            </a>
          ))}

          {/* Theme toggle */}
          <button
            type="button"
            onClick={toggle}
            aria-label={theme === "dark" ? "切换到亮色模式" : "切换到暗色模式"}
            className="ml-1 p-2 rounded-full hover:bg-white/10 transition"
          >
            {theme === "dark" ? (
              <HiSun className="text-yellow-400" size={18} />
            ) : (
              <HiMoon className="text-brand-purple" size={18} />
            )}
          </button>
        </div>

        {/* Mobile menu button */}
        <button
          type="button"
          className="md:hidden p-2 min-h-11 min-w-11 inline-flex items-center justify-center"
          onClick={() => setOpen(!open)}
          aria-label={open ? "关闭导航菜单" : "打开导航菜单"}
          aria-expanded={open}
          aria-controls="mobile-navigation"
        >
          {open ? <HiX size={22} /> : <HiMenu size={22} />}
        </button>
      </div>

      {/* Mobile menu */}
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            id="mobile-navigation"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="site-nav-menu md:hidden glass border-t border-white/5"
          >
            <div className="flex flex-col gap-1 p-4">
              {links.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  onClick={() => setOpen(false)}
                  aria-current={isActive(l.href) ? "page" : undefined}
                  className={`px-4 py-2.5 rounded-lg transition-all ${
                    isActive(l.href)
                      ? "text-brand-purple bg-brand-purple/10 font-medium"
                      : "text-gray-400 hover:text-white hover:bg-white/5"
                  }`}
                >
                  {l.label}
                </Link>
              ))}

              {/* Mobile social icons */}
              <div className="nav-divider-border flex items-center gap-2 mt-2 pt-2 border-t border-white/10">
                {socials.map((s) => (
                  <a
                    key={s.label}
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`访问 ${s.label}`}
                    className="p-2 min-h-11 min-w-11 inline-flex items-center justify-center rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition"
                  >
                    <s.icon size={18} aria-hidden="true" focusable="false" />
                  </a>
                ))}
              </div>

              <button
                type="button"
                onClick={toggle}
                className="px-4 py-2.5 text-left text-gray-400 hover:text-white hover:bg-white/5 rounded-lg"
              >
                {theme === "dark" ? "🌞 亮色模式" : "🌙 暗色模式"}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
