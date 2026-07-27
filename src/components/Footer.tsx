"use client";

import { HiHeart } from "react-icons/hi";

export default function Footer() {
  return (
    <footer className="border-t border-white/5 py-8 px-6 text-center">
      <p className="text-sm text-gray-500 flex items-center justify-center gap-1.5">
        © 2026 onfireq · Built with
        <HiHeart className="text-brand-pink" />
        and Next.js · Deployed on GitHub Pages
      </p>
    </footer>
  );
}
