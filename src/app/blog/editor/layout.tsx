import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Markdown 编辑器",
  robots: { index: false, follow: false },
};

export default function BlogEditorLayout({ children }: { children: React.ReactNode }) {
  return children;
}
