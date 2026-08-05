"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type Template = {
  id: string;
  name: string;
  description: string;
  accentClass: string;
};

const templates: Template[] = [
  {
    id: "classic",
    name: "الكلاسيكي",
    description: "تصميم بسيط ورسمي مناسب لمعظم الوظائف.",
    accentClass: "bg-slate-900",
  },
  {
    id: "modern",
    name: "العصري",
    description: "تصميم حديث وواضح للمجالات التقنية والإبداعية.",
    accentClass: "bg-violet-700",
  },
  {
    id: "professional",
    name: "الاحترافي",
    description: "مظهر رسمي مناسب للشركات والمؤسسات.",
    accentClass: "bg-blue-800",
  },
];

export default function TemplatesPage() {
  const router = useRouter();
  const [selectedTemplate, setSelectedTemplate] = useState("classic");
  const [hasCVData, setHasCVData] = useState(false);

  useEffect(() => {
    const savedData = localStorage.getItem("qabool-cv-data");
    setHasCVData(Boolean(savedData));
  }, []);

  function continueToPreview() {
    localStorage.setItem("qabool-cv-template", selectedTemplate);
    router.push("/cv-preview");
  }

  return (
    <main
      dir="rtl"
      className="min-h-screen bg-slate-950 px-5 py-10 text-white"
    >
      <div className="mx-auto max-w-6xl">
        <Link
          href="/create-cv"
          className="text-sm text-violet-400 hover:text-violet-300"
        >
          ← الرجوع إلى البيانات
        </Link>

        <div className="mt-6">
          <p className="text-sm font-semibold text-violet-400">
            الخطوة 2 من 3
          </p>

          <h1 className="mt-2 text-3xl font-bold sm:text-4xl">
            اختر قالب سيرتك الذاتية
          </h1>

          <p className="mt-3 text-slate-400">
            تقدر تغيّر القالب لاحقًا بدون فقدان معلوماتك.
          </p>
        </div>

        {!hasCVData && (
          <div className="mt-8 rounded-2xl border border-amber-400/20 bg-amber-400/10 p-4 text-amber-200">
            ما لقينا بيانات محفوظة. ارجع إلى صفحة إنشاء السيرة وأدخل معلوماتك.
          </div>
        )}

        <section className="mt-10 grid gap-6 md:grid-cols-3">
          {templates.map((template) => {
            const isSelected = selectedTemplate === template.id;

            return (
              <button
                key={template.id}
                type="button"
                onClick={() => setSelectedTemplate(template.id)}
                className={`overflow-hidden rounded-3xl border text-right transition ${
                  isSelected
                    ? "border-violet-400 ring-4 ring-violet-500/20"
                    : "border-white/10 hover:border-white/30"
                }`}
              >
                <div className="bg-white p-5">
                  <div className="min-h-72 rounded-xl border border-slate-200 text-slate-900 shadow-sm">
                    <div
                      className={`${template.accentClass} rounded-t-xl px-5 py-6 text-white`}
                    >
                      <div className="h-4 w-32 rounded bg-white/90" />
                      <div className="mt-3 h-3 w-20 rounded bg-white/50" />
                    </div>

                    <div className="space-y-5 p-5">
                      <div>
                        <div className="h-3 w-20 rounded bg-slate-800" />
                        <div className="mt-3 h-2 w-full rounded bg-slate-200" />
                        <div className="mt-2 h-2 w-4/5 rounded bg-slate-200" />
                      </div>

                      <div>
                        <div className="h-3 w-16 rounded bg-slate-800" />
                        <div className="mt-3 h-2 w-full rounded bg-slate-200" />
                        <div className="mt-2 h-2 w-3/4 rounded bg-slate-200" />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-slate-900 p-5">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <h2 className="text-xl font-bold">{template.name}</h2>
                      <p className="mt-2 text-sm leading-6 text-slate-400">
                        {template.description}
                      </p>
                    </div>

                    <span
                      className={`h-5 w-5 shrink-0 rounded-full border-2 ${
                        isSelected
                          ? "border-violet-400 bg-violet-500"
                          : "border-slate-600"
                      }`}
                    />
                  </div>
                </div>
              </button>
            );
          })}
        </section>

        <div className="mt-10 flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
          <Link
            href="/create-cv"
            className="rounded-2xl border border-white/10 px-6 py-4 text-center font-bold hover:bg-white/5"
          >
            تعديل المعلومات
          </Link>

          <button
            type="button"
            disabled={!hasCVData}
            onClick={continueToPreview}
            className="rounded-2xl bg-violet-600 px-8 py-4 font-bold transition hover:bg-violet-500 disabled:cursor-not-allowed disabled:opacity-40"
          >
            متابعة إلى المعاينة
          </button>
        </div>
      </div>
    </main>
  );
}