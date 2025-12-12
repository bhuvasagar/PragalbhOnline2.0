import dotenv from "dotenv";

dotenv.config();

// LibreTranslate endpoint
// Note: libretranslate.de is a public instance and might have rate limits.
const LIBRE_TRANSLATE_URL = "https://libretranslate.de/translate";

interface ServiceData {
  title: Record<string, string>;
  description: Record<string, string>;
  documents: Record<string, string[]>;
  category: string;
  price: number;
  iconName: string;
}

// Map internal language codes (EN, GU, HI) to LibreTranslate codes (en, gu, hi)
const langMap: Record<string, string> = {
  EN: "en",
  GU: "gu",
  HI: "hi",
};

const translateBatch = async (
  texts: string[],
  source: string,
  target: string
): Promise<string[]> => {
  try {
    const response = await fetch(LIBRE_TRANSLATE_URL, {
      method: "POST",
      body: JSON.stringify({
        q: texts,
        source: langMap[source] || source.toLowerCase(),
        target: langMap[target] || target.toLowerCase(),
        format: "text",
        api_key: "", // Free usage, potentially rate limited
      }),
      headers: { "Content-Type": "application/json" },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `LibreTranslate API Error: ${response.status} ${errorText}`
      );
    }

    const data = await response.json();
    // LibreTranslate returns { translatedText: string | string[] }
    // If 'q' is array, 'translatedText' is array.
    if (data && Array.isArray(data.translatedText)) {
      return data.translatedText;
    } else if (data && typeof data.translatedText === "string") {
      // Fallback if it returned single string for single item array
      return [data.translatedText];
    }

    return texts; // Fallback to original if format unexpected
  } catch (error) {
    console.error("Translation request failed:", error);
    throw error;
  }
};

export const translateServiceData = async (
  data: ServiceData,
  sourceLang: string,
  targetLangs: string[]
): Promise<ServiceData> => {
  const result = { ...data };

  // Helper to ensure target objects exist
  if (!result.title) result.title = {};
  if (!result.description) result.description = {};
  if (!result.documents) result.documents = {};

  for (const targetLang of targetLangs) {
    if (targetLang === sourceLang) continue;

    // 1. Prepare batch: [title, description, ...documents]
    const titleText = data.title[sourceLang] || "";
    const descText = data.description[sourceLang] || "";
    const docTexts = data.documents[sourceLang] || [];

    const batchInput = [titleText, descText, ...docTexts];

    console.log(
      `Translating to ${targetLang} via LibreTranslate...`,
      batchInput
    );

    try {
      const translatedBatch = await translateBatch(
        batchInput,
        sourceLang,
        targetLang
      );

      // 2. Unpack response
      // Index 0: Title
      result.title[targetLang] = translatedBatch[0];
      // Index 1: Description
      result.description[targetLang] = translatedBatch[1];
      // Index 2...N: Documents
      result.documents[targetLang] = translatedBatch.slice(2);
    } catch (error) {
      console.error(`Failed to translate to ${targetLang}`, error);
      // Fallback: copy source text so we don't return partial structure
      result.title[targetLang] = titleText;
      result.description[targetLang] = descText;
      result.documents[targetLang] = docTexts;
    }
  }

  return result;
};
