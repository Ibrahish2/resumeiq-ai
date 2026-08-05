import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="relative z-50 mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
      <Link href="/" className="text-2xl font-bold tracking-tight">
        Qabool <span className="text-violet-400">AI</span>
      </Link>

      <div className="flex items-center gap-3">
        <Link
          href="/auth/login"
          className="rounded-xl px-4 py-2 text-sm text-slate-300 transition hover:bg-white/10"
        >
          تسجيل الدخول
        </Link>

        <Link
          href="/create-cv"
          className="rounded-xl bg-violet-600 px-4 py-2 text-sm font-semibold transition hover:bg-violet-500"
        >
          ابدأ مجانًا
        </Link>
      </div>
    </nav>
  );
}