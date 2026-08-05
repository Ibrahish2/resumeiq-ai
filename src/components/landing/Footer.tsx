export default function Footer() {
  return (
    <footer className="border-t border-white/10 px-6 py-8 text-center text-sm text-slate-500">
      <div className="mx-auto max-w-6xl">
        <p>© 2026 Qabool AI. جميع الحقوق محفوظة.</p>

        <div className="mt-4 flex justify-center gap-6">
          <a href="/about" className="hover:text-white">
            من نحن
          </a>

          <a href="/contact" className="hover:text-white">
            تواصل معنا
          </a>

          <a href="/privacy" className="hover:text-white">
            سياسة الخصوصية
          </a>
        </div>
      </div>
    </footer>
  );
}