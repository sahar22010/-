import { GuidanceMode } from "../types";

export const getGuidanceResponse = async (query: string, mode: GuidanceMode, language: string): Promise<string> => {
  try {
    const response = await fetch("/api/guidance", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ query, mode, language }),
    });

    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      throw new Error(errData.message || `Server responded with status ${response.status}`);
    }

    const data = await response.json();
    return data.text || "عذراً، لم نتمكن من الحصول على رد مناسب حالياً.";
  } catch (error) {
    console.error("Guidance Service Error:", error);
    return "عذراً، تعذر الحصول على الإجابة حالياً. يرجى مراجعة الموقع الرسمي لدار الإفتاء alifta.gov.sa";
  }
};
