import Link from "next/link";

export default function Hero() {
  return (
    <section className="relative overflow-hidden px-6 pb-24 pt-20 text-center">
      <div className="pointer-events-none absolute left-1/2 top-10 z-0 h-72 w-72 -translate-x-1/2 rounded-full bg-violet-600/20 blur-3xl" />

      <div className="relative z-10 mx-auto max-w-4xl">
        <div className="mx-auto mb-6 w-fit rounded-full border border-violet-400/20 bg-violet-400/10 px-4 py-2 text-sm text-violet-300">
          منصتك الذكية للوصول إلى وظيفة أفضل
        </div>

        <h1 className="text-4xl font-bold leading-tight sm:text-6xl">
          ابنِ سيرتك الذاتية
          <span className="block bg-gradient-to-r from-violet-400 to-cyan-400 bg-clip-text text-transparent">
            واحصل على فرص أكثر
          </span>
        </h1>

        <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-slate-400">
          أنشئ CV احترافيًا، حلّل سيرتك الحالية، واكتب رسالة تقديم مناسبة لكل
          وظيفة بسهولة.
        </p>

        <div className="mt-10 flex flex-col justify-center gap-4 sm:flex-row">
          <Link
            href="/create-cv"
            className="rounded-2xl bg-violet-600 px-8 py-4 font-bold shadow-lg shadow-violet-600/20 transition hover:-translate-y-1 hover:bg-violet-500"
          >
            أنشئ سيرتك الآن
          </Link>

          <Link
            href="/analyze"
            className="rounded-2xl border border-white/10 bg-white/5 px-8 py-4 font-bold transition hover:bg-white/10"
          >
            تحليل CV
          </Link>
        </div>

        <p className="mt-5 text-sm text-slate-500">
          لا تحتاج بطاقة دفع للبدء
        </p>
      </div>
    </section>
  );
}