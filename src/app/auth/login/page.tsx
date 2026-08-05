"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const router = useRouter();
  const supabase = createClient();

  async function signIn() {
    setMessage("جاري تسجيل الدخول...");

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setMessage(`فشل تسجيل الدخول: ${error.message}`);
      return;
    }

    router.push("/create-cv");
  }

  return (
    <main
      dir="rtl"
      className="flex min-h-screen items-center justify-center bg-slate-950 px-6 text-white"
    >
      <div className="w-full max-w-md rounded-3xl border border-white/10 bg-slate-900 p-8">
        <h1 className="mb-6 text-center text-3xl font-bold">
          تسجيل الدخول
        </h1>

        <input
          type="email"
          placeholder="البريد الإلكتروني"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          className="w-full rounded-xl border border-white/10 bg-slate-950 p-3 text-white outline-none focus:border-violet-500"
        />

        <input
          type="password"
          placeholder="كلمة المرور"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          className="mt-4 w-full rounded-xl border border-white/10 bg-slate-950 p-3 text-white outline-none focus:border-violet-500"
        />

        <button
          type="button"
          onClick={signIn}
          className="mt-5 w-full rounded-xl bg-violet-600 p-3 font-bold hover:bg-violet-500"
        >
          تسجيل الدخول
        </button>

        {message && (
          <p className="mt-4 rounded-xl bg-slate-950 p-3 text-center text-sm">
            {message}
          </p>
        )}
      </div>
    </main>
  );
}