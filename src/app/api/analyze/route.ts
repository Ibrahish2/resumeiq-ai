import { GoogleGenAI } from "@google/genai";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

export async function POST(request: Request) {
  try {
    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json(
        { error: "مفتاح Gemini غير موجود." },
        { status: 500 },
      );
    }

    const formData = await request.formData();
    const file = formData.get("file");

    if (!(file instanceof File)) {
      return NextResponse.json(
        { error: "لم يتم إرسال ملف." },
        { status: 400 },
      );
    }

    if (file.type !== "application/pdf") {
      return NextResponse.json(
        { error: "يجب اختيار ملف PDF فقط." },
        { status: 400 },
      );
    }

    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        { error: "حجم الملف يجب ألا يتجاوز 5MB." },
        { status: 400 },
      );
    }

    const bytes = await file.arrayBuffer();
    const base64 = Buffer.from(bytes).toString("base64");

    const prompt = `
حلل هذه السيرة الذاتية كخبير توظيف وأنظمة ATS.

أعد النتيجة باللغة العربية بهذا الترتيب:

الدرجة: رقم من 100

الملخص:
فقرة قصيرة.

نقاط القوة:
- نقطة
- نقطة
- نقطة

نقاط الضعف:
- نقطة
- نقطة
- نقطة

تحسينات مقترحة:
- اقتراح عملي
- اقتراح عملي
- اقتراح عملي

الكلمات المفتاحية الناقصة:
- كلمة
- كلمة
- كلمة

لا تخترع خبرات أو شهادات غير موجودة، ولا تدّعِ أن النتيجة تضمن القبول.
`;

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: [
        { text: prompt },
        {
          inlineData: {
            mimeType: "application/pdf",
            data: base64,
          },
        },
      ],
    });

    return NextResponse.json({
      analysis: response.text || "لم يتم إنشاء نتيجة.",
    });
  } catch (error) {
    console.error("Gemini analysis error:", error);

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "حدث خطأ أثناء تحليل السيرة.",
      },
      { status: 500 },
    );
  }
}