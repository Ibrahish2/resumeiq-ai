"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";

export default function TestPage() {
  const [message, setMessage] = useState("");

  async function testConnection() {
    setMessage("جاري الاختبار...");

    const { data, error } = await supabase.auth.getSession();

    if (error) {
      console.error(error);
      setMessage(`فشل الاتصال: ${error.message}`);
      return;
    }

    console.log(data);
    setMessage("الاتصال مع Supabase ناجح ✅");
  }

  return (
    <main
      dir="rtl"
      className="flex min-h-screen items-center justify-center bg-slate-950 px-6 text-white"
    >
      <div className="w-full max-w-md rounded-3xl border border-white/10 bg-slate-900 p-8 text-center">
        <h1 className="text-2xl font-bold">اختبار Supabase</h1>

        <button
          type="button"
          onClick={testConnection}
          className="mt-8 w-full rounded-xl bg-violet-600 px-6 py-3 font-bold hover:bg-violet-500"
        >
          اختبار الاتصال
        </button>

        {message && (
          <p className="mt-5 rounded-xl bg-slate-950 p-4 text-sm">
            {message}
          </p>
        )}
      </div>
    </main>
  );
}