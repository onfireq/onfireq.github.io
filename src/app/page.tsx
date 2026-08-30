import Link from "next/link";
import { HiArrowRight, HiBeaker, HiCalendar, HiChip, HiCode } from "react-icons/hi";
import HeroSection from "@/components/HeroSection";
import { projects } from "@/data/projects";
import { getAllPosts } from "@/lib/blog";

const focusAreas = [
  {
    title: "算法与光学",
    description: "围绕 Stokes 空间、偏振控制与扰偏策略，完成建模、仿真与指标评估。",
    icon: HiBeaker,
  },
  {
    title: "FPGA 工程化",
    description: "把浮点算法转为可验证的定点实现，并持续优化资源、延迟与时序。",
    icon: HiChip,
  },
  {
    title: "全栈与可视化",
    description: "用 Web 与数据工具沉淀实验过程，让研究成果更容易复现、理解和分享。",
    icon: HiCode,
  },
];

export default function Home() {
  const latestPosts = getAllPosts().slice(0, 3);

  return (
    <>
      <HeroSection />

      <section id="home-overview" className="scroll-mt-20 px-6 py-24">
        <div className="mx-auto max-w-6xl">
          <div className="mb-12 max-w-2xl">
            <p className="mb-3 text-sm font-semibold tracking-[0.18em] text-brand-cyan">WHAT I DO</p>
            <h2 className="text-3xl font-bold md:text-4xl">从理论、硬件到可用成果</h2>
            <p className="mt-4 leading-relaxed text-gray-400">
              我的优势不只是掌握多种工具，而是能把算法一路推进到硬件验证，再用软件把结果讲清楚。
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-3">
            {focusAreas.map((area) => (
              <article key={area.title} className="glass p-7">
                <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-xl bg-brand-purple/15 text-brand-cyan">
                  <area.icon size={22} aria-hidden="true" />
                </div>
                <h3 className="mb-2 text-lg font-semibold">{area.title}</h3>
                <p className="text-sm leading-relaxed text-gray-400">{area.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-surface-800/35 px-6 py-24">
        <div className="mx-auto max-w-6xl">
          <div className="mb-10 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <p className="mb-3 text-sm font-semibold tracking-[0.18em] text-brand-cyan">SELECTED WORK</p>
              <h2 className="text-3xl font-bold md:text-4xl">代表项目</h2>
            </div>
            <Link href="/projects" className="inline-flex items-center gap-2 text-sm text-brand-cyan hover:underline">
              查看全部项目 <HiArrowRight aria-hidden="true" />
            </Link>
          </div>

          <div className="grid gap-5 lg:grid-cols-3">
            {projects.slice(0, 3).map((project) => (
              <article key={project.slug} className="glass flex h-full flex-col p-6">
                <div className="mb-5 text-3xl" aria-hidden="true">{project.icon}</div>
                <h3 className="mb-3 text-lg font-semibold">{project.title}</h3>
                <p className="mb-5 flex-1 text-sm leading-relaxed text-gray-400">{project.description}</p>
                <ul className="flex flex-wrap gap-1.5" aria-label={`${project.title} 技术标签`}>
                  {project.tags.slice(0, 4).map((tag) => (
                    <li key={tag} className="rounded-full border border-brand-purple/20 bg-brand-purple/10 px-2.5 py-1 text-xs text-brand-cyan">
                      {tag}
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="px-6 py-24">
        <div className="mx-auto max-w-6xl">
          <div className="mb-10 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <p className="mb-3 text-sm font-semibold tracking-[0.18em] text-brand-cyan">WRITING</p>
              <h2 className="text-3xl font-bold md:text-4xl">最近文章</h2>
            </div>
            <Link href="/blog" className="inline-flex items-center gap-2 text-sm text-brand-cyan hover:underline">
              浏览全部文章 <HiArrowRight aria-hidden="true" />
            </Link>
          </div>

          {latestPosts.length > 0 ? (
            <div className="grid gap-5 lg:grid-cols-3">
              {latestPosts.map((post) => (
                <Link key={post.slug} href={`/blog/${post.slug}`} className="glass group block p-6 transition-transform hover:-translate-y-1">
                  <div className="mb-4 flex items-center gap-2 text-xs text-gray-500">
                    <HiCalendar aria-hidden="true" />
                    <time dateTime={post.date}>{post.date}</time>
                  </div>
                  <h3 className="mb-3 text-lg font-semibold transition-colors group-hover:text-brand-cyan">{post.title}</h3>
                  <p className="line-clamp-3 text-sm leading-relaxed text-gray-400">
                    {post.description || "一篇关于研究、工程实践与技术思考的记录。"}
                  </p>
                </Link>
              ))}
            </div>
          ) : (
            <div className="glass p-8 text-sm text-gray-400">文章正在整理中，欢迎稍后再来。</div>
          )}
        </div>
      </section>

      <section className="px-6 pb-24">
        <div className="glow mx-auto max-w-5xl rounded-3xl border border-brand-purple/20 bg-gradient-to-br from-brand-purple/15 to-brand-cyan/10 px-6 py-12 text-center md:px-12">
          <p className="mb-3 text-sm font-semibold text-brand-cyan">LET&apos;S CONNECT</p>
          <h2 className="text-2xl font-bold md:text-3xl">对偏振控制、FPGA 或技术产品感兴趣？</h2>
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-gray-400">
            欢迎交流研究思路、工程实现和跨领域合作，也欢迎对站内内容提出建议。
          </p>
          <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
            <a href="mailto:2467708204@qq.com" className="rounded-full bg-white px-6 py-3 text-sm font-semibold text-surface-900 hover:bg-surface-100">
              发邮件给我
            </a>
            <Link href="/about" className="rounded-full border border-white/15 px-6 py-3 text-sm font-semibold hover:border-brand-cyan/40">
              进一步了解我
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
