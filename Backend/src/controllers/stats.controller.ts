import { Request, Response } from "express";
import Service from "../models/Service";
import Application from "../models/Application";

// @desc    Get all stats
// @route   GET /api/stats
// @access  Public
export const getStats = async (req: Request, res: Response) => {
  try {
    const servicesCount = await Service.countDocuments();
    // Assuming "Happy Clients" roughly equals number of applications for now
    // Or we could have a specific "Client" model or count unique phones in applications
    const applicationsCount = await Application.countDocuments();

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
        value: (applicationsCount > 0 ? applicationsCount : 0) + 5000, // Real DB Data + Base
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
