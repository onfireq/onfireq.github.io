"use client";

import { HiHeart } from "react-icons/hi";

export default function Footer() {
  return (
    <footer className="border-t border-white/5 py-8 px-6 text-center">
      <p className="text-sm text-gray-500 flex items-center justify-center gap-1.5 flex-wrap">
        © 2026 onfireq · Built with
        <HiHeart className="text-brand-pink" />
        and Next.js · Powered by
        <a
          href="https://www.wps.cn"
          target="_blank"
          rel="noopener"
          className="text-brand-cyan hover:underline"
        >
          WPS Comate
        </a>
        · Deployed on GitHub Pages
      </p>
    </footer>
  );
}
