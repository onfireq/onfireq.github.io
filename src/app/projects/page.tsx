import GitHubRepos from "@/components/GitHubRepos";
import ProjectsSection from "@/components/ProjectsSection";

export const metadata = {
  title: "项目",
  description: "偏振控制、扰偏算法、数字孪生与全栈开发的代表项目。",
  alternates: { canonical: "/projects" },
};

export default function ProjectsPage() {
  return (
    <div className="pt-20">
      <h1 className="sr-only">OnfireQ 的项目</h1>
      <ProjectsSection />

      {/* GitHub Repos */}
      <section className="bg-surface-800/35 py-24 px-6">
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
