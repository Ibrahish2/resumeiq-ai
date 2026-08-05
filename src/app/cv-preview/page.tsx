"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type CVData = {
  fullName: string;
  jobTitle: string;
  email: string;
  phone: string;
  city: string;
  summary: string;
  education: string;
  experience: string;
  skills: string;
};

const emptyData: CVData = {
  fullName: "",
  jobTitle: "",
  email: "",
  phone: "",
  city: "",
  summary: "",
  education: "",
  experience: "",
  skills: "",
};

export default function CVPreviewPage() {
  const [cvData, setCvData] = useState<CVData>(emptyData);
  const [template, setTemplate] = useState("classic");
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const savedData = localStorage.getItem("qabool-cv-data");
    const savedTemplate = localStorage.getItem("qabool-cv-template");

    if (savedData) {
      try {
        setCvData(JSON.parse(savedData));
      } catch {
        setCvData(emptyData);
      }
    }

    if (savedTemplate) {
      setTemplate(savedTemplate);
    }

    setLoaded(true);
  }, []);

  const skills = cvData.skills
    .split(",")
    .map((skill) => skill.trim())
    .filter(Boolean);

  const headerClass =
    template === "modern"
      ? "bg-violet-700"
      : template === "professional"
        ? "bg-blue-800"
        : "bg-slate-900";

  if (!loaded) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-950 text-white">
        جاري تحميل السيرة...
      </main>
    );
  }

  return (
    <main dir="rtl" className="min-h-screen bg-slate-950 px-4 py-8 text-white">
      <div className="mx-auto max-w-6xl">
        <div className="no-print mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <Link
            href="/templates"
            className="text-violet-400 hover:text-violet-300"
          >
            ← الرجوع إلى القوالب
          </Link>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Link
              href="/create-cv"
              className="rounded-xl border border-white/10 px-5 py-3 text-center font-bold hover:bg-white/5"
            >
              تعديل المعلومات
            </Link>

            <button
              type="button"
              onClick={() => window.print()}
              className="rounded-xl bg-violet-600 px-6 py-3 font-bold hover:bg-violet-500"
            >
              تحميل PDF
            </button>
          </div>
        </div>

        <div className="no-print mb-6">
          <p className="text-sm font-semibold text-violet-400">
            الخطوة 3 من 3
          </p>
          <h1 className="mt-2 text-3xl font-bold">معاينة السيرة الذاتية</h1>
          <p className="mt-2 text-slate-400">
            راجع المعلومات، وبعدها اضغط تحميل PDF.
          </p>
        </div>

        <section
          id="cv-document"
          className="mx-auto min-h-[1120px] max-w-[794px] overflow-hidden bg-white text-slate-900 shadow-2xl"
        >
          <header className={`${headerClass} px-10 py-10 text-white`}>
            <h2 className="text-4xl font-bold">
              {cvData.fullName || "الاسم الكامل"}
            </h2>

            <p className="mt-3 text-xl text-white/80">
              {cvData.jobTitle || "المسمى الوظيفي"}
            </p>

            <div className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-sm text-white/75">
              {cvData.email && <span>{cvData.email}</span>}
              {cvData.phone && <span>{cvData.phone}</span>}
              {cvData.city && <span>{cvData.city}</span>}
            </div>
          </header>

          <div className="space-y-9 px-10 py-10">
            <CVSection
              title="نبذة مهنية"
              content={cvData.summary || "لا توجد نبذة مهنية بعد."}
            />

            <CVSection
              title="التعليم"
              content={cvData.education || "لا توجد معلومات تعليمية بعد."}
            />

            <CVSection
              title="الخبرة العملية"
              content={cvData.experience || "لا توجد خبرات عملية بعد."}
            />

            <section>
              <h3 className="border-b-2 border-slate-900 pb-2 text-xl font-bold">
                المهارات
              </h3>

              <div className="mt-4 flex flex-wrap gap-2">
                {skills.length > 0 ? (
                  skills.map((skill) => (
                    <span
                      key={skill}
                      className="rounded-full bg-slate-100 px-4 py-2 text-sm"
                    >
                      {skill}
                    </span>
                  ))
                ) : (
                  <p className="text-slate-500">لا توجد مهارات مضافة بعد.</p>
                )}
              </div>
            </section>
          </div>
        </section>
      </div>
    </main>
  );
}

function CVSection({
  title,
  content,
}: {
  title: string;
  content: string;
}) {
  return (
    <section>
      <h3 className="border-b-2 border-slate-900 pb-2 text-xl font-bold">
        {title}
      </h3>

      <p className="mt-4 whitespace-pre-line leading-8 text-slate-700">
        {content}
      </p>
    </section>
  );
}