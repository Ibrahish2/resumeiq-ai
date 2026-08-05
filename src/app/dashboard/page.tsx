"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase";

type CV = {
  id: string;
  full_name: string | null;
  job_title: string | null;
  template: string | null;
  created_at: string;
};

export default function DashboardPage() {
  const supabase = createClient();

  const [cvs, setCvs] = useState<CV[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    loadCVs();
  }, []);

  async function loadCVs() {
    setLoading(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      window.location.href = "/auth/login";
      return;
    }

    const { data, error } = await supabase
      .from("cvs")
      .select("id, full_name, job_title, template, created_at")
      .order("created_at", { ascending: false });

    if (error) {
      console.error(error);
      setMessage(`فشل تحميل السير: ${error.message}`);
      setLoading(false);
      return;
    }

    setCvs(data ?? []);
    setLoading(false);
  }

  async function deleteCV(id: string) {
    const confirmed = window.confirm(
      "هل أنت متأكد من حذف هذه السيرة؟",
    );

    if (!confirmed) return;

    const { error } = await supabase
      .from("cvs")
      .delete()
      .eq("id", id);

    if (error) {
      alert(`فشل الحذف: ${error.message}`);
      return;
    }

    setCvs((currentCVs) =>
      currentCVs.filter((cv) => cv.id !== id),
    );
  }

  async function signOut() {
    await supabase.auth.signOut();
    window.location.href = "/auth/login";
  }

  return (
    <main
      dir="rtl"
      className="min-h-screen bg-slate-950 px-5 py-10 text-white"
    >
      <div className="mx-auto max-w-6xl">
        <header className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold sm:text-4xl">
              لوحة التحكم
            </h1>

            <p className="mt-2 text-slate-400">
              شاهد السير الذاتية التي حفظتها.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Link
              href="/create-cv"
              className="rounded-xl bg-violet-600 px-6 py-3 text-center font-bold hover:bg-violet-500"
            >
              إنشاء CV جديد
            </Link>

            <button
              type="button"
              onClick={signOut}
              className="rounded-xl border border-white/10 px-6 py-3 font-bold hover:bg-white/5"
            >
              تسجيل الخروج
            </button>
          </div>
        </header>

        {loading && (
          <p className="mt-12 text-center text-slate-400">
            جاري تحميل السير...
          </p>
        )}

        {message && (
          <p className="mt-8 rounded-2xl bg-red-500/10 p-4 text-red-300">
            {message}
          </p>
        )}

        {!loading && cvs.length === 0 && (
          <section className="mt-12 rounded-3xl border border-white/10 bg-slate-900 p-10 text-center">
            <h2 className="text-2xl font-bold">
              ما عندك سيرة محفوظة بعد
            </h2>

            <p className="mt-3 text-slate-400">
              أنشئ أول سيرة ذاتية وراح تظهر هنا.
            </p>

            <Link
              href="/create-cv"
              className="mt-6 inline-block rounded-xl bg-violet-600 px-6 py-3 font-bold hover:bg-violet-500"
            >
              إنشاء أول CV
            </Link>
          </section>
        )}

        {!loading && cvs.length > 0 && (
          <section className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {cvs.map((cv) => (
              <article
                key={cv.id}
                className="rounded-3xl border border-white/10 bg-slate-900 p-6"
              >
                <div className="rounded-2xl bg-white p-5 text-slate-900">
                  <div className="rounded-xl bg-slate-900 px-5 py-6 text-white">
                    <h2 className="text-xl font-bold">
                      {cv.full_name || "بدون اسم"}
                    </h2>

                    <p className="mt-2 text-sm text-slate-300">
                      {cv.job_title || "بدون مسمى وظيفي"}
                    </p>
                  </div>

                  <div className="space-y-3 py-5">
                    <div className="h-2 rounded bg-slate-200" />
                    <div className="h-2 w-4/5 rounded bg-slate-200" />
                    <div className="h-2 w-3/5 rounded bg-slate-200" />
                  </div>
                </div>

                <p className="mt-5 text-sm text-slate-400">
                  القالب: {cv.template || "classic"}
                </p>

                <p className="mt-2 text-xs text-slate-500">
                  تاريخ الإنشاء:{" "}
                  {new Date(cv.created_at).toLocaleDateString("ar-IQ")}
                </p>

                <div className="mt-5 flex gap-3">
                  <Link
                    href={`/dashboard/${cv.id}`}
                    className="flex-1 rounded-xl bg-violet-600 px-4 py-3 text-center font-bold hover:bg-violet-500"
                  >
                    عرض
                  </Link>

                  <button
                    type="button"
                    onClick={() => deleteCV(cv.id)}
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