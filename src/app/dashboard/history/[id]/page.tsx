"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase";
import { useParams } from "next/navigation";

type Analysis = {
  score: number;
  summary: string;
  strengths: string[];
  weaknesses: string[];
  improvements: string[];
  keywords: string[];
};

export default function AnalysisDetailsPage() {
  const supabase = createClient();
  const { id } = useParams();

  const [analysis, setAnalysis] = useState<Analysis | null>(null);
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAnalysis();
  }, []);

  async function loadAnalysis() {
    const { data, error } = await supabase
      .from("ai_results")
      .select("title,result")
      .eq("id", id)
      .single();

    if (error) {
      console.error(error);
      setLoading(false);
      return;
    }

    setTitle(data.title ?? "");
    setAnalysis(data.result as Analysis);
    setLoading(false);
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
        جاري التحميل...
      </main>
    );
  }

  if (!analysis) {
    return (
      <main className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
        لم يتم العثور على التحليل.
      </main>
    );
  }

  return (
    <main
      dir="rtl"
      className="min-h-screen bg-slate-950 px-6 py-10 text-white"
    >
      <div className="mx-auto max-w-5xl">

        <Link
          href="/dashboard/history"
          className="text-violet-400 hover:text-violet-300"
        >
          ← العودة
        </Link>

        <h1 className="mt-6 text-4xl font-bold">
          {title}
        </h1>

        <div className="mt-8 rounded-3xl bg-violet-600/10 p-8 text-center">
          <p className="text-violet-300">
            درجة السيرة
          </p>

          <h2 className="mt-3 text-6xl font-bold">
            {analysis.score}/100
          </h2>
        </div>

        <Section
          title="📝 الملخص"
          items={[analysis.summary]}
        />

        <Section
          title="✅ نقاط القوة"
          items={analysis.strengths}
        />

        <Section
          title="⚠️ نقاط الضعف"
          items={analysis.weaknesses}
        />

        <Section
          title="💡 التحسينات"
          items={analysis.improvements}
        />

        <Section
          title="🔍 الكلمات المفتاحية"
          items={analysis.keywords}
        />

      </div>
    </main>
  );
}

function Section({
  title,
  items,
}: {
  title: string;
  items: string[];
}) {
  return (
    <section className="mt-8 rounded-3xl border border-white/10 bg-slate-900 p-6">
      <h2 className="text-2xl font-bold">
        {title}
      </h2>

      <ul className="mt-5 space-y-3">
        {items.map((item, index) => (
          <li
            key={index}
            className="rounded-xl bg-slate-950 p-4"
          >
            {item}
          </li>
        ))}
      </ul>
    </section>
  );
}