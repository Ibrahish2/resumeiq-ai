"use client";

import { ChangeEvent, useRef, useState } from "react";
import Link from "next/link";

export default function AnalyzePage() {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [message, setMessage] = useState("");
  const [analysis, setAnalysis] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  function chooseFile() {
    fileInputRef.current?.click();
  }

  function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    if (!file) return;

    if (file.type !== "application/pdf") {
      setSelectedFile(null);
      setMessage("اختَر ملف PDF فقط.");
      event.target.value = "";
      return;
    }

    const maximumSize = 5 * 1024 * 1024;

    if (file.size > maximumSize) {
      setSelectedFile(null);
      setMessage("حجم الملف يجب ألا يتجاوز 5MB.");
      event.target.value = "";
      return;
    }

    setSelectedFile(file);
    setMessage("تم اختيار الملف بنجاح ✅");
  }

  async function startAnalysis() {
  if (!selectedFile) {
    setMessage("اختَر ملف PDF أولًا.");
    return;
  }

  setLoading(true);
  setMessage("جاري تحليل السيرة...");
 setAnalysis("");
  try {
    const formData = new FormData();
    formData.append("file", selectedFile);

    const response = await fetch("/api/analyze", {
      method: "POST",
      body: formData,
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error || "فشل التحليل.");
    }

    setAnalysis(result.analysis);
    setMessage("اكتمل التحليل ✅");
  } catch (error) {
    setMessage(
      error instanceof Error
        ? error.message
        : "حدث خطأ أثناء التحليل.",
    );
  } finally {
    setLoading(false);
  }
}

  return (
    <main
      dir="rtl"
      className="min-h-screen bg-slate-950 px-6 py-10 text-white"
    >
      <div className="mx-auto max-w-3xl">
        <Link
          href="/"
          className="text-sm text-violet-400 hover:text-violet-300"
        >
          ← العودة إلى الصفحة الرئيسية
        </Link>

        <section className="mt-8 rounded-3xl border border-white/10 bg-slate-900 p-8 text-center sm:p-10">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-violet-500/10 text-3xl">
            📄
          </div>

          <h1 className="mt-6 text-3xl font-bold sm:text-4xl">
            تحليل السيرة الذاتية
          </h1>

          <p className="mx-auto mt-4 max-w-xl leading-7 text-slate-400">
            ارفع سيرتك بصيغة PDF للحصول على تقييم ونصائح تساعدك على تحسينها.
          </p>

          <input
            ref={fileInputRef}
            type="file"
            accept="application/pdf,.pdf"
            onChange={handleFileChange}
            className="hidden"
          />

          <div className="mt-10 rounded-3xl border-2 border-dashed border-slate-700 bg-slate-950/50 p-10">
            {selectedFile ? (
              <div>
                <p className="text-lg font-bold text-white">
                  {selectedFile.name}
                </p>

                <p className="mt-2 text-sm text-slate-400">
                  {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                </p>

                <button
                  type="button"
                  onClick={chooseFile}
                  className="mt-5 text-sm font-bold text-violet-400 hover:text-violet-300"
                >
                  اختيار ملف آخر
                </button>
              </div>
            ) : (
              <div>
                <p className="text-lg font-bold">
                  اختَر سيرتك الذاتية
                </p>

                <p className="mt-2 text-sm text-slate-500">
                  PDF فقط، وبحجم أقصى 5MB
                </p>

                <button
                  type="button"
                  onClick={chooseFile}
                  className="mt-6 rounded-xl bg-violet-600 px-7 py-3 font-bold hover:bg-violet-500"
                >
                  اختيار ملف
                </button>
              </div>
            )}
          </div>

          {message && (
            <p className="mt-5 rounded-xl bg-slate-950 p-4 text-sm text-slate-300">
              {message}
            </p>
          )}

          <button
            type="button"
            onClick={startAnalysis}
            disabled={!selectedFile || loading}
            className="mt-6 w-full rounded-xl bg-violet-600 px-6 py-4 font-bold transition hover:bg-violet-500 disabled:cursor-not-allowed disabled:opacity-40"
          >
           {loading ? "جاري التحليل..." : "بدء التحليل"}
          </button>
          {analysis && <AnalysisResult analysis={analysis} />}
        </section>
      </div>
    </main>
  );
} 
function AnalysisResult({ analysis }: { analysis: any }) {
  return (
    <section className="mt-8 space-y-6 text-right">
      <div className="rounded-3xl border border-violet-500/20 bg-violet-500/10 p-8 text-center">
        <p className="text-sm text-violet-300">
          درجة السيرة الذاتية
        </p>

        <h2 className="mt-3 text-6xl font-bold text-white">
          {analysis.score}
          <span className="text-2xl text-slate-400">
            /100
          </span>
        </h2>
      </div>

      <ResultCard
        title="📝 الملخص"
        items={[analysis.summary]}
      />

      <ResultCard
        title="✅ نقاط القوة"
        items={analysis.strengths}
      />

      <ResultCard
        title="⚠️ نقاط الضعف"
        items={analysis.weaknesses}
      />

      <ResultCard
        title="💡 تحسينات مقترحة"
        items={analysis.improvements}
      />

      <ResultCard
        title="🔍 الكلمات المفتاحية الناقصة"
        items={analysis.keywords}
      />
    </section>
  );
}

function ResultCard({
  title,
  items,
}: {
  title: string;
  items: string[];
}) {
  return (
    <div className="rounded-3xl border border-white/10 bg-slate-900 p-6">
      <h2 className="mb-4 text-xl font-bold">
        {title}
      </h2>

      <ul className="space-y-3">
        {items.map((item, index) => (
          <li
            key={index}
            className="rounded-xl bg-slate-950 p-3 leading-7 text-slate-300"
          >
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}