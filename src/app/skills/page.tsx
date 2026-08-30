import SkillsSection from "@/components/SkillsSection";

export const metadata = {
  title: "技能",
  description: "偏振控制、FPGA、算法仿真与全栈开发能力概览。",
  alternates: { canonical: "/skills" },
};

export default function SkillsPage() {
  return (
    <div className="pt-20">
      <h1 className="sr-only">OnfireQ 的核心技能</h1>
      <SkillsSection />
    </div>
  );
}
