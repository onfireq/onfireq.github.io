"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FaGithub } from "react-icons/fa";
import ScrollReveal from "./ScrollReveal";

interface Repo {
  name: string;
  description: string | null;
  language: string | null;
  stargazers_count: number;
  html_url: string;
  updated_at: string;
  topics?: string[];
}

const LANG_COLORS: Record<string, string> = {
  TypeScript: "#3178c6",
  JavaScript: "#f1e05a",
  Python: "#3572A5",
  Verilog: "#b2b7f8",
  VHDL: "#adb2cb",
  HTML: "#e34c26",
  CSS: "#563d7c",
  "C++": "#f34b7d",
  C: "#555555",
  Go: "#00ADD8",
  Rust: "#dea584",
  Java: "#b07219",
};

export default function GitHubRepos() {
  const [repos, setRepos] = useState<Repo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const controller = new AbortController();

    async function loadRepos() {
      try {
        const response = await fetch(
          "https://api.github.com/users/onfireq/repos?per_page=12&sort=updated",
          {
            headers: { Accept: "application/vnd.github+json" },
            signal: controller.signal,
          },
        );
        if (!response.ok) throw new Error(`GitHub API ${response.status}`);

        const data: unknown = await response.json();
        if (!Array.isArray(data)) throw new Error("Unexpected GitHub response");

        setRepos(
          (data as Repo[]).filter(
            (repo) => typeof repo.name === "string" && !repo.name.includes("github.io"),
          ),
        );
      } catch (requestError) {
        if (!(requestError instanceof DOMException && requestError.name === "AbortError")) {
          setError(true);
        }
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }

    loadRepos();
    return () => controller.abort();
  }, []);

  if (loading) {
    return (
      <div className="text-center py-12" role="status" aria-label="正在加载 GitHub 仓库">
        <div className="inline-block w-6 h-6 border-2 border-brand-purple/30 border-t-brand-purple rounded-full animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="glass p-8 text-center">
        <p className="mb-4 text-sm text-gray-400">GitHub 仓库暂时无法加载，请稍后重试或直接访问 GitHub。</p>
        <a
          href="https://github.com/onfireq"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex rounded-full border border-brand-purple/30 px-5 py-2 text-sm text-brand-cyan hover:bg-brand-purple/10"
        >
          前往 GitHub
        </a>
      </div>
    );
  }

  if (repos.length === 0) {
    return <div className="glass p-8 text-center text-sm text-gray-400">暂时没有可展示的公开仓库。</div>;
  }

  return (
    <div className="space-y-4">
      {repos.map((repo, i) => {
        const color = repo.language ? LANG_COLORS[repo.language] || "#999" : "#999";
        return (
          <ScrollReveal key={repo.name} delay={i * 0.08}>
            <motion.a
              href={repo.html_url}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ y: -4 }}
              className="glass p-5 block transition-colors hover:border-brand-purple/30 group"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <FaGithub className="github-repo-icon text-gray-400 group-hover:text-white transition" size={18} aria-hidden="true" />
                    <h4 className="font-semibold text-brand-cyan">{repo.name}</h4>
                  </div>
                  <p className="text-sm text-gray-400 mb-3 line-clamp-2">
                    {repo.description || "暂无描述"}
                  </p>
                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    {repo.language && (
                      <div className="flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-full" style={{ background: color }} />
                        {repo.language}
                      </div>
                    )}
                    {repo.stargazers_count > 0 && (
                      <div className="flex items-center gap-1">
                        ⭐ {repo.stargazers_count}
                      </div>
                    )}
                    <div>
                      更新于 {new Date(repo.updated_at).toLocaleDateString("zh-CN")}
                    </div>
                  </div>
                </div>
              </div>
            </motion.a>
          </ScrollReveal>
        );
      })}
    </div>
  );
}
