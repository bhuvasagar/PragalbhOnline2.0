import { Request, Response } from "express";
import { translateServiceData } from "../utils/ai-translator";

// @desc    Translate service data
// @route   POST /api/translations/translate
// @access  Private/Admin
export const translate = async (req: Request, res: Response) => {
  try {
    const { content, sourceLang, targetLangs } = req.body;

    if (
      !content ||
      !sourceLang ||
      !targetLangs ||
      !Array.isArray(targetLangs)
    ) {
      return res.status(400).json({ message: "Invalid payload" });
    }

    const translatedData = await translateServiceData(
      content,
      sourceLang,
      targetLangs
    );
    res.json(translatedData);
  } catch (error: any) {
    console.error("Translation Controller Error:", error.message);
    res.status(500).json({ message: error.message || "Translation failed" });
  }
};
