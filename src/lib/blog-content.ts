export type BlogFormat = "md" | "tex";

export function prepareBlogContent(content: string, format: BlogFormat): string {
  if (format !== "tex") return content;

  return content
    .replace(/\\\(/g, "$")
    .replace(/\\\)/g, "$")
    .replace(/\\\[/g, "$$")
    .replace(/\\\]/g, "$$")
    .replace(/\\section\{([^}]+)\}/g, "\n## $1\n")
    .replace(/\\subsection\{([^}]+)\}/g, "\n### $1\n")
    .replace(/\\textbf\{([^}]+)\}/g, "**$1**")
    .replace(/\\textit\{([^}]+)\}/g, "*$1*")
    .replace(/\\emph\{([^}]+)\}/g, "*$1*")
    .replace(/\\begin\{itemize\}/g, "")
    .replace(/\\end\{itemize\}/g, "")
    .replace(/\\begin\{enumerate\}/g, "")
    .replace(/\\end\{enumerate\}/g, "")
    .replace(/\\item\s*/g, "- ")
    .replace(/\\newline/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}
