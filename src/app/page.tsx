import Link from "next/link";
const features = [
  {
    icon: "✨",
    title: "إنشاء سيرة ذاتية",
    description:
      "أنشئ CV مرتب واحترافي خلال دقائق وباللغتين العربية والإنكليزية.",
  },
  {
    icon: "🔍",
    title: "تحليل الـCV",
    description:
      "احصل على ملاحظات واضحة تساعدك على تحسين سيرتك وزيادة فرص قبولك.",
  },
  {
    icon: "✉️",
    title: "رسالة تقديم",
    description:
      "أنشئ Cover Letter مخصصًا للوظيفة التي تريد التقديم عليها.",
  },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
        <div className="text-2xl font-bold tracking-tight">
          Qabool<span className="text-violet-400">.</span>
        </div>

        <div className="flex items-center gap-3">
          <Link
  href="/auth/login"
  className="rounded-xl px-4 py-2 text-sm text-slate-300 transition hover:bg-white/10"
>
  تسجيل الدخول
</Link>

          <Link
  href="/auth/login"
  className="rounded-xl bg-violet-600 px-4 py-2 text-sm font-semibold transition hover:bg-violet-500"
>
  ابدأ مجانًا
</Link>
        </div>
      </nav>

      <section className="relative overflow-hidden px-6 pb-24 pt-20 text-center">
        <div className="absolute left-1/2 top-10 -z-0 h-72 w-72 -translate-x-1/2 rounded-full bg-violet-600/20 blur-3xl" />

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
            أنشئ CV احترافيًا، حلّل سيرتك الحالية، واكتب رسالة تقديم مناسبة
            لكل وظيفة بسهولة.
          </p>

          <div className="mt-10 flex flex-col justify-center gap-4 sm:flex-row">
            <Link
  href="/create-cv"
  className="rounded-2xl bg-violet-600 px-8 py-4 font-bold shadow-lg shadow-violet-600/20 transition hover:-translate-y-1 hover:bg-violet-500"
>
  أنشئ سيرتك الآن
</Link>

            <button className="rounded-2xl border border-white/10 bg-white/5 px-8 py-4 font-bold transition hover:bg-white/10">
              تحليل CV
            </button>
          </div>

          <p className="mt-5 text-sm text-slate-500">
            لا تحتاج بطاقة دفع للبدء
          </p>
        </div>
      </section>

      <section className="border-y border-white/10 bg-white/[0.02] px-6 py-20">
        <div className="mx-auto max-w-6xl">
          <div className="mb-12 text-center">
            <p className="font-semibold text-violet-400">خدماتنا</p>

            <h2 className="mt-3 text-3xl font-bold sm:text-4xl">
              كل ما تحتاجه للتقديم على وظيفة
            </h2>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {features.map((feature) => (
              <article
                key={feature.title}
                className="rounded-3xl border border-white/10 bg-slate-900 p-7 transition hover:-translate-y-1 hover:border-violet-400/40"
              >
                <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-500/10 text-2xl">
                  {feature.icon}
                </div>

                <h3 className="text-xl font-bold">{feature.title}</h3>

                <p className="mt-3 leading-7 text-slate-400">
                  {feature.description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="px-6 py-24 text-center">
        <div className="mx-auto max-w-4xl rounded-3xl border border-violet-400/20 bg-gradient-to-br from-violet-600/20 to-cyan-500/10 px-8 py-14">
          <h2 className="text-3xl font-bold sm:text-4xl">
            مستعد للحصول على فرصة أفضل؟
          </h2>

          <p className="mx-auto mt-4 max-w-xl text-slate-300">
            ابدأ الآن وأنشئ أول سيرة ذاتية احترافية لك.
          </p>

          <Link
  href="/auth/login"
  className="mt-8 inline-block rounded-2xl bg-white px-8 py-4 font-bold text-slate-950 transition hover:scale-105"
>
  ابدأ مجانًا
</Link>
        </div>
      </section>

      <footer className="border-t border-white/10 px-6 py-8 text-center text-sm text-slate-500">
        © 2026 Qabool. جميع الحقوق محفوظة.
      </footer>
    </main>
  );
}