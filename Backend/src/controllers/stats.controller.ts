import { Request, Response } from "express";
import Service from "../models/Service";
import GlobalStats from "../models/GlobalStats";

// @desc    Get all stats
// @route   GET /api/stats
// @access  Public
export const getStats = async (req: Request, res: Response) => {
  try {
    const servicesCount = await Service.countDocuments();

    // Find or create global stats
    let globalStats = await GlobalStats.findOne({ name: "site_stats" });
    if (!globalStats) {
      globalStats = await GlobalStats.create({ name: "site_stats", visits: 0 });
    }

    const visitCount = globalStats.visits || 0;

    // Years Experience Calculation
    const START_YEAR = 2015;
    const CURRENT_YEAR = new Date().getFullYear();
    const yearsExperience = CURRENT_YEAR - START_YEAR;

    // Construct the stats array dynamically
    // We strive to match the structure the frontend expects:
    // { id, value, suffix, label: { EN, GU, HI }, iconName }

    const stats = [
      {
        id: 1,
        value: visitCount + 5000, // Visit Data + Base
        suffix: "+",
        label: {
          EN: "Happy Clients",
          GU: "સંતુષ્ટ ગ્રાહકો",
          HI: "संतुष्ट ग्राहक",
        },
        iconName: "Users",
      },
      {
        id: 2,
        value: yearsExperience,
        suffix: "+",
        label: {
          EN: "Years Experience",
          GU: "વર્ષોનો અનુભવ",
          HI: "वर्षों का अनुभव",
        },
        iconName: "Calendar",
      },
      {
        id: 3,
        value: servicesCount,
        suffix: "+",
        label: {
          EN: "Services Offered",
          GU: "ઉપલબ્ધ સેવાઓ",
          HI: "उपलब्ध सेवाएं",
        },
        iconName: "Briefcase",
      },
    ];

    res.json(stats);
  } catch (error) {
    console.error("Stats Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Increment visit count
// @route   POST /api/stats/visit
// @access  Public
export const incrementVisits = async (req: Request, res: Response) => {
  try {
    const stats = await GlobalStats.findOneAndUpdate(
      { name: "site_stats" },
      { $inc: { visits: 1 } },
      { upsert: true, new: true }
    );
    res.json({ success: true, visits: stats.visits });
  } catch (error) {
    console.error("Increment Visits Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
