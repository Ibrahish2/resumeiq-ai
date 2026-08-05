"use client";

import Link from "next/link";
import { ChangeEvent, useRef, useState } from "react";

type MatchResult = {
  matchScore: number;
  summary: string;
  matchedSkills: string[];
  missingSkills: string[];
  missingKeywords: string[];
  recommendations: string[];
};

export default function MatchPage() {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [jobDescription, setJobDescription] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<MatchResult | null>(null);

  function chooseFile() {
    fileInputRef.current?.click();
  }

  function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    if (!file) return;

    if (file.type !== "application/pdf") {
      setSelectedFile(null);
      setResult(null);
      setMessage("اختَر ملف PDF فقط.");
      event.target.value = "";
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setSelectedFile(null);
      setResult(null);
      setMessage("حجم الملف يجب ألا يتجاوز 5MB.");
      event.target.value = "";
      return;
    }

    setSelectedFile(file);
    setResult(null);
    setMessage("تم اختيار ملف السيرة ✅");
  }

  async function startMatching() {
    if (!selectedFile) {
      setMessage("اختَر ملف السيرة الذاتية أولًا.");
      return;
    }

    if (jobDescription.trim().length < 30) {
      setMessage("الصق وصفًا وظيفيًا أوضح وأطول.");
      return;
    }

    setLoading(true);
    setResult(null);
    setMessage("جاري تحليل التطابق...");

    try {
      const formData = new FormData();

      formData.append("file", selectedFile);
      formData.append("jobDescription", jobDescription.trim());

      const response = await fetch("/api/match", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "فشل تحليل التطابق.");
      }

      setResult(data.result);
      setMessage("اكتمل تحليل التطابق ✅");
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "حدث خطأ أثناء تحليل التطابق.",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main
      dir="rtl"
      className="min-h-screen bg-slate-950 px-5 py-10 text-white"
    >
      <div className="mx-auto max-w-4xl">
        <Link
          href="/"
          className="text-sm text-violet-400 hover:text-violet-300"
        >
          ← العودة إلى الصفحة الرئيسية
        </Link>

        <header className="mt-8 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-violet-500/10 text-3xl">
            🎯
          </div>

          <h1 className="mt-5 text-3xl font-bold sm:text-4xl">
            مطابقة السيرة مع الوظيفة
          </h1>

          <p className="mx-auto mt-4 max-w-2xl leading-7 text-slate-400">
            ارفع سيرتك الذاتية والصق وصف الوظيفة لمعرفة نسبة التطابق
            والمهارات والكلمات المفتاحية الناقصة.
          </p>
        </header>

        <section className="mt-10 space-y-6 rounded-3xl border border-white/10 bg-slate-900 p-6 sm:p-8">
          <div>
            <h2 className="text-xl font-bold">
              1. ارفع السيرة الذاتية
            </h2>

            <input
              ref={fileInputRef}
              type="file"
              accept="application/pdf,.pdf"
              onChange={handleFileChange}
              className="hidden"
            />

            <div className="mt-4 rounded-2xl border-2 border-dashed border-slate-700 bg-slate-950/50 p-8 text-center">
              {selectedFile ? (
                <>
                  <p className="font-bold">{selectedFile.name}</p>

                  <p className="mt-2 text-sm text-slate-400">
                    {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                  </p>

                  <button
                    type="button"
                    onClick={chooseFile}
                    className="mt-4 text-sm font-bold text-violet-400 hover:text-violet-300"
                  >
                    اختيار ملف آخر
                  </button>
                </>
              ) : (
                <>
                  <p className="text-slate-400">
                    PDF فقط، وبحجم أقصى 5MB
                  </p>

                  <button
                    type="button"
                    onClick={chooseFile}
                    className="mt-5 rounded-xl bg-violet-600 px-6 py-3 font-bold hover:bg-violet-500"
                  >
                    اختيار ملف
                  </button>
                </>
              )}
            </div>
          </div>

          <div>
            <label
              htmlFor="job-description"
              className="block text-xl font-bold"
            >
              2. الصق وصف الوظيفة
            </label>

            <textarea
              id="job-description"
              value={jobDescription}
              onChange={(event) => {
                setJobDescription(event.target.value);
                setResult(null);
              }}
              rows={12}
              placeholder="الصق هنا متطلبات الوظيفة، المهارات المطلوبة، والمسؤوليات..."
              className="mt-4 w-full resize-y rounded-2xl border border-white/10 bg-slate-950 px-5 py-4 leading-7 outline-none placeholder:text-slate-600 focus:border-violet-500"
            />

            <p className="mt-2 text-left text-xs text-slate-500">
              {jobDescription.length} حرف
            </p>
          </div>

          {message && (
            <p className="rounded-xl bg-slate-950 p-4 text-center text-sm text-slate-300">
              {message}
            </p>
          )}

          <button
            type="button"
            onClick={startMatching}
            disabled={loading}
            className="w-full rounded-xl bg-violet-600 px-6 py-4 font-bold transition hover:bg-violet-500 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? "جاري تحليل التطابق..." : "تحليل التطابق"}
          </button>
        </section>

        {result && <MatchResultView result={result} />}
      </div>
    </main>
  );
}

function MatchResultView({ result }: { result: MatchResult }) {
  const scoreClass =
    result.matchScore >= 80
      ? "border-emerald-400/20 bg-emerald-400/10 text-emerald-300"
      : result.matchScore >= 60
        ? "border-amber-300/20 bg-amber-300/10 text-amber-200"
        : "border-red-400/20 bg-red-400/10 text-red-300";

  return (
    <section className="mt-8 space-y-6">
      <div
        className={`rounded-3xl border p-8 text-center ${scoreClass}`}
      >
        <p className="text-sm font-semibold">
          نسبة التطابق مع الوظيفة
        </p>

        <p className="mt-3 text-6xl font-bold">
          {result.matchScore}
          <span className="text-2xl">%</span>
        </p>
      </div>

      <ResultCard
        title="📝 ملخص التوافق"
        items={[result.summary]}
      />

      <ResultCard
        title="✅ المهارات المطابقة"
        items={result.matchedSkills}
      />

      <ResultCard
        title="⚠️ المهارات المفقودة"
        items={result.missingSkills}
      />

      <ResultCard
        title="🔍 الكلمات المفتاحية الناقصة"
        items={result.missingKeywords}
      />

      <ResultCard
        title="💡 توصيات التحسين"
        items={result.recommendations}
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
  if (!items?.length) return null;

  return (
    <article className="rounded-3xl border border-white/10 bg-slate-900 p-6">
      <h2 className="text-xl font-bold">{title}</h2>

      <ul className="mt-5 space-y-3">
        {items.map((item, index) => (
          <li
            key={`${title}-${index}`}
            className="rounded-xl bg-slate-950 p-4 leading-7 text-slate-300"
          >
            {item}
          </li>
        ))}
      </ul>
    </article>
  );
}