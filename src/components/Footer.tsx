export default function Footer() {
  return (
    <footer className="border-t border-white/5 py-8 px-6 text-center">
      <p className="text-sm text-gray-500">
        © {new Date().getFullYear()} OnfireQ · Built with Next.js · Deployed on GitHub Pages
      </p>
    </footer>
  );
}
