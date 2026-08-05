"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase";

type CVData = {
  id: string;
  full_name: string;
  job_title: string;
  email: string;
  phone: string;
  city: string;
  summary: string;
  education: string;
  experience: string;
  skills: string;
  template: string;
};

const emptyCV: CVData = {
  id: "",
  full_name: "",
  job_title: "",
  email: "",
  phone: "",
  city: "",
  summary: "",
  education: "",
  experience: "",
  skills: "",
  template: "classic",
};

export default function EditCVPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const supabase = createClient();

  const [cv, setCV] = useState<CVData>(emptyCV);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    loadCV();
  }, [params.id]);

  async function loadCV() {
    setLoading(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      router.push("/auth/login");
      return;
    }

    const { data, error } = await supabase
      .from("cvs")
      .select(
        "id, full_name, job_title, email, phone, city, summary, education, experience, skills, template",
      )
      .eq("id", params.id)
      .single();

    if (error || !data) {
      console.error(error);
      setMessage("تعذر تحميل السيرة الذاتية.");
      setLoading(false);
      return;
    }

    setCV({
      id: data.id,
      full_name: data.full_name ?? "",
      job_title: data.job_title ?? "",
      email: data.email ?? "",
      phone: data.phone ?? "",
      city: data.city ?? "",
      summary: data.summary ?? "",
      education: data.education ?? "",
      experience: data.experience ?? "",
      skills: data.skills ?? "",
      template: data.template ?? "classic",
    });

    setLoading(false);
  }

  function handleChange(
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) {
    const { name, value } = event.target;

    setCV((currentCV) => ({
      ...currentCV,
      [name]: value,
    }));
  }

  async function saveChanges() {
    if (!cv.full_name.trim()) {
      setMessage("اكتب الاسم الكامل أولًا.");
      return;
    }

    setSaving(true);
    setMessage("");

    const { error } = await supabase
      .from("cvs")
      .update({
        full_name: cv.full_name,
        job_title: cv.job_title,
        email: cv.email,
        phone: cv.phone,
        city: cv.city,
        summary: cv.summary,
        education: cv.education,
        experience: cv.experience,
        skills: cv.skills,
        template: cv.template,
      })
      .eq("id", cv.id);

    if (error) {
      console.error(error);
      setMessage(`فشل حفظ التعديلات: ${error.message}`);
      setSaving(false);
      return;
    }

    localStorage.setItem(
      "qabool-cv-data",
      JSON.stringify({
        fullName: cv.full_name,
        jobTitle: cv.job_title,
        email: cv.email,
        phone: cv.phone,
        city: cv.city,
        summary: cv.summary,
        education: cv.education,
        experience: cv.experience,
        skills: cv.skills,
      }),
    );

    localStorage.setItem("qabool-cv-template", cv.template);

    setMessage("تم حفظ التعديلات بنجاح ✅");
    setSaving(false);
  }

  const skills = cv.skills
    .split(",")
    .map((skill) => skill.trim())
    .filter(Boolean);

  const headerClass =
    cv.template === "modern"
      ? "bg-violet-700"
      : cv.template === "professional"
        ? "bg-blue-800"
        : "bg-slate-900";

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-950 text-white">
        جاري تحميل السيرة...
      </main>
    );
  }

  return (
    <main
      dir="rtl"
      className="min-h-screen bg-slate-950 px-4 py-8 text-white"
    >
      <div className="mx-auto max-w-7xl">
        <header className="no-print mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <Link
              href="/dashboard"
              className="text-violet-400 hover:text-violet-300"
            >
              ← الرجوع إلى لوحة التحكم
            </Link>

            <h1 className="mt-3 text-3xl font-bold">
              تعديل السيرة الذاتية
            </h1>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              onClick={saveChanges}
              disabled={saving}
              className="rounded-xl bg-violet-600 px-6 py-3 font-bold hover:bg-violet-500 disabled:opacity-50"
            >
              {saving ? "جاري الحفظ..." : "حفظ التعديلات"}
            </button>

            <button
              type="button"
              onClick={() => window.print()}
              className="rounded-xl border border-white/10 px-6 py-3 font-bold hover:bg-white/5"
            >
              تحميل PDF
            </button>
          </div>
        </header>

        {message && (
          <p className="no-print mb-6 rounded-2xl bg-slate-900 p-4 text-center">
            {message}
          </p>
        )}

        <div className="grid gap-8 lg:grid-cols-2">
          <section className="no-print space-y-5 rounded-3xl border border-white/10 bg-slate-900 p-6">
            <InputField
              label="الاسم الكامل"
              name="full_name"
              value={cv.full_name}
              onChange={handleChange}
            />

            <InputField
              label="المسمى الوظيفي"
              name="job_title"
              value={cv.job_title}
              onChange={handleChange}
            />

            <InputField
              label="البريد الإلكتروني"
              name="email"
              value={cv.email}
              onChange={handleChange}
            />

            <InputField
              label="رقم الهاتف"
              name="phone"
              value={cv.phone}
              onChange={handleChange}
            />

            <InputField
              label="المدينة"
              name="city"
              value={cv.city}
              onChange={handleChange}
            />

            <TextAreaField
              label="نبذة مهنية"
              name="summary"
              value={cv.summary}
              onChange={handleChange}
            />

            <TextAreaField
              label="التعليم"
              name="education"
              value={cv.education}
              onChange={handleChange}
            />

            <TextAreaField
              label="الخبرة العملية"
              name="experience"
              value={cv.experience}
              onChange={handleChange}
            />

            <TextAreaField
              label="المهارات"
              name="skills"
              value={cv.skills}
              onChange={handleChange}
            />

            <div>
              <label className="mb-2 block text-sm font-semibold">
                القالب
              </label>

              <select
                value={cv.template}
                onChange={(event) =>
                  setCV((currentCV) => ({
                    ...currentCV,
                    template: event.target.value,
                  }))
                }
                className="w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-3"
              >
                <option value="classic">الكلاسيكي</option>
                <option value="modern">العصري</option>
                <option value="professional">الاحترافي</option>
              </select>
            </div>
          </section>

          <section
            id="cv-document"
            className="mx-auto min-h-[1120px] w-full max-w-[794px] overflow-hidden bg-white text-slate-900 shadow-2xl"
          >
            <header className={`${headerClass} px-10 py-10 text-white`}>
              <h2 className="text-4xl font-bold">
                {cv.full_name || "الاسم الكامل"}
              </h2>

              <p className="mt-3 text-xl text-white/80">
                {cv.job_title || "المسمى الوظيفي"}
              </p>

              <div className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-sm text-white/75">
                {cv.email && <span>{cv.email}</span>}
                {cv.phone && <span>{cv.phone}</span>}
                {cv.city && <span>{cv.city}</span>}
              </div>
            </header>

            <div className="space-y-9 px-10 py-10">
              <PreviewSection
                title="نبذة مهنية"
                content={cv.summary || "لا توجد نبذة مهنية."}
              />

              <PreviewSection
                title="التعليم"
                content={cv.education || "لا توجد معلومات تعليمية."}
              />

              <PreviewSection
                title="الخبرة العملية"
                content={cv.experience || "لا توجد خبرات عملية."}
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
                    <p className="text-slate-500">
                      لا توجد مهارات مضافة.
                    </p>
                  )}
                </div>
              </section>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}

function InputField({
  label,
  name,
  value,
  onChange,
}: {
  label: string;
  name: string;
  value: string;
  onChange: (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => void;
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-semibold">
        {label}
      </label>

      <input
        name={name}
        value={value}
        onChange={onChange}
        className="w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-3 outline-none focus:border-violet-500"
      />
    </div>
  );
}

function TextAreaField({
  label,
  name,
  value,
  onChange,
}: {
  label: string;
  name: string;
  value: string;
  onChange: (
    event: React.ChangeEvent<HTMLTextAreaElement>,
  ) => void;
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-semibold">
        {label}
      </label>

      <textarea
        name={name}
        value={value}
        rows={4}
        onChange={onChange}
        className="w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-3 outline-none focus:border-violet-500"
      />
    </div>
  );
}

function PreviewSection({
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