import AboutSection from "@/components/AboutSection";

export const metadata = {
  title: "关于我",
  description: "了解 OnfireQ 的研究方向、技术背景与联系方式。",
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return (
    <div className="pt-20">
      <h1 className="sr-only">关于 OnfireQ</h1>
      <AboutSection />
    </div>
  );
}
