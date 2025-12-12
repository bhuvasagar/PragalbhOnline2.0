import axios from "axios";

const LIBRE_TRANSLATE_URL =
  import.meta.env.VITE_LIBRE_TRANSLATE_URL || "https://libretranslate.de";

export const translateText = async (
  text: string,
  target: string,
  source: string = "auto"
): Promise<string> => {
  try {
    const response = await axios.post(
      `${LIBRE_TRANSLATE_URL}/translate`,
      {
        q: text,
        source: source,
        target: target.toLowerCase(),
        format: "text",
      },
      {
        headers: { "Content-Type": "application/json" },
      }
    );
    return response.data.translatedText;
  } catch (error) {
    console.error("Translation error:", error);
    return text; // Return original text on failure
  }
};
