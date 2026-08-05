export default function CreateCVPage() {
  return (
    <main className="min-h-screen bg-slate-950 px-6 py-16 text-white">
      <div className="mx-auto max-w-3xl">
        <h1 className="text-4xl font-bold">إنشاء سيرة ذاتية</h1>

        <p className="mt-3 text-slate-400">
          املأ معلوماتك، وبعدها نحولها إلى CV احترافي.
        </p>

        <form className="mt-10 space-y-6 rounded-3xl border border-white/10 bg-slate-900 p-8">
          <div>
            <label className="mb-2 block text-sm font-semibold">
              الاسم الكامل
            </label>

            <input
              type="text"
              placeholder="مثال: إبراهيم كامل حسن"
              className="w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-3 outline-none focus:border-violet-500"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold">
              البريد الإلكتروني
            </label>

            <input
              type="email"
              placeholder="example@email.com"
              className="w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-3 outline-none focus:border-violet-500"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold">
              رقم الهاتف
            </label>

            <input
              type="tel"
              placeholder="07XXXXXXXXX"
              className="w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-3 outline-none focus:border-violet-500"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold">
              نبذة عنك
            </label>

            <textarea
              rows={5}
              placeholder="اكتب نبذة قصيرة عن خبرتك ومهاراتك"
              className="w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-3 outline-none focus:border-violet-500"
            />
          </div>

          <button
            type="submit"
            className="w-full rounded-xl bg-violet-600 px-6 py-4 font-bold transition hover:bg-violet-500"
          >
            إنشاء السيرة الذاتية
          </button>
        </form>
      </div>
    </main>
  );
}