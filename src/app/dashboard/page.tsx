"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase";

export default function DashboardPage() {
  const supabase = createClient();

  const [loading, setLoading] = useState(true);
  const [userEmail, setUserEmail] = useState("");

  const [cvCount, setCvCount] = useState(0);
  const [analysisCount, setAnalysisCount] = useState(0);

  useEffect(() => {
    loadDashboard();
  }, []);

  async function loadDashboard() {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      window.location.href = "/auth/login";
      return;
    }

    setUserEmail(user.email ?? "");

    const { count: cvCountResult } = await supabase
      .from("cvs")
      .select("*", {
        count: "exact",
        head: true,
      });

    setCvCount(cvCountResult ?? 0);

    const { count: analysisCountResult } = await supabase
      .from("ai_results")
      .select("*", {
        count: "exact",
        head: true,
      })
      .eq("type", "cv_analysis");

    setAnalysisCount(analysisCountResult ?? 0);

    setLoading(false);
  }

  async function signOut() {
    await supabase.auth.signOut();
    window.location.href = "/auth/login";
  }

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-950 text-white">
        جاري تحميل لوحة التحكم...
      </main>
    );
  }

  return (
    <main
      dir="rtl"
      className="min-h-screen bg-slate-950 px-6 py-10 text-white"
    >
      <div className="mx-auto max-w-7xl">
        <header className="flex flex-col items-start justify-between gap-5 sm:flex-row sm:items-center">
          <div>
            <h1 className="text-4xl font-bold">
              لوحة التحكم
            </h1>

            <p className="mt-2 text-slate-400">
              مرحبًا، {userEmail}
            </p>
          </div>

          <button
            onClick={signOut}
            className="rounded-xl border border-white/10 px-5 py-3 hover:bg-white/5"
          >
            تسجيل الخروج
          </button>
        </header>

        <section className="mt-10 grid gap-6 md:grid-cols-3">
          <DashboardCard
            title="السير الذاتية"
            value={cvCount}
            description="عدد السير الذاتية المحفوظة"
          />

          <DashboardCard
            title="تحليل السيرة"
            value={analysisCount}
            description="عدد التحليلات المحفوظة"
          />

          <DashboardCard
            title="مطابقة الوظائف"
            value={0}
            description="سيتم ربطها قريبًا"
          />
        </section>

        <section className="mt-10 grid gap-5 md:grid-cols-4">
          <ActionCard
            href="/create-cv"
            icon="📄"
            title="إنشاء سيرة"
            description="أنشئ سيرة احترافية."
          />

          <ActionCard
            href="/analyze"
            icon="🤖"
            title="تحليل السيرة"
            description="حلل سيرتك بالذكاء الاصطناعي."
          />

          <ActionCard
            href="/match"
            icon="🎯"
            title="مطابقة الوظيفة"
            description="قارن سيرتك مع إعلان وظيفة."
          />

          <ActionCard
            href="/dashboard/history"
            icon="🕒"
            title="سجل التحليلات"
            description="عرض جميع التحليلات المحفوظة."
          />
        </section>
      </div>
    </main>
  );
}

function DashboardCard({
  title,
  value,
  description,
}: {
  title: string;
  value: number;
  description: string;
}) {
  return (
    <div className="rounded-3xl border border-white/10 bg-slate-900 p-7">
      <h2 className="text-xl font-bold">{title}</h2>

      <p className="mt-4 text-5xl font-bold text-violet-400">
        {value}
      </p>

      <p className="mt-3 text-slate-400">
        {description}
      </p>
    </div>
  );
}

function ActionCard({
  href,
  icon,
  title,
  description,
}: {
  href: string;
  icon: string;
  title: string;
  description: string;
}) {
  return (
    <Link
      href={href}
      className="rounded-3xl border border-white/10 bg-slate-900 p-7 transition hover:-translate-y-1 hover:border-violet-400/40"
    >
      <div className="text-3xl">{icon}</div>

      <h2 className="mt-5 text-xl font-bold">
        {title}
      </h2>

      <p className="mt-3 text-slate-400">
        {description}
      </p>
    </Link>
  );
}