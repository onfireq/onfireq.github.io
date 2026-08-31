import type { Metadata, Viewport } from "next";
import { ThemeProvider } from "@/components/ThemeProvider";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import "./globals.css";

const siteUrl = new URL("https://onfireq.github.io");
const siteDescription = "onfireq的个人网站";

export const metadata: Metadata = {
  metadataBase: siteUrl,
  title: {
    default: "OnfireQ",
    template: "%s | OnfireQ",
  },
  description: siteDescription,
  keywords: ["偏振控制", "FPGA", "光学工程", "扰偏算法", "全栈开发"],
  authors: [{ name: "OnfireQ", url: siteUrl }],
  creator: "OnfireQ",
  alternates: {
    canonical: "/",
    types: { "application/rss+xml": "/rss.xml" },
  },
  openGraph: {
    type: "website",
    locale: "zh_CN",
    url: "/",
    siteName: "OnfireQ",
    title: "OnfireQ | 偏振控制 · FPGA · 全栈开发",
    description: siteDescription,
    images: [
      {
        url: "/og.png",
        alt: "OnfireQ：偏振控制、FPGA 与全栈开发",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "OnfireQ | 偏振控制 · FPGA · 全栈开发",
    description: siteDescription,
    images: ["/og.png"],
  },
};

export const viewport: Viewport = {
  colorScheme: "dark light",
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#0f172a" },
    { media: "(prefers-color-scheme: light)", color: "#f5f7fb" },
  ],
};

const themeInitScript = `
  try {
    const savedTheme = localStorage.getItem("theme");
    document.documentElement.dataset.theme = savedTheme === "light" ? "light" : "dark";
  } catch (_) {
    document.documentElement.dataset.theme = "dark";
  }
`;

const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "OnfireQ",
  url: siteUrl.toString(),
  jobTitle: "光学工程研究者与全栈工程师",
  sameAs: [
    "https://github.com/onfireq",
    "https://www.zhihu.com/people/bai-ri-meng-you-54-77",
    "https://space.bilibili.com/447249116",
  ],
  knowsAbout: ["偏振控制", "扰偏算法", "FPGA", "光学工程", "全栈开发"],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN" suppressHydrationWarning className="min-h-full">
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(personJsonLd).replace(/</g, "\\u003c"),
          }}
        />
      </head>
      <body className="font-sans min-h-full">
        <a href="#main-content" className="skip-link">
          跳至主要内容
        </a>
        <ThemeProvider>
          <div className="flex flex-col min-h-screen">
            <Navbar />
            <main id="main-content" tabIndex={-1} className="flex-1 outline-none">
              {children}
            </main>
            <Footer />
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
