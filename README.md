# OnfireQ Portfolio

一个记录偏振控制、FPGA 与全栈开发实践，也分享历史、文化与阅读思考的个人网站。站点使用 Next.js App Router 构建，静态导出后部署到 GitHub Pages。

## 主要内容

- 个人定位、研究方向与 GitHub 仓库
- Markdown / LaTeX 博客，支持技术文章、人文随笔、GFM、KaTeX 与代码高亮
- 人文写作模板，可在 Markdown 编辑器中一键新建草稿
- 按主题分类和本地即时搜索
- GitHub、知乎等公开技术内容入口
- 暗色 / 亮色主题、响应式布局与减少动态效果支持
- Sitemap、robots、文章级 Metadata、JSON-LD 与社交分享卡片

## 技术栈

- Next.js 16、React 19、TypeScript
- Tailwind CSS 4、Framer Motion
- React Three Fiber / Three.js
- React Markdown、KaTeX、rehype-highlight
- GitHub Actions、GitHub Pages

## 本地开发

需要 Node.js 22 和 npm。

```bash
npm ci
npm run dev
```

提交前运行完整检查：

```bash
npm run check
```

生产构建输出位于 `out/`。

## 新增博客文章

文章放在 `content/blog/<category>/` 下。Markdown 文章建议包含完整 frontmatter：

```yaml
---
title: "文章标题"
slug: "readable-ascii-slug"
date: "2026-08-31"
tags: ["FPGA", "时序"]
description: "用于列表和搜索结果的简短摘要"
published: true
---
```

- 草稿请设置 `published: false`。
- 中文文件名可以保留，但建议显式填写简短、稳定的 ASCII `slug`。
- 分类配置集中在 `src/lib/categories.ts`。
- Wolai 同步使用 `npm run elog:sync`；本地凭据保存在 `.elog.env`，不得提交。

### 写历史、文化与读书笔记

- 在「博客 → Markdown 编辑器」点击「人文模板」，新建带当天日期的独立草稿；已有草稿会保留。
- 也可以复制 [人文文章模板](content/templates/humanities.md) 到 `content/blog/humanities/`，修改文件名和元数据后开始写作。
- 使用「人文」分类，以 `历史`、`文化`、`读书笔记` 等标签细分主题。`content/blog/人文/` 也会归入同一分类。
- 模板和编辑器新建文章默认 `published: false`，完成后再改为 `true`。模板源文件不参与博客列表、搜索或 RSS。
- Wolai 同步后检查本地目录和 frontmatter；分类由文件夹决定。

详细流程、文章结构取舍与引用格式见 [人文写作指南](docs/writing-humanities.md)。

## 部署

推送到 `main` 后，`.github/workflows/deploy.yml` 会依次执行依赖安装、Lint、类型检查、静态构建和 GitHub Pages 部署。

## 安全约定

- 不要把 PAT、Cookie、Token 或其他凭据写进源码、脚本、Git remote URL 或提交历史。
- GitHub 凭据使用 Git Credential Manager、GitHub CLI 或 SSH 管理。
- 自动同步脚本只暂存明确的内容目录，提交前先检查 `git diff --staged`。
