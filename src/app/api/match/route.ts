import { GoogleGenAI } from "@google/genai";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

const matchSchema = {
  type: "object",
  properties: {
    matchScore: {
      type: "integer",
      minimum: 0,
      maximum: 100,
    },
    summary: {
      type: "string",
    },
    matchedSkills: {
      type: "array",
      items: { type: "string" },
    },
    missingSkills: {
      type: "array",
      items: { type: "string" },
    },
    missingKeywords: {
      type: "array",
      items: { type: "string" },
    },
    recommendations: {
      type: "array",
      items: { type: "string" },
    },
  },
  required: [
    "matchScore",
    "summary",
    "matchedSkills",
    "missingSkills",
    "missingKeywords",
    "recommendations",
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
    const jobDescription = formData.get("jobDescription");

    if (!(file instanceof File)) {
      return NextResponse.json(
        { error: "لم يتم إرسال ملف السيرة." },
        { status: 400 },
      );
    }

    if (
      typeof jobDescription !== "string" ||
      jobDescription.trim().length < 30
    ) {
      return NextResponse.json(
        { error: "وصف الوظيفة قصير أو غير موجود." },
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
قارن السيرة الذاتية المرفقة مع وصف الوظيفة التالي كخبير توظيف وأنظمة ATS.

وصف الوظيفة:
${jobDescription}

المطلوب:
- أعطِ نسبة تطابق واقعية من 0 إلى 100.
- لخّص مدى مناسبة المرشح للوظيفة.
- حدّد المهارات الموجودة في السيرة والمتوافقة مع الوظيفة.
- حدّد المهارات المفقودة.
- حدّد الكلمات المفتاحية الناقصة.
- أعطِ توصيات عملية لتحسين السيرة لهذه الوظيفة تحديدًا.

لا تخترع خبرات أو مهارات غير موجودة.
لا تدّعِ أن النتيجة تضمن القبول.
اكتب النتيجة باللغة العربية.
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
        responseSchema: matchSchema,
      },
    });

    if (!response.text) {
      throw new Error("لم يرجع Gemini نتيجة.");
    }

    const result = JSON.parse(response.text);

    return NextResponse.json({ result });
  } catch (error) {
    console.error("Match API error:", error);

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "حدث خطأ أثناء تحليل التطابق.",
      },
      { status: 500 },
    );
  }
}