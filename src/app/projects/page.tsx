import GitHubRepos from "@/components/GitHubRepos";

export const metadata = {
  title: "项目",
  description: "OnfireQ 的 GitHub 仓库与工程实践。",
  alternates: { canonical: "/projects" },
};

export default function ProjectsPage() {
  return (
    <div className="pt-20">
      <h1 className="sr-only">OnfireQ 的项目</h1>

      {/* 易经研习入口 */}
      <section className="pt-24 pb-8 px-6">
        <div className="max-w-5xl mx-auto">
          <a
            href="/iching/"
            className="group glass block rounded-xl p-8 transition-all hover:border-[var(--color-brand-purple)]/30 hover:shadow-lg"
          >
            <div className="flex items-center gap-6">
              <div className="flex-shrink-0 flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-[var(--color-brand-purple)]/15 to-[var(--color-brand-cyan)]/15 text-3xl">
                ☯
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-bold mb-1">观易 · 易经研习</h2>
                <p className="text-sm text-gray-400">六十四卦全文 · 在线起卦 · 入门研习 · 名词速查</p>
              </div>
              <span className="hidden text-sm font-medium text-[var(--color-brand-purple)] opacity-0 transition-opacity group-hover:opacity-100 sm:inline">
                进入研习 →
              </span>
            </div>
          </a>
        </div>
      </section>

      {/* GitHub Repos */}
      <section className="py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-bold mb-2 text-center">
            GitHub <span className="text-gradient">仓库</span>
          </h2>
          <p className="text-gray-400 text-sm text-center mb-10">自动同步自 GitHub</p>
          <GitHubRepos />
        </div>
      </section>
    </div>
  );
}
