import Link from "next/link";
import HeroSection from "@/components/HeroSection";

const destinations = [
  { href: "/projects", title: "项目经历", description: "从算法到部署的完整链路", icon: "🚀" },
  { href: "/blog", title: "技术博客", description: "深度思考与学习记录", icon: "✍️" },
  { href: "/about", title: "关于我", description: "硬件 & 软件 全栈工程师", icon: "👨‍💻" },
];

export default function Home() {
  return (
    <>
      <HeroSection />

      <section id="home-links" aria-label="网站主要内容" className="scroll-mt-20 px-6 py-24">
        <div className="mx-auto grid max-w-4xl gap-6 md:grid-cols-3">
          {destinations.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="glass group p-8 text-center transition-all hover:border-brand-purple/30"
            >
              <div className="mb-4 text-4xl transition-transform group-hover:scale-110" aria-hidden="true">
                {item.icon}
              </div>
              <h2 className="mb-2 text-lg font-semibold">{item.title}</h2>
              <p className="text-sm text-gray-400">{item.description}</p>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
