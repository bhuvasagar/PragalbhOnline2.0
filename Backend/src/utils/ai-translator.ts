import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

interface ServiceData {
  title: Record<string, string>;
  description: Record<string, string>;
  documents: Record<string, string[]>;
  category: string;
  price: number;
  iconName: string;
}

const translateText = async (text: string, target: string): Promise<string> => {
  if (!text) return "";
  try {
    const response = await axios.post(
      "https://de.libretranslate.com/translate",
      {
        q: text,
        source: "auto",
        target: target,
        format: "text",
        alternatives: 3,
        api_key: "",
      }
    );
    return response.data.translatedText;
  } catch (error) {
    console.error(`Translation failed for "${text}" to ${target}:`, error);
    return text; // Fallback to original text on failure
  }
};

export const translateServiceData = async (
  data: ServiceData,
  sourceLang: string,
  targetLangs: string[]
): Promise<ServiceData> => {
  const translatedData = { ...data };

  // Initialize target language objects if they don't exist
  targetLangs.forEach((lang) => {
    if (!translatedData.title[lang]) translatedData.title[lang] = "";
    if (!translatedData.description[lang])
      translatedData.description[lang] = "";
    if (!translatedData.documents[lang]) translatedData.documents[lang] = [];
  });

  // Translate in parallel for each target language
  await Promise.all(
    targetLangs.map(async (lang) => {
      // 1. Translate Title
      if (translatedData.title[sourceLang]) {
        translatedData.title[lang] = await translateText(
          translatedData.title[sourceLang],
          lang.toLowerCase()
        );
      }

      // 2. Translate Description
      if (translatedData.description[sourceLang]) {
        translatedData.description[lang] = await translateText(
          translatedData.description[sourceLang],
          lang.toLowerCase()
        );
      }

      // 3. Translate Documents
      if (
        translatedData.documents[sourceLang] &&
        Array.isArray(translatedData.documents[sourceLang])
      ) {
        translatedData.documents[lang] = await Promise.all(
          translatedData.documents[sourceLang].map(async (doc) => {
            return await translateText(doc, lang.toLowerCase());
          })
        );
      }
    })
  );

  return translatedData;
};
