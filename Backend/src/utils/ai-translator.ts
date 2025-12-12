import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

dotenv.config();

// Initialize Gemini
const apiKey = process.env.GEMINI_API_KEY;
const genAI = apiKey ? new GoogleGenerativeAI(apiKey) : null;

interface ServiceData {
  title: Record<string, string>;
  description: Record<string, string>;
  documents: Record<string, string[]>;
  category: string;
  price: number;
  iconName: string;
}

export const translateServiceData = async (
  data: ServiceData,
  sourceLang: string,
  targetLangs: string[]
): Promise<ServiceData> => {
  if (!genAI) {
    throw new Error("GEMINI_API_KEY not configured");
  }

  const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });

  const prompt = `
    You are a professional translator for a government services portal.
    Translate the following JSON object's translatable fields (title, description, documents) from '${sourceLang}' to these target languages: ${targetLangs.join(
    ", "
  )}.
    
    Current Data:
    ${JSON.stringify(data, null, 2)}
    
    Rules:
    1. Return ONLY the valid JSON object. No markdown formatting.
    2. Preserve the original '${sourceLang}' content.
    3. Fill in the keys for ${targetLangs.join(
      ", "
    )} in title, description, and documents.
    4. For 'documents', translate each string in the array.
    5. Do not translate 'category', 'price', or 'iconName'.
    6. Ensure the structure perfectly matches the input.
  `;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Cleanup potential markdown code blocks
    const jsonStr = text
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    return JSON.parse(jsonStr);
  } catch (error) {
    console.error("AI Translation Error:", error);
    throw new Error("Failed to translate content");
  }
};
