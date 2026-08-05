import Link from "next/link";

export default function CTA() {
  return (
    <section className="px-6 py-24 text-center">
      <div className="mx-auto max-w-4xl rounded-3xl border border-violet-400/20 bg-gradient-to-br from-violet-600/20 to-cyan-500/10 px-8 py-14">
        <h2 className="text-3xl font-bold sm:text-4xl">
          مستعد للحصول على فرصة أفضل؟
        </h2>

        <p className="mx-auto mt-4 max-w-xl text-slate-300">
          أنشئ سيرتك الذاتية، حللها بالذكاء الاصطناعي، وحسّن فرص قبولك.
        </p>

        <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
          <Link
            href="/create-cv"
            className="rounded-2xl bg-white px-8 py-4 font-bold text-slate-950 transition hover:scale-105"
          >
            أنشئ سيرتك مجانًا
          </Link>

          <Link
            href="/analyze"
            className="rounded-2xl border border-white/10 bg-white/5 px-8 py-4 font-bold transition hover:bg-white/10"
          >
            حلّل سيرتك
          </Link>
        </div>
      </div>
    </section>
  );
}