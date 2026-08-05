import { GoogleGenAI } from "@google/genai";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

const analysisSchema = {
  type: "object",
  properties: {
    score: {
      type: "integer",
      minimum: 0,
      maximum: 100,
      description: "ATS-style resume score from 0 to 100.",
    },
    summary: {
      type: "string",
      description: "A short Arabic summary of the resume quality.",
    },
    strengths: {
      type: "array",
      items: { type: "string" },
      minItems: 3,
      maxItems: 6,
    },
    weaknesses: {
      type: "array",
      items: { type: "string" },
      minItems: 3,
      maxItems: 6,
    },
    improvements: {
      type: "array",
      items: { type: "string" },
      minItems: 3,
      maxItems: 6,
    },
    keywords: {
      type: "array",
      items: { type: "string" },
      maxItems: 10,
    },
  },
  required: [
    "score",
    "summary",
    "strengths",
    "weaknesses",
    "improvements",
    "keywords",
  ],
  additionalProperties: false,
};

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
حلل هذه السيرة الذاتية باللغة العربية كخبير توظيف وأنظمة ATS.

قيّم:
- وضوح المعلومات.
- جودة الملخص المهني.
- التعليم والخبرات.
- المهارات والكلمات المفتاحية.
- سهولة قراءة السيرة بواسطة أنظمة ATS.

لا تخترع خبرات أو شهادات غير موجودة.
لا تدّعِ أن الدرجة تضمن الحصول على وظيفة.
اجعل الاقتراحات عملية ومحددة.
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
      config: {
        responseMimeType: "application/json",
        responseSchema: analysisSchema,
      },
    });

    if (!response.text) {
      throw new Error("لم يرجع Gemini نتيجة.");
    }

    const analysis = JSON.parse(response.text);

    return NextResponse.json({ analysis });
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