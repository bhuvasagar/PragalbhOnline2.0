import dotenv from "dotenv";

dotenv.config();

// LibreTranslate endpoints (Mirrors)
const LIBRE_TRANSLATE_MIRRORS = [
  "https://libretranslate.de/translate",
  "https://translate.terraprint.co/translate",
  "https://lt.vern.cc/translate",
  "https://translate.argosopentech.com/translate",
];

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
  let lastError: any;

  for (const url of LIBRE_TRANSLATE_MIRRORS) {
    try {
      console.log(`Attempting translation via: ${url}`);
      const response = await fetch(url, {
        method: "POST",
        body: JSON.stringify({
          q: texts,
          source: langMap[source] || source.toLowerCase(),
          target: langMap[target] || target.toLowerCase(),
          format: "text",
          api_key: "",
        }),
        headers: { "Content-Type": "application/json" },
      });

      if (!response.ok) {
        // If 4xx/5xx, try next mirror
        const text = await response.text();
        console.warn(`Mirror ${url} failed: ${response.status} ${text}`);
        continue;
      }

      const data = await response.json();

      if (data && Array.isArray(data.translatedText)) {
        return data.translatedText;
      } else if (data && typeof data.translatedText === "string") {
        return [data.translatedText];
      }

      // If format is wrong, consider failed and try next
      console.warn(`Mirror ${url} returned unexpected format:`, data);
      continue;
    } catch (error) {
      console.warn(`Mirror ${url} connection failed:`, error);
      lastError = error;
      // Try next
    }
  }

  console.error("All translation mirrors failed.");
  throw lastError || new Error("All translation mirrors failed.");
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
