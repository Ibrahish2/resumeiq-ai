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

export default function Features() {
  return (
    <section className="border-y border-white/10 bg-white/[0.02] px-6 py-20">
      <div className="mx-auto max-w-6xl">
        <div className="mb-12 text-center">
          <p className="font-semibold text-violet-400">
            خدماتنا
          </p>

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

              <h3 className="text-xl font-bold">
                {feature.title}
              </h3>

              <p className="mt-3 leading-7 text-slate-400">
                {feature.description}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}