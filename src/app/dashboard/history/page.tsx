"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase";

type AnalysisResult = {
  score?: number;
  summary?: string;
  strengths?: string[];
  weaknesses?: string[];
  improvements?: string[];
  keywords?: string[];
};

type HistoryItem = {
  id: string;
  type: string;
  title: string | null;
  result: AnalysisResult;
  created_at: string;
};

export default function HistoryPage() {
  const [supabase] = useState(() => createClient());

  const [items, setItems] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    async function loadHistory() {
      setLoading(true);
      setMessage("");

      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError) {
        setMessage(`فشل التحقق من الحساب: ${userError.message}`);
        setLoading(false);
        return;
      }

      if (!user) {
        window.location.href = "/auth/login";
        return;
      }

      const { data, error } = await supabase
        .from("ai_results")
        .select("id, type, title, result, created_at")
        .eq("type", "cv_analysis")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("History error:", error);
        setMessage(`فشل تحميل التحليلات: ${error.message}`);
        setLoading(false);
        return;
      }

      setItems((data as HistoryItem[]) ?? []);
      setLoading(false);
    }

    loadHistory();
  }, [supabase]);

  async function deleteItem(id: string) {
    const confirmed = window.confirm(
      "هل أنت متأكد من حذف هذا التحليل؟",
    );

    if (!confirmed) return;

    const { error } = await supabase
      .from("ai_results")
      .delete()
      .eq("id", id);

    if (error) {
      alert(`فشل الحذف: ${error.message}`);
      return;
    }

    setItems((currentItems) =>
      currentItems.filter((item) => item.id !== id),
    );
  }

  return (
    <main
      dir="rtl"
      className="min-h-screen bg-slate-950 px-5 py-10 text-white"
    >
      <div className="mx-auto max-w-6xl">
        <Link
          href="/dashboard"
          className="text-sm text-violet-400 hover:text-violet-300"
        >
          ← العودة إلى لوحة التحكم
        </Link>

        <header className="mt-6">
          <h1 className="text-3xl font-bold sm:text-4xl">
            سجل التحليلات
          </h1>

          <p className="mt-2 text-slate-400">
            جميع نتائج تحليل السيرة الذاتية المحفوظة.
          </p>
        </header>

        {loading && (
          <p className="mt-10 text-center text-slate-400">
            جاري تحميل التحليلات...
          </p>
        )}

        {message && (
          <p className="mt-8 rounded-2xl bg-red-500/10 p-4 text-red-300">
            {message}
          </p>
        )}

        {!loading && !message && items.length === 0 && (
          <section className="mt-10 rounded-3xl border border-white/10 bg-slate-900 p-10 text-center">
            <h2 className="text-2xl font-bold">
              لا توجد تحليلات محفوظة
            </h2>

            <p className="mt-3 text-slate-400">
              حلّل أول سيرة ذاتية وستظهر النتيجة هنا.
            </p>

            <Link
              href="/analyze"
              className="mt-6 inline-block rounded-xl bg-violet-600 px-6 py-3 font-bold hover:bg-violet-500"
            >
              تحليل سيرة الآن
            </Link>
          </section>
        )}

        {!loading && !message && items.length > 0 && (
          <section className="mt-10 grid gap-6 md:grid-cols-2">
            {items.map((item) => (
              <article
                key={item.id}
                className="rounded-3xl border border-white/10 bg-slate-900 p-6"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h2 className="break-all text-xl font-bold">
                      {item.title || "تحليل بدون اسم"}
                    </h2>

                    <p className="mt-2 text-sm text-slate-500">
                      {new Date(item.created_at).toLocaleString("ar-IQ")}
                    </p>
                  </div>

                  <div className="shrink-0 rounded-2xl bg-violet-500/10 px-4 py-3 text-center text-violet-300">
                    <p className="text-xs">الدرجة</p>

                    <p className="mt-1 text-2xl font-bold">
                      {item.result?.score ?? "--"}
                    </p>
                  </div>
                </div>

                {item.result?.summary && (
                  <p className="mt-5 line-clamp-3 leading-7 text-slate-300">
                    {item.result.summary}
                  </p>
                )}

                <div className="mt-6 flex gap-3">
                  <Link
                    href={`/dashboard/history/${item.id}`}
                    className="flex-1 rounded-xl bg-violet-600 px-4 py-3 text-center font-bold hover:bg-violet-500"
                  >
                    عرض
                  </Link>

                  <button
                    type="button"
                    onClick={() => deleteItem(item.id)}
                    className="rounded-xl border border-red-400/20 px-4 py-3 font-bold text-red-300 hover:bg-red-400/10"
                  >
                    حذف
                  </button>
                </div>
              </article>
            ))}
          </section>
        )}
      </div>
    </main>
  );
}