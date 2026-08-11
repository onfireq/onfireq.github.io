import ProjectsSection from "@/components/ProjectsSection";
import GitHubRepos from "@/components/GitHubRepos";

export const metadata = { title: "项目 | OnfireQ" };

export default function ProjectsPage() {
  return (
    <div className="pt-20">
      <ProjectsSection />

      {/* GitHub Repos */}
      <section className="py-16 px-6">
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
