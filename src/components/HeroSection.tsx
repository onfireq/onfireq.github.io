import { HiArrowDown } from "react-icons/hi";
import HeroBackground from "./HeroBackground";
import HeroBackdrop from "./HeroBackdrop";

export default function HeroSection() {
  return (
    <section
      id="hero"
      className="relative isolate min-h-screen flex items-center overflow-hidden"
    >
      <HeroBackground><HeroBackdrop /></HeroBackground>

      {/* Gradient overlays */}
      <div className="pointer-events-none absolute top-0 right-0 w-[500px] h-[500px] rounded-full bg-brand-purple/10 blur-[120px]" />
      <div className="pointer-events-none absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full bg-brand-cyan/8 blur-[100px]" />

      <div className="relative max-w-6xl mx-auto px-6 z-10 w-full">
        <div>
          <span className="inline-block px-4 py-1.5 mb-6 text-sm text-brand-purple border border-brand-purple/30 rounded-full bg-brand-purple/10">
            👋 欢迎来到我的主页
          </span>
        </div>

        <h1
          className="text-4xl md:text-6xl lg:text-7xl font-extrabold leading-tight mb-6"
        >
          Hi，我是
          <br />
          <span className="text-gradient">onfireq</span>
        </h1>

        <p
          className="text-gray-400 text-base md:text-lg max-w-xl mb-10 leading-relaxed"
        >
          这里记录我的项目、技术笔记和踩坑过程。
        </p>
      </div>

      {/* Scroll indicator */}
      <a
        href="#home-links"
        aria-label="继续浏览"
        className="absolute bottom-8 left-1/2 -translate-x-1/2 rounded-full p-2"
      >
        <HiArrowDown className="text-brand-purple animate-bounce" size={24} aria-hidden="true" />
      </a>
    </section>
  );
}
