import type { BlogHeading } from "@/lib/blog-headings";
import { HiChevronDown } from "react-icons/hi";

function HeadingLinks({ headings }: { headings: BlogHeading[] }) {
  return (
    <ol className="space-y-2 text-sm">
      {headings.map((heading) => (
        <li
          key={heading.id}
          className={heading.level === 3 ? "ml-3 border-l border-white/10 pl-3" : undefined}
        >
          <a
            href={`#${heading.id}`}
            className="block leading-6 text-gray-400 transition-colors hover:text-brand-cyan"
          >
            {heading.text}
          </a>
        </li>
      ))}
    </ol>
  );
}

export default function TableOfContents({
  headings,
  variant,
}: {
  headings: BlogHeading[];
  variant: "mobile" | "desktop";
}) {
  if (headings.length === 0) return null;

  if (variant === "mobile") {
    return (
      <details className="glass group mb-6 px-5 py-3 lg:hidden">
        <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between gap-4 font-medium">
          <span>本文目录</span>
          <span className="flex items-center gap-2 text-xs font-normal text-gray-500">
            {headings.length} 个小节
            <HiChevronDown
              size={16}
              aria-hidden="true"
              className="transition-transform group-open:rotate-180"
            />
          </span>
        </summary>
        <nav aria-label="本文目录" className="border-0 bg-transparent pb-2 pt-3 backdrop-blur-none">
          <HeadingLinks headings={headings} />
        </nav>
      </details>
    );
  }

  return (
    <aside className="sticky top-24 hidden max-h-[calc(100vh-7rem)] self-start overflow-y-auto lg:col-start-2 lg:row-start-1 lg:block">
      <div className="glass p-5">
        <p className="mb-4 text-sm font-semibold">本文目录</p>
        <nav aria-label="本文目录" className="border-0 bg-transparent backdrop-blur-none">
          <HeadingLinks headings={headings} />
        </nav>
      </div>
    </aside>
  );
}
