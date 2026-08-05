"use client";

import { ChangeEvent, FormEvent, useState } from "react";
import { createClient } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import Link from "next/link";

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

const initialData: CVData = {
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

export default function CreateCVPage() {
  const supabase = createClient();
  const [cvData, setCvData] = useState<CVData>(initialData);
  const router = useRouter();

  function handleChange(
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) {
    const { name, value } = event.target;

    setCvData((previousData) => ({
      ...previousData,
      [name]: value,
    }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
  event.preventDefault();

  if (!cvData.fullName.trim()) {
    alert("اكتب الاسم الكامل أولًا.");
    return;
  }

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    alert("يجب تسجيل الدخول أولًا.");
    router.push("/auth/login");
    return;
  }

  const { error } = await supabase.from("cvs").insert({
    user_id: user.id,
    full_name: cvData.fullName,
    job_title: cvData.jobTitle,
    email: cvData.email,
    phone: cvData.phone,
    city: cvData.city,
    summary: cvData.summary,
    education: cvData.education,
    experience: cvData.experience,
    skills: cvData.skills,
    template: "classic",
  });

  if (error) {
    console.error(error);
    alert(`فشل حفظ السيرة: ${error.message}`);
    return;
  }

  localStorage.setItem("qabool-cv-data", JSON.stringify(cvData));
  router.push("/templates");
}

  const skillsList = cvData.skills
    .split(",")
    .map((skill) => skill.trim())
    .filter(Boolean);

  return (
    <main
      dir="rtl"
      className="min-h-screen bg-slate-950 px-4 py-8 text-white sm:px-6"
    >
      <div className="mx-auto max-w-7xl">
        <header className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <Link
              href="/"
              className="text-sm text-violet-400 transition hover:text-violet-300"
            >
              ← العودة إلى الصفحة الرئيسية
            </Link>

            <h1 className="mt-3 text-3xl font-bold sm:text-4xl">
              إنشاء سيرة ذاتية
            </h1>

            <p className="mt-2 text-slate-400">
              املأ معلوماتك وشاهد النتيجة مباشرة.
            </p>
          </div>

          <div className="rounded-2xl border border-violet-400/20 bg-violet-400/10 px-4 py-3 text-sm text-violet-300">
            الخطوة 1 من 3
          </div>
        </header>

        <div className="grid gap-8 lg:grid-cols-2">
          <form
            onSubmit={handleSubmit}
            className="space-y-6 rounded-3xl border border-white/10 bg-slate-900 p-6 sm:p-8"
          >
            <div>
              <h2 className="text-xl font-bold">المعلومات الشخصية</h2>
              <p className="mt-1 text-sm text-slate-400">
                أدخل معلوماتك الأساسية كما تريد ظهورها في السيرة.
              </p>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <FormField
                label="الاسم الكامل"
                name="fullName"
                value={cvData.fullName}
                placeholder="إبراهيم كامل حسن"
                onChange={handleChange}
              />

              <FormField
                label="المسمى الوظيفي"
                name="jobTitle"
                value={cvData.jobTitle}
                placeholder="مترجم أو مدرس لغة إنكليزية"
                onChange={handleChange}
              />

              <FormField
                label="البريد الإلكتروني"
                name="email"
                type="email"
                value={cvData.email}
                placeholder="example@email.com"
                onChange={handleChange}
              />

              <FormField
                label="رقم الهاتف"
                name="phone"
                type="tel"
                value={cvData.phone}
                placeholder="07XXXXXXXXX"
                onChange={handleChange}
              />

              <FormField
                label="المدينة"
                name="city"
                value={cvData.city}
                placeholder="بغداد، العراق"
                onChange={handleChange}
              />
            </div>

            <TextAreaField
              label="نبذة مهنية"
              name="summary"
              value={cvData.summary}
              placeholder="اكتب نبذة قصيرة عن خبرتك، دراستك، وأهدافك المهنية."
              onChange={handleChange}
            />

            <TextAreaField
              label="التعليم"
              name="education"
              value={cvData.education}
              placeholder="بكالوريوس آداب، قسم اللغة الإنكليزية..."
              onChange={handleChange}
            />

            <TextAreaField
              label="الخبرات العملية"
              name="experience"
              value={cvData.experience}
              placeholder="اكتب اسم الوظيفة، مكان العمل، وأهم المهام."
              onChange={handleChange}
            />

            <TextAreaField
              label="المهارات"
              name="skills"
              value={cvData.skills}
              placeholder="اللغة الإنكليزية، الترجمة، Microsoft Office"
              helpText="افصل بين كل مهارة والثانية بفاصلة."
              onChange={handleChange}
            />

            <button
              type="submit"
              className="w-full rounded-2xl bg-violet-600 px-6 py-4 font-bold transition hover:bg-violet-500"
            >
              حفظ ومتابعة
            </button>
          </form>

          <section className="lg:sticky lg:top-6 lg:self-start">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-lg font-bold">المعاينة المباشرة</h2>
              <span className="text-sm text-slate-500">قالب بسيط</span>
            </div>

            <div
              dir="rtl"
              className="min-h-[750px] overflow-hidden rounded-3xl bg-white text-slate-900 shadow-2xl"
            >
              <div className="bg-slate-900 px-8 py-10 text-white">
                <h2 className="text-3xl font-bold">
                  {cvData.fullName || "اسمك الكامل"}
                </h2>

                <p className="mt-2 text-lg text-violet-300">
                  {cvData.jobTitle || "المسمى الوظيفي"}
                </p>

                <div className="mt-5 flex flex-wrap gap-x-5 gap-y-2 text-sm text-slate-300">
                  <span>{cvData.email || "البريد الإلكتروني"}</span>
                  <span>{cvData.phone || "رقم الهاتف"}</span>
                  <span>{cvData.city || "المدينة"}</span>
                </div>
              </div>

              <div className="space-y-8 px-8 py-10">
                <PreviewSection
                  title="نبذة مهنية"
                  content={
                    cvData.summary ||
                    "ستظهر هنا نبذة قصيرة عن خبرتك ومؤهلاتك وأهدافك المهنية."
                  }
                />

                <PreviewSection
                  title="التعليم"
                  content={
                    cvData.education ||
                    "اكتب معلومات دراستك والجامعة والشهادة."
                  }
                />

                <PreviewSection
                  title="الخبرة العملية"
                  content={
                    cvData.experience ||
                    "اكتب خبراتك السابقة والمسؤوليات التي عملت بها."
                  }
                />

                <div>
                  <h3 className="border-b-2 border-violet-600 pb-2 text-lg font-bold">
                    المهارات
                  </h3>

                  <div className="mt-4 flex flex-wrap gap-2">
                    {skillsList.length > 0 ? (
                      skillsList.map((skill) => (
                        <span
                          key={skill}
                          className="rounded-full bg-violet-100 px-3 py-1 text-sm text-violet-800"
                        >
                          {skill}
                        </span>
                      ))
                    ) : (
                      <>
                        <SkillPlaceholder text="مهارة أولى" />
                        <SkillPlaceholder text="مهارة ثانية" />
                        <SkillPlaceholder text="مهارة ثالثة" />
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}

type FormFieldProps = {
  label: string;
  name: keyof CVData;
  value: string;
  placeholder: string;
  type?: string;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
};

function FormField({
  label,
  name,
  value,
  placeholder,
  type = "text",
  onChange,
}: FormFieldProps) {
  return (
    <div>
      <label htmlFor={name} className="mb-2 block text-sm font-semibold">
        {label}
      </label>

      <input
        id={name}
        name={name}
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={onChange}
        className="w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-3 outline-none transition placeholder:text-slate-600 focus:border-violet-500"
      />
    </div>
  );
}

type TextAreaFieldProps = {
  label: string;
  name: keyof CVData;
  value: string;
  placeholder: string;
  helpText?: string;
  onChange: (event: ChangeEvent<HTMLTextAreaElement>) => void;
};

function TextAreaField({
  label,
  name,
  value,
  placeholder,
  helpText,
  onChange,
}: TextAreaFieldProps) {
  return (
    <div>
      <label htmlFor={name} className="mb-2 block text-sm font-semibold">
        {label}
      </label>

      <textarea
        id={name}
        name={name}
        rows={4}
        value={value}
        placeholder={placeholder}
        onChange={onChange}
        className="w-full resize-y rounded-xl border border-white/10 bg-slate-950 px-4 py-3 outline-none transition placeholder:text-slate-600 focus:border-violet-500"
      />

      {helpText && (
        <p className="mt-2 text-xs text-slate-500">{helpText}</p>
      )}
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
    <div>
      <h3 className="border-b-2 border-violet-600 pb-2 text-lg font-bold">
        {title}
      </h3>

      <p className="mt-4 whitespace-pre-line leading-7 text-slate-700">
        {content}
      </p>
    </div>
  );
}

function SkillPlaceholder({ text }: { text: string }) {
  return (
    <span className="rounded-full bg-slate-100 px-3 py-1 text-sm text-slate-500">
      {text}
    </span>
  );
}