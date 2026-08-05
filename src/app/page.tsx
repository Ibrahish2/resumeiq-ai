import Link from "next/link";
import CTA from "@/components/landing/CTA";
import Footer from "@/components/landing/Footer";
import Features from "@/components/landing/Features";
import Hero from "@/components/landing/Hero";
import Navbar from "@/components/landing/Navbar";
const features = [
  {
    icon: "✨",
    title: "إنشاء سيرة ذاتية",
    description:
      "أنشئ CV مرتب واحترافي خلال دقائق وباللغتين العربية والإنكليزية.",
  },
  {
    icon: "🔍",
    title: "تحليل الـCV",
    description:
      "احصل على ملاحظات واضحة تساعدك على تحسين سيرتك وزيادة فرص قبولك.",
  },
  {
    icon: "✉️",
    title: "رسالة تقديم",
    description:
      "أنشئ Cover Letter مخصصًا للوظيفة التي تريد التقديم عليها.",
  },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <Navbar />

      <Hero />

      <Features />

      <CTA />

      <Footer />
    </main>
  );
}