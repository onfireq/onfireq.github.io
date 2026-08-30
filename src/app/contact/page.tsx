import ContactSection from "@/components/ContactSection";

export const metadata = {
  title: "联系我",
  description: "与 OnfireQ 交流偏振控制、FPGA、全栈开发或合作机会。",
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return (
    <div className="pt-20">
      <h1 className="sr-only">联系 OnfireQ</h1>
      <ContactSection />
    </div>
  );
}
